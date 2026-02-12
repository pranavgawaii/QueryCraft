# QueryCraft Frontend

Modern React + TypeScript frontend for the QueryCraft SQL query builder platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router v6** for routing
- **TanStack Query** for server state
- **Radix UI** for accessible components

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components  
│   ├── auth/           # Authentication components
│   ├── connections/    # Database connection components
│   ├── layout/         # Layout and navigation
│   ├── query-builder/  # Visual query builder
│   ├── results/        # Query results display
│   └── ui/             # Basic UI primitives
├── pages/              # Route-level page components
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## ⚙️ Configuration

Environment variables are loaded from `.env` (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key  
VITE_ENCRYPTION_KEY=your-32-char-key
```

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming
- **Responsive** design with mobile-first approach
- **Dark/Light** theme support

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Backend integration |
| `@tanstack/react-query` | Server state management |
| `react-router-dom` | Client-side routing |
| `zustand` | Client state management |
| `@radix-ui/*` | Accessible UI primitives |
| `lucide-react` | Icons |
| `tailwindcss` | CSS framework |

## 🔧 Development

The frontend is configured for:
- Hot module replacement during development
- TypeScript type checking
- ESLint code linting
- Automatic dependency optimization
- Source maps in development

Built assets are optimized for production with code splitting and lazy loading.