from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Organization
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
)  # Asegúrate de haber instalado flask-jwt-extended

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
