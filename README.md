# McDonald's Photo Booth - Netlify

## 📦 Archivos necesarios:

```
tu-repo/
├── functions/
│   └── replicate.js
├── index.html
├── package.json
└── netlify.toml
```

## 🚀 Pasos para deployar:

### 1️⃣ Subir a GitHub
Creá un repo y subí estos 4 archivos con la estructura de carpetas exacta.

### 2️⃣ Conectar Netlify
1. [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import from Git** → **GitHub**
3. Elegí tu repo
4. No cambies ninguna configuración

### 3️⃣ Variable de entorno (IMPORTANTE)
Expandí **"Advanced"** → **"New variable"**:
- **Key**: `REPLICATE_API_TOKEN`
- **Value**: Tu token (r8_...)

### 4️⃣ Deploy
Click **"Deploy"** y esperá 2-3 minutos.

## 🔑 Token de Replicate:
https://replicate.com/account/api-tokens → Crear nuevo token

## ✅ Listo!
Abrí la URL que te dio Netlify y funcionará automáticamente.

## 💰 Costos:
- Netlify: Gratis
- Replicate: ~$0.04 por foto
