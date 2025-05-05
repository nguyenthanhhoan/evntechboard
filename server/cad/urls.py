from django.urls import path
from . import views

urlpatterns = [
    path('cad/upload/', views.CadFileUploadView.as_view(), name='cad-upload'),
    path('cad/current/', views.CurrentCadFileView.as_view(), name='current-cad-file'),
    path('cad/entities/', views.CadEntitiesView.as_view(), name='cad-entities'),
    path('cad/entities/<str:pk>/', views.CadEntityDetailView.as_view(), name='cad-entity-detail'),
    path('cad/layers/', views.CadLayersView.as_view(), name='cad-layers'),
    path('cad/layers/<str:name>/', views.CadEntitiesByLayerView.as_view(), name='cad-entities-by-layer'),
]
