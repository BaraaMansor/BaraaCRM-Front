# BaraaCRM Frontend

Modern React/TypeScript frontend for the BaraaCRM system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- BaraaCRM Backend running (see backend repository)

### Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your backend URL:

   ```env
   VITE_FRONTEND_FORGE_API_URL=https://localhost:7005/api
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## 🔗 Backend Integration

This frontend connects to the [BaraaCRM Backend](https://github.com/BaraaMansor/BaraaCRM) ASP.NET Core API.

**Default Backend URL:** `https://localhost:7005/api`

### Troubleshooting Connection Issues

If you encounter SSL certificate errors with `https://localhost:7005`:

1. **Option 1:** Use HTTP instead (in `.env`):

   ```env
   VITE_FRONTEND_FORGE_API_URL=http://localhost:5000/api
   ```

2. **Option 2:** Trust the backend's development certificate:
   ```bash
   dotnet dev-certs https --trust
   ```

### CORS Configuration

The backend is already configured to accept requests from:

- `http://localhost:3000` (this frontend)
- `http://localhost:5173` (Vite default)

## 📁 Project Structure

```
client/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/
│   │   └── api.ts      # Backend API integration
│   ├── contexts/       # React contexts
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── index.html
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## 🔧 Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Wouter** - Routing

## 📝 Environment Variables

| Variable                      | Description          | Default                      |
| ----------------------------- | -------------------- | ---------------------------- |
| `VITE_FRONTEND_FORGE_API_URL` | Backend API base URL | `https://localhost:7005/api` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
