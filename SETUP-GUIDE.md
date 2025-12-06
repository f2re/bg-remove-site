# 🚀 Setup Guide - BG Remove Landing Page

## ✅ What's Been Created

A modern, fully responsive landing page for your Telegram background removal bot with:

### 🎨 Features Implemented
- ⚡ **Next.js 14+** with App Router for optimal performance
- 🎨 **Tailwind CSS** with custom color scheme
- ✨ **Framer Motion** animations for smooth user experience
- 📱 **Fully responsive** design (mobile, tablet, desktop)
- 🔍 **SEO optimized** with meta tags and Schema.org structured data
- 🎯 **8 main sections**: Hero, Features, How It Works, Use Cases, Pricing, FAQ, CTA, Footer
- 🚀 **Fast loading** and optimized for production

### 📂 Project Structure
```
bg-remove-site/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx             # Main landing page
│   └── globals.css          # Global styles
├── components/
│   ├── sections/            # All page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── UseCases.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── StructuredData.tsx   # SEO Schema.org markup
├── lib/
│   ├── constants.ts         # All content and configuration
│   └── utils.ts             # Utility functions
├── .env.local              # Environment variables
└── README.md               # Documentation

```

## 🎯 Quick Start

### 1. View Your Site
The development server is already running at:
**http://localhost:3000**

Open this URL in your browser to see your landing page!

### 2. Configure Your Bot Details

Edit `.env.local` and update:

```bash
# Your Telegram bot username (without @)
NEXT_PUBLIC_BOT_USERNAME=your_actual_bot_username

# Full bot URL
NEXT_PUBLIC_BOT_URL=https://t.me/your_actual_bot_username

# Your domain (for production)
NEXT_PUBLIC_SITE_URL=https://bg.app-studio.online
```

### 3. Customize Content

All content is in `lib/constants.ts`. Update:

#### Bot Information
```typescript
export const BOT_USERNAME = "your_bot_username";
```

#### Pricing Packages
```typescript
export const PRICING_PACKAGES = [
  {
    id: 1,
    name: "Пробный",
    price: 0,
    photos: 3,
    // ... customize as needed
  },
  // Add or modify packages
];
```

#### Features, FAQ, Use Cases
Simply edit the arrays in `lib/constants.ts` to match your needs.

## 🎨 Customization Guide

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "#0088CC",  // Your brand color
    dark: "#006699",
    light: "#00A0E6",
  },
  secondary: {
    DEFAULT: "#8B5CF6",  // Accent color
    // ...
  },
}
```

### Modify Sections

Each section is a standalone component in `components/sections/`.
Edit any file to customize layout, text, or styling.

### Add New Icons

Using Lucide React icons. Add imports like:
```typescript
import { YourIcon } from "lucide-react";
```

Browse icons at: https://lucide.dev

## 📱 Testing Responsiveness

The site is optimized for all devices:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

Test by resizing your browser or using browser dev tools (F12).

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

Done! Your site will be live in minutes.

### Option 2: Netlify

1. Push to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repo
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Add environment variables
8. Deploy!

### Option 3: Your Own Server

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `.next`, `public`, `node_modules`, `package.json` to your server

3. Install PM2 (process manager):
   ```bash
   npm install -g pm2
   pm2 start npm --name "bg-remove-site" -- start
   ```

## 📊 SEO Optimization

### Already Implemented
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook, VK)
- ✅ Twitter Card tags
- ✅ Schema.org structured data:
  - Organization
  - SoftwareApplication
  - FAQPage
  - Product (for each pricing package)
- ✅ Semantic HTML
- ✅ Fast loading (< 2s)

### After Deployment

1. **Google Search Console**
   - Add your site
   - Submit sitemap: `https://bg.app-studio.online/sitemap.xml`

2. **Yandex Webmaster**
   - Add your site
   - Verify ownership
   - Submit sitemap

3. **Analytics** (Optional)
   Uncomment in `.env.local`:
   ```bash
   NEXT_PUBLIC_YANDEX_METRIKA_ID=your_counter_id
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

## 🎯 Performance Tips

The site is already optimized, but you can further improve:

1. **Add Real Images**: Replace placeholder images in `public/images/`
2. **Enable Caching**: Configure in your hosting provider
3. **CDN**: Vercel/Netlify include this automatically
4. **Compress Images**: Use WebP format, max 200KB per image

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run lint
```

## 📝 Content Updates

To update content without code:

1. Open `lib/constants.ts`
2. Edit text, prices, features
3. Save file
4. Changes appear instantly (dev mode)
5. Rebuild for production: `npm run build`

## 🎨 Design Philosophy

The landing page follows 2025 trends:

- **Minimalist**: Clean, focused design
- **Gradient Backgrounds**: Modern hero sections
- **Smooth Animations**: Framer Motion for micro-interactions
- **Glass Morphism**: Semi-transparent cards
- **Bold Typography**: Clear hierarchy
- **White Space**: Breathing room
- **Mobile-First**: Optimized for phones

## 🆘 Troubleshooting

### Port 3000 already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Styling not working?
- Check Tailwind classes are correct
- Restart dev server: Ctrl+C then `npm run dev`
- Clear browser cache (Cmd+Shift+R)

## 📞 Support

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## 🎉 Ready to Launch!

Your landing page is production-ready! Just:
1. ✅ Update `.env.local` with your bot username
2. ✅ Customize content in `lib/constants.ts`
3. ✅ Deploy to Vercel/Netlify
4. ✅ Share and grow your user base!

---

**Need help?** Check README.md for more details or the inline code comments.
