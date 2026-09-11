# TripNest — Milestone 1 Documentation

## M1 Objective

Implement:
- Spring Boot backend setup
- PostgreSQL database setup
- JWT authentication
- OAuth2 login
- Role-Based Access Control
- Authentication flow integration

---

# Step 1 — Project Dependencies

## Existing Project

- Spring Boot: 4.1.1
- Java: 21
- Build tool: Maven
- ORM: Spring Data JPA / Hibernate
- Database target: PostgreSQL
- Backend: Spring Boot

## Existing Dependencies

- Spring Data JPA
- Spring Validation
- Spring Web MVC
- Spring DevTools
- MySQL Connector
- Lombok
- Spring Boot test dependencies

## Changes

### 1. Replace MySQL with PostgreSQL

Removed:

`mysql-connector-j`

Added:

`org.postgresql:postgresql`

### 2. Add Spring Security

Added:

`spring-boot-starter-security`

Purpose:
- Authentication
- Authorization
- Password security
- Security filter chain
- Protected API endpoints

### 3. Add JWT/JOSE Support

Added:

`spring-security-oauth2-jose`

Purpose:
- JWT/JOSE support
- JWT encoding/signing
- JWT decoding/validation

## Why?

TripNest requires secure JWT-based authentication.

Authentication flow:

Registration
→ Password hashing
→ Login
→ JWT generation
→ JWT sent to client
→ JWT sent with protected requests
→ JWT validation
→ Authenticated user

## Important Decision

TripNest will use PostgreSQL as the target database for local development
and production/Render deployment.

---

## Next Step

Configure PostgreSQL connection and verify that the Spring Boot
application can connect successfully.


### date 31 aug 2026 work
# Step 0 — Environment Verification

Before continuing M1 implementation, the development environment was verified.

## Versions Verified

| Component              | Version            |
| ---------------------- | ------------------ |
| Java                   | 21.0.10 LTS        |
| Maven                  | 3.9.16             |
| Spring Boot            | 4.1.1              |
| PostgreSQL             | 17.11              |
| PostgreSQL JDBC Driver | Present in pom.xml |

## PostgreSQL User

Verified PostgreSQL CLI user using:

`SELECT current_user;`

Result:

`postgres`

## Result

Environment verification completed successfully.

---

# Step 1A — Maven Compilation Verification

The Maven project was initially accessed from the parent `ver1` directory.

Running:

`mvn clean compile`

there produced:

`MissingProjectException — there is no POM in this directory`

## Cause

The actual Maven project is inside:

`ver1/code_Backend`

The `pom.xml` is located in the `code_Backend` directory.

## Fix

Changed directory to:

`ver1/code_Backend`

Then ran:

`mvn clean compile`

## Result

**BUILD SUCCESS**

This confirmed that the current Java code and Maven dependencies compile successfully.

## Concept Learned

Maven commands that operate on a project normally need to be executed from the directory containing `pom.xml`.

---

# Step 2 — PostgreSQL Database Foundation

## Step 2A — Create TripNest Database

PostgreSQL CLI (`psql`) was used to create and verify the application database.

### Database

`tripnest_db`

### Commands Used

List databases:

`\l`

Connect to TripNest database:

`\c tripnest_db`

Verify current database:

`SELECT current_database();`

Result:

`tripnest_db`

Verify current PostgreSQL user:

`SELECT current_user;`

Result:

`postgres`

## Why CLI?

PostgreSQL CLI was chosen for this step to learn basic PostgreSQL database-management commands.

pgAdmin can still be used later for visual inspection and management.

## Result

**PostgreSQL database `tripnest_db` successfully created and selected.**

---

# Current Status

M1 progress:

* Step 0 — Environment verification ✅
* Step 1 — Project dependencies ✅
* Step 1A — Maven compilation ✅
* Step 2A — PostgreSQL database creation ✅
* Step 2B — Spring Boot → PostgreSQL connection ⏳

---

# Immediate Next Step

Configure:

`src/main/resources/application.properties`

The existing:

`spring.application.name=backend`

will be retained.

We decided **not to convert `application.properties` to `application.yml`**, because there is no need to do so.

Add PostgreSQL datasource configuration, using:

* Database: `tripnest_db`
* Host: `localhost`
* Port: `5432`
* Username: `postgres`
* Password: local PostgreSQL password

Then start the application and verify that Spring Boot successfully connects to PostgreSQL.

**Do not share the PostgreSQL password in chat.**

---

# Important Documentation Rule

For the remainder of M1, document every significant step with:

1. Objective
2. What was done
3. Why it was done
4. Configuration/code changes
5. Concepts learned
6. Errors encountered
7. Cause
8. Fix
9. Testing
10. Result
11. Important decisions


--- 
Issue Summary: Spring Boot PostgreSQL DataSource Failure

1. The Problem:

Application crashed on startup with:
BeanCreationException: Failed to instantiate HikariDataSource ... Failed to determine a suitable driver class

application.properties kept clearing or was missing connection settings.

Maven build showed duplicate dependency warnings for org.postgresql:postgresql.

2. Root Causes Identified:

Missing DB Configuration: Spring Data JPA was on the classpath, but no valid database driver or connection URL was supplied.

File Location / Overwrite Issue: Configuration was either unsaved or edited in the transient target/ build directory instead of the source directory.

Duplicate POM Entry: The PostgreSQL driver dependency was declared twice in pom.xml.

3. Resolution Steps Applied:

Cleaned pom.xml: Removed the duplicate PostgreSQL dependency declaration around line 95.

Configured Source Properties: Saved the required database properties in src/main/resources/application.properties:

Database URL: jdbc:postgresql://localhost:5432/tripnest_db

Driver class: org.postgresql.Driver

Username, password, and Hibernate dialect.

Database Verification: Ensured local PostgreSQL service was active and tripnest_db was created.

Clean Build: Rebuilt and ran the project using mvn spring-boot:run.

4. Final Status:

Tomcat: Initialized and running on port 8080.

Database Connection: HikariPool-1 successfully established connection to tripnest_db on PostgreSQL 17.

Application: BackendApplication started in ~3.14 seconds.


--------

