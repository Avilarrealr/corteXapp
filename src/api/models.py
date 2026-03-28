from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Organization(db.Model):
    __tablename__ = "organization"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)

    users = relationship("User", back_populates="organization")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    role: Mapped[str] = mapped_column(String(20), default="master")

    organization_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("organization.id"), nullable=False
    )
    organization = relationship("Organization", back_populates="users")

    def __init__(self, **kwargs):
        # Al crear el usuario, encriptamos la clave antes de guardarla
        if "password" in kwargs:
            kwargs["password"] = generate_password_hash(kwargs["password"])
        super(User, self).__init__(**kwargs)

    def check_password(self, password):
        # Este método servirá para el Login
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "organization": self.organization.name if self.organization else None,
        }
