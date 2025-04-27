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
* **SQL Client:** A tool to connect to your database and run SQL scripts (e.g., MySQL Workbench, DBeaver, command-line `mysql`).
* **Web Browser:** Chrome, Firefox, Brave, Edge, etc. (Disable ad blockers that might interfere with Google Maps API for testing).

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/vatsalgandhi83/sj-hopes.git](https://github.com/vatsalgandhi83/sj-hopes.git)
    cd sj-hopes
    ```

2.  **Backend Setup (`/backend/sjHopes` directory):**
    * **Navigate:** `cd backend/sjHopes`
    * **Database:**
        * Ensure your local MySQL server is running.
        * Create a database schema named `sjhopes`. Use UTF-8 character set: `CREATE DATABASE sjhopes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        * Create a MySQL user (e.g., `sjhopes_user`) with privileges on this database (e.g., `GRANT ALL PRIVILEGES ON sjhopes.* TO 'sjhopes_user'@'localhost' IDENTIFIED BY 'your_password'; FLUSH PRIVILEGES;`). Replace `your_password`!
    * **Configuration:**
        * Open `src/main/resources/application.properties`.
        * Update the `spring.datasource.url` to `jdbc:mysql://localhost:3306/sjhopes?createDatabaseIfNotExist=false&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` (set `createDatabaseIfNotExist=false` if you created it manually).
        * Update `spring.datasource.username` and `spring.datasource.password` with the credentials for the user you created.
        * Set `spring.jpa.hibernate.ddl-auto` appropriately:
            * Use `create` or `update` the *first time* you run the backend to let Hibernate create the tables based on your entities.
            * After the tables are created, switch to `validate` or `none` if you plan to manage data primarily via the SQL scripts, to prevent accidental data loss or unexpected schema changes. `validate` is recommended.
    * **Sample Data (Choose ONE method or manage carefully):**
        * **Method A: Automatic Loading (via `DataLoader.java`)**
            * If `spring.jpa.hibernate.ddl-auto` is set to `create` or `create-drop` (or `update` on an empty schema), the included `DataLoader.java` component will attempt to insert sample Shelter, Client, and Task records automatically when the backend starts.
        * **Method B: Manual Loading (via SQL Scripts)**
            * SQL scripts containing sample data are located in the `/backend/sql/sample-data/` directory (`01-shelters.sql`, `02-clients.sql`, `03-tasks.sql`).
            * **Important:** Use this method *after* the database tables have been created (e.g., after running once with `ddl-auto=update` or `create`, then switching `ddl-auto` to `validate`).
            * Connect to your `sjhopes` database using an SQL client.
            * Execute the scripts **in order** (01 -> 02 -> 03).
            * *Example using mysql command line:*
                ```bash
                mysql -u sjhopes_user -p sjhopes < ../sql/sample-data/01-shelters.sql
                mysql -u sjhopes_user -p sjhopes < ../sql/sample-data/02-clients.sql
                mysql -u sjhopes_user -p sjhopes < ../sql/sample-data/03-tasks.sql
                ```
                (Enter your password when prompted).
    * **Build (Optional - Run usually builds):**
        ```bash
        ./gradlew build
        ```

3.  **Frontend Setup (`/frontend` directory):**
    * **Navigate:** `cd ../../frontend` (from `/backend/sjHopes`)
    * **Install Dependencies:**
        ```bash
        npm install
        ```
    * **Environment Variables:**
        * Create a file named `.env.local` in the `/frontend` directory.
        * Add your API key and the **correct backend URL/port**:
            ```env
            NEXT_PUBLIC_Maps_API_KEY=YOUR_Maps_API_KEY_HERE
            ```
        * Replace `YOUR_Maps_API_KEY_HERE` with your actual key.

## Running the Application (Local Demo)

1.  **Ensure Data:** Make sure sample data exists in your `sjhopes` database (either loaded automatically via `DataLoader` or manually via SQL scripts).
2.  **Run the Backend:**
    * Navigate to the `/backend/sjHopes` directory.
    * Execute:
        ```bash
        ./gradlew bootRun
        ```
    * Or run the main application class (`SjHopeNavigatorApplication.java`) from your IDE.
    * The backend should start on **`http://localhost:8081`**. Check console logs.

3.  **Run the Frontend:**
    * Navigate to the `/frontend` directory.
    * Execute:
        ```bash
        npm run dev
        ```
    * The frontend development server should start, typically on `http://localhost:3000`. Open this URL in your browser.

## API Documentation (Swagger)

Once the backend is running locally, access the interactive API documentation via Swagger UI:

* **Swagger UI:** [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui.html)

## Contributors

* [Vatsal Gandhi](https://github.com/vatsalgandhi83)
* [Rajeev Ranjan Chaurasia](https://github.com/rajeev-chaurasia)
* [Arya Nimesh Mehta](https://github.com/gangster26)
* [Ganesh Thampi](https://github.com/ganesh077)
