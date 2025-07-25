# DJI Dealer Dashboard

This is a full-stack web application for managing marketing activities and sales forecasts for DJI dealers.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

## Project Structure

The project is a monorepo managed with npm workspaces.

- `/client`: Contains the React frontend application.
- `/server`: Contains the Express backend server and Prisma setup.

## Setup & Installation

1.  **Install Dependencies:** From the root directory, run:
    ```bash
    npm install
    ```
    This will install dependencies for both the client and server.

2.  **Environment Configuration:**
    - Navigate to the `/server` directory.
    - Copy the `server/.env.example` file to a new file named `server/.env`.
    - Update the `DATABASE_URL`, `JWT_SECRET` and `CORS_ORIGIN` values in `server/.env` with your desired settings.

3.  **Run Database Migrations:** From the root directory, run:
    ```bash
    npm run db:migrate
    ```

4.  **Seed the Database:** (Optional) To populate the database with initial sample data:
    ```bash
    npm run db:seed
    ```

## Running the Application

-   **Development:** To run both the client and server concurrently with hot-reloading:
    ```bash
    npm run dev
    ```
    The client will be available at `http://localhost:5173` and the server at `http://localhost:3001`.

-   **Production Build:** To build both applications for production:
    ```bash
    npm run build
    ```

-   **Start Production Server:**
    ```bash
    npm start
    ```

## Role Permissions

The application uses a role-based access control system implemented in the `roleActionGuard` middleware.

| Role   | Permissions Summary                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------ |
| `ADMIN`  | Full CRUD access to all resources. Can manage users, dealers, goals, forms, and view all data.                      |
| `DEALER` | Can view all data (`GET`). Can only create form submissions (`POST /api/submissions`) and update their own forecasts (`PATCH /api/forecasts/:id`). |
| `GUEST`  | Read-only access (`GET`) to public resources.                                                                       |

This ensures that users can only perform actions and access data that is appropriate for their assigned role.
