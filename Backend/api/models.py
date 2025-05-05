from django.db import models
import mongoengine as me
import secrets

# Create your models here.

class Admin(me.Document):
    nombre = me.StringField(required=True, default="Admin")
    password = me.StringField(required=True, default="AdminPassword")
    meta = {'collection': 'admins'}  # Nombre de la colección en MongoDB


class Salto(me.EmbeddedDocument):
    nombre = me.StringField(default="")
    dificultad = me.FloatField(default=0.0)

class Deportista(me.Document):
    nombre = me.StringField(required=True)
    edad = me.IntField(required=True)
    saltos = me.EmbeddedDocumentListField(Salto, default=[])
    meta = {'collection': 'deportistas'}

class Jurado(me.Document):
    nombre = me.StringField(required=True)
    password = me.StringField(required=True, unique=True)
    cedula = me.StringField(required=True, unique=True)

    meta = {'collection': 'jurados'}

class Organizador(me.Document):
    nombre = me.StringField(required=True)
    password = me.StringField(required=True, unique=True)
    cedula = me.StringField(required=True, unique=True)

    meta = {'collection': 'organizadores'}

class Competencia(me.Document):
    nombre = me.StringField(required=True)
    admin = me.ReferenceField(Admin, required=True)  # Relación con Admin
    organizadores = me.ListField(me.ReferenceField(Organizador))
    jueces = me.ListField(me.ReferenceField(Jurado))
    deportistas = me.ListField(me.ReferenceField(Deportista))

    meta = {'collection': 'competencias'}

    def agregar_usuario(self, tipo, nombre):
        """Agrega un usuario (organizador o juez) a la competencia con password única"""
        password_unica = secrets.token_hex(8)  # Genera una password aleatoria
        if tipo == "organizador":
            usuario = Organizador(nombre=nombre, password=password_unica)
            self.organizadores.append(usuario)
        elif tipo == "jurado":
            usuario = Jurado(nombre=nombre, password=password_unica)
            self.jueces.append(usuario)
        usuario.save()
        self.save()
        return password_unica
