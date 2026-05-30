from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms, models
from PIL import Image
import torch
import io

# Inicializacion de la aplicacion FastAPI
aplicacion = FastAPI(title="Clasificador de Residuos API")

# Configuracion de CORS para permitir peticiones desde el frontend React
aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clases en orden alfabetico, igual que las lee ImageFolder
clases = [
    'battery', 'biological', 'brown-glass', 'cardboard',
    'clothes', 'green-glass', 'metal', 'paper',
    'plastic', 'shoes', 'trash', 'white-glass'
]

# Carga del modelo al iniciar el servidor
def cargar_modelo():
    modelo = models.resnet18(weights=None)
    modelo.fc = torch.nn.Linear(modelo.fc.in_features, len(clases))
    modelo.load_state_dict(
        torch.load('modelo/clasificador.pth', map_location='cpu'))
    modelo.eval()
    return modelo

modelo = cargar_modelo()

# Transformaciones aplicadas a cada imagen recibida
transformacion = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

@aplicacion.get("/")
def inicio():
    return {"mensaje": "Clasificador de Residuos API activo"}

@aplicacion.post("/clasificar")
async def clasificar(imagen: UploadFile = File(...)):
    # Lectura y preprocesamiento de la imagen recibida
    contenido = await imagen.read()
    img = Image.open(io.BytesIO(contenido)).convert('RGB')
    tensor = transformacion(img).unsqueeze(0)

    # Inferencia con el modelo entrenado
    with torch.no_grad():
        salida         = modelo(tensor)
        probabilidades = torch.softmax(salida, dim=1)
        confianza, indice = probabilidades.max(1)

    # Construccion de la respuesta con top 3 predicciones
    valores, indices = probabilidades[0].topk(3)
    top3 = [
        {"clase": clases[i], "probabilidad": round(p.item() * 100, 1)}
        for p, i in zip(valores, indices)
    ]

    return {
        "clasificacion": clases[indice.item()].upper(),
        "confianza": round(confianza.item() * 100, 1),
        "top3": top3
    }