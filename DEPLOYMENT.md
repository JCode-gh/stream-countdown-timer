# Deployment Guide 🚀

## Quick Deployment Options

### Option 1: Local Development (Recommended for most users)
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173`

### Option 2: Static Build + Web Server
```bash
npm run build
npm run preview
```
Access at: `http://localhost:4173`

### Option 3: Deploy to GitHub Pages

1. **Build the project**
```bash
npm run build
```

2. **Update vite.config.ts** for GitHub Pages:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/stream-countdown-timer/', // Replace with your repo name
  build: {
    outDir: 'dist',
  }
})
```

3. **Deploy to GitHub Pages**
```bash
# Push dist folder to gh-pages branch
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### Option 4: Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Drag the `dist` folder to Netlify Drop
   - Or connect your GitHub repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 5: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
npm run build
vercel --prod
```

### Option 6: Self-Hosted with nginx

1. **Build the project**
```bash
npm run build
```

2. **nginx configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Configuration for Production

### Environment Variables
Create a `.env.production` file:
```env
VITE_APP_TITLE=Stream Countdown Timer
VITE_APP_DESCRIPTION=Professional countdown timer for streamers
VITE_BASE_URL=https://your-domain.com
```

### Build Optimization
Update `vite.config.ts` for production:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
})
```

## 🌐 CDN and Performance

### Using a CDN
After building, upload the `dist` folder to:
- **AWS CloudFront**
- **Cloudflare**
- **Google Cloud CDN**
- **Azure CDN**

### Performance Optimizations
1. **Enable gzip compression**
2. **Set proper cache headers**
3. **Use HTTP/2**
4. **Optimize images** (if you add custom backgrounds)

## 🔒 Security Considerations

### Content Security Policy
Add to your web server headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *;
```

### HTTPS
Always use HTTPS in production:
- Required for modern browser features
- Better performance with HTTP/2
- Security for your users

## 📱 Mobile/Multi-Device Setup

### PWA Configuration (Optional)
Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#667eea">
```

Create `public/manifest.json`:
```json
{
  "name": "Stream Countdown Timer",
  "short_name": "Timer",
  "description": "Professional countdown timer for streamers",
  "start_url": "/",
  "display": "fullscreen",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🏠 Local Network Access (LAN Streaming)

### Access from other devices on your network:

1. **Find your local IP**
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

2. **Start dev server with host flag**
```bash
npm run dev -- --host
```

3. **Access from other devices**
```
http://192.168.1.100:5173  # Replace with your IP
```

### Firewall Configuration
Ensure port 5173 (or your chosen port) is open:
- **Windows**: Windows Defender Firewall
- **Mac**: System Preferences > Security & Privacy
- **Linux**: `ufw allow 5173`

## 🔄 Auto-Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🎯 OBS Integration Tips

### Using Local URLs
- **Development**: `http://localhost:5173/#/display`
- **Production**: `https://your-domain.com/#/display`

### Network Streaming Setup
If streaming from multiple computers:
1. Deploy to a web server
2. Use the web URL in all OBS instances
3. Configure same settings across devices

### Backup Plans
Always have a backup:
1. Local development server
2. Deployed version
3. Static HTML fallback

---

**Ready to deploy! 🌟**

## 📞 Support

For deployment issues:
1. Check the browser console for errors
2. Verify build output in `dist` folder
3. Test locally before deploying
4. Check server logs for 404 errors 