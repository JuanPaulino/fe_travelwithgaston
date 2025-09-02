# 🐳 Despliegue con Docker - Astro SSR

Este proyecto está configurado para ejecutarse en producción usando Docker con Astro SSR, React 19 y Vite.

## 🏗️ Estructura del Dockerfile

El Dockerfile utiliza un enfoque multi-stage para optimizar el tamaño de la imagen final:

1. **Base Stage**: Configuración común y dependencias del sistema (Node.js 18 Alpine)
2. **Dependencies Stage**: Instalación de todas las dependencias con `npm ci`
3. **Builder Stage**: Construcción de la aplicación con `npm run build`
4. **Runner Stage**: Imagen final optimizada para producción

## 🚀 Construir y Desplegar

### Opción 1: Script Automatizado (Recomendado)

```bash
# Construir y subir versión latest
./build-and-push.sh

# Construir y subir versión específica
./build-and-push.sh v1.0.0

# Construir y subir con username personalizado
./build-and-push.sh v1.0.0 tuusername
```

### Opción 2: Comandos Manuales

```bash
# Construir la imagen
docker build -t travelwithgaston/fe-traverwithgaston:latest .

# Subir a Docker Hub (asegúrate de estar logueado)
docker push travelwithgaston/fe-traverwithgaston:latest
```

## 🧪 Pruebas Locales

### Con Docker Run

```bash
# Ejecutar directamente
docker run -p 4321:4321 travelwithgaston/fe-traverwithgaston:latest

# Con variables de entorno
docker run -p 4321:4321 \
  -e PUBLIC_API_URL=https://tu-api.com \
  travelwithgaston/fe-traverwithgaston:latest
```

## 🔧 Variables de Entorno

| Variable | Descripción | Valor por Defecto | Build Arg |
|----------|-------------|-------------------|-----------|
| `NODE_ENV` | Entorno de ejecución | `production` | No |
| `PUBLIC_API_URL` | URL de la API backend | `http://localhost:3000` | Sí |
| `HOST` | Host del servidor | `0.0.0.0` | No |
| `PORT` | Puerto del servidor | `4321` | No |

### Configuración de Build Args

```bash
# Construir con API URL personalizada
docker build \
  --build-arg PUBLIC_API_URL=https://tu-api.com \
  -t travelwithgaston/fe-traverwithgaston:latest .
```

## 📊 Características de la Imagen

- **Base**: Node.js 18 Alpine (ligero y seguro)
- **Usuario**: Ejecuta como usuario no-root (`astro:1001`)
- **Puerto**: 4321 (puerto estándar de Astro)
- **Output**: SSR (Server-Side Rendering) con modo standalone
- **Integraciones**: React 19, Tailwind CSS v4
- **Multi-stage**: Optimización de tamaño y seguridad

## 🐳 Comandos Útiles

```bash
# Ver logs del contenedor
docker logs <container_id>

# Ejecutar comandos dentro del contenedor
docker exec -it <container_id> sh

# Ver estadísticas del contenedor
docker stats <container_id>

# Inspeccionar la imagen
docker inspect travelwithgaston/fe-traverwithgaston:latest
```

## 🔒 Seguridad

- Usuario no-root para ejecución (`astro:1001`)
- Imagen base Alpine (mínima superficie de ataque)
- Solo dependencias de producción en imagen final
- Permisos correctos en archivos copiados

## 📦 Dependencias del Proyecto

### Principales
- **Astro**: 5.12.4 (Framework SSR)
- **React**: 19.1.1 (UI Library)
- **Tailwind CSS**: 4.1.11 (Styling)
- **@astrojs/node**: 9.4.3 (Adapter para Node.js)

### Características
- **Output**: Server (SSR)
- **Adapter**: Node.js standalone
- **Integrations**: React, Tailwind CSS
- **Type**: ES Modules

## 🚨 Troubleshooting

### Error de permisos
```bash
# Asegúrate de que el script sea ejecutable
chmod +x build-and-push.sh
```

### Error de login en Docker Hub
```bash
# Loguearse en Docker Hub
docker login
```

### Puerto ya en uso
```bash
# Cambiar puerto en el comando docker run
docker run -p 8080:4321 travelwithgaston/fe-traverwithgaston:latest
```

### Error de build
```bash
# Limpiar cache de Docker
docker builder prune

# Reconstruir sin cache
docker build --no-cache -t travelwithgaston/fe-traverwithgaston:latest .
```

## 📚 Recursos Adicionales

- [Documentación oficial de Astro](https://docs.astro.build/)
- [Docker Multi-stage builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
- [Docker Hub](https://hub.docker.com/)
- [Astro Node Adapter](https://docs.astro.build/en/guides/integrations-guide/node/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation)

## 🔄 Flujo de Desarrollo

1. **Desarrollo local**: `npm run dev`
2. **Build**: `npm run build`
3. **Preview**: `npm run preview`
4. **Docker build**: `./build-and-push.sh`
5. **Despliegue**: `docker run` o `docker-compose up`
