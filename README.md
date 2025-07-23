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

2.  **Database Setup:**
    - Navigate to the `/server` directory.
    - Copy the `.env.example` file to a new file named `.env`.
    - Update the `DATABASE_URL` and `JWT_SECRET` variables in the `.env` file with your PostgreSQL connection string and a strong secret key.

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

## Deploy su Render

Questo progetto include un file `render.yaml` per facilitare il deploy su [Render](https://render.com/).

1. Imposta le variabili d'ambiente nei servizi Render:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV`
   - `CORS_ORIGIN` (opzionale)
   - `VITE_API_URL`
   - `NPM_CONFIG_PRODUCTION=false`
2. Esegui il build automatico con `npm run build`.
3. Il frontend viene pubblicato come static site dal percorso `client/dist`.

Consulta `server/.env.example` e `client/.env.example` per i valori necessari.

## Role Permissions

The application uses a role-based access control system implemented in the `roleActionGuard` middleware.

| Role   | Permissions Summary                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------ |
| `ADMIN`  | Full CRUD access to all resources. Can manage users, dealers, goals, forms, and view all data.                      |
| `DEALER` | Can view all data (`GET`). Can only create form submissions (`POST /api/submissions`) and update their own forecasts (`PATCH /api/forecasts/:id`). |
| `GUEST`  | Read-only access (`GET`) to public resources.                                                                       |

This ensures that users can only perform actions and access data that is appropriate for their assigned role.
