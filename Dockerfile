# Multi-stage build para Astro SSR con React
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Stage 1: Dependencias
FROM base AS deps
RUN npm ci --only=production=false

# Stage 2: Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NODE_ENV=production
# Las variables de entorno se pasan durante el build con --build-arg
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL:-http://localhost:3000}

# Construir la aplicación
RUN npm run build

# Stage 3: Producción
FROM node:18-alpine AS runner
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos construidos
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

# Copiar archivos estáticos de public
COPY --from=builder --chown=astro:nodejs /app/public ./public

# Variables de entorno
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

# Cambiar al usuario no-root
USER astro

# Comando para ejecutar la aplicación
CMD ["node", "dist/server/entry.mjs"]
