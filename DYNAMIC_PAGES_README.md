# Sistema de Páginas Dinámicas

Este sistema permite crear páginas dinámicas en Astro que se pueden gestionar desde Directus CMS.

## Cómo funciona

### 0. ¿Por qué `[...slug].astro`?
Usamos un **parámetro rest** (`[...slug]`) en lugar de un parámetro simple (`[slug]`) para evitar conflictos con la página de inicio (`index.astro`). Esto permite:

- **Página de inicio**: `/` → `index.astro`
- **Páginas dinámicas**: `/mi-pagina`, `/destinos/paris`, etc. → `[...slug].astro`
- **Sin conflictos**: No hay colisión entre rutas

### 1. Estructura de las páginas
- **Página de inicio**: `src/pages/index.astro` - Obtiene datos de Directus con slug 'home'
- **Páginas dinámicas**: `src/pages/[...slug].astro` - Cualquier slug (ej: `/mi-pagina`, `/destinos/paris`, etc.)
- **Datos**: Se obtienen desde Directus usando la función `getPageData(slug)`
- **Layout**: Todas las páginas usan `Layout.astro` de manera consistente
- **Bloques**: Sistema unificado `DynamicBlocks.astro` para manejar todos los tipos de bloques

### 2. Configuración en Directus
La colección `pages` en Directus debe tener los siguientes campos:
- `permalink`: El slug de la URL (ej: "mi-pagina", "destinos/paris")
- `status`: Estado de la página ("published" para páginas públicas)
- `title`: Título de la página
- `content`: Contenido HTML de la página
- `blocks`: Bloques dinámicos (opcional)

### 3. Sistema unificado de bloques
El componente `DynamicBlocks.astro` centraliza el manejo de todos los tipos de bloques:
- **Reutilizable**: Usado tanto en `index.astro` como en `[...slug].astro`
- **Extensible**: Fácil agregar nuevos tipos de bloques
- **Compatibilidad**: Soporta formatos antiguos y nuevos
- **Debug**: Información detallada en modo desarrollo
- **Consistencia**: Misma lógica en todas las páginas

### 4. Validaciones
- Solo se muestran páginas con `status = "published"`
- Si la página no existe o no está publicada, se redirige a `/404`
- La verificación se hace directamente en la consulta de Directus

### 5. Bloques dinámicos soportados
El sistema unificado `DynamicBlocks.astro` maneja los siguientes tipos de bloques:

#### Bloques principales:
- `block_hero` / `hero_section`: Sección hero con título y descripción
- `block_inspiration_grid` / `inspiration_grid`: Grid de elementos de inspiración con imágenes
- `block_featured_hotels`: Hoteles destacados
- `content_block` / `block_content`: Bloque de contenido con título y contenido HTML

#### Compatibilidad:
- Soporta tanto el formato nuevo (`block_*`) como el formato anterior (`*_section`)
- Fallback automático para bloques no reconocidos
- Debug en modo desarrollo para bloques desconocidos

### 6. Variables de entorno
```env
DIRECTUS_URL=http://localhost:8055
```

## Uso

### Página de inicio
La página de inicio (`/`) obtiene datos de Directus usando el slug `'home'`:
1. En Directus, crear un registro en la colección `pages` con:
   - `permalink`: "home"
   - `status`: "published"
   - `title`: Título de la página de inicio
   - `content`: Contenido HTML (opcional)
   - `blocks`: Bloques dinámicos (opcional)

### Crear una nueva página
1. En Directus, crear un nuevo registro en la colección `pages`
2. Configurar:
   - `permalink`: El slug deseado (ej: "sobre-nosotros")
   - `status`: "published"
   - `title`: Título de la página
   - `content`: Contenido HTML (opcional)
   - `blocks`: Bloques dinámicos (opcional)

### Acceder a las páginas
- **Página de inicio**: `http://tu-dominio.com/`
- **Páginas dinámicas**: `http://tu-dominio.com/sobre-nosotros`
- Las páginas se renderizarán automáticamente con los datos de Directus

### Modificar el slug
- Cambiar el campo `permalink` en Directus
- La nueva URL estará disponible inmediatamente
- La URL anterior redirigirá a 404

## Desarrollo

### Debug
En modo desarrollo, se muestra información de debug en la parte inferior de la página:
- Slug actual
- Permalink de Directus
- Status de la página
- Título
- Número de bloques

### Estructura de archivos
```
src/
├── pages/
│   ├── index.astro          # Página de inicio (usa DynamicBlocks)
│   ├── [...slug].astro      # Página dinámica (usa DynamicBlocks)
│   └── 404.astro           # Página de error
├── components/
│   ├── DynamicBlocks.astro  # Sistema unificado de bloques
│   ├── DebugInfo.jsx       # Componente de debug
│   ├── HeroSection.astro   # Componente de sección hero
│   ├── InspirationGrid.astro # Componente de grid de inspiración
│   └── FeaturedHotels.astro # Componente de hoteles destacados
└── lib/
    └── directus.js         # Cliente de Directus
```

## Consideraciones

### SEO
- Los meta tags se generan dinámicamente a través del Layout
- El título y descripción se obtienen de Directus
- Las URLs son amigables para SEO
- Todas las páginas heredan los estilos y fuentes del Layout

### Rendimiento
- Las páginas se renderizan en el servidor (SSR)
- Solo se cargan las páginas que se solicitan
- Las imágenes se sirven desde Directus

### Seguridad
- Solo se muestran páginas con status "published"
- Las páginas no publicadas redirigen a 404
- No se exponen datos internos de Directus 