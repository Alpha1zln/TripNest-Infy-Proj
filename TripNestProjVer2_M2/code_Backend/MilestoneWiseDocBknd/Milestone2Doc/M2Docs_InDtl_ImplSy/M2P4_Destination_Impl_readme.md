
---------------------------------------------------

# M2 P4 BKD IMPL README

## COVERED Destination API CREATION


-----------------------------

Let's go, man. ❤️ M2 P4 — Destination starts now.

We'll keep each step small because of the chat limit, and every code block I give will have short comments explaining what that code is for.

P4.1 — First understand what we're building

From the mentor requirement:

Destination entity and APIs for destinations, destination details, attractions, travel guides and relevant travel information.

So our first goal is the Destination Entity.

Think of it as:

Destination
 ├── id
 ├── name
 ├── country
 ├── description
 ├── type
 ├── bestTimeToVisit
 └── travelInformation

Example:

Destination
-------------------------
name              = Varanasi
country           = India
description       = Spiritual city on the Ganges
type              = Religious
bestTimeToVisit   = October - March
travelInformation = Airport, railway, local transport...
Why Entity first?

Because the Entity represents the data we want to store in PostgreSQL.

The basic backend flow will eventually be:

HTTP Request
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Destination Entity
    ↓
PostgreSQL
Step 1 — Create Destination.java

We'll first create only the basic entity. Don't add attractions/travel guides yet. We'll understand the foundation first.

Typical location:

src/main/java/.../destination/entity/Destination.java

Code:

package com.tripnest.destination.entity;

// JPA annotation used to mark this class as a database entity.
import jakarta.persistence.Entity;

// JPA annotation used to specify the primary key.
import jakarta.persistence.Id;

// Automatically generates the ID value.
import jakarta.persistence.GeneratedValue;

// Defines how the ID should be generated.
import jakarta.persistence.GenerationType;

// Lombok generates getters and setters automatically.
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Destination {

    // Primary key of the destination table.
    @Id

    // PostgreSQL will generate the ID automatically.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name of the destination, e.g. "Varanasi".
    private String name;

    // Country where the destination is located.
    private String country;

    // Short description of the destination.
    private String description;

    // Type of destination, e.g. Beach, Hill Station, Temple.
    private String type;

    // Recommended period for visiting the destination.
    private String bestTimeToVisit;

    // General travel-related information.
    private String travelInformation;
}
Understand the important part

@Entity

means:

"Hibernate/JPA, treat this Java class as a database entity."

So Hibernate will map this class to a database table.

Conceptually:

Java                         PostgreSQL

Destination       →          destination
id                →          id
name              →          name
country           →          country
description       →          description
type              →          type
bestTimeToVisit   →          best_time_to_visit
travelInformation →          travel_information

@Id tells JPA:

This field uniquely identifies each Destination.

@GeneratedValue(strategy = GenerationType.IDENTITY) tells PostgreSQL/JPA that the database should generate the ID when we insert a new destination.

One design decision

For now, I'm keeping:

private String type;

rather than creating an enum.

Why?

Because our first objective is to understand the CRUD + API + JPA flow. Later we can decide whether type should become an enum such as:

BEACH
HILL_STATION
TEMPLE
CITY
ADVENTURE

without unnecessarily complicating the first step.

Stop here for now. Don't create Repository yet.

Next we'll understand exactly what happens when Spring sees @Entity, then create the Repository.    


-----------------------------




-----------------------------



-----------------------------



-----------------------------




-----------------------------



-----------------------------

---------------------------------------------
---------------------------------------------
## postman apis testing












---------------------------------------------
---------------------------------------------



---------------------------------------------
