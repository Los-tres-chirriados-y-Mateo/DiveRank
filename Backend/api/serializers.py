from rest_framework import serializers
from .models import Admin, Jurado, Organizador, Deportista, Competencia

#Esto vuelve de objeto python a json para poder llegar a manejar la informacion en el front y poder mandarla

class AdminSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    contraseña = serializers.CharField()

class JuradoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    contraseña = serializers.CharField()

class OrganizadorSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    contraseña = serializers.CharField()

class DeportistaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    edad = serializers.IntegerField()
    saltos = serializers.ListField()

class CompetenciaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField()
    admin = serializers.CharField()
    organizadores = serializers.ListField(child=serializers.CharField())
    jueces = serializers.ListField(child=serializers.CharField())
    deportistas = serializers.ListField(child=serializers.CharField())


class AdminLoginSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    contraseña = serializers.CharField()

class RolLoginSerializer(serializers.Serializer):
    rol = serializers.ChoiceField(choices=['jurado', 'organizador'])
    contraseña = serializers.CharField()