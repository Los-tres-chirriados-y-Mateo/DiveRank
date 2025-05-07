from rest_framework import serializers
from .models import Admin, Jurado, Organizador, Deportista, Competencia

#Esto vuelve de objeto python a json para poder llegar a manejar la informacion en el front y poder mandarla

class AdminSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    password = serializers.CharField()

class JuradoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    password = serializers.CharField()
    cedula = serializers.CharField()

class CrearJuezSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    cedula = serializers.CharField()
    password = serializers.CharField() 
    competencia_id = serializers.CharField()

class OrganizadorSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    password = serializers.CharField()
    cedula = serializers.CharField()

class CrearOrganizadorSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    cedula = serializers.CharField()
    password = serializers.CharField() 
    competencia_id = serializers.CharField()

class SaltoSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    dificultad = serializers.FloatField()

class DeportistaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    edad = serializers.IntegerField()
    saltos = SaltoSerializer(many=True)

class DeportistaCrearSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    edad = serializers.IntegerField()
    num_saltos = serializers.IntegerField()


#Este es para leer
class CompetenciaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    admin = serializers.CharField()
    organizadores = serializers.ListField(child=serializers.CharField())
    jueces = serializers.ListField(child=serializers.CharField())
    deportistas = serializers.ListField(child=serializers.CharField())

#Este es para crear
class CrearCompetenciaSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    admin_nombre = serializers.CharField()
    admin_password = serializers.CharField()
    jueces = serializers.ListField(child=serializers.CharField())
    organizadores = serializers.ListField(child=serializers.CharField())
    deportistas = serializers.ListSerializer(child=DeportistaCrearSerializer())



class AdminLoginSerializer(serializers.Serializer):
    password = serializers.CharField()

class RolLoginSerializer(serializers.Serializer):
    rol = serializers.ChoiceField(choices=['jurado', 'organizador'])
    password = serializers.CharField()

class PuntuacionSerializer(serializers.Serializer):
    juezId = serializers.CharField()
    puntaje = serializers.FloatField(min_value=0.0, max_value=10.0)

class PuntajeSaltoSerializer(serializers.Serializer):
    deportistaId = serializers.CharField()
    puntuaciones = serializers.ListField(child=PuntuacionSerializer())