# TODO App - Frontend

This is the React frontend for the Full Stack TODO App assignment.

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation
- **React Hook Form** with Zod for form validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- The backend server should be running (see [server README](../server/README.md) for setup instructions)

## 📦 Installation

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `client` directory with the following variable:

```env
# API Server URL
# This is the base URL of your backend server
# In development, Vite proxy forwards /api requests to this URL
# In production, the client uses ${VITE_API_URL}/api directly
VITE_API_URL=http://localhost:8000
```

**Important Notes:**
- `VITE_API_URL` is the base URL of your backend server (without the `/api` prefix)
- In development mode, Vite's proxy automatically forwards `/api/*` requests to `${VITE_API_URL}/api/*`
- In production, the client will make direct requests to `${VITE_API_URL}/api/*`
- Defaults to `http://localhost:8000` if not set
- Make sure this matches the port your backend server is running on

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port if 5173 is in use).

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Automatic API proxy configuration
- Source maps for debugging

### Production Build

1. Build the application:

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

2. Preview the production build locally:

```bash
npm run preview
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## ✨ Features

- ✅ **View all TODO items** - Display a list of all todos with their status
- ➕ **Create new TODOs** - Add new todos with title and optional description
- ✏️ **Edit existing TODOs** - Update title and/or description of existing todos
- ✅ **Toggle completion status** - Mark todos as done or undone
- ❌ **Delete TODOs** - Remove todos from the list
- 🔄 **Optimistic UI updates** - Immediate UI feedback for better user experience
- 📱 **Responsive design** - Works on desktop and mobile devices
- ⚡ **Loading and error states** - Clear feedback during API operations
- ✅ **Form validation** - Client-side validation using Zod schemas
- 🎨 **Modern UI** - Clean, modern interface with Tailwind CSS

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── TodoForm.tsx     # Form for creating/editing todos
│   │   ├── TodoItem.tsx     # Individual todo item component
│   │   └── TodoList.tsx     # List of todos component
│   ├── context/             # React context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── screens/             # Page/screen components
│   │   ├── Home.tsx         # Main todo list screen
│   │   ├── Login.tsx        # Login screen
│   │   └── Register.tsx     # Registration screen
│   ├── services/            # API services
│   │   ├── api.ts           # API client configuration
│   │   ├── authService.ts   # Authentication API calls
│   │   └── todoService.ts   # Todo API calls
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts          # Authentication types
│   │   └── todo.ts          # Todo-related types
│   ├── routes.tsx           # Route configuration
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🔌 API Integration

The frontend communicates with the backend through RESTful API endpoints:

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| GET    | `/api/todos`            | Fetch all todos                  |
| POST   | `/api/todos`            | Create a new todo                |
| PUT    | `/api/todos/:id`        | Update a todo                    |
| PATCH  | `/api/todos/:id/done`   | Toggle todo completion status    |
| DELETE | `/api/todos/:id`        | Delete a todo                    |

### Authentication

The app includes authentication features:
- User registration
- User login
- JWT token-based authentication
- Protected routes

## 🎨 Styling

The app uses **Tailwind CSS** for styling, following a modern and clean design with:

- Gradient backgrounds
- Smooth transitions and animations
- Responsive layout (mobile-first approach)
- Accessible color contrasts
- Visual feedback for user actions
- Hover and focus states for interactive elements

## 📝 Development Notes

- **Optimistic Updates**: The app implements optimistic UI updates for toggle and delete operations to provide immediate feedback to users
- **Error Handling**: Comprehensive error handling with user-friendly error messages
- **Form Validation**: Client-side validation using Zod schemas ensures data integrity before API calls
- **Loading States**: Visual loading indicators during API operations
- **Type Safety**: Full TypeScript support for type-safe development

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual port number.

### API Connection Issues

1. Ensure the backend server is running (see [server README](../server/README.md))
2. Verify the `VITE_API_URL` in your `.env` file matches your backend server URL
3. Check that the backend server port matches the one configured in `VITE_API_URL`
4. Ensure CORS is properly configured on the backend

### Build Errors

- Run `npm run lint` to check for code quality issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
