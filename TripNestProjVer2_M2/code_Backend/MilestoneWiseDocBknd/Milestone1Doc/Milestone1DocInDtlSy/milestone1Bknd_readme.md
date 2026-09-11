# TripNest — Milestone 1 Backend

## Overview

This folder contains the **backend implementation** of the TripNest Travel Planning & Trip Management Platform.

The backend is developed using **Spring Boot** and will provide REST APIs, business logic, database access, validation, authentication, and other server-side functionality.

## Milestone 1 Goals

* Set up the Spring Boot backend project
* Configure Maven and Java
* Configure the initial database connectivity
* Establish the basic backend project structure
* Prepare the backend for REST API development
* Prepare the project for frontend integration

## Technology Stack

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* MySQL
* Maven
* Bean Validation

## Initial Project Structure

```text
milestone1_backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── tripnest/
│   │   │           └── TripNestApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
└── README.md
```

## Planned Backend Modules

The complete backend will be developed in later milestones.

* Authentication & Authorization
* Users & Profiles
* Trips & Destinations
* Itinerary
* Budget & Expenses
* Hotel Search/Integration
* Group/Trip Members
* Admin
* Validation & Exception Handling

## Architecture

The backend will follow a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / Hibernate
    ↓
MySQL
```

### Responsibilities

**Controller**

* Handles HTTP requests
* Exposes REST APIs

**Service**

* Contains business logic

**Repository**

* Communicates with the database

**Entity**

* Represents database tables

## Database

The project will use **MySQL** as the relational database.

Database design, entities, relationships, and schema will be finalized based on the project requirements before full feature development.

## Development

Build the project:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

## Frontend Integration

The backend will expose REST APIs that will be consumed by the React frontend.

```text
React Frontend
      ↓
    HTTP
      ↓
Spring Boot REST API
      ↓
Service Layer
      ↓
Repository
      ↓
MySQL
```

## Status

**Milestone 1 — Initial Backend Setup**

The basic Spring Boot backend environment and project structure are being established. Feature APIs, database entities, authentication, and business logic will be implemented in subsequent milestones.



***************

# TripNest — Milestone 1 Backend

## Spring Boot Project Setup

### 1. Open Spring Initializr

Go to **start.spring.io**.

### 2. Select project options

```text
Project       → Maven
Language      → Java
Packaging     → Jar
Java          → 17 / 21
Group         → com.tripnest
Artifact      → backend
Name          → TripNest
```

### 3. Add initial dependencies

Select:

* Spring Web
* Spring Data JPA
* MySQL Driver
* Validation
* Spring Boot DevTools

Do not add JWT/Spring Security initially; authentication can be added when that module is implemented.

### 4. Generate

Click **Generate** → download the ZIP → extract it into:

```text
TripNest/
└── milestone1_backend/
```

Open the extracted project in IntelliJ/VS Code.

### 5. Run the application

Using Maven:

```bash
mvn spring-boot:run
```

Or run the main class:

```text
TripNestApplication.java
```

### Initial Backend Structure

```text
src/
├── main/
│   ├── java/
│   │   └── com/tripnest/
│   │       └── TripNestApplication.java
│   │
│   └── resources/
│       └── application.properties
│
└── test/

pom.xml
```

### Later Backend Structure

After requirements and DB design are finalized:

```text
controller/
service/
repository/
entity/
dto/
config/
exception/
```

### Architecture

```text
React
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
JPA / Hibernate
  ↓
MySQL
```

## Database

Use **MySQL** as the relational database.

DB schema and entities should be finalized **after requirements/features are decided**, not before.

****************************