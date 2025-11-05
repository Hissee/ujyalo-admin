# Ujyalo Khet - Admin Panel

Separate Angular frontend application for Ujyalo Khet administration.

## Features

- Admin authentication and authorization
- Dashboard with statistics and recent activity
- User management (view, activate/deactivate, verify email, delete)
- Product management (view all, delete)
- Order management (view all, update status)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server (runs on port 4201):
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Default Admin Credentials

The default admin user is automatically created when the backend server starts:

- **Email**: `admin@ujyalokhet.com`
- **Password**: `Admin@123`

⚠️ **Important**: Please change the default password after first login!

You can customize these credentials by setting environment variables in the backend `.env` file:
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password
- `ADMIN_NAME` - Admin display name

## Access

- Development: http://localhost:4201
- Login with admin credentials

## Backend API

The admin panel connects to the backend API at `http://localhost:3000/api/admin/*`

All admin endpoints require:
- Valid JWT token in Authorization header
- User role must be "admin"
