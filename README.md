<div align="right">
  <img src="https://img.shields.io/badge/PJ-Pablo%20Jim%C3%A9nez-black?style=for-the-badge" alt="PJ"/>
</div>

# Clasificador de Residuos — Aplicacion Web

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![Docker](https://img.shields.io/badge/Docker-blue?style=flat-square&logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2-orange?style=flat-square&logo=amazonaws)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

Aplicacion web que permite clasificar residuos desde el navegador. El usuario sube una imagen y la IA identifica automaticamente el tipo de residuo con un 98% de precision. Construida con React en el frontend y FastAPI en el backend, desplegada en AWS EC2 con Docker.

Demo en vivo: http://52.23.197.76


## Que resuelve

Permite a cualquier persona clasificar un residuo desde el navegador sin instalar nada, subiendo una foto desde su dispositivo y recibiendo la clasificacion en tiempo real con nivel de confianza y top 3 de predicciones.

## Arquitectura

Frontend React: interfaz de usuario donde se sube la imagen y se muestra el resultado
Backend FastAPI: recibe la imagen, corre el modelo y devuelve la clasificacion
Nginx: reverse proxy que sirve el frontend y redirige las peticiones a la API
Docker: contenedor que empaqueta y orquesta todos los servicios
AWS EC2: instancia donde corre toda la aplicacion


## Tecnologias

React 18: Interfaz de usuario — https://react.dev
FastAPI: API REST del backend — https://fastapi.tiangolo.com
PyTorch 2.0: Inferencia del modelo — https://pytorch.org
Nginx: Servidor web y reverse proxy — https://nginx.org
Docker: Contenedor de servicios — https://docker.com
AWS EC2: Servidor en la nube — https://aws.amazon.com/ec2
Python 3.12: Lenguaje del backend — https://python.org

## Instalacion local

Clona el repositorio con: 'git clone https://github.com/pablojimenez23/clasificador-app.git'

Entra a la carpeta con: 'cd clasificador-app'

Descarga el modelo entrenado desde https://github.com/pablojimenez23/clasificador-imagenes y colocalo en 'api/modelo/clasificador.pth'

Instala las dependencias del backend con: `pip install -r api/requirements.txt`

Instala las dependencias del frontend con:

cd frontend
npm install

Crea el archivo 'frontend/.env' con:

REACT_APP_API_URL=http://127.0.0.1:8000

Corre el backend en una terminal con:

cd api
uvicorn main:aplicacion --reload

Corre el frontend en otra terminal con:

cd frontend
npm start

Abre el navegador en: http://localhost:3000


## Despliegue en AWS EC2

### 1. Crear la instancia

Crea una instancia EC2 con estas configuraciones en https://console.aws.amazon.com/ec2:

AMI: Ubuntu Server 24.04 LTS
Instance type: t2.small o superior
Storage: 20 GB minimo
Security groups: habilitar SSH, HTTP y HTTPS
Key pair: crear o usar uno existente en formato .pem

### 2. Conectarse a la instancia

ssh -i ruta/al/archivo.pem ubuntu@IP_PUBLICA

### 3. Instalar Docker

sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
exit

Vuelve a conectarte para aplicar los permisos de Docker.

### 4. Clonar el repositorio

git clone https://github.com/pablojimenez23/clasificador-app.git
cd clasificador-app
mkdir -p api/modelo

### 5. Subir el modelo desde tu PC local

scp -i ruta/al/archivo.pem ruta/al/clasificador.pth ubuntu@IP_PUBLICA:~/clasificador-app/api/modelo/clasificador.pth

### 6. Subir el build del frontend

En tu PC local genera el build con la IP de EC2:

Crea 'frontend/.env' con:

REACT_APP_API_URL=http://IP_PUBLICA

Genera el build con: 'npm run build'

Sube el build a EC2 con:

scp -i ruta/al/archivo.pem -r frontend/build ubuntu@IP_PUBLICA:~/clasificador-app/frontend/

### 7. Configurar permisos del build

sudo chmod -R 755 frontend/build/
sudo chown -R root:root frontend/build/

### 8. Levantar los contenedores

sudo docker compose up --build -d

La aplicacion queda disponible en: http://IP_PUBLICA

### 9. Levantar la app despues de apagar la instancia

Conectate a EC2 y ejecuta:

cd clasificador-app
sudo docker compose up -d

## Endpoint de la API

GET /: verifica que la API esta activa

POST /clasificar: recibe una imagen y devuelve la clasificacion

Ejemplo de respuesta:

{
  "clasificacion": "PLASTIC",
  "confianza": 94.3,
  "top3": [
    {"clase": "plastic", "probabilidad": 94.3},
    {"clase": "white-glass", "probabilidad": 5.0},
    {"clase": "metal", "probabilidad": 0.6}
  ]
}

Documentacion interactiva disponible en: http://IP_PUBLICA:8000/docs


## Proximas mejoras

Autenticacion con JWT para controlar el acceso a la API
Dominio personalizado con HTTPS usando Let's Encrypt
Soporte para clasificacion de video en tiempo real
Aplicacion movil con React Native


## Como contribuir

Haz fork del repositorio, crea una rama con: `git checkout -b feature/nombre-mejora`, realiza tus cambios y abre un Pull Request describiendo lo que hiciste.


## Repositorio del modelo

El modelo de clasificacion, los scripts de entrenamiento y la documentacion completa estan disponibles en: https://github.com/pablojimenez23/clasificador-imagenes


## Autor

Pablo Jimenez — Ingeniero en Informatica
GitHub: https://github.com/pablojimenez23
Kaggle: https://www.kaggle.com/pablandjf
