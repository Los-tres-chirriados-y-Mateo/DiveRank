# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, Jurado, Organizador
from .serializers import AdminLoginSerializer, RolLoginSerializer

class AdminLoginView(APIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']
            contraseña = serializer.validated_data['contraseña']
            admin = Admin.objects(nombre=nombre, contraseña=contraseña).first()
            if admin:
                return Response({"mensaje": "Inicio de sesión exitoso como admin"}, status=200)
            return Response({"error": "Credenciales inválidas"}, status=401)
        return Response(serializer.errors, status=400)

class RolLoginView(APIView):
    def post(self, request):
        serializer = RolLoginSerializer(data=request.data)
        if serializer.is_valid():
            rol = serializer.validated_data['rol']
            contraseña = serializer.validated_data['contraseña']
            if rol == 'jurado':
                user = Jurado.objects(contraseña=contraseña).first()
            else:
                user = Organizador.objects(contraseña=contraseña).first()
            if user:
                return Response({"mensaje": f"Inicio de sesión exitoso como {rol}"}, status=200)
            return Response({"error": "Contraseña incorrecta o rol inválido"}, status=401)
        return Response(serializer.errors, status=400)