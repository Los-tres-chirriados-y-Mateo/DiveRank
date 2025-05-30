from django.db import models
import mongoengine as me
import secrets

# Create your models here.

class Admin(me.Document):
    nombre = me.StringField(required=False, default="Admin")
    password = me.StringField(required=True, default="AdminPassword")
    meta = {'collection': 'admins'}  # Nombre de la colección en MongoDB


class Salto(me.EmbeddedDocument):
    nombre = me.StringField(default="")
    dificultad = me.FloatField(default=0.0)

class Deportista(me.Document):
    nombre = me.StringField(required=True)
    saltos = me.EmbeddedDocumentListField(Salto, default=[])
    num_saltos = me.IntField(default=0)
    orden = me.IntField(required=True)
    
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

class Puntuacion(me.EmbeddedDocument):
    juez = me.ReferenceField(Jurado, required=True)
    puntaje = me.FloatField(required=True, min_value=-2.0, max_value=10.0)


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

class Ranking(me.Document):
    deportista = me.ReferenceField(Deportista, required = True, unique=True)
    promedios = me.ListField(me.FloatField(), required=True)
    posicion = me.IntField(required=True)

    meta = {'collection': 'ranking', 'ordering': ['posicion']}

class PuntajeSalto(me.Document):
    deportista = me.ReferenceField(Deportista, required=True)
    numeroSalto = me.IntField(required = False)
    competencia = me.ReferenceField(Competencia, required=False)#False dado que de momento solo manejamos una unica competencia
    puntajes = me.EmbeddedDocumentListField(Puntuacion, default=[])
    promedio= me.FloatField(default=0.0)
    def calcular_promedio(self, dificultad):
        """Calcula el promedio de los puntajes del salto."""
        if len(self.puntajes) < 3:
            raise ValueError("Se requieren al menos 3 puntajes para calcular el promedio.")
        if all(v == -1 for v in valores):
            self.promedio = -1  # salto descalificado
        else:
            # sigue lógica si no es descalificado
            puntajes = sorted([p for p in valores if p != -1])
            mitad = len(puntajes) // 2
            selecteds = puntajes[mitad - 1:mitad + 2]
            self.promedio = (sum(selecteds) / 3) * dificultad
        self.save()
        
    meta = {'collection': 'puntajes_saltos'}