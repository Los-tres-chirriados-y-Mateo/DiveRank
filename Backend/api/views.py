# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, Jurado, Organizador, Competencia, Deportista, Salto, Puntuacion, PuntajeSalto, Ranking
from .serializers import AdminLoginSerializer, RolLoginSerializer, CrearCompetenciaSerializer, CrearJuezSerializer, CrearOrganizadorSerializer, DeportistaCrearSerializer, PuntuacionIndividualSerializer, PuntuacionSerializer, JuradoSerializer, OrganizadorSerializer, AdminSerializer, DeportistaCrearSerializer, RankingSerializer, CrearAdministradorSerializer, PuntajeSaltoSerializer

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

        ultimo = Deportista.objects.order_by('-orden').first()
        orden_actual = ultimo.orden + 1 if ultimo else 1

        for d in deportistas_data:
            nombre = d.get('nombre')
            num_saltos = d.get('num_saltos')
            if num_saltos is None:
                return Response({"error": "Se requiere 'num_saltos'"}, status=400)
            saltos = [Salto(nombre="", dificultad=0.0) for _ in range(num_saltos)]

            deportista = Deportista(
                nombre=nombre,
                saltos=saltos,
                num_saltos=num_saltos,
                orden = orden_actual
            )
            orden_actual += 1
            deportista.save()
            competencia = Competencia.objects.first()
            if competencia:
                competencia.deportistas.append(deportista)
                competencia.save()
            nuevos_deportistas.append(str(deportista.id))

        return Response({"mensaje": "Deportistas creados exitosamente", "ids": nuevos_deportistas}, status=201)

class EditarDeportistaView(APIView):
    def put(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        nombre = request.data.get('nombre')
        

        if nombre:
            deportista.nombre = nombre
        
        deportista.save()

        return Response({"mensaje": "Deportista actualizado correctamente"}, status=200)

class EliminarDeportistaView(APIView):
    def delete(self, request, deportista_id):
        try:
            deportista = Deportista.objects.get(id=deportista_id)
        except Deportista.DoesNotExist:
            return Response({"error": "Deportista no encontrado"}, status=404)

        competencia = Competencia.objects.first()
        if competencia and deportista in competencia.deportistas:
            competencia.deportistas.remove(deportista)
            competencia.save()

        deportista.delete()

        return Response({"mensaje": "Deportista eliminado correctamente"}, status=200)

class EliminarOrganizadorView(APIView):
    def delete(self, request, nombre):
        try:
            organizador = Organizador.objects.get(nombre=nombre)
        except Organizador.DoesNotExist:
            return Response({"error": "Organizador no encontrado"}, status=404)

        competencia = Competencia.objects.first()
        if competencia and organizador in competencia.organizadores:
            competencia.organizadores.remove(organizador)
            competencia.save()

        organizador.delete()

        return Response({"mensaje": "Organizador eliminado correctamente"}, status=200)

class EliminarJuezView(APIView):
    def delete(self, request, nombre):
        try:
            juez = Jurado.objects.get(nombre=nombre)
        except Jurado.DoesNotExist:
            return Response({"error": "Juez no encontrado"}, status=404)

        competencia = Competencia.objects.first()
        if competencia and juez in competencia.jueces:
            competencia.jueces.remove(juez)
            competencia.save()

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


            if Jurado.objects(nombre=nombre).first():
                return Response({"error": "Ya existe un juez con ese nombre"}, status=400)

            password = serializer.validated_data['password']
            juez = Jurado(nombre=nombre, password=password, cedula=cedula)
            juez.save()
            competencia = Competencia.objects.first()
            if competencia:
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
            

            if Organizador.objects(nombre=nombre).first():
                return Response({"error": "Ya existe un organizador con ese nombre"}, status=400)

            password = serializer.validated_data['password']
            organizador = Organizador(nombre=nombre, password=password, cedula=cedula)
            organizador.save()
            competencia = Competencia.objects.first()
            if competencia:
                competencia.organizadores.append(organizador)
                competencia.save()


            return Response({
                "mensaje": "Organizador creado y vinculado exitosamente",
                "nombre": nombre,
                "cedula": cedula,
            }, status=201)

        return Response(serializer.errors, status=400)

class BuscarJuezView(APIView):
    def get(self, request):
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
    def get(self, request):
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

class ListarDeportistasView(APIView):
    def get(self, request):

        deportista = Deportista.objects.all()
        serializer = DeportistaCrearSerializer(deportista, many=True)

                
        return Response(serializer.data, status=200)
        
class ListaOrganizadoresView(APIView):
    def get(self, request):
        organizadores = Organizador.objects.all()
        datos = [
            {
                "nombre": o.nombre,
                "cedula": o.cedula,
                "password": o.password
            } for o in organizadores
        ]
        return Response(datos, status=200)
    
class ListaJuecesView(APIView):
    def get(self, request):
        jueces = Jurado.objects.all()
        datos = [
            {
                "nombre": o.nombre,
                "cedula": o.cedula,
                "password": o.password
            } for o in jueces
        ]
        return Response(datos, status=200)

class BuscarDeportistaView(APIView):
    def get(self, request, nombre):  # mejor pasar 'nombre' por URL y como parámetro aquí
        if not nombre:
            return Response({"error": "Debes enviar 'nombre' para buscar"}, status=400)

        deportista = Deportista.objects(nombre=nombre).first()

        if deportista:
            
            saltos_serializer = [{"nombre": salto.nombre, "dificultad": salto.dificultad} for salto in deportista.saltos]

            return Response({
                "id": str(deportista.id),
                "nombre": deportista.nombre,
                "saltos": saltos_serializer
            }, status=200)
        else:
            return Response({"error": "Deportista no encontrado"}, status=404)

        
class RegistrarPuntuacionIndividualView(APIView):
    def post(self, request):
        serializer = PuntuacionIndividualSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            deportista = Deportista.objects(id=data['deportista_id']).first()
            juez = Jurado.objects(id=data['juez_id']).first()
            competencia = Competencia.objects.first()

            if not deportista or not juez or not competencia:
                return Response({"error": "Datos inválidos"}, status=400)

            if juez not in competencia.jueces or deportista not in competencia.deportistas:
                return Response({"error": "Juez o deportista no están en la competencia"}, status=400)

            # Traer todos los saltos de este deportista en esta competencia
            saltos = PuntajeSalto.objects(deportista=deportista, competencia=competencia).order_by('numeroSalto')

            # Buscar el primero que esté incompleto (no todos los jueces han calificado)
            salto = next((s for s in saltos if len(s.puntajes) < len(competencia.jueces)), None)

            if not salto:
                # Si no hay salto incompleto, creamos uno nuevo
                ultimo_num = saltos.order_by('-numeroSalto').first().numeroSalto if saltos else 0
                salto = PuntajeSalto(
                    deportista=deportista,
                    competencia=competencia,
                    numeroSalto=ultimo_num + 1,
                    puntajes=[]
                )

            # Miramos si el juez ya calificó este salto
            for p in salto.puntajes:
                if p.juez.id == juez.id:
                    return Response({"error": "Este juez ya calificó este salto"}, status=400)

            salto.puntajes.append(Puntuacion(juez=juez, puntaje=data['puntaje']))
            dificultad = deportista.saltos[salto.numeroSalto-1].dificultad

            if len(salto.puntajes) == len(competencia.jueces):
                salto.calcular_promedio(dificultad)
                salto.save()
                ActualizarRankingView().get(request)  # Actualizar ranking después de calcular el promedio
                return Response({"mensaje": "Puntaje registrado. Promedio calculado y ranking actualizado."}, status=201)
            else:
                salto.save()
                return Response({"mensaje": "Puntaje registrado. Esperando a los demás jueces."}, status=201)

        return Response(serializer.errors, status=400)
    
class BuscarAdministradorPorCredencialView(APIView):
    def post(self, request):
        credencial = request.data.get('credencial')
        if not credencial:
            return Response({"error": "Credencial requerida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin = Admin.objects.get(password=credencial)
            serializer = AdminSerializer(admin)
            return Response(serializer.data)
        except Admin.DoesNotExist:
            return Response({"error": "Administrador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class BuscarJuezPorCredencialView(APIView):
    def post(self, request):
        credencial = request.data.get('credencial')
        if not credencial:
            return Response({"error": "Credencial requerida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            juez = Jurado.objects.get(password=credencial)
            serializer = JuradoSerializer(juez)
            return Response(serializer.data)
        except Jurado.DoesNotExist:
            return Response({"error": "Juez no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
class BuscarOrganizadorPorCredencialView(APIView):
    def post(self, request):
        credencial = request.data.get('credencial')
        if not credencial:
            return Response({"error": "Credencial requerida"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            organizador = Organizador.objects.get(password=credencial)
            serializer = OrganizadorSerializer(organizador)
            return Response(serializer.data)
        except Organizador.DoesNotExist:
            return Response({"error": "Organizador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class VerCredencialJuezView(APIView):
    def get(self, request, nombre):
        try:
            juez = Jurado.objects.get(nombre=nombre)
        except Jurado.DoesNotExist:
            return Response({"error": "Juez no encontrado"}, status=404)

        data = juez.password

        return Response(data, status=200)
    
class VerCredencialOrganizadorView(APIView):
    def get(self, request, nombre):
        try:
            organizador = Organizador.objects.get(nombre=nombre)
        except Organizador.DoesNotExist:
            return Response({"error": "Organizador no encontrado"}, status=404)

        data = organizador.password

        return Response(data, status=200)

class ActualizarSaltosView(APIView):
    def put(self, request, nombre):
        saltos_data = request.data.get('saltos')
        if not saltos_data:
            return Response({"error": "No se enviaron saltos"}, status=status.HTTP_400_BAD_REQUEST)

        deportista = Deportista.objects(nombre=nombre).first()
        if not deportista:
            return Response({"error": "Deportista no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Convertir cada dict en instancia de Salto
        saltos_objs = [Salto(nombre=s.get('nombre', ''), dificultad=s.get('dificultad', 0.0)) for s in saltos_data]

        deportista.saltos = saltos_objs
        deportista.save()

        return Response({"mensaje": "Saltos actualizados"}, status=status.HTTP_200_OK)
    
class ActualizarRankingView(APIView):
    def get(self, request):
        datos = {}
        resultados = []
        for salto in PuntajeSalto.objects:
            idDeportista = str(salto.deportista.id)
            if idDeportista not in datos:
                datos[idDeportista] = []
            datos[idDeportista].append(salto.promedio)
        for idDeportista, promedio in datos.items():
            deportista = Deportista.objects.get(id = idDeportista)
            totalPromedio = sum(promedio)
            resultados.append((deportista, totalPromedio, promedio))
        resultados.sort(key=lambda x:x[1], reverse = True)
        Ranking.drop_collection()
        for i, (deportista, j, promedio) in enumerate(resultados, start=1):

            Ranking(deportista=deportista, promedios = promedio, posicion = i).save()
            

        ranking = Ranking.objects.order_by('posicion')
        
        serializer = RankingSerializer(ranking, many=True)
        return Response(serializer.data, status=200)

class ListarRankingView(APIView):
    def get(self, request):
        ranking = Ranking.objects.order_by('posicion')
        serializer = RankingSerializer(ranking, many=True)
        return Response(serializer.data, status=200)

class ListarPuntajesView(APIView):
    def get(self, request):
        puntajes = PuntajeSalto.objects.all()
        serializer = PuntajeSaltoSerializer(puntajes, many=True)
        return Response(serializer.data, status=200)
            
class ListaAdministradoresView(APIView):
    def get(self, request):
        administradores = Admin.objects.all()
        datos = [
            {
                "nombre": o.nombre,
                "password": o.password
            } for o in administradores
        ]
        return Response(datos, status=200)
    
class VerCredencialAdministradorView(APIView):
    def get(self, request, nombre):
        try:
            administrador = Admin.objects.get(nombre=nombre)
        except Admin.DoesNotExist:
            return Response({"error": "Administrador no encontrado"}, status=404)

        data = administrador.password

        return Response(data, status=200)
    
class EliminarAdministradorView(APIView):
    def delete(self, request, nombre):
        try:
            administrador = Admin.objects.get(nombre=nombre)
        except Admin.DoesNotExist:
            return Response({"error": "Administrador no encontrado"}, status=404)

        

        administrador.delete()

        return Response({"mensaje": "Administrador eliminado correctamente"}, status=200)
    
class CrearAdministradorView(APIView):
    def post(self, request):
        serializer = CrearAdministradorSerializer(data=request.data)
        if serializer.is_valid():
            nombre = serializer.validated_data['nombre']


            if Admin.objects(nombre=nombre).first():
                return Response({"error": "Ya existe un administrador con ese nombre"}, status=400)

            password = serializer.validated_data['password']
            juez = Admin(nombre=nombre, password=password)
            juez.save()
            
            

            return Response({
                "mensaje": "Administrador creado y vinculado exitosamente",
                "nombre": nombre,
            }, status=201)

        return Response(serializer.errors, status=400)

class BuscarAdminPorNombreView(APIView):
    def get(self, request, nombre):
        admin = Admin.objects(nombre=nombre).first()
        if admin:
            serializer = AdminSerializer(admin)
            return Response(serializer.data, status=200)
        return Response({"error": "Admin no encontrado"}, status=404)

class BuscarIdJuezPorNombreView(APIView):
    def get(self, request, nombre):
        juez = Jurado.objects(nombre=nombre).first()
        if juez:
            idJuez = str(juez.id)
            return Response({"id": idJuez}, status=200)
        return Response({"error": "Juez no encontrado"}, status=404)

class BuscarIdDeportistaPorNombreView(APIView):
    def get(self, request, nombre):
        deportista = Deportista.objects(nombre=nombre).first()
        if deportista:
            idDeportista = str(deportista.id)
            return Response({"id": idDeportista}, status=200)
        return Response({"error": "Deportista no encontrado"}, status=404)