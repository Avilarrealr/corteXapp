"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Organization
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint("api", __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/hello", methods=["POST", "GET"])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def handle_signup():
    body = request.get_json()

    # Validamos que lleguen los datos del formulario de React
    if not body or "email" not in body or "organizationName" not in body:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        # 1. Creamos la organización
        new_org = Organization(name=body["organizationName"])
        db.session.add(new_org)
        db.session.flush()  # Obtenemos el ID sin cerrar la transacción

        # 2. Creamos el usuario vinculado (usando full_name con guion bajo)
        new_user = User(
            full_name=body["fullName"],  # Mapeamos desde el camelCase de React
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
        print(f"Error detallado: {str(e)}")  # Esto saldrá en tu terminal de Flask
        return jsonify({"msg": "Error interno al crear la cuenta"}), 500
