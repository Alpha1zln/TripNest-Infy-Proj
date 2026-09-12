
---------------------------------------------------

# M2 P3 BKD IMPL README

## COVERED ACTIVITY API CREATION


-----------------------------

Activity API should be shorter than Itinerary 👍

Itinerary was a bigger piece because we built the parent + child structure:

Trip → Itinerary → ItineraryDay

For Activity, we'll attach activities to an existing itinerary day:

Trip → Itinerary → Day → Activities

P3 Activity — likely work
Part	Approx.
Activity entity	15–20 min
Repository	5 min
Request/Response DTOs	10–15 min
Service	20–30 min
Controller	15–20 min
CRUD testing	20–30 min
Small business validation	10–15 min
Total	~1.5–2 hrs

We'll support:

Add activity to a particular day
View activities for a day
Update activity
Delete activity
Ownership/security through the parent Trip
Basic validation

Something like:

POST   /api/trips/{tripId}/itinerary/days/{dayId}/activities
GET    /api/trips/{tripId}/itinerary/days/{dayId}/activities
PUT    /api/trips/{tripId}/itinerary/days/{dayId}/activities/{activityId}
DELETE /api/trips/{tripId}/itinerary/days/{dayId}/activities/{activityId}

So don't worry—P3 shouldn't become another P2-sized task.

And I would not add fancy fields initially. We can start with:

id
itineraryDay
title
description
startTime
endTime
location

Then later, if useful, add cost/category/booking info.

First finish the small P2 validation we just discussed. Then we'll build Activity one file at a time, same way we did Itinerary.


------------

Exactly. Since P2 is fully tested now, let's make P3 sensible enough that you don't have to redesign Activity later.

Activity fields

I'd recommend we include these now:

Field	Why
title	e.g. Fort Aguada Visit
description	Details of the activity
startTime	10:00 AM
endTime	12:00 PM
location	Fort Aguada, Goa
category	Helps classify the activity
bookingInfo	Optional booking/reference details
What is category?

Just a simple label:

SIGHTSEEING
FOOD
TRANSPORT
SHOPPING
ADVENTURE
RELAXATION
OTHER

Example:

Fort Aguada Visit → SIGHTSEEING
Dinner at Thalassa → FOOD
Flight to Goa → TRANSPORT

Very easy to implement now and useful later for filtering the itinerary.

What is bookingInfo?

Just optional text for something already booked.

Example:

"Flight: 6E-234, PNR ABC123"

or

"Hotel booking: Booking.com #123456"

We don't build a booking system. It's simply a place to remember booking/reference information.

What about cost?

I'd leave cost out of Activity.

Because you already have a separate Expense/Budget module planned. If we put cost into Activity now, later we'll have to decide:

Is activity cost the actual expense?
What if only one person paid?
What about shared expenses?
Currency? Refunds? Splitting?

That can unnecessarily complicate P3.

So:

Activity = what you're doing

Expense = how much money was spent

That's a clean separation.

Final P3 Activity design
Activity
 ├── id
 ├── itineraryDay
 ├── title
 ├── description
 ├── startTime
 ├── endTime
 ├── location
 ├── category
 └── bookingInfo

This is still a small CRUD module, but much more realistic for your resume/project.

And yes—let's implement these now rather than adding fields later. Next we'll create Activity.java, one file at a time.

------------------------------

P3 Activity — expected flow

Something roughly like:

Trip
  ↓
Itinerary
  ↓
Activity

An activity belongs to an itinerary/day, for example:

Trip: Goa Trip
   ↓
Day 1
   ↓
Activities
   ├── Visit Baga Beach
   ├── Lunch at ...
   └── Sunset at Fort Aguada

We'll decide the exact entity relationship, fields, DTOs, validation, authorization, repository, service, controller, APIs, and testing before coding each piece.

Let's start with P3 Step 1: Activity requirements/entity design.

------------------

category - i want based on category give differetn color in UI of activity portion,
means for hotel = light blue, sightseeing = light red, Food option = light orange, travelling = light green, and so on.
dont connect it with anyehere else in api, jst for color and easily noticeable.
.
. booking information  = just like note give space to enter travelling bkng dtl, no cnctn 
can we do this 2

Yes — both are good additions, and they fit P3 nicely without creating unnecessary backend complexity.

1. category ✅

We can add:

private String category;

Example values:

HOTEL
SIGHTSEEING
FOOD
TRAVEL
SHOPPING
ACTIVITY
OTHER

But importantly, we won't create relationships or separate APIs for categories.

It is simply metadata attached to an Activity:

Activity
 ├── title       → "Visit Baga Beach"
 ├── category    → "SIGHTSEEING"
 └── ...

Frontend can then do:

HOTEL       → light blue
SIGHTSEEING → light red
FOOD        → light orange
TRAVEL      → light green

So the backend's responsibility is just:

Store and return the category.

The UI decides the color.

That's actually a clean separation of responsibility.

2. Booking information / notes ✅

Also yes.

We can add something like:

private String bookingDetails;

Example:

Activity: Flight to Delhi
Category: TRAVEL

Booking Details:
IndiGo 6E-123
Departure: 7:30 PM
PNR: ABC123
Terminal 2

Or:

Activity: Hotel Check-in
Category: HOTEL

Booking Details:
Hotel ABC
Booking ID: XYZ123
Check-in: 2 PM

There will be:

NO Booking entity
NO Booking API
NO payment integration
NO relationship with another module

It's basically a free-text note field attached to Activity.

So our final Activity becomes
Activity
│
├── id
├── title
├── description
├── category
├── startTime
├── endTime
├── location
├── bookingDetails
└── itinerary

This is still very manageable for P3.

And I actually like these two additions because they make the TripNest UI feel much more like a real travel application without unnecessarily turning P3 into a huge feature.

Next → we'll create Activity.java with these fields and go line-by-line.

---------------------------------



keep thngs simple man... do only thngs tht can b done easily...cmplx ftrs once whole proj is done.
if ths us simple thn add.
checklist            → simple text for now
UI wil mk it checklist


Exactly, man. 👍 Simple first. We don't need to turn TripNest into a huge production system right now.

We'll add checklist as a simple text field.

Final P3 Activity fields
Activity
├── id
├── title
├── description       → normal text
├── category          → HOTEL / SIGHTSEEING / FOOD / TRAVEL / etc.
├── startTime
├── endTime
├── location
├── bookingDetails    → simple text
├── checklist         → simple text
└── itineraryDay      → relationship

Example:

Title: Visit Baga Beach

Description:
Spend the afternoon at Baga Beach.

Category:
SIGHTSEEING

Checklist:
Carry sunscreen
Carry sunglasses
Carry swimming clothes

Booking Details:
Water sports booking - 3 PM

The backend simply stores these strings.

The frontend can later turn the checklist into:

☐ Carry sunscreen
☐ Carry sunglasses
☐ Carry swimming clothes

No extra entity.
No extra table.
No checklist API.
No completion-status logic.

Simple → finish project → later enhance if needed. That's our rule. 💯

And I'll keep this principle in mind throughout P3: if a feature doesn't add meaningful value or can be postponed, we postpone it.




---------------------------------

Yes man. We checked the repo, and we're starting M2 → P3 Activity now.

P3 — File 1: Activity.java

Create it here:

code_Backend
└── src
    └── main
        └── java
            └── com.tripnest.backend
                └── entity
                    └── Activity.java

For the first file, let's keep it to the entity only. Don't create DTO/service/controller yet.

package com.tripnest.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private LocalTime startTime;

    private LocalTime endTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String bookingDetails;

    @Column(columnDefinition = "TEXT")
    private String checklist;

    @ManyToOne
    @JoinColumn(name = "itinerary_day_id", nullable = false)
    private ItineraryDay itineraryDay;
}
Before you paste it

Don't just copy-paste and move on. This file has several important concepts we need to understand, especially:

Why @Entity?
Why @Table(name = "activities")?
Why Long id?
Why GenerationType.IDENTITY?
Why LocalTime?
Why columnDefinition = "TEXT"?
Why @ManyToOne?
Why @JoinColumn(name = "itinerary_day_id")?
Why is nullable = false used here?
What exactly happens in PostgreSQL?

We'll go line by line, just like you wanted.

First, paste this into Activity.java but don't create anything else yet. Then we'll start from line 1.



---------------------------------


Cool 😎 Let's understand File 1 line-by-line before touching File 2.

Activity.java — Part 1
1. Package
package com.tripnest.backend.entity;

This tells Java:

"Activity belongs to the entity package."

Same pattern as your existing P2 entities like Trip, Itinerary, and ItineraryDay.

2. JPA imports
import jakarta.persistence.*;

These are needed for JPA annotations such as:

@Entity
@Table
@Id
@GeneratedValue
@Column
@ManyToOne
@JoinColumn

Layman:
These annotations tell Spring/Hibernate how our Java class should be connected to the database.

Interview:

JPA annotations define the object-relational mapping between the Java entity and the relational database.

3. Lombok imports
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

These reduce boilerplate code.

@Data gives us:

getters
setters
toString()
equals()
hashCode()

@NoArgsConstructor → creates:

new Activity();

@AllArgsConstructor → creates a constructor containing all fields.

You already use this pattern in your project.

4. LocalTime
import java.time.LocalTime;

We're storing only time, not date.

Example:

10:00
14:30
18:45

Why?

Because the ItineraryDay already represents the date/day.

So:

Day 2 — 15 October
    ↓
Activity
    startTime = 10:00
    endTime   = 12:00

No need to duplicate the date inside Activity.

5. Entity declaration
@Entity
public class Activity {

@Entity tells JPA/Hibernate:

"Treat this Java class as a database entity."

Therefore Hibernate will map it to a database table.

Conceptually:

Java                         PostgreSQL

Activity          →         activities
id                →         id
title             →         title
description       →         description
...

Without @Entity, Hibernate won't treat Activity as a persistent database entity.

6. Table name
@Table(name = "activities")

We're explicitly saying:

Store Activity records in the activities table.

So:

Activity.java
      ↓
activities table

We could let Hibernate derive the table name, but explicitly specifying it makes the database structure clear.

7. Lombok annotations
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

Together they save us from manually writing a lot of repetitive Java code.

Now the actual fields start
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

This is an important one, so we'll stop here.

Next we'll understand exactly:

What is @Id?
Why Long?
What does GenerationType.IDENTITY actually do in PostgreSQL?

Don't move ahead yet — this is worth understanding properly.


-----------------

So let's continue.

Activity.java — ID field
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@Id

This marks id as the Primary Key of the activities table.

Think:

Activity 1 → id = 1
Activity 2 → id = 2
Activity 3 → id = 3

Every Activity needs a unique identity.

@GeneratedValue

We don't want the user/frontend to manually decide:

id = 101
id = 102

Hibernate/database generates it for us.

GenerationType.IDENTITY

This tells Hibernate:

Let the database generate the ID, typically using its identity/auto-increment mechanism.

So when we create:

title = "Visit Baga Beach"

we don't provide an ID.

PostgreSQL generates one:

id = 1
Why Long?
private Long id;

Long gives us a large range of integer IDs.

For a project like TripNest, Long is a common and safe choice for database primary keys.

Interview wording 🎯

"@Id marks the primary key, while @GeneratedValue configures automatic ID generation. With GenerationType.IDENTITY, the database generates the primary-key value."

Next field
@Column(nullable = false)
private String title;

Here we have one new concept: nullable = false.

We'll understand why title should be mandatory and what this eventually means at the PostgreSQL level.

-----------

Activity.java — title
@Column(nullable = false)
private String title;
@Column

This annotation lets us customize how this Java field is mapped to the database column.

Here we're using:

nullable = false

Meaning:

title cannot be NULL in the database.

So this is valid:

title = "Visit Baga Beach"

But this isn't:

title = null

Why make it mandatory?

Because an Activity without a title doesn't make much sense.

Layman

Imagine creating a task in a to-do app.

You can have:

Description: "Carry sunscreen..."

But if there is no task name, you don't know what the task/activity actually is.

So:

title       → required ✅
description → optional
Interview wording

nullable = false adds a database-level constraint that prevents the column from storing NULL values.

Next:
@Column(columnDefinition = "TEXT")
private String description;

Here the new concept is columnDefinition = "TEXT". We'll cover only that next.


-----------------------

Yep, understood. 👍 Project mode = quick practical understanding → implement → move on. No interview definitions unless you ask.

Also, I won't repeat concepts we've already covered.

Activity.java — Remaining fields
1. Description
@Column(columnDefinition = "TEXT")
private String description;

TEXT allows a longer description than a typical short String/VARCHAR column.

Example:

"Spend the afternoon exploring Baga Beach, try water sports,
and visit nearby shops."

It's optional because we didn't set nullable = false.

2. Category
private String category;

Stores the activity type.

Examples:

HOTEL
SIGHTSEEING
FOOD
TRAVEL
SHOPPING
OTHER

No relationship or separate table.

Frontend will later use this value for colors.

3. Start and end time
private LocalTime startTime;

private LocalTime endTime;

Stores only the time.

Example:

10:00 → 12:00

Both are optional for now. An activity doesn't necessarily need an exact time.

4. Location
private String location;

Simple text.

Examples:

Baga Beach, Goa
Hotel ABC, Delhi
Indira Gandhi Airport

No Google Maps/location API connection at this stage.

5. Booking details
@Column(columnDefinition = "TEXT")
private String bookingDetails;

Simple free-text space for things like:

Flight: IndiGo 6E123
PNR: ABC123
Terminal: T2
Departure: 7:30 PM

Again, no booking system or separate entity.

6. Checklist
@Column(columnDefinition = "TEXT")
private String checklist;

Also simple text.

For example:

Carry passport
Carry sunscreen
Download tickets
Carry charger

The frontend can later display each line as a checkbox.

Backend doesn't track checked/unchecked status.

7. Connection with ItineraryDay
@ManyToOne
@JoinColumn(name = "itinerary_day_id", nullable = false)
private ItineraryDay itineraryDay;

This is the most important part of P3.

It means:

One ItineraryDay
       ↓
   many Activities

For example:

Day 1
 ├── Visit Beach
 ├── Lunch
 └── Sunset Point

Each Activity stores which ItineraryDay it belongs to.

The database will therefore have:

activities
--------------------------------
id
title
description
category
start_time
end_time
location
booking_details
checklist
itinerary_day_id   ← FK

@JoinColumn(name = "itinerary_day_id") tells JPA which column stores that connection.

And:

nullable = false

means an Activity must belong to an ItineraryDay.

So that's the whole entity. ✅

Our P3 design is intentionally simple:

Activity
 ├── basic information
 ├── category
 ├── timing
 ├── location
 ├── booking notes
 ├── checklist
 └── ItineraryDay relationship

Next file → ActivityRepository.java.


-----------------------------


Perfect 😎

P3 — File 2: ActivityRepository.java

Create it here:

code_Backend
└── src/main/java/com/tripnest/backend
    └── repository
        └── ActivityRepository.java

Use:

package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
What is happening here?

Very simple file.

public interface ActivityRepository
        extends JpaRepository<Activity, Long>

We're telling Spring Data JPA:

"Create a repository for the Activity entity, whose primary-key type is Long."

Because we extend JpaRepository, we automatically get common database operations such as:

save()
findById()
findAll()
deleteById()
existsById()

So we don't write SQL for basic CRUD.

For example, later our service can simply do:

activityRepository.save(activity);

and Spring/Hibernate handles the database operation.

One important thing

Notice we haven't added any custom method:

findBy...

yet.

That's intentional.

For P3's basic CRUD, the methods inherited from JpaRepository are enough. Don't add complexity until we actually need it.

File 2 done ✅

Next → ActivityRequestDTO.java.


------------------

Yep. P3 File 3 → ActivityRequestDTO.java.

Create it in:

code_Backend
└── src/main/java/com/tripnest/backend
    └── dto
        └── ActivityRequestDTO.java
package com.tripnest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ActivityRequestDTO {

    @NotBlank
    private String title;

    private String description;

    private String category;

    private LocalTime startTime;

    private LocalTime endTime;

    private String location;

    private String bookingDetails;

    private String checklist;

    private Long itineraryDayId;
}
Quick understanding

This DTO represents the data coming from the frontend when creating/updating an Activity.

Example request:

title           → Visit Baga Beach
description     → Spend afternoon at beach
category        → SIGHTSEEING
startTime       → 10:00
endTime         → 13:00
location        → Baga Beach
bookingDetails  → Water sports booking at 12 PM
checklist       → Carry sunscreen, sunglasses
itineraryDayId  → 5
One important difference from Activity

Notice we have:

private Long itineraryDayId;

instead of:

private ItineraryDay itineraryDay;

That's intentional.

The frontend sends:

"I want to create this Activity under ItineraryDay 5."

Then our service will use that ID to find the actual ItineraryDay entity and connect it to the Activity.

Also:

@NotBlank
private String title;

means title is required and cannot be empty/only spaces.

That's all you need to understand for this file right now.

Next → ActivityResponseDTO.java.

----------------

Got it 👍 — P3 DTOs will live under:

dto/
└── activity/
    └── ActivityRequestDTO.java

So the package is:

package com.tripnest.backend.dto.activity;

I'll follow this structure for the remaining Activity files.

P3 — File 4: ActivityResponseDTO.java

Create:

dto/
└── activity/
    ├── ActivityRequestDTO.java
    └── ActivityResponseDTO.java
package com.tripnest.backend.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {

    private Long id;

    private String title;

    private String description;

    private String category;

    private LocalTime startTime;

    private LocalTime endTime;

    private String location;

    private String bookingDetails;

    private String checklist;

    private Long itineraryDayId;
}
Quick idea

RequestDTO = frontend → backend

Create / Update Activity
        ↓
ActivityRequestDTO

ResponseDTO = backend → frontend

Database
   ↓
Activity
   ↓
ActivityResponseDTO
   ↓
Frontend

We're keeping the response DTO simple and returning itineraryDayId, not the entire ItineraryDay object.

That's it for this file. Next → ActivityService.java, where the actual P3 logic starts.

-------------------------------------------------


Yep. P3 File 5 → ActivityService.java.

Create:

service/
└── ActivityService.java

For now, just create the class structure. We'll add the CRUD methods immediately after.

package com.tripnest.backend.service;

import com.tripnest.backend.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
}
Quick idea

@Service tells Spring:

This class contains business logic.

@RequiredArgsConstructor automatically creates the constructor for:

private final ActivityRepository activityRepository;

So Spring can inject the repository for us.

We'll now start adding the Create Activity logic inside this service.

Next → first method: createActivity().


---------------------------------


Yep. Now P3 → Create Activity logic.

Add these imports and method inside ActivityService.

package com.tripnest.backend.service;

import com.tripnest.backend.dto.activity.ActivityRequestDTO;
import com.tripnest.backend.dto.activity.ActivityResponseDTO;
import com.tripnest.backend.entity.Activity;
import com.tripnest.backend.entity.ItineraryDay;
import com.tripnest.backend.repository.ActivityRepository;
import com.tripnest.backend.repository.ItineraryDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ItineraryDayRepository itineraryDayRepository;

    public ActivityResponseDTO createActivity(ActivityRequestDTO requestDTO) {

        ItineraryDay itineraryDay = itineraryDayRepository
                .findById(requestDTO.getItineraryDayId())
                .orElseThrow(() -> new RuntimeException("Itinerary day not found"));

        Activity activity = new Activity();

        activity.setTitle(requestDTO.getTitle());
        activity.setDescription(requestDTO.getDescription());
        activity.setCategory(requestDTO.getCategory());
        activity.setStartTime(requestDTO.getStartTime());
        activity.setEndTime(requestDTO.getEndTime());
        activity.setLocation(requestDTO.getLocation());
        activity.setBookingDetails(requestDTO.getBookingDetails());
        activity.setChecklist(requestDTO.getChecklist());
        activity.setItineraryDay(itineraryDay);

        Activity savedActivity = activityRepository.save(activity);

        return new ActivityResponseDTO(
                savedActivity.getId(),
                savedActivity.getTitle(),
                savedActivity.getDescription(),
                savedActivity.getCategory(),
                savedActivity.getStartTime(),
                savedActivity.getEndTime(),
                savedActivity.getLocation(),
                savedActivity.getBookingDetails(),
                savedActivity.getChecklist(),
                savedActivity.getItineraryDay().getId()
        );
    }
}
Quick flow

When frontend sends:

ActivityRequestDTO
       ↓
find ItineraryDay
       ↓
create Activity object
       ↓
copy request data → Activity
       ↓
save Activity
       ↓
ActivityResponseDTO
       ↓
frontend
One new thing here
itineraryDayRepository.findById(...)

We need the actual ItineraryDay entity before setting:

activity.setItineraryDay(itineraryDay);

We can't simply put the ID into that field because the Activity entity expects an ItineraryDay object.

Also, we're using your existing ItineraryDayRepository, so no new repository is needed for the parent day.

One small thing: later we'll replace the generic RuntimeException with your project's existing exception handling pattern, so don't worry about that line yet.

Next → ActivityController.java + POST API.

----------------------------



       ItineraryDay itineraryDay = itineraryDayRepository
                .findById(requestDTO.getItineraryDayId())
                .orElseThrow(() -> new RuntimeException("Itinerary day not found"));

explain this cd

Sure. This line is worth understanding because you'll see this pattern a lot in Spring/JPA.

ItineraryDay itineraryDay = itineraryDayRepository
        .findById(requestDTO.getItineraryDayId())
        .orElseThrow(() -> new RuntimeException("Itinerary day not found"));

Let's break it down from inside → outside.

1. Get the ID from the request
requestDTO.getItineraryDayId()

Suppose frontend sends:

itineraryDayId = 5

So this gives us:

5
2. Search database
itineraryDayRepository.findById(5)

This asks:

"Does ItineraryDay with ID 5 exist?"

The result is not directly an ItineraryDay.

It returns an Optional<ItineraryDay>.

Think of Optional as a box:

┌─────────────────────┐
│ ItineraryDay #5     │
└─────────────────────┘

if it exists.

If it doesn't:

┌─────────────────────┐
│       empty         │
└─────────────────────┘

This prevents us from blindly using an object that might not exist.

3. .orElseThrow(...)
.orElseThrow(() -> new RuntimeException("Itinerary day not found"));

Means:

"If the box contains an ItineraryDay, give it to me. If the box is empty, throw an exception."

So:

ID 5 exists:

findById(5)
    ↓
ItineraryDay #5
    ↓
itineraryDay variable

ID 999 doesn't exist:

findById(999)
    ↓
empty
    ↓
throw exception
    ↓
"Itinerary day not found"
4. Finally, this variable
ItineraryDay itineraryDay = ...

now contains the actual database entity.

That's important because later we do:

activity.setItineraryDay(itineraryDay);

We're saying:

"This new Activity belongs to this actual ItineraryDay."

Whole thing in plain English
Get itineraryDayId from frontend
        ↓
Search that ID in database
        ↓
Found?
 ┌──────┴──────┐
YES           NO
 ↓             ↓
get object    throw error
 ↓
attach object to Activity

That's the main idea. Don't worry about the deeper Optional theory right now—we'll encounter it repeatedly in the project.

.orElseThrow(() -> new RuntimeException("Itinerary day not found"));  
explain .. how ths works

Yes. This specific syntax can look weird initially:

.orElseThrow(() -> new RuntimeException("Itinerary day not found"));

Think of it as:

"If a value is present, give it to me. Otherwise, throw this error."

What is () ->?

This:

() -> new RuntimeException("Itinerary day not found")

is a lambda expression.

It means:

"When you need the error, create this RuntimeException."

It does not immediately create the exception.

Imagine Optional contains the result

After:

itineraryDayRepository.findById(5)

we have an Optional.

Case 1 — ID 5 exists
Optional
   ↓
[ ItineraryDay #5 ]

Then:

.orElseThrow(...)

says:

"There's already a value. Return it."

The lambda is not executed.

So:

ItineraryDay itineraryDay = ...

gets the actual ItineraryDay.

Case 2 — ID 5 doesn't exist
Optional
   ↓
[ empty ]

Now .orElseThrow(...) says:

"There's no value. I need to throw something."

So Java executes:

() -> new RuntimeException("Itinerary day not found")

which creates:

new RuntimeException("Itinerary day not found")

and throws it.

Why write () -> instead of directly writing new RuntimeException(...)?

Because orElseThrow() expects a function that can create the exception when needed.

So this:

.orElseThrow(() -> new RuntimeException("Itinerary day not found"));

basically means:

Is Optional empty?
       │
   ┌───┴───┐
  NO      YES
   │        │
return    execute
value     lambda
            ↓
      create exception
            ↓
          throw
One-line memory trick 🧠
.orElseThrow(() -> new RuntimeException("..."));

= "Give me the value, otherwise throw this."

You'll see this pattern many times in our TripNest services, so once this clicks, a lot of Spring code will become easier.


--------------------------------


Yep. Let's continue with the rest of createActivity().

The lookup part is understood. Now these lines simply copy the request data into our Activity entity:

Activity activity = new Activity();

activity.setTitle(requestDTO.getTitle());
activity.setDescription(requestDTO.getDescription());
activity.setCategory(requestDTO.getCategory());
activity.setStartTime(requestDTO.getStartTime());
activity.setEndTime(requestDTO.getEndTime());
activity.setLocation(requestDTO.getLocation());
activity.setBookingDetails(requestDTO.getBookingDetails());
activity.setChecklist(requestDTO.getChecklist());

activity.setItineraryDay(itineraryDay);
What is happening?

We receive:

ActivityRequestDTO
        ↓
      values

Then create an empty Activity:

Activity activity = new Activity();

and fill it:

requestDTO.title          → activity.title
requestDTO.description    → activity.description
requestDTO.category       → activity.category
requestDTO.startTime      → activity.startTime
...

The final one is slightly different:

activity.setItineraryDay(itineraryDay);

Here we're attaching the actual ItineraryDay entity we retrieved earlier.

So now:

Activity
   │
   └── itineraryDay → ItineraryDay #5
Save it
Activity savedActivity = activityRepository.save(activity);

This sends the Activity to JPA/Hibernate.

Hibernate then inserts it into PostgreSQL.

The returned savedActivity contains the generated ID and the persisted data.

For example:

Before save:
id = null

After save:
id = 12
Create the response
return new ActivityResponseDTO(
        savedActivity.getId(),
        savedActivity.getTitle(),
        savedActivity.getDescription(),
        savedActivity.getCategory(),
        savedActivity.getStartTime(),
        savedActivity.getEndTime(),
        savedActivity.getLocation(),
        savedActivity.getBookingDetails(),
        savedActivity.getChecklist(),
        savedActivity.getItineraryDay().getId()
);

We're converting:

Activity entity
      ↓
ActivityResponseDTO

and returning that DTO to the controller.

The frontend therefore receives clean response data rather than the JPA entity itself.

So Create flow is now:
POST request
     ↓
ActivityRequestDTO
     ↓
Find ItineraryDay
     ↓
Create Activity
     ↓
Copy values
     ↓
Attach ItineraryDay
     ↓
repository.save()
     ↓
ActivityResponseDTO

Create logic done ✅

Next → ActivityController.java and our first P3 API: POST /api/activities.




---------------------------------


Yep. P3 File 6 → ActivityController.java

Create:

controller/
└── ActivityController.java
package com.tripnest.backend.controller;

import com.tripnest.backend.dto.activity.ActivityRequestDTO;
import com.tripnest.backend.dto.activity.ActivityResponseDTO;
import com.tripnest.backend.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponseDTO> createActivity(
            @Valid @RequestBody ActivityRequestDTO requestDTO) {

        ActivityResponseDTO responseDTO =
                activityService.createActivity(requestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseDTO);
    }
}
Quick flow

Our first Activity API is now:

POST /api/activities

Request:

Frontend
   ↓
ActivityController
   ↓
ActivityService
   ↓
ActivityRepository
   ↓
PostgreSQL
3 new things here

@RequestMapping("/api/activities")

Sets the common URL for this controller.

So:

@PostMapping

becomes:

POST /api/activities

@RequestBody

Takes the JSON request body and converts it into:

ActivityRequestDTO

@Valid

Triggers the validation annotations in our DTO.

Currently:

@NotBlank
private String title;

So if title is missing/blank, the request will fail validation.

ResponseEntity

We're returning:

HTTP 201 Created
+
ActivityResponseDTO

because a new Activity was successfully created.

That's enough for the controller for now.

Next → we'll test our first P3 API in Postman before building Update/Get/Delete.



---------------------------------


Yep. Next step = test Create Activity API before writing more code. This is important so we catch any issue early.

P3 — Step 7: Test POST /api/activities
1. Start backend

Run your Spring Boot application and make sure it starts without errors.

2. Get an existing itineraryDayId

We need a real ItineraryDay ID from your database.

For example:

itineraryDayId = 1

Don't use 1 blindly — use an ID that actually exists in your PostgreSQL data.

3. Postman request
POST
http://localhost:8080/api/activities

Headers:

Authorization: Bearer <your JWT>
Content-Type: application/json

Body → raw → JSON:

{
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "13:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}
Expected response

Something like:

{
  "id": 1,
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00:00",
  "endTime": "13:00:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}

with HTTP status:

201 Created
If it works ✅

Check PostgreSQL and confirm the new row exists in:

activities

with the correct:

itinerary_day_id
If it fails ❌

Don't change the code randomly. Send me the exact error/response, and we'll debug it together.

Once Create Activity works, we'll move to GET all activities for an itinerary day.

Perfect 👍 Now we have valid itineraryDayIds.

For our Create Activity API test, let's use Day 1 of Manali Trip:

Trip: Manali Trip → trip_id = 1
Itinerary: itinerary_id = 1
Day: Day 1 → itinerary_day_id = 1
POST Activity
POST http://localhost:8080/api/activities

Authorization: Bearer <your JWT>

Body:

{
  "title": "Visit Solang Valley",
  "description": "Explore Solang Valley and enjoy the mountain views.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "13:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Cab booked for 9:30 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry water bottle",
  "itineraryDayId": 1
}
Expected result

You should get 201 Created, something like:

{
  "id": 1,
  "title": "Visit Solang Valley",
  "description": "Explore Solang Valley and enjoy the mountain views.",
  "category": "SIGHTSEEING",
  "startTime": "10:00:00",
  "endTime": "13:00:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Cab booked for 9:30 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry water bottle",
  "itineraryDayId": 1
}

After you run it, send me the response/error.

Then we'll do the next Activity API — probably GET activities by itinerary day — and continue CRUD one step at a time.

for user aln, tried with itnrydayid =1
500 err
{"timestamp":"2026-09-11T18:37:18.293Z","status":500,"error":"Internal Server Error","trace":"java.lang.Error: Unresolved compilation problem: \n\tThe constructor ActivityResponseDTO(Long, String, String, String, LocalTime, LocalTime, String, String, String, Long) is undefined\n\r\n\tat com.tripnest.backend.service.ActivityService.createActivity(ActivityService.java:40)\r\n\tat com.tripnest.backend.controller.ActivityController.createActivity(ActivityController.java:24)\r\n\tat java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)\r\n\tat java.base/java.lang.

Yep — this is our code issue, not your itineraryDayId = 1 issue. 👍

The error says:

The constructor ActivityResponseDTO(Long, String, String, String, LocalTime, LocalTime, String, String, String, Long) is undefined

What happened?

In ActivityService, we return:

return new ActivityResponseDTO(
        savedActivity.getId(),
        savedActivity.getTitle(),
        savedActivity.getDescription(),
        savedActivity.getCategory(),
        savedActivity.getStartTime(),
        savedActivity.getEndTime(),
        savedActivity.getLocation(),
        savedActivity.getBookingDetails(),
        savedActivity.getChecklist(),
        savedActivity.getItineraryDay().getId()
);

That's 10 values.

We already have:

@AllArgsConstructor

in ActivityResponseDTO, so Lombok should generate that 10-argument constructor.

But your running application is telling us that constructor doesn't exist in the compiled class.

First, check ActivityResponseDTO.java

It should be exactly:

package com.tripnest.backend.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private String bookingDetails;
    private String checklist;
    private Long itineraryDayId;
}

If this is exactly what you have, then don't change the DTO.

Then do a clean rebuild

Stop the Spring Boot application.

From code_Backend terminal:

mvn clean compile

If that succeeds:

mvn spring-boot:run

Or simply clean/rebuild from VS Code/STS/IntelliJ if that's how you're running it.

Then retry the same POST request with:

{
  "title": "Visit Solang Valley",
  "description": "Explore Solang Valley and enjoy the mountain views.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "13:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Cab booked for 9:30 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry water bottle",
  "itineraryDayId": 1
}
Important

Your database data is fine:

itinerary_day_id = 1 → Manali Trip → Day 1

So don't create another itinerary/day.

If mvn clean compile itself gives an error, send me that error. That's the useful next thing to inspect.

yeah ... it was empty ... aded cd now.
wrkng well api... 201... 
op>
{"id":1,"title":"Visit Solang Valley","description":"Explore Solang Valley and enjoy the mountain views.","category":"SIGHTSEEING","startTime":"10:00:00","endTime":"13:00:00","location":"Solang Valley, Manali","bookingDetails":"Cab booked for 9:30 AM","checklist":"Carry jacket\nCarry sunglasses\nCarry water bottle","itineraryDayId":1}

Yesss 😄 P3 Create Activity is working! 🎉

201 Created confirms the full flow worked:

Request DTO → Service → find ItineraryDay → Activity entity → PostgreSQL → Response DTO

And importantly:

Activity ID       = 1
Itinerary Day ID  = 1

So the relationship is correctly stored:

Manali Trip → Itinerary 1 → Day 1 → Activity 1 (Visit Solang Valley)

Also our simple fields are all working:

category → SIGHTSEEING
bookingDetails → stored
checklist → stored as plain text with multiple lines
startTime/endTime → LocalTime
P3 progress
Part	Status
Activity Entity	✅
Activity Repository	✅
Request DTO	✅
Response DTO	✅
Service – Create	✅
Controller – POST	✅
PostgreSQL save	✅
API testing	✅

Next: let's add 
GET Activity by ID / 
GET Activities for an Itinerary Day.
I'd do 
GET all activities for one itinerary day first, because that's what the UI will actually need for displaying a day's plan.




---------------------------------

Let's continue. P3 → GET all Activities for an ItineraryDay.

This is the useful API for the frontend: when the user opens Day 1, we fetch all its activities.

Step 1 — Add repository method

Update ActivityRepository.java:

package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByItineraryDayId(Long itineraryDayId);
}
What's new?

Only this:

List<Activity> findByItineraryDayId(Long itineraryDayId);

Spring Data JPA understands the method name:

find
  By
  ItineraryDay
  Id

and automatically creates the query to find Activities whose itinerary_day_id matches the supplied ID.

So:

findByItineraryDayId(1L)

means:

Give me all Activities belonging to ItineraryDay 1.

If Day 1 has:

Visit Solang Valley
Lunch
Visit Mall Road

the method returns all three.

Why List<Activity>?

Because one day can have many activities.

ItineraryDay 1
     ↓
 ┌───────────────┐
 │ Activity 1    │
 │ Activity 2    │
 │ Activity 3    │
 └───────────────┘

That's it for the repository.

Next → 
we'll add the service method that converts these Activities into ActivityResponseDTO objects.


-------------------------------------

```java
public List<ActivityResponseDTO> getActivitiesByItineraryDay(Long itineraryDayId) {

    List<Activity> activities =
            activityRepository.findByItineraryDayId(itineraryDayId);

    return activities.stream()
            .map(activity -> new ActivityResponseDTO(
                    activity.getId(),
                    activity.getTitle(),
                    activity.getDescription(),
                    activity.getCategory(),
                    activity.getStartTime(),
                    activity.getEndTime(),
                    activity.getLocation(),
                    activity.getBookingDetails(),
                    activity.getChecklist(),
                    activity.getItineraryDay().getId()
            ))
            .toList();
}
```

Also add this import at the top:

```java
import java.util.List;
```

### Quick idea

Repository gives us:

```text
List<Activity>
```

But we don't want to directly return entities.

So:

```text
Activity entities
      ↓
stream()
      ↓
convert each Activity
      ↓
ActivityResponseDTO
      ↓
List<ActivityResponseDTO>
```

This part:

```java
.map(activity -> new ActivityResponseDTO(...))
```

means:

> Take each Activity and convert it into an `ActivityResponseDTO`.

And:

```java
.toList();
```

collects all those DTOs back into a List.

So if Day 1 has 3 activities:

```text
Activity 1 ──→ ResponseDTO 1
Activity 2 ──→ ResponseDTO 2
Activity 3 ──→ ResponseDTO 3
                       ↓
              List<ResponseDTO>
```

That's all we need here.

**Next → add the GET endpoint in `ActivityController` and test it with `itineraryDayId = 1`.**


-------------------------------


 return activities.stream()

                .map(activity -> new ActivityResponseDTO(

explain ths

Sure. This is the core Java Stream part, so let's make it intuitive.

return activities.stream()
        .map(activity -> new ActivityResponseDTO(
            ...
        ))
        .toList();
1. activities.stream()

Suppose repository returned:

activities
    ↓
[Activity1, Activity2, Activity3]

.stream() lets us process these objects one by one.

Think:

Activity1 → process
Activity2 → process
Activity3 → process
2. .map(...)

map means:

Take each item and transform it into something else.

Here:

.map(activity -> new ActivityResponseDTO(...))

means:

Take each Activity and convert it into an ActivityResponseDTO.

So:

Activity1 ──→ ActivityResponseDTO1
Activity2 ──→ ActivityResponseDTO2
Activity3 ──→ ActivityResponseDTO3
3. activity ->

This is a lambda.

activity -> ...

means:

"For each Activity that comes into map, call it activity and do the following."

So this:

.map(activity -> new ActivityResponseDTO(...))

can be mentally read as:

For every activity:
    create an ActivityResponseDTO using that activity's data
4. Why new ActivityResponseDTO(...)?

Because we don't want to return the database Activity entity directly.

We're creating a DTO:

new ActivityResponseDTO(
    activity.getId(),
    activity.getTitle(),
    ...
)

So the complete transformation is:

List<Activity>
      ↓
   stream()
      ↓
   map()
      ↓
each Activity → ActivityResponseDTO
      ↓
   toList()
      ↓
List<ActivityResponseDTO>
Simple example

If:

Activity1 = Visit Solang Valley
Activity2 = Lunch

then:

.map(activity -> new ActivityResponseDTO(...))

does approximately:

Activity1 → new ActivityResponseDTO(...)
Activity2 → new ActivityResponseDTO(...)

And finally .toList() gives:

[ResponseDTO1, ResponseDTO2]

Memory trick:
stream() = process items
map() = transform each item
toList() = collect the results back into a list.




-------------------------------

Absolutely. 👍 From now on, important methods/code blocks will have short comments so when you revise later, you can quickly understand the purpose without rereading the whole explanation.

For example:

// Get all activities belonging to a specific itinerary day
public List<ActivityResponseDTO> getActivitiesByItineraryDay(Long itineraryDayId) {

And I won't clutter every line with comments.

P3 — Controller: GET Activities

Add this method to ActivityController:

// Get all activities planned for a specific itinerary day
@GetMapping("/day/{itineraryDayId}")
public ResponseEntity<List<ActivityResponseDTO>> getActivitiesByItineraryDay(
        @PathVariable Long itineraryDayId) {

    List<ActivityResponseDTO> activities =
            activityService.getActivitiesByItineraryDay(itineraryDayId);

    return ResponseEntity.ok(activities);
}

Also add:

import java.util.List;
New concept: @PathVariable

Our URL will be:

GET /api/activities/day/1

Here:

1

is the itineraryDayId.

Spring takes that 1 and puts it into:

Long itineraryDayId

because of:

@PathVariable Long itineraryDayId

So:

/api/activities/day/1
             ↓
itineraryDayId = 1
             ↓
service
             ↓
find activities for Day 1
Test it

Use:

GET http://localhost:8080/api/activities/day/1

with your JWT.

You should get your Activity:

[
  {
    "id": 1,
    "title": "Visit Solang Valley",
    "category": "SIGHTSEEING",
    "itineraryDayId": 1
  }
]

If that works, GET-by-day is complete ✅.

Then we'll move to GET Activity by ID.


-----------------------------------------



```java
// Get one activity using its ID
public ActivityResponseDTO getActivityById(Long activityId) {

    Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() ->
                    new RuntimeException("Activity not found"));

    return new ActivityResponseDTO(
            activity.getId(),
            activity.getTitle(),
            activity.getDescription(),
            activity.getCategory(),
            activity.getStartTime(),
            activity.getEndTime(),
            activity.getLocation(),
            activity.getBookingDetails(),
            activity.getChecklist(),
            activity.getItineraryDay().getId()
    );
}
```

### Quick idea

Same `findById()` + `orElseThrow()` pattern we already learned.

```text
activityId
    ↓
Repository
    ↓
Activity found?
 ┌──────┴──────┐
 YES           NO
  ↓             ↓
DTO          throw error
```

Then the Activity is converted into `ActivityResponseDTO`.

---

### 2. Controller

Add:

```java
// Get one activity by its ID
@GetMapping("/{activityId}")
public ResponseEntity<ActivityResponseDTO> getActivityById(
        @PathVariable Long activityId) {

    ActivityResponseDTO responseDTO =
            activityService.getActivityById(activityId);

    return ResponseEntity.ok(responseDTO);
}
```

### Test

```text
GET http://localhost:8080/api/activities/1
```

Expected:

```json
{
  "id": 1,
  "title": "Visit Solang Valley",
  "category": "SIGHTSEEING",
  "itineraryDayId": 1
}
```

So now we have:

```text
POST /api/activities              ✅ Create
GET  /api/activities/day/{id}     ✅ Get by day
GET  /api/activities/{id}         ✅ Get by ID
```

**Next → Update Activity (`PUT`).**


---------------------------------------------

Yep. P3 → Update Activity (PUT).

We'll keep it simple: the client sends the updated Activity data, and we replace the existing values.

1. Service

Add this to ActivityService:

// Update an existing activity
public ActivityResponseDTO updateActivity(
        Long activityId,
        ActivityRequestDTO requestDTO) {

    Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() ->
                    new RuntimeException("Activity not found"));

    ItineraryDay itineraryDay = itineraryDayRepository
            .findById(requestDTO.getItineraryDayId())
            .orElseThrow(() ->
                    new RuntimeException("Itinerary day not found"));

    activity.setTitle(requestDTO.getTitle());
    activity.setDescription(requestDTO.getDescription());
    activity.setCategory(requestDTO.getCategory());
    activity.setStartTime(requestDTO.getStartTime());
    activity.setEndTime(requestDTO.getEndTime());
    activity.setLocation(requestDTO.getLocation());
    activity.setBookingDetails(requestDTO.getBookingDetails());
    activity.setChecklist(requestDTO.getChecklist());
    activity.setItineraryDay(itineraryDay);

    Activity updatedActivity = activityRepository.save(activity);

    return new ActivityResponseDTO(
            updatedActivity.getId(),
            updatedActivity.getTitle(),
            updatedActivity.getDescription(),
            updatedActivity.getCategory(),
            updatedActivity.getStartTime(),
            updatedActivity.getEndTime(),
            updatedActivity.getLocation(),
            updatedActivity.getBookingDetails(),
            updatedActivity.getChecklist(),
            updatedActivity.getItineraryDay().getId()
    );
}
Quick flow
PUT request
    ↓
Find Activity
    ↓
Find new/updated ItineraryDay
    ↓
Update Activity fields
    ↓
save()
    ↓
Return ResponseDTO

Notice we again find the ItineraryDay entity. This allows the user to move an Activity from one day to another during an update.

2. Controller

Add:

// Update an existing activity
@PutMapping("/{activityId}")
public ResponseEntity<ActivityResponseDTO> updateActivity(
        @PathVariable Long activityId,
        @Valid @RequestBody ActivityRequestDTO requestDTO) {

    ActivityResponseDTO responseDTO =
            activityService.updateActivity(activityId, requestDTO);

    return ResponseEntity.ok(responseDTO);
}
Test

Use your existing Activity:

Activity ID = 1
PUT http://localhost:8080/api/activities/1

Body:

{
  "title": "Visit Solang Valley and Skiing",
  "description": "Explore Solang Valley and enjoy skiing.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "14:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Ski equipment booking at 11 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry gloves",
  "itineraryDayId": 1
}

Expected:

200 OK

with the updated Activity.

P3 CRUD progress
POST   /api/activities                  ✅
GET    /api/activities/day/{dayId}      ✅
GET    /api/activities/{activityId}     ✅
PUT    /api/activities/{activityId}     🟢
DELETE /api/activities/{activityId}     ⏳

Test the PUT first. After it works, we'll do the final CRUD operation: DELETE.

Test

Use your existing Activity:

Activity ID = 1
PUT http://localhost:8080/api/activities/1

Body:

{
  "title": "Visit Solang Valley and Skiing",
  "description": "Explore Solang Valley and enjoy skiing.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "14:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Ski equipment booking at 11 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry gloves",
  "itineraryDayId": 1
}

Expected:

200 OK

with the updated Activity.

P3 CRUD progress
POST   /api/activities                  ✅
GET    /api/activities/day/{dayId}      ✅
GET    /api/activities/{activityId}     ✅
PUT    /api/activities/{activityId}     🟢
DELETE /api/activities/{activityId}     ⏳

Test the PUT first. After it works, we'll do the final CRUD operation: DELETE.


-------------------------------

Yep 😄 let's finish P3 DELETE Activity.

1. Service

Add this to ActivityService:

// Delete an activity by its ID
public void deleteActivity(Long activityId) {

    Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() ->
                    new RuntimeException("Activity not found"));

    activityRepository.delete(activity);
}

Simple flow:

activityId
   ↓
Find Activity
   ↓
Not found → error
Found
   ↓
delete()
2. Controller

Add:

// Delete an existing activity
@DeleteMapping("/{activityId}")
public ResponseEntity<Void> deleteActivity(
        @PathVariable Long activityId) {

    activityService.deleteActivity(activityId);

    return ResponseEntity.noContent().build();
}

204 No Content means:

Delete succeeded, and there is no response body to return.

3. Test

Since your Activity 1 is our test activity:

DELETE http://localhost:8080/api/activities/1

Use your JWT.

Expected:

204 No Content

Then verify:

GET http://localhost:8080/api/activities/1

It should give:

500 / Activity not found

(or your current exception handling's equivalent).

Also check:

GET http://localhost:8080/api/activities/day/1

The deleted activity should no longer appear.

Run DELETE now and send me the result.


---------------------------------------------




---------------------------------------------
---------------------------------------------
## postman apis testing


**
POST
http://localhost:8080/api/activities

Headers:

Authorization: Bearer <your JWT>
Content-Type: application/json

Body → raw → JSON:

{
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "13:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}
Expected response

Something like:

{
  "id": 1,
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00:00",
  "endTime": "13:00:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}

with HTTP status:

201 Created


**
```
SELECT
    u.id AS user_id,
    u.email,
    t.id AS trip_id,
    t.title AS trip_title,
    i.id AS itinerary_id,
    iday.id AS itinerary_day_id,
    iday.day_number
FROM users u
JOIN trips t
    ON t.user_id = u.id
JOIN itineraries i
    ON i.trip_id = t.id
JOIN itinerary_days iday
    ON iday.itinerary_id = i.id
ORDER BY u.id, t.id, i.id, iday.day_number;
```

```
 user_id |      email      | trip_id |       trip_title        | itinerary_id | itinerary_day_id | day_number
---------+-----------------+---------+-------------------------+--------------+------------------+------------
       2 | aln@example.com |       1 | Manali Trip             |            1 |                1 |          1
       2 | aln@example.com |       1 | Manali Trip             |            1 |                3 |          2
       2 | aln@example.com |       1 | Manali Trip             |            1 |                2 |          4
       2 | aln@example.com |       1 | Manali Trip             |            1 |                4 |          8
       2 | aln@example.com |       2 | Manali Hillstation Trip |            2 |                6 |          2
       2 | aln@example.com |       3 | Andmn Trip              |            3 |                7 |          1
```

**
GET-Activity-by-day api

GET 
http://localhost:8080/api/activities/day/1

with your JWT token.

op>
[{"id":1,"title":"Visit Solang Valley","description":"Explore Solang Valley and enjoy the mountain views.","category":"SIGHTSEEING","startTime":"10:00:00","endTime":"13:00:00","location":"Solang Valley, Manali","bookingDetails":"Cab booked for 9:30 AM","checklist":"Carry jacket\nCarry sunglasses\nCarry water bottle","itineraryDayId":1}]




**
GET-Activity-by-Id api

GET 
http://localhost:8080/api/activities/1

with your JWT token.

op>
{"id":1,"title":"Visit Solang Valley","description":"Explore Solang Valley and enjoy the mountain views.","category":"SIGHTSEEING","startTime":"10:00:00","endTime":"13:00:00","location":"Solang Valley, Manali","bookingDetails":"Cab booked for 9:30 AM","checklist":"Carry jacket\nCarry sunglasses\nCarry water bottle","itineraryDayId":1}



**
UPDATE ACTIVITY API 

Test the PUT first. 
Use your existing Activity:
Activity ID = 1

PUT 
http://localhost:8080/api/activities/1

Body:
{
  "title": "Visit Solang Valley and Skiing",
  "description": "Explore Solang Valley and enjoy skiing.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "14:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Ski equipment booking at 11 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry gloves",
  "itineraryDayId": 1
}

Expected:
200 OK

op> same as abv data



**
select * from activities;
```
tripnest_db=# SELECT * from activities;
 id |        booking_details         |  category   |       checklist       |               description               | end_time |       location        | start_time |             title              | itinerary_day_id
----+--------------------------------+-------------+-----------------------+-----------------------------------------+----------+-----------------------+------------+--------------------------------+------------------
  1 | Ski equipment booking at 11 AM | SIGHTSEEING | Carry jacket         +| Explore Solang Valley and enjoy skiing. | 14:00:00 | Solang Valley, Manali | 10:00:00   | Visit Solang Valley and Skiing |                1
    |                                |             | Carry sunglasses     +|                                         |          |                       |            |                                |
    |                                |             | Carry gloves          |                                         |          |                       |            |                                |
  2 | bus booked for 10:30 AM        | SIGHTSEEING | Carry extra clother  +| Explore views.                          | 17:00:00 | rhtng, India          | 13:00:00   | Visit rhtng                    |                2
    |                                |             | Carry basic medicines+|                                         |          |                       |            |                                |
    |                                |             | Carry water bottle    |                                         |          |                       |            |                                |
  3 | bus booked for 10:30 AM        | SIGHTSEEING | Carry extra clother  +| Explore views.                          | 17:00:00 | jlkjljl, India        | 13:00:00   | Visit njljljl                  |                3
    |                                |             | Carry basic medicines+|                                         |          |                       |            |                                |
    |                                |             | Carry water bottle    |                                         |          |                       |            |                                |
(3 rows)
```


**
Del activity Test


Since Activity 1 is our test activity:

DELETE 
http://localhost:8080/api/activities/3

Use JWT.

Expected:
op> 204 No Content


*Then, verify:
GET 
http://localhost:8080/api/activities/3

It should give:
500 / Activity not found
(or your current exception handling's equivalent).


*Also check:
GET 
http://localhost:8080/api/activities/day/3
op> []

Status- 200 OK.
The deleted activity should no longer appear.


*select * from activities;
only 2 rows now, 1 deltd.



-------------------------------------------
-------------------------------------------