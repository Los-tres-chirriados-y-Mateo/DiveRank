# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, Jurado, Organizador, Competencia, Deportista
from .serializers import AdminLoginSerializer, RolLoginSerializer, CrearCompetenciaSerializer, CrearJuezSerializer, CrearOrganizadorSerializer, DeportistaCrearSerializer

class AdminLoginView(APIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            admin = Admin.objects(password=password).first()
            if admin:
                return Response({"mensaje": "Inicio de sesión exitoso como admin"}, status=200)
            return Response({"error": "Credenciales inválidas"}, status=401)
        return Response(serializer.errors, status=400)


class RolLoginView(APIView):
    def post(self, request):
        serializer = RolLoginSerializer(data=request.data)
        if serializer.is_valid():
            rol = serializer.validated_data['rol']
            password = serializer.validated_data['password']
            if rol == 'jurado':
                user = Jurado.objects(password=password).first()
            elif rol == 'organizador':
                user = Organizador.objects(password=password).first()
            else:
                return Response({"error": "Rol inválido"}, status=400)
            
            if user:
                return Response({"mensaje": f"Inicio de sesión exitoso como {rol}"}, status=200)
            return Response({"error": "Contraseña incorrecta"}, status=401)
        return Response(serializer.errors, status=400)

class CrearCompetenciaView(APIView): #este acepta tambien deportistas directamente pero no es necesario para crearla
    def post(self, request):
        serializer = CrearCompetenciaSerializer(data=request.data)
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']
            admin_nombre = serializer.validated_data['admin_nombre']
            admin_password = serializer.validated_data['admin_password']
            jueces_passwords = serializer.validated_data['jueces']
            organizadores_passwords = serializer.validated_data['organizadores']
            deportistas_data = serializer.validated_data['deportistas']

            admin = Admin.objects(nombre=admin_nombre, password=admin_password).first()
            if not admin:
                return Response({"error": "Admin no encontrado o credenciales incorrectas"}, status=401)

            jueces = [Jurado.objects(password=pw).first() for pw in jueces_passwords]
            organizadores = [Organizador.objects(password=pw).first() for pw in organizadores_passwords]

            deportistas = []
            for d in deportistas_data:
                deportista = Deportista(
                    nombre=d['nombre'],
                    edad=int(d['edad']),
                    saltos=d.get('saltos', [])
                )
                deportista.save()
                deportistas.append(deportista)
            

            competencia = Competencia(
                nombre=nombre,
                admin=admin,
                jueces=jueces,
                organizadores=organizadores,
                deportistas=deportistas
            )
            competencia.save()

            return Response({"mensaje": "Competencia creada exitosamente"}, status=201)
        return Response(serializer.errors, status=400)

class ListaCompetenciasView(APIView):
    def get(self, request):
        competencias = Competencia.objects()
        data = []

        for c in competencias:
            data.append({
                "id": str(c.id),
                "nombre": c.nombre,
                "admin": c.admin.nombre if c.admin else None,
                "jueces": [j.nombre for j in c.jueces],
                "organizadores": [o.nombre for o in c.organizadores],
                "deportistas": [d.nombre for d in c.deportistas],
            })
        
        return Response(data, status=200)

class DeportistasCompetenciaView(APIView):
    def get(self, request, competencia_id):
        try:
            competencia = Competencia.objects.get(id=competencia_id)
        except Competencia.DoesNotExist:
            return Response({"error": "Competencia no encontrada"}, status=404)

        deportistas = competencia.deportistas
        data = []

        for d in deportistas:
            data.append({
                "id": str(d.id),
                "nombre": d.nombre,
                "edad": d.edad,
                "saltos": d.saltos,  # Lista de saltos
            })

        return Response(data, status=200)

class JuecesCompetenciaView(APIView):
    def get(self, request, competencia_id):
        try:
            competencia = Competencia.objects.get(id=competencia_id)
        except Competencia.DoesNotExist:
            return Response({"error": "Competencia no encontrada"}, status=404)

        jueces = competencia.jueces
        data = []

        for j in jueces:
            data.append({
                "id": str(j.id),
                "nombre": j.nombre,
                "password": j.password,  #? esto se deberia ver?
            })

        return Response(data, status=200)

class OrganizadoresCompetenciaView(APIView):
    def get(self, request, competencia_id):
        try:
            competencia = Competencia.objects.get(id=competencia_id)
        except Competencia.DoesNotExist:
            return Response({"error": "Competencia no encontrada"}, status=404)

        organizadores = competencia.organizadores
        data = []

        for o in organizadores:
            data.append({
                "id": str(o.id),
                "nombre": o.nombre,
                "password": o.password,  #? lo mismo que el de arriba
            })

        return Response(data, status=200)

class VerSaltosDeportistaView(APIView):
    def get(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        saltos = [{"nombre": s.nombre, "dificultad": s.dificultad} for s in deportista.saltos]

        return Response({
            "nombre": deportista.nombre,
            "saltos": saltos
        }, status=200)


class AgregarSaltoDeportistaView(APIView):
    def post(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        nombre = request.data.get('nombre', "")
        dificultad = request.data.get('dificultad', 0.0)

        salto = Salto(nombre=nombre, dificultad=float(dificultad))
        deportista.saltos.append(salto)
        deportista.save()

        return Response({
            "mensaje": "Salto agregado correctamente",
            "saltos": [{"nombre": s.nombre, "dificultad": s.dificultad} for s in deportista.saltos]
        }, status=200)


class EditarSaltoDeportistaView(APIView):
    def put(self, request, deportista_id, salto_index):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        if salto_index < 0 or salto_index >= len(deportista.saltos):
            return Response({"error": "Índice de salto inválido"}, status=400)

        nombre = request.data.get('nombre')
        dificultad = request.data.get('dificultad')

        if nombre is not None:
            deportista.saltos[salto_index].nombre = nombre
        if dificultad is not None:
            deportista.saltos[salto_index].dificultad = float(dificultad)

        deportista.save()

        return Response({
            "mensaje": "Salto actualizado correctamente",
            "salto": {
                "nombre": deportista.saltos[salto_index].nombre,
                "dificultad": deportista.saltos[salto_index].dificultad
            }
        }, status=200)



class EliminarSaltoDeportistaView(APIView):
    def delete(self, request, deportista_id, salto_index):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        if salto_index < 0 or salto_index >= len(deportista.saltos):
            return Response({"error": "Índice de salto inválido"}, status=400)

        salto_eliminado = deportista.saltos.pop(salto_index)
        deportista.save()

        return Response({"mensaje": f"Salto '{salto_eliminado}' eliminado correctamente", "saltos": deportista.saltos}, status=200)

class CrearDeportistasView(APIView):
    def post(self, request):
        deportistas_data = request.data.get('deportistas')

        if not deportistas_data or not isinstance(deportistas_data, list):
            return Response({"error": "Se debe enviar una lista de deportistas"}, status=400)

        nuevos_deportistas = []
        for d in deportistas_data:
            nombre = d.get('nombre')
            edad = d.get('edad')
            num_saltos = d.get('num_saltos')
            if num_saltos is None:
                return Response({"error": "Se requiere 'num_saltos'"}, status=400)
            saltos = [Salto(nombre="", dificultad=0.0) for _ in range(num_saltos)]

            if not nombre or not edad:
                return Response({"error": "Cada deportista debe tener nombre y edad"}, status=400)

            deportista = Deportista(
                nombre=nombre,
                edad=int(edad),
                saltos=saltos
            )
            deportista.save()
            nuevos_deportistas.append(str(deportista.id))

        return Response({"mensaje": "Deportistas creados exitosamente", "ids": nuevos_deportistas}, status=201)

class EditarDeportistaView(APIView):
    def put(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        nombre = request.data.get('nombre')
        edad = request.data.get('edad')

        if nombre:
            deportista.nombre = nombre
        if edad:
            deportista.edad = int(edad)

        deportista.save()

        return Response({"mensaje": "Deportista actualizado correctamente"}, status=200)

class EliminarDeportistaView(APIView):
    def delete(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        deportista.delete()

        return Response({"mensaje": "Deportista eliminado correctamente"}, status=200)

class EliminarOrganizadorView(APIView):
    def delete(self, request, organizador_id):
        try:
            organizador = Organizador.objects.get(id=organizador_id)
        except Organizador.DoesNotExist:
            return Response({"error": "Organizador no encontrado"}, status=404)

        organizador.delete()

        return Response({"mensaje": "Organizador eliminado correctamente"}, status=200)

class EliminarJuezView(APIView):
    def delete(self, request, juez_id):
        try:
            juez = Jurado.objects.get(id=juez_id)
        except Jurado.DoesNotExist:
            return Response({"error": "Juez no encontrado"}, status=404)

        juez.delete()

        return Response({"mensaje": "Juez eliminado correctamente"}, status=200)

class EliminarCompetenciaView(APIView):
    def delete(self, request, competencia_id):
        try:
            competencia = Competencia.objects.get(id=competencia_id)
        except Competencia.DoesNotExist:
            return Response({"error": "Competencia no encontrada"}, status=404)

        competencia.delete()

        return Response({"mensaje": "Competencia eliminada correctamente"}, status=200)

import secrets  # Asegúrate que arriba esté importado

class CrearJuezView(APIView):
    def post(self, request):
        serializer = CrearJuezSerializer(data=request.data)
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']
            cedula = serializer.validated_data['cedula']
            competencia_id = serializer.validated_data['competencia_id']

            if Jurado.objects(nombre=nombre).first():
                return Response({"error": "Ya existe un juez con ese nombre"}, status=400)

            password = serializer.validated_data['password']
            juez = Jurado(nombre=nombre, password=password, cedula=cedula)
            juez.save()

            # Vincular de una ves con la competencia
            competencia = Competencia.objects(id=competencia_id).first()
            if not competencia:
                return Response({"error": "Competencia no encontrada"}, status=404)

            competencia.jueces.append(juez)
            competencia.save()

            return Response({
                "mensaje": "Juez creado y vinculado exitosamente",
                "nombre": nombre,
                "cedula": cedula,
            }, status=201)

        return Response(serializer.errors, status=400)

class CrearOrganizadorView(APIView):
    def post(self, request):
        serializer = CrearOrganizadorSerializer(data=request.data)
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']
            cedula = serializer.validated_data['cedula']
            competencia_id = serializer.validated_data['competencia_id']

            if Organizador.objects(nombre=nombre).first():
                return Response({"error": "Ya existe un organizador con ese nombre"}, status=400)

            password = serializer.validated_data['password']
            organizador = Organizador(nombre=nombre, password=password, cedula=cedula)
            organizador.save()

            # Vincular de una ves con la competencia
            competencia = Competencia.objects(id=competencia_id).first()
            if not competencia:
                return Response({"error": "Competencia no encontrada"}, status=404)

            competencia.organizadores.append(organizador)
            competencia.save()

            return Response({
                "mensaje": "Organizador creado y vinculado exitosamente",
                "nombre": nombre,
                "cedula": cedula,
            }, status=201)

        return Response(serializer.errors, status=400)

class BuscarJuezView(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        password = request.data.get('password')

        if not nombre and not password:
            return Response({"error": "Debes enviar 'nombre' o 'password' para buscar"}, status=400)

        # mejor buscar por password si lo mandan
        if password:
            juez = Jurado.objects(password=password).first()
        else:
            juez = Jurado.objects(nombre=nombre).first()

        if juez:
            return Response({
                "id": str(juez.id),
                "nombre": juez.nombre,
                "password": juez.password
            }, status=200)
        else:
            return Response({"error": "Juez no encontrado"}, status=404)


class BuscarOrganizadorView(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        password = request.data.get('password')

        if not nombre and not password:
            return Response({"error": "Debes enviar 'nombre' o 'password' para buscar"}, status=400)

        # mejor buscar por password si lo mandan
        if password:
            organizador = Organizador.objects(password=password).first()
        else:
            organizador = Organizador.objects(nombre=nombre).first()

        if organizador:
            return Response({
                "id": str(organizador.id),
                "nombre": organizador.nombre,
                "password": organizador.password
            }, status=200)
        else:
            return Response({"error": "Organizador no encontrado"}, status=404)

class BuscarDeportistaView(APIView):
    def post(self, request):
        nombre = request.data.get('nombre')
        edad = request.data.get('edad')

        if not nombre and not edad:
            return Response({"error": "Debes enviar 'nombre' o 'edad' para buscar"}, status=400)

        # mejor buscar por nombre si lo mandan
        if edad:
            deportista = Deportista.objects(nombre=nombre).first()
        else:
            deportista = Deportista.objects(edad=edad).first()
            
        if deportista:
            return Response({
                "id": str(deportista.id),
                "nombre": deportista.nombre,
                "edad": deportista.edad,
                "saltos": deportista.saltos
            }, status=200)
        else:
            return Response({"error": "Deportista no encontrado"}, status=404)