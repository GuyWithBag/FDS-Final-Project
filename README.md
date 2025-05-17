# FDS Final Project

## Project Description

Travel & Tour Booking System
A travel agency system where users book vacation packages and tours.


## Prerequisites

Before running the project, ensure you have the following installed:

-   Node.js (with npm)
-   MySQL
-   MySQL Workbench

## Setup

Open your terminal or command prompt and navigate to the project directory:

```bash
cd FDS-Final-Project
```

Follow these steps to get the project up and running on your local machine.

### 1. Database Setup

This project uses MySQL. You need to initialize the database schema and populate it with initial data using the provided SQL script.

-   Open MySQL Workbench.
-   Connect to your MySQL server.
-   Go to `File > Open SQL Script...` and select the `sql_init.sql` file from the project root directory.
-   Execute the script. This will create the necessary database and tables.

### 2. Install Dependencies

Navigate to both the `backend` and `frontend` directories and install the required npm packages.

```bash
cd FDS-Final-Project
cd backend
npm install
cd ../frontend
npm install
```

### 3. Run the Backend

From the `backend` directory, start the backend server:

```bash
cd FDS-Final-Project/backend
npm start
```

### 4. Run the Frontend

From the `frontend` directory, start the frontend development server:

```bash
cd FDS-Final-Project/frontend
npm run dev
```

## Usage

Open your web browser and navigate to `http://localhost:3000` to access the application.

### Backend API Usage

The backend API runs on `http://localhost:5000` (assuming the default port). You can interact with the API endpoints using tools like Postman or curl. Some of the available routes include:

-   `/api/activities`
-   `/api/bookings`
-   `/api/destinations`
-   `/api/hotels`
-   `/api/payments`
-   `/api/reviews`
-   `/api/tourPackages`
-   `/api/transportation`
-   `/api/users`

Refer to the backend code for specific request methods and data formats for each endpoint.

## Contributors

-   Dulaugon
-   Pacanza
-   Juliane
