// api/assets/[...path].js - Endpoint para servir assets con cache headers
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET({ params }) {
  try {
    const { path } = params;
    console.log('Requested asset path:', path);
    
    // Construir la ruta al archivo en public
    const assetPath = join(process.cwd(), 'public', path);
    console.log('Asset file path:', assetPath);
    
    // Leer el archivo
    const fileBuffer = await readFile(assetPath);
    
    // Determinar el tipo de contenido
    const ext = path.split('.').pop().toLowerCase();
    const mimeTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'css': 'text/css',
      'js': 'application/javascript',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'eot': 'application/vnd.ms-fontobject'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    console.error('Error serving asset:', error);
    return new Response(`Asset not found: ${error.message}`, { status: 404 });
  }
}
