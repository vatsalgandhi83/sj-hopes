# SJ Hopes - Connecting Shelter and Support
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/6d1122d1-5951-4516-bea8-f68ea719d484" />

## Project Description

SJ Hopes is a full-stack web application developed for the **SJ Hacks - Public Good for City of San Jose** hackathon (April 2025). Focused on the **Homelessness track**, this platform aims to provide a centralized hub for managing shelter availability, connecting unhoused individuals (clients) with resources and work opportunities, and offering analytics for administrators. It facilitates workflows for caseworkers and provides oversight tools for program managers, ultimately aiming to enhance efficiency and dignity in homelessness services.

## Key Features

* **Real-time Shelter Visibility:** Interactive map and list view showing shelters with simulated real-time bed availability.
* **Advanced Search & Filtering:** Find shelters based on type, location, pet/partner allowance, and active status.
* **Role-Based Access:** Distinct views and permissions for Public Users, Caseworkers, and Administrators.
* **Client Management (Caseworker):** Register new clients, view client lists, track status, and assign clients to shelters.
* **Work Opportunity Management (Caseworker & Admin):** View, filter, create, edit, delete, and assign relevant tasks/micro-jobs to clients. Track task status (Open, Assigned, Completed).
* **Admin Dashboard:** Analytics providing an overview of shelter occupancy, task completion rates, and resource allocation (including breakdown by shelter type).
* **API Documentation:** Interactive API documentation via Swagger UI.

## Tech Stack

* **Backend:**
    * Java 17+
    * Spring Boot 3.x
    * Spring Data JPA / Hibernate
    * Gradle
    * MySQL (or PostgreSQL)
    * Springdoc OpenAPI (Swagger UI)
    * Lombok
* **Frontend:**
    * React 18+ / Next.js 13+
    * TypeScript
    * Material UI (MUI)
    * `@react-google-maps/api` (or similar Google Maps library)
    * Axios (or fetch) for API calls
* **Database:** MySQL (Instructions below assume MySQL, adaptable for PostgreSQL)

## Prerequisites

Before you begin, ensure you have the following installed:

* **Git:** For cloning the repository.
* **Java JDK:** Version 17 or later.
* **Gradle:** (Often included via wrapper `gradlew` in Spring Boot projects).
* **Node.js:** Version 18.x or later (includes npm). Alternatively, `yarn`.
* **MySQL Server:** A running local instance (e.g., via Docker, direct install). Or a PostgreSQL server if you adapted the config.
* **IDE:** Your preferred IDE (e.g., IntelliJ IDEA, VS Code).
* **Web Browser:** Chrome, Firefox, Brave, Edge, etc. (Disable ad blockers that might interfere with Google Maps API for testing).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vatsalgandhi83/sj-hopes.git
    cd sj-hopes
    ```

2.  **Backend Setup (`/backend/sjHopes` directory):**
    * **Navigate:** `cd backend/sjHopes`
    * **Database:**
        * Ensure your local MySQL server is running.
        * Create a database schema (e.g., `sjhopes`). **Important:** For initial setup with sample data, ensure this schema is empty or that `ddl-auto` is set to `create` or `create-drop`.
        * Create a MySQL user with privileges on this database.
    * **Configuration:**
        * Open `src/main/resources/application.properties`.
        * Update the `spring.datasource.url` to match your MySQL instance and database name (e.g., `jdbc:mysql://localhost:3306/sjhopes?createDatabaseIfNotExist=true...`).
        * Update `spring.datasource.username` and `spring.datasource.password` with your MySQL user credentials.
        * Ensure `spring.jpa.hibernate.ddl-auto` is set appropriately (use `create-drop` or `update` for local dev if you want tables created/updated automatically). **Note:** `create-drop` will wipe data on each restart.
    * **Sample Data:**
        * The backend includes a `DataLoader.java` component.
        * When the application starts **and** connects to an empty database (or if `ddl-auto` is set to `create` or `create-drop`), this component will automatically populate the database with sample Shelter, Client, and Task records based on the data discussed during development.
        * This allows you to quickly have data to interact with in the UI after setting up the database connection.
    * **Build (Optional - Run usually builds):**
        ```bash
        ./gradlew build
        ```

3.  **Frontend Setup (`/frontend` directory):**
    * **Navigate:** `cd ../frontend` (assuming sibling directories)
    * **Install Dependencies:**
        ```bash
        npm install
        ```
    * **Environment Variables:**
        * Create a file named `.env.local` in the `/frontend` directory.
        * Add your API key:
            ```env
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_Maps_API_KEY_HERE
            ```

## Running the Application (Local Demo)

1.  **Run the Backend:**
    * Navigate to the `/backend/sjHomes` directory.
    * Execute:
        ```bash
        ./gradlew bootRun
        ```
    * Or run the main application class (`SjHopeNavigatorApplication.java`) from your IDE.
    * The backend should start on `http://localhost:8081` (or the configured port). Check the console logs to ensure the `DataLoader` ran if expected.

2.  **Run the Frontend:**
    * Navigate to the `/frontend` directory.
    * Execute:
        ```bash
        npm run dev
        ```
    * The frontend development server should start, typically on `http://localhost:3000`. Open this URL in your browser. You should see UI elements populated with the sample data loaded in the backend.

## API Documentation (Swagger)

Once the backend is running locally, you can access the interactive API documentation:

* **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8081/swagger-ui/index.html)

## Contributors

* [Vatsal Gandhi](https://github.com/vatsalgandhi83)
* [Rajeev Ranjan Chaurasia](https://github.com/rajeev-chaurasia)
* [Arya Nimesh Mehta](https://github.com/gangster26)
* [Ganesh Thampi](https://github.com/ganesh077)
