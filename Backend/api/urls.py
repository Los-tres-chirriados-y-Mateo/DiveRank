from django.urls import path
from .views import (
    AdminLoginView,
    RolLoginView,
    CrearCompetenciaView,
    EliminarCompetenciaView,
    ListaCompetenciasView,
    CrearDeportistasView,
    EditarDeportistaView,
    EliminarDeportistaView,
    EliminarJuezView,
    EliminarOrganizadorView,
    CrearJuezView,
    CrearOrganizadorView,
    BuscarJuezView,
    BuscarOrganizadorView,
    BuscarDeportistaView,
    RegistrarPuntuaciónView,    
)

urlpatterns = [
    path('admin_login/', AdminLoginView.as_view(), name='admin_login'),
    path('rol_login/', RolLoginView.as_view(), name='rol_login'),

    path('crear_competencia/', CrearCompetenciaView.as_view(), name='crear_competencia'),
    path('eliminar_competencia/<str:competencia_id>/', EliminarCompetenciaView.as_view(), name='eliminar_competencia'),
    path('lista_competencias/', ListaCompetenciasView.as_view(), name='lista_competencias'),

    path('registrar_puntuacion/', RegistrarPuntuaciónView.as_view(), name='registrar_puntuacion'),

    path('crear_deportistas/', CrearDeportistasView.as_view(), name='crear_deportistas'),
    path('editar_deportista/<str:deportista_id>/', EditarDeportistaView.as_view(), name='editar_deportista'),
    path('eliminar_deportista/<str:deportista_id>/', EliminarDeportistaView.as_view(), name='eliminar_deportista'),
    path('eliminar_juez/<str:juez_id>/', EliminarJuezView.as_view(), name='eliminar_juez'),
    path('eliminar_organizador/<str:organizador_id>/', EliminarOrganizadorView.as_view(), name='eliminar_organizador'),
    path('crear_juez/', CrearJuezView.as_view(), name='crear_juez'),
    path('crear_organizador/', CrearOrganizadorView.as_view(), name='crear_organizador'),
    path('buscar_juez/', BuscarJuezView.as_view(), name='buscar_juez'),
    path('buscar_organizador/', BuscarOrganizadorView.as_view(), name='buscar_organizador'),
    path('buscar_deportista/', BuscarDeportistaView.as_view(), name='buscar_deportista'),
]

