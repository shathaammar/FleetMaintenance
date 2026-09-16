# FleetNova

FleetNova is a full-stack fleet maintenance management system designed to simplify vehicle, maintenance, and service-request management.

It provides role-based experiences for administrators and users. Administrators can manage fleet vehicles, maintenance types and records, maintenance requests, and user roles, while users can browse active vehicles, submit maintenance requests, and track their request history.

## Features

### Admin

- View fleet-wide statistics, maintenance insights, and dashboard charts.
- Manage vehicles with search, status filtering, and pagination.
- Create and manage maintenance types.
- Schedule, update, complete, cancel, and delete maintenance records.
- Search and filter maintenance records by vehicle, type, status, and date range.
- Review maintenance requests and approve or reject them.
- Manage registered users and assign Admin or User roles.
- Update profile information and change account password.

### User

- View personal maintenance-request statistics and recent activity.
- Browse and search active fleet vehicles.
- Submit maintenance requests for available vehicles and maintenance types.
- Track and filter personal maintenance requests.
- Cancel pending maintenance requests.
- Update profile information and change account password.

## Tech Stack

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT Authentication
- FluentValidation
- Swagger / OpenAPI
- xUnit & Moq

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form & Zod
- Framer Motion
- Recharts

### Architecture & Patterns

- Clean Architecture
- Repository Pattern
- Unit of Work
- Dependency Injection
- Role-Based Authorization
- Centralized Exception Handling
- Server-Side Pagination
- Rate Limiting

## Architecture

FleetNova's backend follows a four-layer Clean Architecture approach with clear separation of responsibilities:

- **Domain** — Contains the core entities and enums with no external dependencies.
- **Application** — Contains DTOs, business services, service/repository interfaces, validators, shared models, and application exceptions.
- **Infrastructure** — Handles Entity Framework Core, SQL Server persistence, repositories, Unit of Work, ASP.NET Core Identity, and database migrations.
- **API** — Exposes REST endpoints and configures authentication, authorization, CORS, rate limiting, Swagger, and global exception handling.

The React frontend is maintained as a separate client application and communicates with the backend through a typed service layer using Axios.

## Authentication & Security

- JWT Bearer authentication for secure API access.
- ASP.NET Core Identity for user, password, and role management.
- Role-based authorization with separate Admin and User access.
- Authentication required by default for protected API endpoints.
- Account lockout after repeated failed login attempts.
- Rate limiting on login and registration endpoints.
- Centralized exception handling with consistent API error responses.
- Protected frontend routes based on authentication state and user role.

## Testing

The backend includes dedicated automated test projects for the Application and Infrastructure layers.

- Unit and integration-style tests using xUnit and Moq.
- Isolated EF Core testing using SQLite.
- Coverage includes business rules, user role management, pagination behavior, and data-access-related scenarios.
- Current test suite: **11 tests passing, 0 failed, 0 skipped**.

Run the complete backend test suite with:

```bash
dotnet test
```

## Project Structure

```text
FleetNova/
├── FleetMaintenance.API/                  # ASP.NET Core Web API
├── FleetMaintenance.Application/          # Business logic, DTOs, validators, interfaces
├── FleetMaintenance.Domain/               # Core entities and enums
├── FleetMaintenance.Infrastructure/       # EF Core, Identity, repositories, migrations
├── FleetMaintenance.Application.Tests/    # Application layer tests
├── FleetMaintenance.Infrastructure.Tests/ # Infrastructure layer tests
└── fleet-maintenance-client/              # React + TypeScript frontend
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── layouts/
        ├── pages/
        ├── routes/
        ├── services/
        ├── types/
        └── utils/
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- .NET SDK 10.0
- SQL Server
- Node.js `^20.19.0` or `>=22.12.0`
- npm

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FleetMaintenance
```

### 2. Configure the Backend

Configure the following settings using `appsettings.json`, user secrets, or environment variables:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:ExpiryMinutes`
- `Cors:AllowedOrigins`

Optional admin seed settings:

- `AdminSeed:Email`
- `AdminSeed:Password`
- `AdminSeed:FullName`

Apply the database migrations:

```bash
dotnet ef database update --project FleetMaintenance.Infrastructure --startup-project FleetMaintenance.API
```

Start the API:

```bash
dotnet run --project FleetMaintenance.API
```

### 3. Configure the Frontend

Navigate to the frontend:

```bash
cd fleet-maintenance-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and configure the API base URL:

```env
VITE_API_BASE_URL=http://localhost:5212/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run through the Vite development server and communicate with the FleetNova API.

## API Documentation

When running the API in the Development environment, Swagger UI is available for exploring and testing the FleetNova REST API.

After starting the backend, open:

```text
http://localhost:5212/swagger
```

Swagger provides documentation for the available endpoints, request models, and API responses.

## Author

**Shatha Ammar**  
Computer Engineer & Full-Stack .NET Developer