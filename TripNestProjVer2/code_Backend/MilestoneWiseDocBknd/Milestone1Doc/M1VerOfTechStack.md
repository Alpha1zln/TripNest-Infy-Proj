
## Technology & Version Information

| Technology | Version |
|---|---|
| Java | 21 |
java -version
java version "21.0.10" 2026-01-20 LTS
Java(TM) SE Runtime Environment (build 21.0.10+8-LTS-217)
Java HotSpot(TM) 64-Bit Server VM (build 21.0.10+8-LTS-217, mixed mode, sharing)
| Spring Boot | 4.1.1 |
| Spring Framework | 7.0.9 |
| Spring Security | 7.1.1 |
| Spring Data JPA | 4.1.1 |
| Hibernate ORM | 7.4.x |
| PostgreSQL JDBC Driver | 42.7.x |
| PostgreSQL Database | TBD - check local installation |
postgres=# select version();
version
 PostgreSQL 17.11 on x86_64-windows, compiled by msvc-19.44.35228, 64-bit
(1 row)
| Maven | TBD - check installed version |
mvn -version
Apache Maven 3.9.16 (2bdd9fddda4b155ebf8000e807eb73fd829a51d5)
Maven home: C:\Program Files\Apache\Maven\apache-maven-3.9.16
Java version: 21.0.10, vendor: Oracle Corporation,
| Lombok | Spring Boot managed version |

### Dependency Version Management

Spring Boot parent POM manages compatible versions of
Spring and third-party dependencies.

Therefore, versions are normally not specified individually
in `pom.xml`.

---
### Gist Ver
| Component | Version |
|---|---|
| Java | 21.0.10 LTS |
| Java Major Version | 21 |
| Java Vendor | Oracle Corporation |
| JVM | 64-bit HotSpot |
| Maven | 3.9.16 |
| Spring Boot | 4.1.1 |
| Database | PostgreSQL 17.11 |


### Local Environment

OS: Windows
Java Installation: Oracle JDK 21.0.10
Build Tool: Apache Maven 3.9.16

### Database Version Decision

PostgreSQL 17.11 selected instead of PostgreSQL 18.x.

Reason:
- PostgreSQL 17 is a mature major release.
- It is still officially supported.
- It provides everything required for TripNest.
- Avoid unnecessary dependency on a newly released major version.
------

