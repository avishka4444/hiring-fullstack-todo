# TODO App - Backend

NestJS backend server for the TODO app with Prisma ORM and PostgreSQL database.

## 🚀 Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM for database access
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Swagger** - API documentation
- **TypeScript** - Type-safe development

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local installation or cloud service like AWS RDS, Heroku Postgres, or Supabase)

## 📦 Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root of the `server` directory with the following variables:

```env
# Database Connection
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db?schema=public

# Server Port
PORT=8000

# JWT Secret (for signing tokens)
# Generate a secure random string for production:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-secret-key-change-in-production

# Client URL (for CORS configuration)
# Optional: defaults to http://localhost:5173
CLIENT_URL=http://localhost:5173
```

**Environment Variables Explained:**

- **`DATABASE_URL`**: PostgreSQL connection string
  - Replace `user`, `password`, `localhost`, `5432`, and `todo_db` with your actual PostgreSQL credentials
  - Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public`
  - For cloud databases (e.g., AWS RDS, Heroku, Supabase), use the connection string provided by your service

- **`PORT`**: Port on which the server will run
  - Default: `3000` if not set
  - Recommended: `8000` to match frontend expectations

- **`JWT_SECRET`**: Secret key for signing JWT tokens
  - **Important**: Change this to a secure random string in production
  - Generate a secure secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
  - If not set, a default value will be used (not recommended for production)

- **`CLIENT_URL`**: Frontend application URL for CORS configuration
  - Optional: defaults to `http://localhost:5173`
  - Set this if your frontend runs on a different URL

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql@14` or download from [PostgreSQL website](https://www.postgresql.org/download/)
   - Linux: Use your distribution's package manager
   - Windows: Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)

2. **Start PostgreSQL service**:
   ```bash
   # macOS (Homebrew)
   brew services start postgresql@14
   
   # Linux (systemd)
   sudo systemctl start postgresql
   ```

3. **Create a database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE todo_db;
   
   # Create user (optional)
   CREATE USER todo_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;
   ```

4. **Update `.env` file** with your database credentials:
   ```env
   DATABASE_URL=postgresql://todo_user:your_password@localhost:5432/todo_db?schema=public
   ```

### Option 2: PostgreSQL on Cloud (Recommended for Production)

#### MongoDB Atlas Alternative

**Note**: While the assignment requirements mention MongoDB, this implementation uses **PostgreSQL with Prisma**. If you need to use MongoDB, you would need to modify the Prisma schema and configuration.

#### PostgreSQL Cloud Options:

1. **Supabase** (Free tier available):
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy the connection string from Project Settings → Database
   - Use the connection string in your `.env` file

2. **Heroku Postgres**:
   - Create a Heroku app
   - Add Heroku Postgres addon
   - Get connection string: `heroku config:get DATABASE_URL`

3. **AWS RDS**:
   - Create a PostgreSQL RDS instance
   - Get the connection endpoint and credentials
   - Format: `postgresql://USER:PASSWORD@ENDPOINT:5432/DBNAME?schema=public`

4. **Railway**:
   - Create a new project
   - Add PostgreSQL service
   - Copy the connection string from the service variables

### Running Migrations

After setting up your database connection:

1. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

2. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

   This will:
   - Create the necessary tables (`users`, `todos`)
   - Set up relationships between tables
   - Apply all pending migrations

3. **Optional: Open Prisma Studio** (database GUI):
   ```bash
   npm run prisma:studio
   ```
   This opens a web interface at `http://localhost:5555` to view and edit your database.

## 🏃 Running the Application

### Development Mode

Start the server in development mode with hot reload:

```bash
npm run start:dev
```

The server will automatically restart when you make changes to the code.

### Production Mode

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm run start:prod
   ```

### Debug Mode

Start the server in debug mode:

```bash
npm run start:debug
```

## 🛠️ Available Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the server (production build required)
- `npm run start:dev` - Start development server with hot reload (recommended)
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 📊 Database Models

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Hashed with bcrypt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}
```

### Todo Model

```prisma
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  done        Boolean  @default(false)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔌 API Endpoints

The API is documented with Swagger. Once the server is running, visit:

**Swagger UI**: `http://localhost:8000/api` (or your configured port)

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Todo Endpoints

| Method | Endpoint                | Description                      | Auth Required |
|--------|-------------------------|----------------------------------|---------------|
| GET    | `/api/todos`            | Get all todos                    | Yes            |
| POST   | `/api/todos`            | Create a new todo                | Yes            |
| PUT    | `/api/todos/:id`        | Update a todo (title/description) | Yes            |
| PATCH  | `/api/todos/:id/done`   | Toggle the `done` status         | Yes            |
| DELETE | `/api/todos/:id`        | Delete a todo                    | Yes            |

**Note**: All todo endpoints require JWT authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register**: Create a new user account
2. **Login**: Get a JWT token by providing username and password
3. **Protected Routes**: Include the JWT token in the `Authorization` header for protected endpoints

Passwords are hashed using bcrypt before storage.

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## 📝 Assumptions and Limitations

### Assumptions

1. **Database**: The implementation uses **PostgreSQL** instead of MongoDB (as mentioned in the assignment requirements). This was chosen for:
   - Better type safety with Prisma
   - Relational data structure support
   - ACID compliance for data integrity

2. **Authentication**: The app includes user authentication, which was not explicitly required but adds value for:
   - User-specific todos
   - Secure API access
   - Better data isolation

3. **Port Configuration**: 
   - Backend defaults to port `3000` but can be configured via `PORT` env variable
   - Frontend expects backend on port `8000` by default
   - Make sure to set `PORT=8000` in backend `.env` or update frontend `VITE_API_URL`

4. **CORS**: CORS is configured to allow requests from `http://localhost:5173` by default. Update `CLIENT_URL` if your frontend runs on a different URL.

### Limitations

1. **Database Choice**: The assignment mentions MongoDB, but this implementation uses PostgreSQL. If MongoDB is required, the Prisma schema and configuration would need to be modified.

2. **No Pagination**: The todo list endpoint returns all todos without pagination. For large datasets, pagination should be implemented.

3. **No Search/Filter**: The API doesn't include search or filtering capabilities for todos.

4. **No Soft Delete**: Todos are permanently deleted from the database. Soft delete functionality could be added for data recovery.

5. **Single User Session**: The JWT implementation doesn't include refresh tokens. Users need to re-login when tokens expire.

6. **No Rate Limiting**: The API doesn't implement rate limiting, which should be added for production use.

7. **No Input Sanitization**: While validation is in place, additional input sanitization could be added for enhanced security.

## 🐛 Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Verify connection string**: Ensure your `DATABASE_URL` in `.env` is correct
   - Check username, password, host, port, and database name
   - For cloud databases, ensure your IP is whitelisted

3. **Test connection manually**:
   ```bash
   psql "postgresql://user:password@localhost:5432/todo_db"
   ```

### Migration Issues

1. **Reset database** (⚠️ **WARNING**: This deletes all data):
   ```bash
   npx prisma migrate reset
   ```

2. **Check migration status**:
   ```bash
   npx prisma migrate status
   ```

### Port Already in Use

If the default port is in use:
1. Change the `PORT` in your `.env` file
2. Update the frontend `VITE_API_URL` to match

### JWT Secret Issues

- Ensure `JWT_SECRET` is set in your `.env` file
- Use a strong, random secret in production
- Never commit secrets to version control

## 🚀 Deployment

When deploying to production:

1. **Set secure environment variables**:
   - Use a strong `JWT_SECRET`
   - Use a production database connection string
   - Set appropriate `CLIENT_URL` for CORS

2. **Run migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start the server**:
   ```bash
   npm run start:prod
   ```

5. **Consider using**:
   - Process manager (PM2, systemd)
   - Reverse proxy (Nginx)
   - SSL/TLS certificates
   - Rate limiting
   - Logging and monitoring

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io) - JWT token decoder and information

## 📄 License

This project is part of a take-home assignment.
