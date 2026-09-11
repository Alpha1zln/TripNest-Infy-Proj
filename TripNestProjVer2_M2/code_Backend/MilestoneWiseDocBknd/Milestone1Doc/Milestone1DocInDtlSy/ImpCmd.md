
# MAVEN 

mvn clean compile

Running & Development:

mvn spring-boot:run — Compile, configure, and start the Spring Boot application.

mvn clean spring-boot:run — Delete the previous target/ directory and run fresh.

Building & Packaging:

mvn clean — Delete the build target folder.

mvn compile — Compile the main Java source code (src/main/java).

mvn clean install — Build the .jar package and install it to the local ~/.m2 repository.

Troubleshooting & Flags:

mvn clean install -DskipTests — Build and package the project while skipping all unit tests.

mvn clean install -U — Force Maven to check remote repositories for updated dependencies and plugins.

mvn spring-boot:run -X — Run with full debug logging enabled to diagnose build failures.

---

# POSTGRESQL 
PostgreSQL Commands (CLI / psql)

Login / Connect:

psql -U postgres — Log in as the default superuser (postgres).

psql -U postgres -d tripnest_db — Connect directly to a specific database.

sudo -u postgres psql — Log in via Linux system user (Ubuntu/Debian).

Database Operations:

\l — List all existing databases.

CREATE DATABASE tripnest_db; — Create a new database.

\c tripnest_db — Switch/connect to tripnest_db.

DROP DATABASE tripnest_db; — Delete a database.

Schema & Table Inspection:

\dt — List all tables in the current database.

\d table_name — Describe the schema/structure of a specific table.

\du — List all users and their roles/permissions.

Exit:

\q — Quit and exit the psql shell.



---

