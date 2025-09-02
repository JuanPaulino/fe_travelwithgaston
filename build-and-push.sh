#!/bin/bash

# Script para construir y subir la imagen de Astro a Docker Hub
# Uso: ./build-and-push.sh [version] [username]

set -e

# Configuración por defecto
VERSION=${1:-latest}
USERNAME=${2:-travelwithgaston}
IMAGE_NAME="fe-traverwithgaston"
FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME:$VERSION"

echo "🚀 Construyendo imagen de Astro SSR con npm..."
echo "📦 Imagen: $FULL_IMAGE_NAME"

# Cargar variables de entorno del archivo .env si existe
if [ -f .env ]; then
    echo "📋 Cargando variables de entorno desde .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  Archivo .env no encontrado, usando valores por defecto"
fi

# Construir la imagen con build args
docker build \
    --build-arg PUBLIC_API_URL=${PUBLIC_API_URL:-http://localhost:3000} \
    -t $FULL_IMAGE_NAME .

echo "✅ Imagen construida exitosamente"

# Etiquetar como latest si no es la versión por defecto
if [ "$VERSION" != "latest" ]; then
    echo "🏷️  Etiquetando como latest..."
    docker tag $FULL_IMAGE_NAME "$USERNAME/$IMAGE_NAME:latest"
fi

echo "📤 Subiendo imagen a Docker Hub..."
echo "🔐 Asegúrate de estar logueado en Docker Hub (docker login)"

# Subir la imagen
docker push $FULL_IMAGE_NAME

if [ "$VERSION" != "latest" ]; then
    echo "📤 Subiendo versión latest..."
    docker push "$USERNAME/$IMAGE_NAME:latest"
fi

echo "🎉 ¡Imagen subida exitosamente a Docker Hub!"
echo "🐳 Para ejecutar localmente:"
echo "   docker run -p 4321:4321 $FULL_IMAGE_NAME"
echo ""
echo "🔧 Para ejecutar con variables de entorno:"
echo "   docker run -p 4321:4321 -e PUBLIC_API_URL=tu-api-url $FULL_IMAGE_NAME"
