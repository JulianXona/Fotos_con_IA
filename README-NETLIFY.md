# McDonald's Photo Booth - Netlify

Aplicación web para activaciones de marca con transformación de fotos usando IA.

## 🚀 Deploy en Netlify (Super Simple)

### PASO 1: Conectar con GitHub

1. Andá a [app.netlify.com](https://app.netlify.com)
2. Iniciá sesión con tu cuenta de GitHub
3. Click en **"Add new site"** → **"Import an existing project"**
4. Elegí **GitHub**
5. Autorizá Netlify si es la primera vez
6. Seleccioná tu repositorio

### PASO 2: Configurar el Build

En la pantalla de configuración:

- **Build command**: (dejar vacío)
- **Publish directory**: `public`
- **Functions directory**: `netlify/functions`

Click en **"Show advanced"** → **"Add environment variable"**

### PASO 3: Agregar Variable de Entorno

Click en **"New variable"**:

- **Key**: `REPLICATE_API_TOKEN`
- **Value**: Tu API token de Replicate (empieza con `r8_...`)

### PASO 4: Deploy

Click en **"Deploy site"**

Esperá 1-2 minutos y listo! Tu URL será algo como: `https://nombre-random.netlify.app`

---

## 📁 Estructura de Archivos para GitHub

```
tu-repo/
├── netlify/
│   └── functions/
│       └── replicate.js
├── public/
│   └── index.html
├── netlify.toml
├── .gitignore
└── README.md
```

---

## 🔑 Conseguir API Token de Replicate

1. Andá a: [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Creá un **nuevo token**
3. **Copialo inmediatamente** (solo lo ves una vez)
4. Pegalo en la variable de entorno de Netlify

---

## 📱 Usar la App

1. Abrí la URL que te dio Netlify
2. Click en "EMPEZAR"
3. Da permisos de cámara
4. Botón 🔄 para cambiar entre cámara frontal/trasera
5. Sacá la foto
6. "TRANSFORMAR CON IA" → Esperá 15-30 segundos
7. Escaneá el QR para descargar

---

## 💰 Costos

- **Netlify**: Gratis (plan gratuito incluye todo)
- **Replicate**: ~$0.04 USD por foto
- **Ejemplo**: 500 personas = ~$20 USD

---

## 🔄 Actualizar tu Sitio

Simplemente:
1. Editá archivos en GitHub
2. Commit
3. Netlify redeploya automáticamente

---

## ✏️ Personalizar el Prompt

Para cambiar el estilo de transformación, editá `netlify/functions/replicate.js`:

```javascript
const prompt = "Tu descripción personalizada aquí...";
```

Ejemplos:
- **Figurita Mundial**: `Transform into Argentina World Cup Panini sticker...`
- **Revista TIME**: `TIME Magazine cover portrait, bold typography...`
- **Retro 80s**: `1980s yearbook photo, vintage filter...`

---

## 🆘 Solución de Problemas

**Error: "API token not configured"**
- Verificá que agregaste `REPLICATE_API_TOKEN` en Site settings → Environment variables
- Redeployá el sitio

**La cámara no funciona**
- Debe ser HTTPS (Netlify lo provee automáticamente)
- Abrí en Chrome o Safari (no WhatsApp/Instagram browser)
- Da permisos cuando lo pida

**Error al transformar**
- Verificá que tu token de Replicate sea válido
- Verificá que tengas crédito en Replicate

---

## ✅ Ventajas de Netlify

- ✅ Más simple que Vercel para functions
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratis
- ✅ Variables de entorno seguras
- ✅ Plan gratuito generoso

---

## 🎉 ¡Listo!

Tu photobooth está completamente seguro y funcional.
