
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

P4.2 — Create DestinationRepository.java

Create:

src/main/java/com/tripnest/destination/repository/DestinationRepository.java

Use:

package com.tripnest.destination.repository;

import com.tripnest.destination.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

}

That's the entire file. Don't add custom methods yet.

Understand this properly — interview perspective

The most important line is:

public interface DestinationRepository extends JpaRepository<Destination, Long>

Think of it as:

DestinationRepository
        ↓
JpaRepository
        ↓
Spring Data JPA
        ↓
Hibernate
        ↓
PostgreSQL
Why interface?

We're not writing the implementation ourselves.

Normally, you might imagine:

class DestinationRepository {
    // write save()
    // write findById()
    // write delete()
    // write SQL...
}

But Spring Data JPA does that work for us.

We simply declare:

interface DestinationRepository

and extend JpaRepository.

Spring creates the actual repository implementation at runtime.

Why <Destination, Long>?

JpaRepository needs two important types:

JpaRepository<EntityType, IDType>

So ours becomes:

JpaRepository<Destination, Long>

Meaning:

"This repository manages Destination entities, and their primary key is of type Long."

Because our entity has:

private Long id;

the second parameter is:

Long
What do we get automatically?

Because we extend JpaRepository, we immediately get methods such as:

save(destination)
findById(id)
findAll()
deleteById(id)
existsById(id)
count()

So we don't write SQL for basic CRUD.

For example:

destinationRepository.save(destination);

eventually results in JPA/Hibernate performing the appropriate database operation.

Interview question

Q: Why use JpaRepository instead of writing SQL manually?

Good answer:

JpaRepository is provided by Spring Data JPA and gives us ready-made CRUD and persistence operations for an entity. It reduces boilerplate code and allows us to define custom query methods when required.

One important distinction

Don't confuse:

@Entity

with:

JpaRepository

They have different jobs.

Component	Purpose
Destination	Represents the data/entity
DestinationRepository	Performs database operations
DestinationService	Contains business logic
DestinationController	Handles HTTP requests

So our P4 flow is becoming:

HTTP
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


-----------------------------

Ah yes — this is important. Now I have the exact package convention you're using.

Your project is not using subfolders like:

entity/trip/
entity/destination/
service/trip/
controller/trip/

Instead, you have:

com.tripnest.backend/
├── controller/
│   ├── AuthController.java
│   └── TestController.java
│
├── dto/
│   ├── activity/
│   ├── trip/
│   └── itinerary/
│
├── entity/
├── repository/
└── service/

The only nested organization is inside dto.

So I need to correct the path I gave earlier

❌ Don't create:

destination/repository/DestinationRepository.java

✅ Create:

com.tripnest.backend/
└── repository/
    └── DestinationRepository.java

And the package must be:

package com.tripnest.backend.repository;
P4.2 — Correct file
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

}
Why this matters for our project

We'll follow your existing architecture, not introduce a new folder structure just because it's theoretically possible.

So P4 will look like:

com.tripnest.backend/
│
├── controller/
│   ├── AuthController.java
│   ├── TestController.java
│   └── DestinationController.java       ← P4
│
├── dto/
│   ├── activity/
│   ├── trip/
│   ├── itinerary/
│   └── destination/                     ← P4 DTOs if needed
│
├── entity/
│   ├── User.java
│   ├── Role.java
│   ├── UserRole.java
│   └── Destination.java                 ← P4
│
├── repository/
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── UserRoleRepository.java
│   └── DestinationRepository.java       ← P4
│
└── service/
    ├── AuthService.java
    ├── JwtService.java
    └── DestinationService.java          ← P4

This is the structure I'll follow from now on.

And good catch giving me the package declaration. The package com.tripnest.backend... line is actually one of the first things I should have verified before giving you the file path. 👍

Now create only DestinationRepository.java in the existing repository folder. Then we'll move to the Service.

-----------------------------

Great. ✅ P4.2 Repository is correct.

Now we move to:

P4.3 — DestinationService.java

Create it directly inside:

com.tripnest.backend/
└── service/
    └── DestinationService.java

For this first step, we'll keep the service very simple. We're only establishing the connection between Service → Repository.

package com.tripnest.backend.service;

import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }
}
Understand the important parts
1. @Service
@Service
public class DestinationService

This tells Spring:

"Create and manage an object of this class as a Spring Bean."

So Spring can inject DestinationService into our future DestinationController.

Flow:

DestinationController
        ↓
DestinationService
        ↓
DestinationRepository
2. Repository dependency
private final DestinationRepository destinationRepository;

The Service needs the Repository because the Repository is responsible for database operations.

The Service will eventually do things like:

create destination
get destination
get all destinations
update destination
delete destination

and use:

destinationRepository

to communicate with the database.

3. Constructor injection ⭐
public DestinationService(DestinationRepository destinationRepository) {
    this.destinationRepository = destinationRepository;
}

Spring sees that the constructor needs a DestinationRepository.

Since DestinationRepository is a Spring Data repository, Spring provides it automatically.

This is called Dependency Injection.

Interview question

Q: Why constructor injection?

Good SDE1 answer:

Constructor injection allows Spring to provide the required dependency when creating the object. It makes the dependency explicit, supports immutability when the field is final, and is generally preferred over field injection because it is easier to test.

Why aren't we writing methods yet?

Because we're building this incrementally.

Current:

Entity          ✅
Repository      ✅
Service         ← currently here
Controller      ⏳

First we'll establish the layers, then add the actual CRUD methods.

Create only this file for now.

Once done, say done, and we'll add the first Service method: create/save Destination.

-----------------------------

P4.4 — Add createDestination() to Service

Now that we understand why the Repository is injected, let's actually use it.

Update DestinationService.java to:

package com.tripnest.backend.service;

import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Saves a new destination in the database.
    public Destination createDestination(Destination destination) {
        return destinationRepository.save(destination);
    }
}
What's happening here?

This method:

public Destination createDestination(Destination destination)

basically says:

"Give me a Destination, and I'll save it and return the saved Destination."

Then:

return destinationRepository.save(destination);

is where the actual database operation is delegated to the Repository.

So:

Controller
    ↓
createDestination(destination)
    ↓
Service
    ↓
destinationRepository.save(destination)
    ↓
JPA / Hibernate
    ↓
PostgreSQL
Why do we put save() in Service instead of Controller?

This is an important interview concept.

We want each layer to have a job:

Controller:

"Someone sent an HTTP request."

Service:

"What should the application do with that request?"

Repository:

"How do I interact with the database?"

So Controller shouldn't directly do:

repository.save(...)

Instead:

Controller → Service → Repository

This separation keeps the code organized and makes it easier to add business rules later.

For example, later our Service might do:

Check destination name
        ↓
Check country
        ↓
Apply business rules
        ↓
Save destination

The Controller doesn't need to know those details.

One thing to notice

We are currently accepting the Entity directly:

Destination destination

That's okay for this learning step.

Later, when we build the proper API, we'll likely use:

DestinationRequestDTO
        ↓
Service
        ↓
Destination
        ↓
Repository

because exposing database entities directly through APIs isn't generally the best design.

Don't change that now. We'll introduce DTOs at the appropriate point.

Your task now

Just add this one method and don't create Controller yet.

Once done, say done.

Then we'll do P4.5 — getAllDestinations(), where you'll see how findAll() works and why its return type is List<Destination>.


-----------------------------

Yep. Next small step. 🔥

P4.5 — getAllDestinations()

Add this method to your existing DestinationService.java:

public List<Destination> getAllDestinations() {
    return destinationRepository.findAll();
}

And add this import at the top:

import java.util.List;

So the complete file is now:

package com.tripnest.backend.service;

import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Saves a new destination.
    public Destination createDestination(Destination destination) {
        return destinationRepository.save(destination);
    }

    // Gets all destinations from the database.
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }
}
Understand this line
return destinationRepository.findAll();

We didn't create findAll() ourselves.

It comes automatically from:

JpaRepository<Destination, Long>

So Spring Data JPA already gives us:

save()       → create
findAll()    → get all
findById()   → get one
deleteById() → delete

For findAll():

PostgreSQL
    ↓
Repository
    ↓
findAll()
    ↓
List<Destination>
    ↓
Service
Why List<Destination>?

Because there can be multiple destinations:

[
   Varanasi,
   Goa,
   Manali,
   Jaipur
]

So:

Destination

means one destination.

While:

List<Destination>

means multiple destinations.

Interview question

Q: Where does findAll() come from?

It is inherited from Spring Data JPA's JpaRepository, so we don't need to implement the basic database operation ourselves.

That's it for this step.

Don't create Controller yet.

Next we'll add getDestinationById(), which is slightly more interesting because findById() returns an Optional. That's worth understanding properly for interviews.

-----------------------------

Absolutely. 👍 From now on, one class = complete class in one go. That will save us a lot of time.

For DestinationService, let's finish the complete basic CRUD service now.

P4.3 — Complete DestinationService.java

Replace your current file with:

package com.tripnest.backend.service;

import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Create a new destination.
    public Destination createDestination(Destination destination) {
        return destinationRepository.save(destination);
    }

    // Get all destinations.
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // Get one destination using its ID.
    public Optional<Destination> getDestinationById(Long id) {
        return destinationRepository.findById(id);
    }

    // Update an existing destination.
    public Destination updateDestination(Long id, Destination destination) {
        Destination existing = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        existing.setName(destination.getName());
        existing.setCountry(destination.getCountry());
        existing.setDescription(destination.getDescription());
        existing.setType(destination.getType());
        existing.setBestTimeToVisit(destination.getBestTimeToVisit());
        existing.setTravelInformation(destination.getTravelInformation());

        return destinationRepository.save(existing);
    }

    // Delete a destination using its ID.
    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }
}
Understand the 5 methods
Method	Job
createDestination()	Create
getAllDestinations()	Read all
getDestinationById()	Read one
updateDestination()	Update
deleteDestination()	Delete

That's our basic CRUD.

⭐ One important thing: Optional

This:

public Optional<Destination> getDestinationById(Long id)

means:

"There may or may not be a Destination with this ID."

For example:

ID 1 → Varanasi       ✅
ID 2 → Goa            ✅
ID 99 → nothing       ❌

Instead of pretending ID 99 definitely has a Destination, Java uses Optional to represent:

value exists       → Optional containing Destination
value doesn't exist → Optional.empty()

You'll see this pattern a lot in Spring Boot interviews.

⭐ Update method — understand this carefully

We first find the existing record:

Destination existing = destinationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Destination not found"));

In simple language:

"Find destination with this ID. If it doesn't exist, throw an error."

Then we change the existing object's fields:

existing.setName(destination.getName());
existing.setCountry(destination.getCountry());
...

And finally:

return destinationRepository.save(existing);

saves the updated object.

So:

ID = 5
   ↓
Find existing destination
   ↓
Change its fields
   ↓
save()
   ↓
Database updated
One small design note

We're using RuntimeException temporarily to keep P4 simple.

Later, we should replace this with a proper custom exception such as:

DestinationNotFoundException

and handle it globally using your project's exception-handling approach, if/when we add that.

Don't add that complexity now.

Current P4 progress
Destination.java             ✅
DestinationRepository.java   ✅
DestinationService.java      ✅

Next, we'll do the entire DestinationController.java in one go — all endpoints together:

POST   /api/destinations
GET    /api/destinations
GET    /api/destinations/{id}
PUT    /api/destinations/{id}
DELETE /api/destinations/{id}

Then we'll test the complete flow through Postman instead of stopping after every endpoint.



---------------------------------------------

dto folder, destination folder shud be there, DestinationRequestDTO, DestinationResponseDTO, kindly create , as this flow is more clean, readble.

Yes — I agree. Since your existing dto already uses subfolders for trip, activity, itinerary, keeping Destination DTOs together is cleaner and more readable.

We'll use:

com.tripnest.backend/
│
├── dto/
│   ├── activity/
│   ├── itinerary/
│   ├── trip/
│   └── destination/
│       ├── DestinationRequestDTO.java
│       └── DestinationResponseDTO.java
│
├── entity/
│   └── Destination.java
│
├── repository/
│   └── DestinationRepository.java
│
├── service/
│   └── DestinationService.java
│
└── controller/
    └── DestinationController.java

And yes, let's use DTOs in the API flow rather than exposing Destination directly.

P4.6A — DestinationRequestDTO.java

Create:

src/main/java/com/tripnest/backend/dto/destination/DestinationRequestDTO.java
package com.tripnest.backend.dto.destination;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DestinationRequestDTO {

    private String name;
    private String country;
    private String description;
    private String type;
    private String bestTimeToVisit;
    private String travelInformation;
}
What is Request DTO?

Simple:

Request DTO = what the client is allowed to SEND to our API.

For example:

{
  "name": "Varanasi",
  "country": "India",
  "description": "Spiritual city on the Ganges",
  "type": "Religious",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Airport, railway and local transport"
}

This JSON becomes:

JSON
 ↓
DestinationRequestDTO
 ↓
Service
 ↓
Destination Entity
 ↓
Repository
 ↓
DB
P4.6B — DestinationResponseDTO.java

Create:

src/main/java/com/tripnest/backend/dto/destination/DestinationResponseDTO.java
package com.tripnest.backend.dto.destination;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DestinationResponseDTO {

    private Long id;
    private String name;
    private String country;
    private String description;
    private String type;
    private String bestTimeToVisit;
    private String travelInformation;
}
Request vs Response

This is important for interviews.

Request DTO:

Client → Backend

Response DTO:

Backend → Client

So:

                 TripNest Backend
                       │
       ┌───────────────┴───────────────┐
       ↓                               ↓
RequestDTO                         ResponseDTO
       ↑                               ↓
     Client                         Client
Why not just return Destination?

Because the Entity represents our database structure.

DTO represents our API structure.

Keeping them separate gives us flexibility.

For example, suppose later Destination gets:

private String internalAdminNote;

We probably don't want that information going to the frontend.

If Controller directly returns Entity:

Entity → Client

we risk exposing fields that shouldn't be exposed.

With Response DTO:

Entity → ResponseDTO → Client

we explicitly control what the client receives.

One change we now need

Because we're introducing DTOs, our previous Controller/Service signatures:

createDestination(Destination destination)

and

ResponseEntity<Destination>

should eventually become:

DestinationRequestDTO
        ↓
Service
        ↓
Destination Entity
        ↓
Repository
        ↓
Destination Entity
        ↓
DestinationResponseDTO
        ↓
Client

Don't modify the Service/Controller yet.

First create these two DTO files.

Then we'll update the entire DestinationService.java in one go, including the DTO → Entity and Entity → DTO conversion. That will give us a much cleaner architecture.

-----------------------------

Good. 👍 Now let's make the DTO-based Service complete in one go, as we agreed.

P4.7 — Update DestinationService.java

Replace the whole file with:

package com.tripnest.backend.service;

import com.tripnest.backend.dto.destination.DestinationRequestDTO;
import com.tripnest.backend.dto.destination.DestinationResponseDTO;
import com.tripnest.backend.entity.Destination;
import com.tripnest.backend.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    // Create destination: DTO → Entity → Database → Response DTO.
    public DestinationResponseDTO createDestination(DestinationRequestDTO request) {

        Destination destination = new Destination();

        destination.setName(request.getName());
        destination.setCountry(request.getCountry());
        destination.setDescription(request.getDescription());
        destination.setType(request.getType());
        destination.setBestTimeToVisit(request.getBestTimeToVisit());
        destination.setTravelInformation(request.getTravelInformation());

        Destination savedDestination = destinationRepository.save(destination);

        return convertToResponseDTO(savedDestination);
    }

    // Get all destinations.
    public List<DestinationResponseDTO> getAllDestinations() {

        return destinationRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get one destination by ID.
    public Optional<DestinationResponseDTO> getDestinationById(Long id) {

        return destinationRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    // Update an existing destination.
    public DestinationResponseDTO updateDestination(
            Long id,
            DestinationRequestDTO request) {

        Destination existing = destinationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Destination not found"));

        existing.setName(request.getName());
        existing.setCountry(request.getCountry());
        existing.setDescription(request.getDescription());
        existing.setType(request.getType());
        existing.setBestTimeToVisit(request.getBestTimeToVisit());
        existing.setTravelInformation(request.getTravelInformation());

        Destination updatedDestination =
                destinationRepository.save(existing);

        return convertToResponseDTO(updatedDestination);
    }

    // Delete a destination by ID.
    public void deleteDestination(Long id) {

        destinationRepository.deleteById(id);
    }

    // Converts Entity into the DTO returned to the client.
    private DestinationResponseDTO convertToResponseDTO(
            Destination destination) {

        return new DestinationResponseDTO(
                destination.getId(),
                destination.getName(),
                destination.getCountry(),
                destination.getDescription(),
                destination.getType(),
                destination.getBestTimeToVisit(),
                destination.getTravelInformation()
        );
    }
}
The important idea

Our flow is now much cleaner:

             CLIENT
                ↓
     DestinationRequestDTO
                ↓
           Controller
                ↓
            Service
                ↓
        Destination Entity
                ↓
          Repository
                ↓
          PostgreSQL

And coming back:

PostgreSQL
    ↓
Entity
    ↓
Service
    ↓
DestinationResponseDTO
    ↓
Controller
    ↓
CLIENT
Why the conversion?

We don't want:

Entity ↔ Client

We want:

RequestDTO → Entity
Entity → ResponseDTO

This keeps our database model separate from our API model.

⭐ Understand the stream() part

This:

return destinationRepository.findAll()
        .stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());

looks complicated, but conceptually it's just:

List<Destination>
        ↓
take each Destination
        ↓
convert it to DestinationResponseDTO
        ↓
collect them into a List

For example:

Destination         → ResponseDTO
Varanasi            → Varanasi DTO
Goa                 → Goa DTO
Manali              → Manali DTO

So the final result is:

List<DestinationResponseDTO>
What does this mean?
.map(this::convertToResponseDTO)

means:

"For every Destination, call my convertToResponseDTO() method."

The :: syntax is called a method reference.

For interview purposes:

this::convertToResponseDTO is a method reference that passes each stream element to the convertToResponseDTO() method.

⭐ One more important improvement

We now have:

Optional<DestinationResponseDTO>

instead of:

Optional<Destination>

That's good.

The database Entity never needs to reach the Controller/client.

One thing to fix next

Our Controller still expects Destination, because we wrote the original CRUD Controller before introducing DTOs.

So don't test yet.

Next we'll replace the entire DestinationController.java in one go so it matches this new DTO-based Service.

Then we'll compile and test the complete P4 CRUD flow.



---------------------------------------------

Yep. Now the complete DTO-based Controller. 🔥

P4.8 — DestinationController.java

Replace the previous Controller completely with:

package com.tripnest.backend.controller;

import com.tripnest.backend.dto.destination.DestinationRequestDTO;
import com.tripnest.backend.dto.destination.DestinationResponseDTO;
import com.tripnest.backend.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // Create a new destination.
    @PostMapping
    public ResponseEntity<DestinationResponseDTO> createDestination(
            @RequestBody DestinationRequestDTO request) {

        return ResponseEntity.ok(
                destinationService.createDestination(request)
        );
    }

    // Get all destinations.
    @GetMapping
    public ResponseEntity<List<DestinationResponseDTO>> getAllDestinations() {

        return ResponseEntity.ok(
                destinationService.getAllDestinations()
        );
    }

    // Get one destination by ID.
    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponseDTO> getDestinationById(
            @PathVariable Long id) {

        return destinationService.getDestinationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update an existing destination.
    @PutMapping("/{id}")
    public ResponseEntity<DestinationResponseDTO> updateDestination(
            @PathVariable Long id,
            @RequestBody DestinationRequestDTO request) {

        return ResponseEntity.ok(
                destinationService.updateDestination(id, request)
        );
    }

    // Delete a destination.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(
            @PathVariable Long id) {

        destinationService.deleteDestination(id);

        return ResponseEntity.noContent().build();
    }
}
Understand the new flow ⭐

The important change is that Controller no longer knows about Destination Entity.

For POST:

JSON
 ↓
DestinationRequestDTO
 ↓
Controller
 ↓
Service
 ↓
Destination Entity
 ↓
Repository
 ↓
Database

And response:

Database
 ↓
Destination Entity
 ↓
Service
 ↓
DestinationResponseDTO
 ↓
Controller
 ↓
JSON

That's much cleaner.

POST
@RequestBody DestinationRequestDTO request

means:

Take the JSON sent by frontend/Postman and put it into the Request DTO.

Response
ResponseEntity<DestinationResponseDTO>

means:

We're sending a Response DTO back to the client, not our database Entity.

⭐ Why ResponseEntity?

Think of ResponseEntity as a box containing the HTTP response.

It lets us control things like:

200 OK
404 NOT FOUND
204 NO CONTENT

For example:

ResponseEntity.ok(...)

→ 200 OK

ResponseEntity.notFound().build()

→ 404 Not Found

ResponseEntity.noContent().build()

→ 204 No Content

This is useful because APIs don't just return data—they also return an HTTP status telling the client what happened.

P4 CRUD is now connected
                    CLIENT
                       ↓
             DestinationController
                       ↓
             RequestDTO / ResponseDTO
                       ↓
              DestinationService
                       ↓
               DestinationRepository
                       ↓
                Destination Entity
                       ↓
                  PostgreSQL
Endpoints
Method	URL	Purpose
POST	/api/destinations	Create
GET	/api/destinations	Get all
GET	/api/destinations/{id}	Get one
PUT	/api/destinations/{id}	Update
DELETE	/api/destinations/{id}	Delete
Now STOP coding for a moment 😄

Run:

mvn clean compile

If you get BUILD SUCCESS, send me that.

Then we'll run the application and test all 5 APIs together in Postman.

After CRUD is working, we'll move to the more interesting part of M2 P4: destination search/details and the mentor requirements around attractions, travel guides, and travel information.

-----------------------------


-----------------------------

data --- 
  {
    "id": 1,
    "name": "Varanasi",
    "country": "India",
    "description": "Spiritual city on the banks of the Ganges",
    "type": "Religious",
    "bestTimeToVisit": "October - March",
    "travelInformation": "Airport, railway station and local transport available"
  }


  {
  "name": "Manali",
  "country": "India",
  "description": "A scenic mountain destination in Himachal Pradesh known for snow-capped peaks and valleys",
  "type": "Hill Station",
  "bestTimeToVisit": "March - June",
  "travelInformation": "Nearest airport is Bhuntar; buses and taxis are commonly available"
}


{
  "name": "Goa",
  "country": "India",
  "description": "A coastal destination known for beaches, Portuguese heritage, nightlife and seafood",
  "type": "Beach",
  "bestTimeToVisit": "November - February",
  "travelInformation": "Goa has an international airport, railway stations and local taxis/buses"
}


{
    "name": "Jaipur",
    "country": "India",
    "description": "The capital of Rajasthan, famous for royal palaces, majestic hill forts, vibrant bazaars, and rich Rajput heritage",
    "type": "Heritage / Cultural",
    "bestTimeToVisit": "October - March",
    "travelInformation": "Jaipur International Airport has direct domestic and international flights, connected by superfast trains (like Vande Bharat and Shatabdi), and easily reached via the Delhi-Mumbai Expressway"
  }
---------------------------------------------

{
    "name": "Haridwar",
    "country": "India",
    "description": "An ancient holy city on the banks of the Ganges, famous for the sacred Har Ki Pauri ghat, evening Ganga Aarti, and spiritual pilgrimages",
    "type": "Spiritual / Religious",
    "bestTimeToVisit": "October - April",
    "travelInformation": "Nearest airport is Jolly Grant Airport in Dehradun (around 40 km away), well-connected via Haridwar Junction railway station, and easily accessible by road via national highways from Delhi"
  },
  {
    "name": "Rameswaram",
    "country": "India",
    "description": "A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views",
    "type": "Spiritual / Coastal",
    "bestTimeToVisit": "October - March",
    "travelInformation": "Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities"
  }


-------------------------------------------

---------------------------------------------
---------------------------------------------
## postman apis testing


###  1. CREATE — POST
Enter bearer option , jwt  token.

Then, URL
POST http://localhost:8080/api/destinations

Body → raw → JSON
{
  "name": "Varanasi",
  "country": "India",
  "description": "Spiritual city on the banks of the Ganges",
  "type": "Religious",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Airport, railway station and local transport available"
}

Expected:
200 OK


Notice something important:
Request has no id.
The database creates it.

### 2. GET ALL
GET http://localhost:8080/api/destinations

Expected:
200 OK

Example:
op>Response>
[
    {"id":1,"name":"Varanasi","country":"India","description":"Spiritual city on the banks of the Ganges","type":"Religious","bestTimeToVisit":"October - March","travelInformation":"Airport, railway station and local transport available"},
    {"id":2,"name":"Manali","country":"India","description":"A scenic mountain destination in Himachal Pradesh known for snow-capped peaks and valleys","type":"Hill Station","bestTimeToVisit":"March - June","travelInformation":"Nearest airport is Bhuntar; buses and taxis are commonly available"},{"id":3,"name":"Goa","country":"India","description":"A coastal destination known for beaches, Portuguese heritage, nightlife and seafood","type":"Beach","bestTimeToVisit":"November - February","travelInformation":"Goa has an international airport, railway stations and local taxis/buses"},{"id":4,"name":"bch","country":"India","description":"A coastal destination known for beaches and seafood","type":"Beach","bestTimeToVisit":"N - February","travelInformation":"Bch has cnctn via airport, railway stations and local taxis/buses"},
    {"id":5,"name":"Jaipur","country":"India","description":"The capital of Rajasthan, famous for royal palaces, majestic hill forts, vibrant bazaars, and rich Rajput heritage","type":"Heritage / Cultural","bestTimeToVisit":"October - March","travelInformation":"Jaipur International Airport has direct domestic and international flights, connected by superfast trains (like Vande Bharat and Shatabdi), and easily reached via the Delhi-Mumbai Expressway"},
    {"id":6,"name":"Haridwar","country":"India","description":"An ancient holy city on the banks of the Ganges, famous for the sacred Har Ki Pauri ghat, evening Ganga Aarti, and spiritual pilgrimages","type":"Spiritual / Religious","bestTimeToVisit":"October - April","travelInformation":"Nearest airport is Jolly Grant Airport in Dehradun (around 40 km away), well-connected via Haridwar Junction railway station, and easily accessible by road via national highways from Delhi"},
    {"id":7,"name":"bch","country":"India","description":"bch , food sea","type":"beach","bestTimeToVisit":"dec - jan","travelInformation":"Nearest airport , well-connected via railway station, and easily accessible by road "}]

### ** sql qry 
select * from destination;

```
 1 | October - March     | India   | Spiritual city on the banks of the Ganges
                                          | Varanasi | Airport, railway station and local transport available
                                                                                                                 | Religious
  2 | March - June        | India   | A scenic mountain destination in Himachal Pradesh known for snow-capped peaks and valleys                                                | Manali   | Nearest airport is Bhuntar; buses and taxis are commonly available
                                                                                                                 | Hill Station
  3 | November - February | India   | A coastal destination known for beaches, Portuguese heritage, nightlife and seafood
                                          | Goa      | Goa has an international airport, railway stations and local taxis/buses                                                                                                                       | Beach
  4 | N - February        | India   | A coastal destination known for beaches and seafood
                                          | bch      | Bch has cnctn via airport, railway stations and local taxis/buses
                                                                                                                 | Beach
  5 | October - March     | India   | The capital of Rajasthan, famous for royal palaces, majestic hill forts, vibrant bazaars, and rich Rajput heritage                       | Jaipur   | Jaipur International Airport has direct domestic and international flights, connected by superfast trains (like Vande Bharat and Shatabdi), and easily reached via the Delhi-Mumbai Expressway | Heritage / Cultural
  6 | October - April     | India   | An ancient holy city on the banks of the Ganges, famous for the sacred Har Ki Pauri ghat, evening Ganga Aarti, and spiritual pilgrimages | Haridwar | Nearest airport is Jolly Grant Airport in Dehradun (around 40 km away), well-connected via Haridwar Junction railway station, and easily accessible by road via national highways from Delhi   | Spiritual / Religious
  7 | dec - jan           | India   | bch , food sea
                                          | bch      | Nearest airport , well-connected via railway station, and easily accessible by road
```



### 3. GET ONE
If Varanasi got id = 1:
GET http://localhost:8080/api/destinations/1

op>
{"id":1,"name":"Varanasi","country":"India","description":"Spiritual city on the banks of the Ganges","type":"Religious","bestTimeToVisit":"October - March","travelInformation":"Airport, railway station and local transport available"}

Expected:
200 OK

If v try:
GET http://localhost:8080/api/destinations/999

Expected:
404 Not Found
This is our Optional + ResponseEntity.notFound() flow working.

### 4. UPDATE
PUT http://localhost:8080/api/destinations/1

Body:
{
    "name": "Rameswaram",
    "country": "India",
    "description": "A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views",
    "type": "Spiritual / Coastal",
    "bestTimeToVisit": "October - March",
    "travelInformation": "Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities"
  }

Expected:
200 OK
The id remains 1.

op>
{"id":7,"name":"Rameswaram","country":"India","description":"A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views","type":"Spiritual / Coastal","bestTimeToVisit":"October - March","travelInformation":"Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities"}


#### ** sql qry to see update id = 7 of dest.

tripnest_db=# select * from destination where id = 7;
```
 id | best_time_to_visit | country |                                                                                   description                                                                                   |    name    |
                                             travel_information
              |        type
----+--------------------+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+---------------------
  7 | October - March    | India   | A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views | Rameswaram | Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities | Spiritual / Coastal
(1 row)
```

### 5. DELETE
DELETE http://localhost:8080/api/destinations/8

Response:
204 No Content

op sql> for - id=8, before deletion
```
tripnest_db=# select * from destination where id = 8;
 id | best_time_to_visit | country |  description   | name |                                  travel_information
             | type
----+--------------------+---------+----------------+------+--------------------------------------------------------------------------------------+-------
  8 | dec - jan          | India   | bch , food sea | bch  | Nearest airport , well-connected via railway station, and easily accessible by road  | beach
(1 row)
```


** After deletion - Then:

GET 
http://localhost:8080/api/destinations/8
Response:
404 Not Found
op> blank

DEL
http://localhost:8080/api/destinations/8
Response:
204 No Content
op> blank.

** op sql for id=8-
tripnest_db=# select * from destination where id = 8;
(0 rows)

-----------------------------------------------------

⭐ What we have achieved
At this point:

Destination Entity          ✅
Destination Repository      ✅
Destination Service         ✅
Request DTO                 ✅
Response DTO                ✅
Destination Controller      ✅
Create API                  ✅
Get All API                 ✅
Get By ID API               ✅
Update API                  ✅
Delete API                  ✅

And built the complete basic flow:

HTTP
 ↓
Controller
 ↓
Request DTO
 ↓
Service
 ↓
Entity
 ↓
Repository
 ↓
PostgreSQL

and back:

PostgreSQL
 ↓
Entity
 ↓
Service
 ↓
Response DTO
 ↓
Controller
 ↓
JSON

---------------------------------------------
---------------------------------------------



---------------------------------------------
