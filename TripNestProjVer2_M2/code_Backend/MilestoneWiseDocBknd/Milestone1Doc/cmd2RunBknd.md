
## In Vscode 
>> mvn clean compile           // first this cmd
>> mvn spring-boot:run         //  run spring boot


## In postman
register api
login api
jwt test api 

## In postgresql
create db
connect to db
show all tables 
show schema of table
add data in table
see ER dig. in GUI of postgres - ERD use
check all data in dft tables


-------

#### cmd to run bknd spbt ================================= 

mvn clean compile  
mvn spring-boot:run


#### cmd to run react ===================================== 
if node-modules folder is not presnt then = npm install
else directly = npm run dev


#### cmd to run PostgreSQL ================================
open cmd prompt = win + R
type below cmds to cnct to postgresql.

*****PostgreSQL Commands (CLI / psql)

**Login / Connect:
psql -U postgres — Log in as the default superuser (postgres).


**Database Operations:
\l — List all existing databases.
CREATE DATABASE tripnest_db; — Create a new database.

\c tripnest_db — Switch/connect to tripnest_db.

DROP DATABASE tripnest_db; — Delete a database.


**Schema & Table Inspection:
\dt — List all tables in the current database.

\d table_name — Describe the schema/structure of a specific table.

\du — List all users and their roles/permissions.


**Exit:
\q — Quit and exit the psql shell.



*******************************
### open PGADMIN sw to chk GUI of postgresql

select * from users;      // to see all users 
likewise all tables.



** chk db schema here too.


-------------

