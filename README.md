# McDonald's Photo Booth - Vercel Deployment

Aplicación web segura para activaciones de marca que transforma fotos en retratos oficiales de empleados de McDonald's usando IA.

## 🔒 Seguridad

Esta versión usa un backend serverless en Vercel que mantiene tu API key de Replicate **completamente privada**. Nunca se expone en el código del frontend.

---

## 🚀 Deploy en Vercel (Paso a Paso)

### PASO 1: Preparar los archivos

Descargá estos archivos que te pasé:
- `public/index.html`
- `api/replicate.js`
- `vercel.json`
- `package.json`
- `.gitignore`

### PASO 2: Subir a GitHub

1. Creá un **nuevo repositorio en GitHub** (puede ser privado)
2. Subí **todos los archivos** manteniendo la estructura de carpetas:
   ```
   tu-repo/
   ├── api/
   │   └── replicate.js
   ├── public/
   │   └── index.html
   ├── vercel.json
   ├── package.json
   └── .gitignore
   ```

### PASO 3: Conectar con Vercel

1. Andá a [vercel.com](https://vercel.com)
2. Registrate/Iniciá sesión (podés usar tu cuenta de GitHub)
3. Click en **"Add New"** → **"Project"**
4. Importá tu repositorio de GitHub
5. Click en **"Import"**

### PASO 4: Configurar la Variable de Entorno (MUY IMPORTANTE)

Antes de deployar, tenés que agregar tu API key:

1. En la pantalla de configuración del proyecto, scrolleá hasta **"Environment Variables"**
2. Agregá una nueva variable:
   - **Name**: `REPLICATE_API_TOKEN`
   - **Value**: Tu API token de Replicate (el que empieza con `r8_...`)
3. Seleccioná: **Production**, **Preview**, y **Development**

### PASO 5: Deploy

1. Click en **"Deploy"**
2. Esperá 1-2 minutos
3. ¡Listo! Te va a dar una URL tipo: `https://tu-proyecto.vercel.app`

---

## 🔑 Conseguir tu API Token de Replicate

1. Andá a: [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Creá un **nuevo token** (le podés poner nombre: "vercel-photobooth")
3. **Copialo inmediatamente** (solo lo ves una vez)
4. Pegalo en las variables de entorno de Vercel como se explicó arriba

---

## 📱 Usar la App

1. Abrí la URL que te dio Vercel en cualquier dispositivo
2. Funciona en celu, tablet, o compu
3. Da permisos de cámara
4. Sacá la foto
5. Esperá 15-30 segundos
6. Escaneá el QR para descargar

---

## 💰 Costos

- **Vercel**: Gratis (Hobby plan incluye todo lo que necesitás)
- **Replicate API**: ~$0.04 USD por foto
- **Ejemplo**: 500 personas = ~$20 USD

---

## 🔄 Actualizar tu Sitio

Si querés cambiar algo:

1. Editá los archivos en GitHub
2. Hacé commit
3. Vercel redeploya automáticamente

---

## ✏️ Personalizar el Prompt

Para cambiar el estilo de foto, editá el archivo `api/replicate.js`:

```javascript
const AI_PROMPT = `Tu descripción personalizada aquí...`;
```

Ejemplos:
- **Figurita Mundial**: `Transform into Argentina World Cup Panini sticker...`
- **Revista Forbes**: `Forbes Magazine cover portrait, professional...`
- **Retro 80s**: `1980s yearbook photo, vintage filter...`

---

## 🆘 Solución de Problemas

**Error: "API token not configured"**
- Verificá que agregaste la variable `REPLICATE_API_TOKEN` en Vercel
- Andá a tu proyecto → Settings → Environment Variables
- Agregala y redeployá

**Error: "Failed to fetch"**
- Verificá que tu API token de Replicate sea válido
- Verificá que tengas crédito/tarjeta en Replicate

**La cámara no funciona**
- Abrí en Chrome o Safari (no en navegador de WhatsApp/Instagram)
- Da permisos cuando te lo pida
- Debe ser HTTPS (Vercel lo provee automáticamente)

---

## 📧 Soporte

Si tenés problemas:
- Replicate: [replicate.com/docs/support](https://replicate.com/docs/support)
- Vercel: [vercel.com/support](https://vercel.com/support)

---

## 🎉 ¡Eso es todo!

Tu photobooth está listo y completamente seguro. El API token nunca se expone públicamente.
