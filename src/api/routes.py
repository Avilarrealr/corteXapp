from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Organization, Company, CashShift, ExchangeRate
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash
from sqlalchemy import func, text
from datetime import datetime, timedelta

api = Blueprint("api", __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/signup", methods=["POST"])
def handle_signup():
    body = request.get_json()

    try:
        # Encriptar contraseña
        hashed_password = generate_password_hash(body["password"])

        # Crear organización
        new_org = Organization(name=body["organizationName"])
        db.session.add(new_org)
        db.session.flush()

        # Crear usuario con rol master
        new_user = User(
            full_name=body["fullName"],
            email=body["email"],
            password=hashed_password,
            organization_id=new_org.id,
            role="master",  # Rol principal corregido
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Registro exitoso"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error detallado: {str(e)}")
        return jsonify({"msg": "Error interno al crear la cuenta"}), 500


@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    # El identity suele ser el ID del usuario que guardaste al crear el token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify(
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id,
        }
    ), 200


@api.route("/cashier", methods=["POST"])
@jwt_required()  # Solo tú (Admin) puedes crear cajeros
def create_cashier():
    body = request.get_json()

    # Validamos que lleguen los datos que envías desde el front
    if not body.get("email") or not body.get("password") or not body.get("company_id"):
        return jsonify({"msg": "Faltan datos: email, password o sede"}), 400

    try:
        # Obtenemos tu ID de organización desde el token JWT
        current_user_id = get_jwt_identity()
        admin = User.query.get(current_user_id)

        new_cashier = User(
            full_name=body.get("full_name"),
            email=body.get("email"),
            password=generate_password_hash(
                body.get("password")
            ),  # ¡Siempre encriptada!
            role="cashier",
            company_id=body.get("company_id"),
            organization_id=admin.organization_id,  # Se hereda de tu cuenta
        )

        db.session.add(new_cashier)
        db.session.commit()
        return jsonify({"msg": "Cajero vinculado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route("/login", methods=["POST"])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body["email"]).first()

    # Validación simple de entrada
    if user is None or not user.check_password(body["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(
        {"msg": "Login exitoso", "token": access_token, "user": user.serialize()}
    ), 200


@api.route("/company", methods=["POST"])
@jwt_required()
def create_company():
    user_id = get_jwt_identity()
    body = request.get_json()

    # Buscamos la organización del usuario logueado
    user = User.query.get(user_id)

    new_company = Company(
        name=body["name"],
        address=body.get("address", ""),
        organization_id=user.organization_id,
    )

    db.session.add(new_company)
    db.session.commit()

    return jsonify({"msg": "Empresa creada", "company": new_company.serialize()}), 201


@api.route("/companies", methods=["GET"])
@jwt_required()
def get_user_companies():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Buscamos todas las empresas de tu organización
    companies = Company.query.filter_by(organization_id=user.organization_id).all()

    # Serializamos la lista
    results = [company.serialize() for company in companies]
    return jsonify(results), 200


@api.route("/company/<int:company_id>/cashiers", methods=["GET"])
@jwt_required()
def get_company_cashiers(company_id):
    # 1. Obtenemos la identidad del admin (opcional, pero sirve para validar)
    admin_id = get_jwt_identity()

    # 2. CORRECCIÓN: Cambiar "cajero" por "cashier"
    # Asegúrate de que en tu base de datos el rol se guarde como "cashier"
    cashiers = User.query.filter_by(company_id=company_id, role="cashier").all()

    # 3. Serializamos y enviamos
    results = [cashier.serialize() for cashier in cashiers]

    # Debug opcional: imprime en consola para ver qué está pasando
    print(f"Buscando cajeros para sede {company_id}. Encontrados: {len(results)}")

    return jsonify(results), 200


@api.route("/company/<int:company_id>", methods=["DELETE"])
@jwt_required()
def delete_company(company_id):
    admin_id = get_jwt_identity()
    admin = User.query.get(admin_id)

    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Sede no encontrada"}), 404

    # Seguridad: Solo borrar si pertenece a tu organización
    if company.organization_id != admin.organization_id:
        return jsonify({"msg": "No tienes permiso para borrar esta sede"}), 403

    db.session.delete(company)
    db.session.commit()

    return jsonify({"done": True, "msg": "Sede eliminada"}), 200


# 1. ABRIR TURNO
@api.route("/cash-shift/open", methods=["POST"])
@jwt_required()
def open_shift():
    cashier_id = get_jwt_identity()
    body = request.get_json()

    # Verificamos si ya tiene un turno abierto
    active_shift = CashShift.query.filter_by(
        cashier_id=cashier_id, status="open"
    ).first()
    if active_shift:
        return jsonify({"msg": "Ya tienes un turno abierto"}), 400

    # CAMBIO AQUÍ: Usar las llaves nuevas que envía el frontend
    new_shift = CashShift(
        open_amount_usd=body.get("open_amount_usd", 0),  # Cambiado de open_amount
        open_amount_bs=body.get("open_amount_bs", 0),  # Nueva llave
        cashier_id=cashier_id,
        company_id=body["company_id"],
        status="open",
        opened_at=datetime.utcnow(),
    )

    db.session.add(new_shift)
    db.session.commit()
    return jsonify({"msg": "Turno abierto con éxito", "shift": new_shift.id}), 201


# 2. CERRAR TURNO (El formulario del cajero)
@api.route("/cash-shift/close", methods=["PUT"])
@jwt_required()
def close_shift():
    cashier_id = get_jwt_identity()
    body = request.get_json()

    shift = CashShift.query.filter_by(cashier_id=cashier_id, status="open").first()
    if not shift:
        return jsonify({"msg": "No hay un turno activo"}), 404

    # Guardamos la declaración física del cajero
    shift.close_cash_usd = body.get("close_cash_usd", 0)
    shift.close_cash_bs = body.get("close_cash_bs", 0)
    shift.close_zelle = body.get("close_zelle", 0)
    shift.close_pagomovil = body.get("close_pagomovil", 0)
    shift.close_biopago = body.get("close_biopago", 0)
    shift.close_punto = body.get("close_punto", 0)

    shift.status = "closed"
    shift.closed_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"msg": "Turno cerrado exitosamente"}), 200


@api.route("/cash-shift/active", methods=["GET"])
@jwt_required()
def get_active_shift():
    cashier_id = get_jwt_identity()
    shift = CashShift.query.filter_by(cashier_id=cashier_id, status="open").first()

    if not shift:
        return jsonify({"msg": "No hay turno activo"}), 404

    return jsonify(
        {
            "id": shift.id,
            "open_amount_usd": shift.open_amount_usd,  # Cambio aquí
            "open_amount_bs": shift.open_amount_bs,  # Cambio aquí
            "opened_at": shift.opened_at,
        }
    ), 200


@api.route("/admin/audit-summary", methods=["GET"])
@jwt_required()
def get_audit_summary():
    # Solo el admin debería acceder a esto
    # (Asumiendo que guardas el rol en el token o lo verificas aquí)

    # Parámetros de fecha (por defecto hoy)
    start_date = request.args.get("start_date", datetime.utcnow().strftime("%Y-%m-%d"))
    end_date = request.args.get("end_date", datetime.utcnow().strftime("%Y-%m-%d"))
    tasa_frontend = request.args.get("tasa")

    # Si el frontend la envía, la usamos. Si no, buscamos la de la DB.
    if tasa_frontend:
        tasa_bcv = float(tasa_frontend)
    else:
        rate_obj = ExchangeRate.query.filter_by(date=datetime.utcnow().date()).first()
        tasa_bcv = rate_obj.rate if rate_obj else 36.50

    # Convertir strings a objetos datetime para el filtro
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)

    # Consulta para sumar todos los métodos de turnos CERRADOS en ese rango
    totals = (
        db.session.query(
            func.sum(CashShift.close_cash_usd).label("total_usd"),
            func.sum(CashShift.close_cash_bs).label("total_bs"),
            func.sum(CashShift.close_zelle).label("total_zelle"),
            func.sum(CashShift.close_pagomovil).label("total_pagomovil"),
            func.sum(CashShift.close_biopago).label("total_biopago"),
            func.sum(CashShift.close_punto).label("total_punto"),
            func.count(CashShift.id).label("count_shifts"),
        )
        .filter(
            CashShift.status == "closed",
            CashShift.closed_at >= start_dt,
            CashShift.closed_at < end_dt,
        )
        .first()
    )

    # 1. Sumamos lo que ya entró directamente en Dólares
    dolares_directos = (totals.total_usd or 0) + (totals.total_zelle or 0)

    # 2. Sumamos todos los métodos que entraron en Bolívares
    bolivares_totales = (
        (totals.total_bs or 0)
        + (totals.total_pagomovil or 0)
        + (totals.total_biopago or 0)
        + (totals.total_punto or 0)
    )

    # 3. Calculamos el Gran Total convirtiendo los Bs a tasa BCV
    # Evitamos división por cero por si acaso
    total_convertido = dolares_directos + (
        bolivares_totales / (tasa_bcv if tasa_bcv > 0 else 1)
    )

    return jsonify(
        {
            "period": {"start": start_date, "end": end_date},
            "totals": {
                "usd_cash": float(totals.total_usd or 0),
                "bs_cash": float(totals.total_bs or 0),
                "zelle": float(totals.total_zelle or 0),
                "pagomovil": float(totals.total_pagomovil or 0),
                "biopago": float(totals.total_biopago or 0),
                "punto": float(totals.total_punto or 0),
            },
            "total_shifts": totals.count_shifts,
            "grand_total_usd": round(
                total_convertido, 2
            ),  # Aquí está la magia del recalculo
            "tasa_utilizada": tasa_bcv,
        }
    ), 200


@api.route("/admin/exchange-rate", methods=["POST"])
@jwt_required()
def set_exchange_rate():
    body = request.get_json()
    rate_value = body.get("rate")
    date_str = body.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    if not rate_value:
        return jsonify({"msg": "La tasa es obligatoria"}), 400

    # Si ya existe una tasa para hoy, la actualizamos. Si no, la creamos.
    existing_rate = ExchangeRate.query.filter_by(date=date_obj).first()

    if existing_rate:
        existing_rate.rate = rate_value
    else:
        new_rate = ExchangeRate(rate=rate_value, date=date_obj)
        db.session.add(new_rate)

    db.session.commit()
    return jsonify({"msg": "Tasa de cambio actualizada correctamente"}), 200


@api.route("/admin/get-rate", methods=["GET"])
@jwt_required()
def get_exchange_rate():
    date_str = request.args.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

    rate_obj = ExchangeRate.query.filter_by(date=date_obj).first()

    if rate_obj:
        return jsonify(rate_obj.serialize()), 200

    return jsonify({"rate": 36.50}), 404  # Valor por defecto si no hay registro


# nombre de la empresa en la ficha del detalle


@api.route("/company/<int:company_id>", methods=["GET"])
@jwt_required()
def get_single_company(company_id):
    # Buscamos la empresa en la DB
    company = Company.query.get(company_id)

    if not company:
        return jsonify({"msg": "Sede no encontrada"}), 404

    return jsonify(company.serialize()), 200


# Endpoint para procesar datos de las estadisticas en el card de cada empresa
@api.route("/admin/company-stats/<int:company_id>", methods=["GET"])
@jwt_required()
def get_company_stats(company_id):
    # 1. Buscamos la tasa más reciente para cálculos (o la enviamos por query)
    rate_obj = ExchangeRate.query.order_by(ExchangeRate.date.desc()).first()
    tasa = rate_obj.rate if rate_obj else 36.50

    # 2. Sumamos todo el histórico de esa sede
    stats = (
        db.session.query(
            func.sum(CashShift.close_cash_usd).label("usd"),
            func.sum(CashShift.close_zelle).label("zelle"),
            func.sum(CashShift.close_cash_bs).label("bs"),
            func.sum(CashShift.close_punto).label("punto"),
            func.sum(CashShift.close_pagomovil).label("pago_movil"),
            func.sum(CashShift.close_biopago).label("biopago"),
            func.count(CashShift.id).label("total_turnos"),
        )
        .filter(CashShift.company_id == company_id, CashShift.status == "closed")
        .first()
    )

    # Cálculo matemático de conversión
    usd_directo = (stats.usd or 0) + (stats.zelle or 0)
    bs_a_convertir = (
        (stats.bs or 0)
        + (stats.punto or 0)
        + (stats.pago_movil or 0)
        + (stats.biopago or 0)
    )
    total_usd_historico = usd_directo + (bs_a_convertir / tasa)

    # 3. Ranking de Cajeros (Corregido: cashier_id)
    cajeros_ranking = (
        db.session.query(
            User.full_name, func.count(CashShift.id).label("turnos_hechos")
        )
        # Cambiamos CashShift.user_id por CashShift.cashier_id
        .join(CashShift, CashShift.cashier_id == User.id)
        .filter(CashShift.company_id == company_id)
        .group_by(User.full_name)
        .order_by(text("turnos_hechos DESC"))
        .all()
    )

    return jsonify(
        {
            "total_ventas_usd": round(total_usd_historico, 2),
            "total_turnos": stats.total_turnos or 0,
            "ticket_promedio": round(total_usd_historico / stats.total_turnos, 2)
            if stats.total_turnos and stats.total_turnos > 0
            else 0,
            "ranking": [{"name": r[0], "count": r[1]} for r in cajeros_ranking],
        }
    ), 200


# endpoints de las graficas


@api.route("/admin/company-trends/<int:company_id>", methods=["GET"])
@jwt_required()
def get_company_trends(company_id):
    # 1. Definimos el rango: hoy y hace 7 días
    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)

    # 2. Consultamos los turnos cerrados en ese rango
    shifts = (
        CashShift.query.filter(
            CashShift.company_id == company_id,
            CashShift.status == "closed",
            CashShift.closed_at >= seven_days_ago,
        )
        .order_by(CashShift.closed_at.asc())
        .all()
    )

    # 3. Formateamos los datos para la gráfica
    # Recharts espera un formato: [{"name": "01/04", "total": 120}, ...]
    trend_data = []
    for s in shifts:
        # CAMBIO AQUÍ: Usar s.closed_at en lugar de s.total_at
        fecha_formateada = s.closed_at.strftime("%d/%m") if s.closed_at else "S/F"

        total_turno = (s.close_cash_usd or 0) + (s.close_zelle or 0)

        trend_data.append({"fecha": fecha_formateada, "ventas": round(total_turno, 2)})

    return jsonify(trend_data), 200
