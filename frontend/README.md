# QuickPing Frontend - Next.js + Shadcn UI

Modern chat dashboard built with Next.js 15, TypeScript, and Shadcn UI.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client

## Features

✅ **3-Column Layout** (như ảnh mẫu):
- **Messages Panel** (trái): Danh sách conversations với tags, search, badges
- **Chat Panel** (giữa): Chat window với messages, input, call button
- **Directory Panel** (phải): Team members list và Files list

✅ **Modern UI Components:**
- Avatar với fallback
- Badge với custom colors
- Button variants (ghost, default, outline)
- Input với icons
- ScrollArea cho danh sách dài
- Responsive design

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development

```bash
# Frontend runs on: http://localhost:3000
# Backend API: http://localhost:5001
npm run dev
```

## Project Structure

```
frontend/
├── app/
│   ├── (chat)/
│   │   └── page.tsx          # Main chat page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles + CSS variables
├── components/
│   ├── chat/
│   │   ├── messages-panel.tsx    # Messages list (left)
│   │   ├── chat-panel.tsx        # Chat window (center)
│   │   └── directory-panel.tsx   # Directory (right)
│   └── ui/                       # Shadcn UI components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── scroll-area.tsx
│       └── separator.tsx
├── lib/
│   └── utils.ts               # Utility functions (cn)
└── types/
    └── index.ts               # TypeScript types

```

## Adding Shadcn Components

```bash
# Add new components
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
```

## Color Scheme

Sử dụng CSS variables trong `app/globals.css`:

- `--primary`: Blue (#5C84F1) - Messages, buttons
- `--secondary`: Gray - Badges, backgrounds
- `--muted`: Light gray - Backgrounds
- `--border`: Border colors

## Integration với Backend

Frontend đã config proxy trong `next.config.js`:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:5001/api/:path*',
    },
  ];
}
```

## TODO: Integration với Backend

- [ ] Connect với real API endpoints
- [ ] Implement authentication flow
- [ ] Add Socket.io real-time updates
- [ ] Implement file upload/download
- [ ] Add message reactions
- [ ] Implement typing indicators
- [ ] Add search functionality
- [ ] Add dark mode toggle

## Design Reference

UI thiết kế dựa trên modern chat applications với:
- Clean, minimal interface
- Colorful tags/badges
- Smooth animations
- Hover effects
- Responsive components

