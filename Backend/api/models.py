from django.db import models
import mongoengine as me
import secrets

# Create your models here.

class Admin(me.Document):
    nombre = me.StringField(required=True, default="Admin")
    contraseña = me.StringField(required=True, default="AdminPassword")
    meta = {'collection': 'admins'}  # Nombre de la colección en MongoDB


class Deportista(me.Document):
    nombre = me.StringField(required=True)
    edad = me.IntField(required=True)
    saltos = me.ListField(me.DictField())  # Lista de saltos con puntuaciones

    meta = {'collection': 'deportistas'}

class Jurado(me.Document):
    nombre = me.StringField(required=True)
    contraseña = me.StringField(required=True, unique=True)

    meta = {'collection': 'jurados'}

class Organizador(me.Document):
    nombre = me.StringField(required=True)
    contraseña = me.StringField(required=True, unique=True)

    meta = {'collection': 'organizadores'}


class Competencia(me.Document):
    nombre = me.StringField(required=True)
    admin = me.ReferenceField(Admin, required=True)  # Relación con Admin
    organizadores = me.ListField(me.ReferenceField(Organizador))
    jueces = me.ListField(me.ReferenceField(Jurado))
    deportistas = me.ListField(me.ReferenceField(Deportista))

    meta = {'collection': 'competencias'}

    def agregar_usuario(self, tipo, nombre):
        """Agrega un usuario (organizador o juez) a la competencia con contraseña única"""
        contraseña_unica = secrets.token_hex(8)  # Genera una contraseña aleatoria
        if tipo == "organizador":
            usuario = Organizador(nombre=nombre, contraseña=contraseña_unica)
            self.organizadores.append(usuario)
        elif tipo == "jurado":
            usuario = Jurado(nombre=nombre, contraseña=contraseña_unica)
            self.jueces.append(usuario)
        usuario.save()
        self.save()
        return contraseña_unica
