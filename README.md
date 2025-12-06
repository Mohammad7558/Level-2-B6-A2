# Vehicle Rental System API

## Live URL

🚀 **Deployed on Vercel**: [Vehicle Rental System API](https://your-vercel-deployment-url.vercel.app)

> Replace the URL above with your actual Vercel deployment URL

---

## 📋 Features

### Core Features

- **User Authentication & Authorization** - Secure JWT-based authentication with password hashing using bcryptjs
- **User Management** - Register, login, and manage user profiles
- **Vehicle Management** - Browse and manage rental vehicle inventory
- **Booking System** - Create, update, and track vehicle bookings
- **PostgreSQL Database** - Reliable data persistence with relational database
- **RESTful API** - Clean and intuitive API endpoints (v1)
- **Error Handling** - Comprehensive error responses and validation

### API Endpoints

- **Auth**: `/api/v1/auth` - Login and authentication endpoints
- **Users**: `/api/v1/users` - User management endpoints
- **Vehicles**: `/api/v1/vehicles` - Vehicle inventory endpoints
- **Bookings**: `/api/v1/bookings` - Booking management endpoints

---

## 🛠️ Technology Stack

### Backend Framework

- **Express.js** (v5.1.0) - Fast and minimalist web framework for Node.js

### Language & Type Safety

- **TypeScript** (v5.9.3) - Strongly typed JavaScript for better code quality
- **Node.js** - JavaScript runtime

### Database

- **PostgreSQL** - Powerful, open-source relational database
- **pg** (v8.16.3) - PostgreSQL client for Node.js

### Authentication & Security

- **JWT (jsonwebtoken v9.0.2)** - Secure token-based authentication
- **bcryptjs** (v3.0.3) - Password hashing and encryption

### Development Tools

- **tsx** (v4.20.6) - TypeScript execution and hot-reloading for development
- **Vercel** - Serverless platform deployment
- **dotenv** - Environment variable management

---

## 🚀 Setup & Usage Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Level-2-B6-A2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_rental
   JWT_SECRET=your_jwt_secret_key_here
   PORT=8080
   NODE_ENV=development
   ```

4. **Initialize the database**
   The application automatically creates tables on startup through the `initDb()` function

### Development

**Start the development server** (with hot-reloading)

```bash
npm run dev
```

The server will run on `http://localhost:8080`

### Production

1. **Build the project**

   ```bash
   npm run build
   ```

   This compiles TypeScript files to the `dist/` directory

2. **Start the production server**
   ```bash
   npm start
   ```
   The server will run on the specified PORT (default: 8080)

---

## 📁 Project Structure

```
Level-2-B6-A2/
├── api/                          # Vercel serverless API
│   └── index.ts
├── src/
│   ├── app.ts                   # Express app configuration
│   ├── server.ts                # Server entry point
│   ├── config/
│   │   ├── db.ts               # Database initialization
│   │   └── index.ts            # Configuration settings
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   └── logger.ts           # Logging middleware
│   ├── modules/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── booking/
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.route.ts
│   │   │   └── booking.service.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.service.ts
│   │   └── vehicle/
│   │       ├── vehicle.controller.ts
│   │       ├── vehicle.route.ts
│   │       └── vehicle.service.ts
│   └── types/
│       └── express/
│           └── index.d.ts      # Express type definitions
├── dist/                        # Compiled JavaScript output
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment configuration
└── README.md                   # This file
```

---

## 📝 API Usage Examples

### Authentication

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Vehicles

```bash
# Fetch all vehicles
curl http://localhost:8080/api/v1/vehicles
```

### Create Booking

```bash
# Create a new booking
curl -X POST http://localhost:8080/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"vehicleId":1,"startDate":"2025-12-10","endDate":"2025-12-15"}'
```

---

## 🔐 Security Features

- **Password Hashing** - Passwords are hashed using bcryptjs before storage
- **JWT Authentication** - Secure token-based authentication for protected routes
- **Environment Variables** - Sensitive data stored in `.env` file
- **Input Validation** - Request validation and error handling

---

## 📦 Scripts

| Script          | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start development server with hot-reloading |
| `npm run build` | Compile TypeScript to JavaScript            |
| `npm start`     | Start production server                     |
| `npm test`      | Run test suite (not yet implemented)        |

---
