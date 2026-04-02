from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Organization(db.Model):
    __tablename__ = "organization"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

    # Relaciones para acceder fácil desde el objeto
    users = db.relationship("User", backref="organization", lazy=True)
    companies = db.relationship("Company", backref="organization", lazy=True)

    def serialize(self):
        return {"id": self.id, "name": self.name}


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # Nuevo: Rol para diferenciar Admin de Cajero
    role = db.Column(db.String(20), default="admin")  # "admin" o "cajero"

    # Nuevo: Relación opcional con una Sede (solo para cajeros)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=True)

    # Relación con la Organización (tu cuenta principal)
    organization_id = db.Column(
        db.Integer, db.ForeignKey("organization.id"), nullable=False
    )

    def __repr__(self):
        return f"<User {self.email}>"

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "company_id": self.company_id,
            "organization_id": self.organization_id,  # Útil tenerlo en el JSON
        }


class Company(db.Model):
    __tablename__ = "company"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    # Relación con la Organización principal
    organization_id = db.Column(
        db.Integer, db.ForeignKey("organization.id"), nullable=False
    )
    cashiers = db.relationship("User", backref="company", lazy=True)

    def serialize(self):
        return {"id": self.id, "name": self.name, "address": self.address}


class CashShift(db.Model):
    __tablename__ = "cash_shift"
    id = db.Column(db.Integer, primary_key=True)

    # APERTURA (Solo efectivo)
    open_amount_usd = db.Column(db.Float, default=0.0)
    open_amount_bs = db.Column(db.Float, default=0.0)

    # CIERRE (Las 6 posibilidades)
    close_cash_usd = db.Column(db.Float, default=0.0)
    close_cash_bs = db.Column(db.Float, default=0.0)
    close_zelle = db.Column(db.Float, default=0.0)
    close_pagomovil = db.Column(db.Float, default=0.0)
    close_biopago = db.Column(db.Float, default=0.0)
    close_punto = db.Column(db.Float, default=0.0)

    status = db.Column(db.String(20), default="open")  # "open" o "closed"
    opened_at = db.Column(db.DateTime, default=db.func.now())
    closed_at = db.Column(db.DateTime, nullable=True)

    cashier_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)
