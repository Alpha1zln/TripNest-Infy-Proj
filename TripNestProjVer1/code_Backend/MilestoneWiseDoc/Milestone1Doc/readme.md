# TripNest — Backend M1

## 1. Project Overview

TripNest is a Travel Planning & Trip Management Platform.

This repository contains the **Spring Boot backend** for the TripNest project.

### Current M1 Backend Progress

The following backend foundation and JWT authentication flow have been implemented:

* Spring Boot backend setup
* PostgreSQL database connection
* JPA/Hibernate configuration
* User, Role and User-Role entities
* User registration
* BCrypt password hashing
* Login
* JWT generation
* JWT validation
* Protected API endpoint
* Spring Security configuration

> **RBAC and OAuth2 are separate tasks and are not included in the current implementation checkpoint.**

---

# 2. Technology Stack

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| Java 21                     | Programming language          |
| Spring Boot 4.1.1           | Backend framework             |
| Spring Web MVC              | REST APIs                     |
| Spring Data JPA             | Database access               |
| Hibernate                   | ORM                           |
| Spring Security             | Authentication & API security |
| Spring Security OAuth2 JOSE | JWT support                   |
| PostgreSQL 17.11            | Database                      |
| Maven                       | Build/dependency management   |
| Lombok                      | Reduces boilerplate code      |
| Postman                     | API testing                   |

---

# 3. Backend Project Structure

Current important structure:

```text
code_Backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── tripnest/
│       │           └── backend/
│       │               ├── config/
│       │               │   ├── JwtConfig.java
│       │               │   └── SecurityConfig.java
│       │               │
│       │               ├── controller/
│       │               │   ├── AuthController.java
│       │               │   └── TestController.java
│       │               │
│       │               ├── dto/
│       │               │   └── RegistrationRequest.java
│       │               │
│       │               ├── entity/
│       │               │   ├── User.java
│       │               │   ├── Role.java
│       │               │   └── UserRole.java
│       │               │
│       │               ├── repository/
│       │               │   ├── UserRepository.java
│       │               │   ├── RoleRepository.java
│       │               │   └── UserRoleRepository.java
│       │               │
│       │               └── service/
│       │                   ├── AuthService.java
│       │                   └── JwtService.java
│       │
│       └── resources/
│           └── application.properties
│
└── pom.xml
```

> The exact package/class structure may change as the project develops.

---

# 4. Database

## Database

PostgreSQL is being used for the TripNest backend.

```text
Database: tripnest_db
Schema: public
```

The backend is successfully connected to:

```text
jdbc:postgresql://localhost:5432/tripnest_db
```

PostgreSQL connection has been verified through Spring Boot/Hibernate.

---

# 5. Database Tables

The current authentication-related schema contains three tables:

```text
users
roles
user_roles
```

## users

Stores registered users.

Important fields:

```text
id
email
name
password
```

* `id` → Primary Key
* `email` → Unique
* `password` → BCrypt hash, not plain text

Example:

```text
id | email              | name | password
---+--------------------+------+-------------------
1  | john@example.com   | John | BCrypt hash
```

---

## roles

Stores application roles.

Current roles:

```text
1 → TRAVELER
2 → GROUP_ADMIN
3 → ADMIN
```

The role table is prepared for the project's authorization requirements.

---

## user_roles

Connects users with roles.

Structure:

```text
id
user_id
role_id
```

Relationships:

```text
users 1 ──────── * user_roles * ──────── 1 roles
```

This allows a user to be associated with one or more roles.

Example:

```text
user_id = 2
role_id = 1

→ User 2 has TRAVELER role
```

---

# 6. Entity Layer

The backend uses JPA entities to map Java objects to PostgreSQL tables.

### User

Represents a registered TripNest user.

Mapped to:

```text
users
```

### Role

Represents an application role.

Mapped to:

```text
roles
```

### UserRole

Represents the relationship between a user and a role.

Mapped to:

```text
user_roles
```

---

# 7. Registration Flow

Registration endpoint:

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

High-level flow:

```text
Client
  ↓
AuthController
  ↓
RegistrationRequest DTO
  ↓
Validation
  ↓
AuthService
  ↓
BCrypt password hashing
  ↓
User entity
  ↓
PostgreSQL
```

The password is **not stored as plain text**.

Example database value:

```text
$2a$10$...
```

---

# 8. BCrypt Password Hashing

BCrypt is a one-way password hashing algorithm.

Conceptually:

```text
Plain password
      ↓
    BCrypt
      ↓
Password hash
      ↓
PostgreSQL
```

During login, Spring Security/BCrypt verifies whether the entered password matches the stored hash.

The original password is not recovered from the database.

---

# 9. Login Flow

Login endpoint:

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "aln@example.com",
  "password": "password123"
}
```

Flow:

```text
Client
  ↓
AuthController
  ↓
AuthService
  ↓
Find user by email
  ↓
BCrypt password verification
  ↓
Password correct?
  ↓
JwtService
  ↓
JWT generated
  ↓
JWT returned to client
```

---

# 10. JWT Authentication

JWT stands for **JSON Web Token**.

The current implementation uses JWT with:

```text
HS256
```

JWT contains three logical sections:

```text
HEADER.PAYLOAD.SIGNATURE
```

Current payload contains:

```text
sub → user's email
iat → issued-at time
exp → expiration time
```

Example conceptually:

```json
{
  "sub": "aln@example.com",
  "iat": "...",
  "exp": "..."
}
```

The JWT is signed using the configured secret key.

---

# 11. JWT Configuration

JWT configuration is located in:

```text
JwtConfig.java
```

It provides:

```text
JwtEncoder
JwtDecoder
```

Conceptually:

```text
Secret Key
   │
   ├──→ JwtEncoder → creates/signs JWT
   │
   └──→ JwtDecoder → validates JWT
```

The JWT secret is configured through:

```properties
jwt.secret=...
```

### Security Note

A real production secret should **not be committed to GitHub**.

For deployment, the secret should be provided through environment variables or the deployment platform's secret-management mechanism.

---

# 12. JwtService

`JwtService` is responsible for JWT-related application logic.

Current responsibility:

```text
generateToken(email)
```

The token contains:

```text
subject
issued time
expiration time
```

Current token expiration:

```text
1 hour
```

---

# 13. Spring Security

Spring Security protects API endpoints.

Authentication endpoints are public:

```text
/api/auth/**
```

Other endpoints require authentication.

Conceptually:

```text
/api/auth/register
        ↓
     PUBLIC

/api/auth/login
        ↓
     PUBLIC

/api/test/protected
        ↓
 AUTHENTICATION REQUIRED
```

---

# 14. Protected Endpoint

A temporary endpoint has been created for JWT testing:

```http
GET /api/test/protected
```

Without a JWT:

```text
401 Unauthorized
```

With a valid JWT:

```http
Authorization: Bearer <JWT>
```

Response:

```text
JWT authentication successful!
```

This confirms that JWT generation and JWT validation are working.

---

# 15. JWT Authentication Flow

Complete current flow:

```text
                 REGISTER
                    ↓
              Validate request
                    ↓
             BCrypt hash password
                    ↓
                PostgreSQL
                    ↓
                  LOGIN
                    ↓
          Verify email + password
                    ↓
               JwtService
                    ↓
              Generate JWT
                    ↓
             Client receives JWT
                    ↓
        Authorization: Bearer JWT
                    ↓
             Spring Security
                    ↓
              JwtDecoder
                    ↓
             Validate JWT
                    ↓
              Authenticated
                    ↓
             Protected API
                    ↓
                 200 OK
```

---

# 16. API Testing

Postman has been used to test the backend.

### Registration

```http
POST http://localhost:8080/api/auth/register
```

### Login

```http
POST http://localhost:8080/api/auth/login
```

### Protected API

```http
GET http://localhost:8080/api/test/protected
```

Authorization:

```text
Bearer Token
```

---

# 17. Current M1 Status

### Completed

* [x] Spring Boot backend setup
* [x] Maven configuration
* [x] Java 21 configuration
* [x] PostgreSQL installation/database setup
* [x] PostgreSQL Spring Boot connection
* [x] JPA/Hibernate configuration
* [x] User entity
* [x] Role entity
* [x] UserRole entity
* [x] Database schema
* [x] Registration DTO
* [x] Request validation
* [x] Registration API
* [x] BCrypt password hashing
* [x] Login API
* [x] JWT secret configuration
* [x] JwtEncoder
* [x] JwtDecoder
* [x] JWT generation
* [x] JWT validation
* [x] Spring Security JWT configuration
* [x] Protected endpoint
* [x] JWT testing through Postman

### Separate / Pending Tasks

* [ ] Role-Based Access Control (RBAC)
* [ ] OAuth2 login
* [ ] Final authentication integration
* [ ] Frontend authentication integration
* [ ] Production security configuration
* [ ] Remove/replace temporary test endpoint

> **Note:** RBAC and OAuth2 are being handled as separate tasks and are intentionally not part of this current JWT checkpoint.

---

# 18. Running the Backend

From the backend project directory:

```powershell
mvn spring-boot:run
```

Successful startup should show:

```text
Started BackendApplication
```

The application runs by default on:

```text
http://localhost:8080
```

---

# 19. Important Notes for Team Members

Before modifying the backend:

1. Check the existing `pom.xml`.
2. Check `application.properties`.
3. Do not commit real database passwords or JWT secrets.
4. Do not modify the PostgreSQL schema blindly.
5. Understand the existing authentication flow before extending it.
6. Use Postman to verify APIs after changes.
7. Keep authentication logic in the appropriate controller/service/configuration layers.

---

# 20. Current Development Checkpoint

At this checkpoint:

```text
Spring Boot
     ↓
PostgreSQL
     ↓
JPA/Hibernate
     ↓
User + Role + UserRole
     ↓
Registration
     ↓
BCrypt
     ↓
Login
     ↓
JWT Generation
     ↓
JWT Validation
     ↓
Protected API
```

**JWT core authentication is working successfully.**

The next major backend work is outside this checkpoint and includes RBAC, OAuth2 and further TripNest business functionality.
