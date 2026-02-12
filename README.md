<div align="center">
  <h1>QueryCraft</h1>
  <p>Visual SQL Query Builder & Database Management Platform</p>
  
  ![Version](https://img.shields.io/badge/version-1.0.0-blue)
  ![License](https://img.shields.io/badge/license-MIT-green)
  ![React](https://img.shields.io/badge/React-18-blue)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
  ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
</div>

---

## 🌟 Overview

QueryCraft is a modern, professional SQL query builder and database management platform designed to simplify database operations for developers and data analysts. With an intuitive visual interface, robust security features, and enterprise-grade architecture, QueryCraft bridges the gap between technical complexity and user-friendly design.

**Perfect for:** Database administrators, developers, analysts, and teams who need to create, execute, and manage SQL queries efficiently without deep SQL expertise.

## ✨ Key Features

### 🎯 **Visual Query Builder**
- Drag-and-drop interface for building complex SQL queries
- Real-time SQL preview with syntax highlighting
- Support for JOINs, WHERE clauses, GROUP BY, ORDER BY, and LIMIT
- No SQL knowledge required

### 🔐 **Enterprise Security**
- AES-256 encryption for sensitive data
- Row-level security (RLS) policies
- SQL injection protection
- Secure edge functions for query execution
- User authentication and authorization

### 💾 **Multi-Database Support**
- PostgreSQL
- MySQL  
- SQLite
- Extensible architecture for additional database types

### 📊 **Professional Dashboard**
- Real-time analytics and insights
- Query performance tracking
- Connection status monitoring
- Usage statistics and trends

### 👥 **Team Collaboration**
- Save and share queries with team members
- Query history and version control
- Team workspace management
- Collaborative query building

## 🚀 Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Custom Gradients |
| **Routing** | React Router v6 |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (Auth + Postgres + Edge Functions) |
| **UI Components** | Custom components with Radix UI primitives |
| **Icons** | Lucide React |
| **Build** | Vite with TypeScript |

## � Project Structure

```
QueryCraft/
├── 📄 README.md                    # Project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 CONTRIBUTING.md              # Development guidelines
├── 📄 CHANGELOG.md                 # Version history
├── 📄 package.json                 # Workspace configuration
├── ⚙️  vercel.json                 # Vercel deployment config
│
├── 📁 frontend/                    # React frontend application
│   ├── 📄 .env                     # Environment variables
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 README.md                # Frontend-specific guide
│   ├── 📁 public/                  # Static assets
│   │   ├── 📄 _redirects           # SPA routing
│   │   └── 📄 favicon.svg          # App icon
│   └── 📁 src/                     # Source code
│       ├── 📁 components/          # Reusable components
│       ├── 📁 pages/               # Route-level pages
│       ├── 📁 stores/              # State management
│       ├── 📁 types/               # TypeScript definitions
│       └── 📁 utils/               # Helper functions
│
└── 📁 backend/                     # Supabase backend
    ├── 📄 package.json             # Backend dependencies
    └── 📁 supabase/                # Supabase configuration
        ├── 📁 functions/           # Edge functions
        └── 📁 migrations/          # Database migrations
```

## 📚 Additional Documentation

| Document | Description |
|----------|-------------|
| [🤝 Contributing Guide](CONTRIBUTING.md) | How to contribute to QueryCraft development |
| [📋 Changelog](CHANGELOG.md) | Version history and release notes |
| [⚖️ License](LICENSE) | MIT License terms |
| [💻 Frontend Documentation](frontend/README.md) | Frontend-specific development guide |

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher  
- **Supabase Account** (free tier available)

### Installation
```bash
# Clone and install
git clone https://github.com/yourusername/querycraft.git
cd querycraft
npm run install:all

# Configure environment
cd frontend  
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Configuration
Copy [`frontend/.env.example`](frontend/.env.example) to `frontend/.env` and configure:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ENCRYPTION_KEY=your-32-character-key
```

## 🛠️ Installation & Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/querycraft.git
cd querycraft

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Settings
VITE_APP_NAME=QueryCraft
VITE_ENCRYPTION_KEY=your-32-character-encryption-key

# Optional: Analytics & Monitoring
VITE_ANALYTICS_ID=your-analytics-id
```

### 3. Supabase Backend Setup

#### Create Supabase Project
1. Visit [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from the settings

#### Database Migration
Execute the SQL migration file in your Supabase SQL editor:
```sql
-- Run: supabase/migrations/202602110015_init_querycraft.sql
```

#### Authentication Configuration
- Enable Email/Password authentication
- Add redirect URLs:
  - **Development:** `http://localhost:5173/dashboard`
  - **Production:** `https://yourdomain.com/dashboard`

#### Edge Functions Deployment
```bash
# Install Supabase CLI
npm install -g supabase

# Authenticate and link project
supabase login
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy execute-query
supabase functions deploy fetch-schema
supabase functions deploy test-connection

# Set environment secrets
supabase secrets set SUPABASE_ENCRYPTION_KEY=your-32-character-key
```

### 4. Development Server

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**: 
   - Visit [vercel.com](https://vercel.com) 
   - Import your GitHub repository
   - Vercel auto-detects the React app
3. **Set Environment Variables** in Vercel dashboard:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ENCRYPTION_KEY=your-32-character-key
   ```
4. **Deploy** - Should work without 404 errors (thanks to `vercel.json`)

### Backend Deployment (Supabase)

```bash
cd backend
supabase login
supabase link --project-ref your-project-id
supabase db push
supabase functions deploy
```

### Troubleshooting

**404 Errors on Routes**: Fixed by `vercel.json` SPA configuration  
**Build Failures**: Ensure Node.js 18+ and proper environment variables  
**Auth Issues**: Verify Supabase URL and anon key are correct

## 🎨 Application Structure

### Landing Page Features
- **Hero Section:** Compelling value proposition with gradient design
- **Features Showcase:** Interactive feature cards with hover effects
- **Pricing Tiers:** Starter, Professional, and Enterprise plans
- **Responsive Design:** Mobile-first approach with seamless UX

### Dashboard Components
- **Analytics Overview:** Real-time statistics and performance metrics
- **Query Builder:** Visual drag-and-drop SQL construction
- **Connection Manager:** Multi-database connection handling
- **Results Viewer:** Formatted query results with export options

## 🛡️ Security & Compliance

- **Data Protection:** AES-256 encryption for sensitive information
- **Access Control:** Role-based permissions and user authentication
- **Query Safety:** SQL injection prevention and query validation
- **Audit Trail:** Comprehensive logging of all database operations
- **Rate Limiting:** Protection against abuse with configurable limits

## 📖 Usage Guide

### Getting Started
1. **Create Account:** Sign up on the landing page
2. **Add Database:** Connect your first database (PostgreSQL/MySQL)
3. **Build Query:** Use the visual builder or write SQL directly
4. **Execute & Analyze:** Run queries and view formatted results
5. **Save & Share:** Store frequently used queries for team access

### Query Builder Workflow
1. Select source tables from the schema browser
2. Choose columns using the visual column picker
3. Add filters with the intuitive WHERE builder
4. Configure joins between related tables
5. Set ordering, grouping, and limits as needed
6. Preview and execute your SQL query

## 🔧 Configuration

### Theme Customization
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### Database Connections
```typescript
// Example connection configuration
const connectionConfig = {
  host: 'your-database-host',
  port: 5432,
  database: 'your-database-name',
  ssl: true, // Recommended for production
  maxConnections: 10
}
```

## 🧪 Development & Testing

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
npm run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint:** Enforced coding standards
- **TypeScript:** Type safety and better developer experience
- **Prettier:** Consistent code formatting

## �️ Application Routes

| Route | Description | Access Level |
|-------|-------------|--------------|
| `/` | Landing page with features and pricing | Public |
| `/login` | User authentication | Public |
| `/signup` | User registration | Public |
| `/reset-password` | Password recovery | Public |
| `/dashboard` | Main application dashboard | Protected |
| `/connections` | Database connections management | Protected |
| `/connections/new` | Add new database connection | Protected |
| `/connections/:id/edit` | Edit existing connection | Protected |
| `/query-builder` | Visual SQL query builder | Protected |
| `/saved-queries` | Library of saved queries | Protected |
| `/settings` | User preferences and settings | Protected |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use conventional commit messages
- Update documentation for new features

## 📚 Documentation & Support

- **Documentation:** [docs.querycraft.com](https://docs.querycraft.com)
- **API Reference:** [api.querycraft.com](https://api.querycraft.com)
- **Community:** [Join our Discord](https://discord.gg/querycraft)
- **Issues:** [GitHub Issues](https://github.com/yourusername/querycraft/issues)
- **Email Support:** support@querycraft.com

## 🌎 Browser Compatibility

QueryCraft supports all modern browsers:

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📊 Performance

- **First Contentful Paint:** < 1.2s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.8s
- **Cumulative Layout Shift:** < 0.1

## 📄 License

## 🚀 Deployment

### Frontend Deployment (SPA Configuration Required)

QueryCraft uses React Router for client-side routing, which requires proper SPA configuration on your hosting platform:

#### **Vercel**
- The `vercel.json` file is already configured
- Set environment variables in your Vercel dashboard

#### **Netlify**  
- The `_redirects` file and `netlify.toml` are already configured
- Deploy from the root directory
- Set environment variables in Netlify dashboard

#### **Other Platforms**
Configure your platform to:
1. Build from the `frontend` directory using `npm run build`
2. Serve the `frontend/dist` folder
3. Redirect all routes to `index.html` (SPA fallback)

### Backend Deployment (Supabase)

1. **Set up Supabase project:**
   ```bash
   cd backend
   supabase login
   supabase link --project-ref your-project-id
   ```

2. **Deploy database migrations:**
   ```bash
   supabase db push
   ```

3. **Deploy edge functions:**
   ```bash
   supabase functions deploy
   ```

### Environment Variables

Set these variables in your deployment platform:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENCRYPTION_KEY=your-32-character-key
```

### Troubleshooting Deployment

**404 Errors**: Ensure SPA routing is properly configured (see configurations above)

**Missing Environment Variables**: Check that all required environment variables are set in your deployment platform

**Build Failures**: Make sure Node.js version is 18+ and all dependencies are installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>QueryCraft</strong> - Empowering teams to work smarter with data</p>
  <p>Made with ❤️ by the QueryCraft Team</p>
  
  **⭐ Star this repo if you find it helpful!**
</div>

