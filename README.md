# BG Remove - Landing Page

Modern landing page for a Telegram bot that removes backgrounds from photos using AI.

## Features

- ⚡ Built with Next.js 14+ (App Router)
- 🎨 Styled with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎯 SEO optimized
- 🚀 Fast loading and performance

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy `.env.local` and update with your bot information:
- `NEXT_PUBLIC_BOT_USERNAME` - Your Telegram bot username
- `NEXT_PUBLIC_BOT_URL` - Full Telegram bot URL

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy!

## Customization

### Colors
Edit colors in `tailwind.config.ts` to match your brand.

### Content
Update content in `lib/constants.ts`:
- Pricing packages
- Features
- FAQ items
- Use cases

### Sections
All sections are in `components/sections/`:
- `Hero.tsx` - Main hero section
- `Features.tsx` - Key features grid
- `Pricing.tsx` - Pricing cards
- `FAQ.tsx` - FAQ accordion
- And more...

## Tech Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## License

MIT
