from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Organization, Company
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash

api = Blueprint("api", __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/signup", methods=["POST"])
def handle_signup():
    body = request.get_json()

    if not body or "email" not in body or "organizationName" not in body:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        new_org = Organization(name=body["organizationName"])
        db.session.add(new_org)
        db.session.flush()

        new_user = User(
            full_name=body["fullName"],
            email=body["email"],
            password=body["password"],
            organization_id=new_org.id,
            role="master",
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Registro exitoso", "user": new_user.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error detallado: {str(e)}")
        return jsonify({"msg": "Error interno al crear la cuenta"}), 500


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


@api.route("/cashier", methods=["POST"])
@jwt_required()
def create_cashier():
    admin_id = get_jwt_identity()
    admin = User.query.get(admin_id)
    body = request.get_json()

    # Verificamos que solo el admin pueda crear cajeros
    if admin.role != "admin":
        return jsonify({"msg": "No tienes permisos"}), 403

    # Creamos el nuevo usuario con rol de cajero
    new_cashier = User(
        full_name=body["full_name"],
        email=body["email"],
        password=generate_password_hash(body["password"]),  # ¡Seguridad ante todo!
        role="cajero",
        organization_id=admin.organization_id,
        company_id=body["company_id"],  # La sede a la que pertenece
    )

    db.session.add(new_cashier)
    db.session.commit()

    return jsonify({"msg": "Cajero registrado exitosamente"}), 201


@api.route("/company/<int:company_id>/cashiers", methods=["GET"])
@jwt_required()
def get_company_cashiers(company_id):
    admin_id = get_jwt_identity()
    # Buscamos solo los usuarios con rol cajero que pertenecen a esa sede
    cashiers = User.query.filter_by(company_id=company_id, role="cajero").all()

    results = [cashier.serialize() for cashier in cashiers]
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
