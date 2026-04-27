# 🗺️ Darb AI Frontend

## الرفع على Netlify

### الخطوة 1 — قبل الرفع
افتح ملف `.env.production` وغيّر:
```
REACT_APP_API_URL=https://YOUR-RAILWAY-URL.up.railway.app
```

### الخطوة 2 — ارفع على Netlify
- افتح netlify.com
- Add new site → Deploy manually
- اسحب المجلد كله

### أو عن طريق GitHub
- ارفع الكود على GitHub
- Netlify → Import from Git
- Build command: `CI=false npm run build`
- Publish directory: `build`
- Environment variable: REACT_APP_API_URL = رابط Railway

## تشغيل محلي
```bash
npm install
npm start
```
الفرونت هيشتغل على: http://localhost:3000
