
# M2 P2 BKD IMPL README

## COVERED ITINERARY API CREATION

---------------------------------------------------


Absolutely 😄. Let's start M2 → P2: Itinerary.

We'll follow our usual approach:

Concept → purpose → DB/entity design → code → explain each part → test → document it.

M2 P2 — Itinerary

The logical TripNest flow is:

User → Trip → Itinerary → Days → Activities

For example:

Trip: Goa Vacation
│
└── Itinerary
    ├── Day 1 — Arrival
    │   ├── Check-in
    │   └── Beach visit
    │
    ├── Day 2 — North Goa
    │   ├── Fort Aguada
    │   └── Baga Beach
    │
    └── Day 3 — Departure
        └── Check-out
First design decision

I recommend not making one huge Itinerary table containing everything.

We'll model it as:

Trip
  │
  └── Itinerary
        │
        ├── ItineraryDay
        │       │
        │       └── Activities   ← P3
        │
        └── ...

So for P2, our immediate responsibility is:

Itinerary entity
ItineraryDay entity
Relationships with Trip
DTOs
Repository
Service
Controller
Validation
Authorization
API testing

Then P3 Activity will attach activities to individual itinerary days.

Before writing code

Let's first inspect what we already have from P1 Trip Management, especially the Trip entity, because Itinerary must reference it correctly.

Send me your current Trip.java first (just that file), and we'll design P2 around your actual code rather than assuming anything.


*****************

Perfect. This is enough. 👍

I can see the P1 Trip structure clearly, and it gives us a clean base for P2.

One important design point before coding:

P2 relationship

We should make:

Trip 1 ───────── 1 Itinerary
                  │
                  ├── Day 1
                  ├── Day 2
                  └── Day 3

And later:

ItineraryDay
      │
      └── Activities   ← P3

For example, if:

Trip ID = 10
Title   = Goa Vacation
Start   = 2026-10-10
End     = 2026-10-12

then the itinerary can contain:

Itinerary
    trip_id = 10

ItineraryDay
    id = 1
    itinerary_id = ...
    dayNumber = 1
    date = 2026-10-10
    title = "Arrival & Beach"

ItineraryDay
    id = 2
    itinerary_id = ...
    dayNumber = 2
    date = 2026-10-11
    title = "North Goa"

ItineraryDay
    id = 3
    itinerary_id = ...
    dayNumber = 3
    date = 2026-10-12
    title = "Departure"
One thing I want to avoid

Don't put @OneToOne / @OneToMany into Trip.java yet.

We'll keep P1 stable and let Itinerary own the relationship:

@ManyToOne
@JoinColumn(name = "trip_id")
private Trip trip;

That means we don't need to modify your existing Trip.java right now.

P2 — Step 1: Create Itinerary entity

Create:

src/main/java/com/tripnest/backend/entity/Itinerary.java

Start with this:

package com.tripnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    private Trip trip;
}
Why @OneToOne?

Because one Trip has one main Itinerary.

Trip: Goa Vacation
        ↓
   One Itinerary

The unique = true on trip_id prevents accidentally creating multiple itineraries for the same trip.

Why LAZY?

We don't want JPA to automatically load the entire Trip whenever we fetch an itinerary.

Think:

"Give me the itinerary first; I'll load the trip only when I actually need it."

But we're NOT done with the entity yet

I deliberately want to build this incrementally, rather than throwing 8 files at you.

After you create Itinerary.java, tell me done.

Then we'll do:

P2 → Step 2: ItineraryDay.java

and I'll explain why we need a separate day entity and exactly how it connects to Itinerary.

----------------

Yep. P2 → Step 2: ItineraryDay.java.

This is the important part because we want day-wise planning, and later P3 Activity will attach activities to each day.

Create:

src/main/java/com/tripnest/backend/entity/ItineraryDay.java

package com.tripnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "itinerary_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private LocalDate date;

    private String title;

    private String description;
}
Understand the fields
Field	Purpose
id	Unique ID of the itinerary day
itinerary	Which itinerary this day belongs to
dayNumber	Day 1, Day 2, Day 3...
date	Actual calendar date
title	Short heading, e.g. "North Goa Exploration"
description	Optional details for the day

So the database relationship becomes:

trips
  │
  │ 1 : 1
  ▼
itineraries
  │
  │ 1 : many
  ▼
itinerary_days
Why @ManyToOne here?

Because:

One Itinerary → Many ItineraryDays

Example:

Itinerary #5
   │
   ├── Day #1
   ├── Day #2
   ├── Day #3
   └── Day #4

But each individual ItineraryDay belongs to one itinerary.

Why dayNumber AND date?

They represent two different things.

dayNumber = 2
date      = 2026-10-11

dayNumber tells the user where it falls in the trip.

date tells us when it actually happens.

This will also make the frontend display much nicer later.

One small validation/design point

We're currently allowing:

dayNumber = 7

even if the trip is only 3 days long.

We'll handle such business validation in the service layer, rather than putting complicated logic into the entity.

Next we'll create the repositories for Itinerary and ItineraryDay, then move into the service/API flow.

------------------


Great. P2 → Step 3: Repositories.

We need two repositories because we now have two entities.

1. ItineraryRepository.java

Create:

src/main/java/com/tripnest/backend/repository/ItineraryRepository.java
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    Optional<Itinerary> findByTripId(Long tripId);
}
Why findByTripId()?

Our API will frequently need:

"Give me the itinerary belonging to Trip 10."

Spring Data JPA understands:

findByTripId
     ↓
Itinerary.trip.id

So we don't need to write SQL.

2. ItineraryDayRepository.java

Create:

src/main/java/com/tripnest/backend/repository/ItineraryDayRepository.java
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {

    List<ItineraryDay> findByItineraryIdOrderByDayNumberAsc(Long itineraryId);
}
Why this method?

Suppose TripNest has:

Itinerary ID = 5

Day 3
Day 1
Day 2

We don't want the frontend receiving them randomly.

This:

findByItineraryIdOrderByDayNumberAsc()

means:

Find all days belonging to this itinerary and return them in Day 1 → Day 2 → Day 3 order.

That's exactly what our UI needs.

Current P2 structure
entity/
├── Trip.java                 ← P1
├── TripStatus.java           ← P1
├── Itinerary.java            ← P2 ✅
└── ItineraryDay.java         ← P2 ✅

repository/
├── TripRepository.java       ← P1
├── ItineraryRepository.java  ← P2 ✅
└── ItineraryDayRepository.java ← P2 ✅

Next → Step 4: DTOs.

We'll decide what the frontend should actually send/receive instead of exposing JPA entities directly.

--------------------------

Yep 👍 P2 → Step 4: DTOs

We need DTOs so the controller doesn't directly expose Itinerary / ItineraryDay JPA entities.

We'll keep this simple for now.

4.1 ItineraryResponse.java

Create:

dto/itinerary/ItineraryResponse.java

package com.tripnest.backend.dto.itinerary;

import lombok.Data;

@Data
public class ItineraryResponse {

    private Long id;

    private Long tripId;
}

This gives the frontend:

{
  "id": 1,
  "tripId": 10
}
4.2 ItineraryDayRequest.java

Create:

dto/itinerary/ItineraryDayRequest.java

package com.tripnest.backend.dto.itinerary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItineraryDayRequest {

    @NotNull(message = "Day number is required")
    @Positive(message = "Day number must be greater than zero")
    private Integer dayNumber;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Day title is required")
    private String title;

    private String description;
}
Why validation here?

If frontend sends:

{
    "dayNumber": 0,
    "date": null,
    "title": ""
}

Spring's @Valid can reject it before our service processes it.

4.3 ItineraryDayResponse.java

Create:

dto/itinerary/ItineraryDayResponse.java

package com.tripnest.backend.dto.itinerary;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ItineraryDayResponse {

    private Long id;

    private Long itineraryId;

    private Integer dayNumber;

    private LocalDate date;

    private String title;

    private String description;
}

So the frontend eventually receives something like:

{
    "id": 3,
    "itineraryId": 1,
    "dayNumber": 2,
    "date": "2026-10-11",
    "title": "North Goa Exploration",
    "description": "Visit beaches and forts"
}
Current P2 structure
dto/
└── itinerary/
    ├── ItineraryResponse.java
    ├── ItineraryDayRequest.java
    └── ItineraryDayResponse.java

Important: We are intentionally not creating an ItineraryRequest yet. An itinerary is created for an existing Trip, so the API can derive the trip from the URL:

POST /api/trips/{tripId}/itinerary

That keeps the API clean and prevents the client from sending a mismatched tripId.

Next → Step 5: ItineraryService — this is where we'll put the actual business logic and ownership check


---------------------------

Let's go. M2 → P2 → Step 5: ItineraryService.

This is where we'll put the main business logic instead of putting everything inside the controller like some of the current P1 code.

Create:

service/ItineraryService.java

package com.tripnest.backend.service;

import com.tripnest.backend.dto.itinerary.ItineraryDayRequest;
import com.tripnest.backend.dto.itinerary.ItineraryDayResponse;
import com.tripnest.backend.dto.itinerary.ItineraryResponse;
import com.tripnest.backend.entity.Itinerary;
import com.tripnest.backend.entity.ItineraryDay;
import com.tripnest.backend.entity.Trip;
import com.tripnest.backend.repository.ItineraryDayRepository;
import com.tripnest.backend.repository.ItineraryRepository;
import com.tripnest.backend.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryDayRepository itineraryDayRepository;
    private final TripRepository tripRepository;

    public ItineraryService(
            ItineraryRepository itineraryRepository,
            ItineraryDayRepository itineraryDayRepository,
            TripRepository tripRepository) {

        this.itineraryRepository = itineraryRepository;
        this.itineraryDayRepository = itineraryDayRepository;
        this.tripRepository = tripRepository;
    }

    public ItineraryResponse createItinerary(Long tripId, Long userId) {

        Trip trip = getOwnedTrip(tripId, userId);

        if (itineraryRepository.findByTripId(tripId).isPresent()) {
            throw new RuntimeException("Itinerary already exists for this trip");
        }

        Itinerary itinerary = Itinerary.builder()
                .trip(trip)
                .build();

        Itinerary savedItinerary = itineraryRepository.save(itinerary);

        return convertToItineraryResponse(savedItinerary);
    }

    public ItineraryResponse getItinerary(Long tripId, Long userId) {

        getOwnedTrip(tripId, userId);

        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        return convertToItineraryResponse(itinerary);
    }

    public ItineraryDayResponse addDay(
            Long tripId,
            ItineraryDayRequest request,
            Long userId) {

        getOwnedTrip(tripId, userId);

        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        ItineraryDay day = ItineraryDay.builder()
                .itinerary(itinerary)
                .dayNumber(request.getDayNumber())
                .date(request.getDate())
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        ItineraryDay savedDay = itineraryDayRepository.save(day);

        return convertToDayResponse(savedDay);
    }

    public List<ItineraryDayResponse> getDays(
            Long tripId,
            Long userId) {

        getOwnedTrip(tripId, userId);

        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        return itineraryDayRepository
                .findByItineraryIdOrderByDayNumberAsc(itinerary.getId())
                .stream()
                .map(this::convertToDayResponse)
                .toList();
    }

    private Trip getOwnedTrip(Long tripId, Long userId) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to access this trip");
        }

        return trip;
    }

    private ItineraryResponse convertToItineraryResponse(
            Itinerary itinerary) {

        ItineraryResponse response = new ItineraryResponse();

        response.setId(itinerary.getId());
        response.setTripId(itinerary.getTrip().getId());

        return response;
    }

    private ItineraryDayResponse convertToDayResponse(
            ItineraryDay day) {

        ItineraryDayResponse response = new ItineraryDayResponse();

        response.setId(day.getId());
        response.setItineraryId(day.getItinerary().getId());
        response.setDayNumber(day.getDayNumber());
        response.setDate(day.getDate());
        response.setTitle(day.getTitle());
        response.setDescription(day.getDescription());

        return response;
    }
}
What this service currently supports

We've already prepared the core P2 operations:

Method	Purpose
createItinerary()	Create one itinerary for a trip
getItinerary()	Get trip's itinerary
addDay()	Add a day to itinerary
getDays()	Get all days in order
getOwnedTrip()	Authorization check

The important security flow is:

JWT
 ↓
logged-in user
 ↓
userId
 ↓
Trip
 ↓
check Trip.owner.id == userId
 ↓
allow itinerary operation

So another logged-in user cannot access someone else's itinerary just by changing {tripId} in the URL.

One thing we'll improve later

Right now I'm deliberately keeping the service understandable. We can later replace generic:

throw new RuntimeException(...)

with proper exceptions such as ResourceNotFoundException and AccessDeniedException, matching the cleanup we discussed for the project.

Next → Step 6: ItineraryController, where we'll expose these operations as REST APIs.

--------------------



Yep 😄 P2 → Step 6: ItineraryController

Now we expose the service methods as REST APIs.

Create:

controller/ItineraryController.java

package com.tripnest.backend.controller;

import com.tripnest.backend.dto.itinerary.ItineraryDayRequest;
import com.tripnest.backend.dto.itinerary.ItineraryDayResponse;
import com.tripnest.backend.dto.itinerary.ItineraryResponse;
import com.tripnest.backend.entity.User;
import com.tripnest.backend.repository.UserRepository;
import com.tripnest.backend.service.ItineraryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final UserRepository userRepository;

    public ItineraryController(
            ItineraryService itineraryService,
            UserRepository userRepository) {

        this.itineraryService = itineraryService;
        this.userRepository = userRepository;
    }

    // Create itinerary for a trip
    @PostMapping
    public ResponseEntity<ItineraryResponse> createItinerary(
            @PathVariable Long tripId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        ItineraryResponse response =
                itineraryService.createItinerary(
                        tripId,
                        user.getId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get itinerary for a trip
    @GetMapping
    public ResponseEntity<ItineraryResponse> getItinerary(
            @PathVariable Long tripId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        ItineraryResponse response =
                itineraryService.getItinerary(
                        tripId,
                        user.getId()
                );

        return ResponseEntity.ok(response);
    }

    // Add a day to itinerary
    @PostMapping("/days")
    public ResponseEntity<ItineraryDayResponse> addDay(
            @PathVariable Long tripId,
            @Valid @RequestBody ItineraryDayRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        ItineraryDayResponse response =
                itineraryService.addDay(
                        tripId,
                        request,
                        user.getId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all itinerary days
    @GetMapping("/days")
    public ResponseEntity<List<ItineraryDayResponse>> getDays(
            @PathVariable Long tripId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        List<ItineraryDayResponse> responses =
                itineraryService.getDays(
                        tripId,
                        user.getId()
                );

        return ResponseEntity.ok(responses);
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}
Our P2 APIs so far
POST   /api/trips/{tripId}/itinerary
GET    /api/trips/{tripId}/itinerary

POST   /api/trips/{tripId}/itinerary/days
GET    /api/trips/{tripId}/itinerary/days

Example:

POST /api/trips/10/itinerary

creates the itinerary for Trip 10.

Then:

POST /api/trips/10/itinerary/days

with:

{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival in Goa",
    "description": "Check-in and visit nearby beach"
}

creates Day 1.

Current architecture
Controller
    ↓
ItineraryService
    ↓
Repository
    ↓
PostgreSQL

And importantly:

JWT → Authentication → User → Trip ownership check

So we're keeping the same security pattern as P1.

Next: Step 7 — run the application and test P2 in Postman.
We'll test create itinerary → get itinerary → add Day 1 → add Day 2 → get all days before adding update/delete operations.


------------

GET /api/trips/{someoneElsesTripId}/itinerary  
id=2
500 internal server err is coming

Yep — this is our code issue, not your Postman test. 👍

The reason is in ItineraryService.getOwnedTrip():

if (!trip.getOwner().getId().equals(userId)) {
    throw new RuntimeException("You are not authorized to access this trip");
}

A plain RuntimeException is currently being thrown. Since we haven't configured a global exception handler yet, Spring converts it into 500 Internal Server Error.

But semantically, this should be 403 Forbidden.

Quick fix for P2

Let's make the service throw Spring Security's AccessDeniedException.

In ItineraryService.java, add:

import org.springframework.security.access.AccessDeniedException;

Then change:

throw new RuntimeException("You are not authorized to access this trip");

to:

throw new AccessDeniedException(
        "You are not authorized to access this trip"
);

So the method becomes:

private Trip getOwnedTrip(Long tripId, Long userId) {

    Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

    if (!trip.getOwner().getId().equals(userId)) {
        throw new AccessDeniedException(
                "You are not authorized to access this trip"
        );
    }

    return trip;
}
Then test again

With your JWT:

GET /api/trips/2/itinerary

where Trip 2 belongs to another user.

Expected:

403 Forbidden
One important thing

We're actually discovering something useful here.

P1 currently has several places like:

throw new RuntimeException("Trip not found");

and manually returns:

ResponseEntity.status(HttpStatus.FORBIDDEN).build();

For P2, we've started moving authorization into the service layer, which is cleaner.

Later, during M2 cleanup, we should introduce:

ResourceNotFoundException
AccessDeniedException
GlobalExceptionHandler

so the whole backend consistently returns:

404 → resource not found
403 → authenticated but not authorized
400 → validation/bad request
401 → not authenticated

But don't stop P2 for that cleanup now.

Make the AccessDeniedException change, restart, and test the same request again.

still 500 err
{"timestamp":"2026-09-11T08:55:53.927Z","status":500,"error":"Internal Server Error","trace":"java.lang.RuntimeException: Itinerary not found\r\n\tat com.tripnest.backend.service.ItineraryService.lambda$getItinerary$0(ItineraryService.java:56)\r\n\tat java.base/java.util.Optional.orElseThrow(Optional.java:403)\r\n\tat com.tripnest.backend.service.ItineraryService.getItinerary(ItineraryService.java:56)\r\n\tat com.tripnest.backend.controller.ItineraryController.getItinerary(ItineraryController.java:62)\r\n\tat java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)\r\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:580)\r\n\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:252)\r\n\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:184)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:934)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:853)\r\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:86)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:866)\r\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1000)\r\n\tat org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:892)\r\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:622)\r\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:874)\r\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:710)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:132)\r\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:59)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\r\n\tat org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:108)\r\n\tat org.springframework.security.web.FilterChainProxy.lambda$doFilterInternal$2(FilterChainProxy.java:235)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:376)\r\n\tat org.springframework.security.web.access.intercept.AuthorizationFilter.doFilter(AuthorizationFilter.java:101)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:126)\r\n\tat org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:120)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:132)\r\n\tat org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:86)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:100)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:181)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter.doFilterInternal(BearerTokenAuthenticationFilter.java:207)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter.doFilterInternal(DefaultLogoutPageGeneratingFilter.java:60)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter.doFilter(DefaultLoginPageGeneratingFilter.java:246)\r\n\tat org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter.doFilter(DefaultLoginPageGeneratingFilter.java:232)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.ui.DefaultResourcesFilter.doFilter(DefaultResourcesFilter.java:73)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:245)\r\n\tat org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:239)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.oauth2.server.resource.web.OAuth2ProtectedResourceMetadataFilter.doFilterInternal(OAuth2ProtectedResourceMetadataFilter.java:98)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter.doFilterInternal(OAuth2AuthorizationRequestRedirectFilter.java:195)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:110)\r\n\tat org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:96)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:91)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)\r\n\tat org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:82)\r\n\tat org.springframework.security.web.context.SecurityContextHolderFilter.doFilter(SecurityContextHolderFilter.java:69)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:62)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.session.DisableEncodeUrlFilter.doFilterInternal(DisableEncodeUrlFilter.java:42)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:385)\r\n\tat org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:237)\r\n\tat org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:195)\r\n\tat org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)\r\n\tat org.springframework.web.filter.ServletRequestPathFilter.doFilter(ServletRequestPathFilter.java:52)\r\n\tat org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:113)\r\n\tat org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:74)\r\n\tat org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration$CompositeFilterChainProxy.doFilter(WebSecurityConfiguration.java:317)\r\n\tat org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:355)\r\n\tat org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:272)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\r\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\r\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\r\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:199)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\r\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:165)\r\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:77)\r\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:535)\r\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)\r\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:86)\r\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:71)\r\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:347)\r\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:406)\r\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:71)\r\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:1307)\r\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:2036)\r\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:74)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:949)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:483)\r\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:74)\r\n\tat java.base/java.lang.Thread.run(Thread.java:1583)\r\n","message":"Itinerary not found","path":"/api/trips/2/itinerary"}

Ah — now the stack trace tells us exactly what happened. 👍

Our ownership check is actually working. The request reached getItinerary(), but Trip 2 doesn't have an itinerary yet.

The important lines are:

ItineraryService.getItinerary(ItineraryService.java:56)
RuntimeException: Itinerary not found
path: /api/trips/2/itinerary

So this happened:

JWT user
   ↓
Trip #2 found
   ↓
Ownership check passed
   ↓
findByTripId(2)
   ↓
NO itinerary exists
   ↓
RuntimeException("Itinerary not found")
   ↓
500
So the test we intended was slightly wrong

We wanted to test "another user's trip", but Trip 2 apparently either:

belongs to the current user, and
has no itinerary,

or the trip ownership isn't what we thought.

The 403 test only works if Trip #2 belongs to another user AND our getOwnedTrip() reaches the ownership check.

Let's test properly

First, use a Trip that you own and create its itinerary:

POST /api/trips/{yourTripId}/itinerary

Then:

GET /api/trips/{yourTripId}/itinerary

should return 200.

After that, to test authorization, use a Trip ID that belongs to another user.

If it is another user's trip, our updated code should throw:

AccessDeniedException

and we should get 403.

But there's one more improvement we should make

Our current code has two different failure cases:

Trip doesn't exist       → 404
Trip exists but no itinerary → 404
Trip belongs to another user → 403

Right now the first two are being represented by RuntimeException, hence 500.

That's why you're seeing 500 even though the application isn't fundamentally broken.

Don't change anything else yet.

Tell me: does Trip ID 2 belong to your current logged-in user, or another registered user?

If you're not sure, we can check it directly from PostgreSQL.

Yes, we can move to the next step. 👍

The 500 is not blocking P2 development. It only means our error handling isn't finished yet.

For now, keep this in mind:

Trip exists + itinerary exists        → 200
Trip exists + no itinerary             → currently 500
Trip doesn't belong to user            → should become 403
Trip doesn't exist                     → currently 500

We'll clean these up later with a proper GlobalExceptionHandler during backend cleanup.

So let's continue

P2 → Step 8: Update + Delete Itinerary Days

We'll add:

PUT    /api/trips/{tripId}/itinerary/days/{dayId}
DELETE /api/trips/{tripId}/itinerary/days/{dayId}

And importantly, we'll verify that the dayId actually belongs to the requested trip before allowing modification/deletion.

No need to open PostgreSQL right now. Let's keep moving. 🚀

-----------------


Yep. P2 → Step 8: Update + Delete Itinerary Day.

We need two things:

PUT to edit a day
DELETE to remove a day
8.1 Add methods to ItineraryService

Add these methods below getDays():

public ItineraryDayResponse updateDay(
        Long tripId,
        Long dayId,
        ItineraryDayRequest request,
        Long userId) {

    getOwnedTrip(tripId, userId);

    Itinerary itinerary = itineraryRepository.findByTripId(tripId)
            .orElseThrow(() -> new RuntimeException("Itinerary not found"));

    ItineraryDay day = itineraryDayRepository.findById(dayId)
            .orElseThrow(() -> new RuntimeException("Itinerary day not found"));

    if (!day.getItinerary().getId().equals(itinerary.getId())) {
        throw new RuntimeException(
                "Itinerary day does not belong to this trip"
        );
    }

    day.setDayNumber(request.getDayNumber());
    day.setDate(request.getDate());
    day.setTitle(request.getTitle());
    day.setDescription(request.getDescription());

    ItineraryDay updatedDay = itineraryDayRepository.save(day);

    return convertToDayResponse(updatedDay);
}

And:

public void deleteDay(
        Long tripId,
        Long dayId,
        Long userId) {

    getOwnedTrip(tripId, userId);

    Itinerary itinerary = itineraryRepository.findByTripId(tripId)
            .orElseThrow(() -> new RuntimeException("Itinerary not found"));

    ItineraryDay day = itineraryDayRepository.findById(dayId)
            .orElseThrow(() -> new RuntimeException("Itinerary day not found"));

    if (!day.getItinerary().getId().equals(itinerary.getId())) {
        throw new RuntimeException(
                "Itinerary day does not belong to this trip"
        );
    }

    itineraryDayRepository.delete(day);
}
Why this check matters

Suppose:

Trip 1 → Itinerary 1 → Day 1

Trip 2 → Itinerary 2 → Day 5

A malicious request shouldn't be able to do:

DELETE /api/trips/1/itinerary/days/5

just because they know dayId = 5.

This check:

if (!day.getItinerary().getId().equals(itinerary.getId()))

ensures the day actually belongs to the itinerary of that trip.

8.2 Add endpoints to ItineraryController

Add below your existing getDays() method:

@PutMapping("/days/{dayId}")
public ResponseEntity<ItineraryDayResponse> updateDay(
        @PathVariable Long tripId,
        @PathVariable Long dayId,
        @Valid @RequestBody ItineraryDayRequest request,
        Authentication authentication) {

    User user = getAuthenticatedUser(authentication);

    ItineraryDayResponse response =
            itineraryService.updateDay(
                    tripId,
                    dayId,
                    request,
                    user.getId()
            );

    return ResponseEntity.ok(response);
}

Then:

@DeleteMapping("/days/{dayId}")
public ResponseEntity<Void> deleteDay(
        @PathVariable Long tripId,
        @PathVariable Long dayId,
        Authentication authentication) {

    User user = getAuthenticatedUser(authentication);

    itineraryService.deleteDay(
            tripId,
            dayId,
            user.getId()
    );

    return ResponseEntity.noContent().build();
}
Now P2 APIs are:
POST    /api/trips/{tripId}/itinerary
GET     /api/trips/{tripId}/itinerary

POST    /api/trips/{tripId}/itinerary/days
GET     /api/trips/{tripId}/itinerary/days

PUT     /api/trips/{tripId}/itinerary/days/{dayId}
DELETE  /api/trips/{tripId}/itinerary/days/{dayId}

Next, test these two new endpoints. After that we'll do the important date/day validation and then consider P2 complete before moving to P3 Activity.





-------------------------------


Yes 👍 Since you already have Trip 1 and Trip 2 + their itinerary days, we can test everything directly from Postman + PostgreSQL.

1. First check the data in PostgreSQL GUI

If using pgAdmin, open:

Databases → tripnest_db → Schemas → public → Tables

Check:

itineraries

You should see something like:

id	trip_id
1	1
2	2

Then open:

itinerary_days

You should see:

id	itinerary_id	day_number	date	title
1	1	1	...	...
2	1	2	...	...
3	2	1	...	...

This confirms the database relationships.

2. Check using PostgreSQL CLI

Run:

SELECT * FROM itineraries;

Then:

SELECT * 
FROM itinerary_days
ORDER BY itinerary_id, day_number;

For a clearer relationship check:

SELECT
    i.id AS itinerary_id,
    i.trip_id,
    d.id AS day_id,
    d.day_number,
    d.date,
    d.title,
    d.description
FROM itineraries i
JOIN itinerary_days d
    ON i.id = d.itinerary_id
ORDER BY i.trip_id, d.day_number;

You should get something like:

itinerary_id | trip_id | day_id | day_number | date       | title
-------------+---------+--------+------------+------------+---------
1            | 1       | 1      | 1          | 2026-...   | Day 1
1            | 1       | 2      | 2          | 2026-...   | Day 2
2            | 2       | 3      | 1          | 2026-...   | Day 1
2            | 2       | 4      | 2          | 2026-...   | Day 2

That is the DB-side verification.

3. Now test UPDATE in Postman

Suppose Trip 1 has:

dayId = 1

Call:

PUT http://localhost:8080/api/trips/1/itinerary/days/1

Headers:

Authorization: Bearer <your JWT>
Content-Type: application/json

Body:

{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival + Baga Beach",
    "description": "Check-in, lunch and evening at Baga Beach"
}

Expected:

200 OK

Then check PostgreSQL:

SELECT *
FROM itinerary_days
WHERE id = 1;

The title/description should now be updated.

4. Test DELETE

Take another day, say:

Trip 1
dayId = 2

Call:

DELETE http://localhost:8080/api/trips/1/itinerary/days/2

Expected:

204 No Content

Then PostgreSQL:

SELECT *
FROM itinerary_days
WHERE id = 2;

It should return 0 rows.

Or simply:

SELECT *
FROM itinerary_days
ORDER BY itinerary_id, day_number;

and verify Day 2 disappeared.

5. ⭐ Important security test

Since you have Trip 1 and Trip 2, this is a great test.

If Day 3 belongs to Trip 2, try:

PUT /api/trips/1/itinerary/days/3

using the JWT of the owner of Trip 1.

Our service should reject it because:

Trip 1
  ↓
Itinerary 1
  ↓
Day 3 ❌

Day 3 belongs to Itinerary 2, not Itinerary 1.

That's exactly why we added:

if (!day.getItinerary().getId().equals(itinerary.getId())) {
    throw new RuntimeException(
            "Itinerary day does not belong to this trip"
    );
}
So your testing checklist
✅ Trip 1 itinerary exists
✅ Trip 2 itinerary exists
✅ Days linked correctly in PostgreSQL

⬜ PUT Day 1 → verify 200 + DB updated
⬜ DELETE Day 2 → verify 204 + DB deleted
⬜ Cross-trip Day test → verify request rejected

I would do these in Postman first. No need to change PostgreSQL manually—the DB is only for verification.

If you paste the current rows from itineraries and itinerary_days, I can tell you exactly which dayId to use for each test.



----------------------

Excellent. P2 CRUD testing is working. 🎯

Your results confirm:

✅ Create itinerary
✅ Get itinerary
✅ Add itinerary days
✅ Get days in dayNumber order
✅ Update day
✅ Delete day
✅ PostgreSQL relationship is correct
✅ Delete actually removed the DB row
✅ Trip 1 and Trip 2 have separate itineraries/days

One thing your DB output reveals that we should address before calling P2 fully complete.

Current data has a logical problem

Trip 1 currently has:

Day 1 → 2026-10-10
Day 2 → 2026-10-11
Day 4 → 2026-10-14
Day 8 → 2026-10-12

So our API currently allows:

Day 8 → 2026-10-12

and:

Day 4 → 2026-10-14

even though they don't correspond to the trip's actual sequence/dates.

That's not a database bug. It's a missing business validation, and we already anticipated this earlier.

I recommend one more P2 step

Before moving to P3 Activity, let's add validation:

dayNumber must be within trip duration
date must fall within trip startDate and endDate

For example, if:

Trip:
startDate = 2026-10-10
endDate   = 2026-10-12

then:

Day 1 → 2026-10-10 ✅
Day 2 → 2026-10-11 ✅
Day 3 → 2026-10-12 ✅

Day 4 ❌
Day 8 ❌
2026-10-14 ❌

This is worth doing because it demonstrates real business logic, not just CRUD.

Also, we can decide whether dayNumber should automatically correspond to the date rather than letting the client send arbitrary combinations.

So I'd do one final P2 validation step, then P2 is complete → P3 Activity.



------------------------------


Yep 👍 next = finish the P2 Itinerary business validation, then we move to P3 Activity.

Step 1 — Add validation helper in ItineraryService

We’ll enforce:

dayNumber must be within trip duration.
date must be within trip dates.
dayNumber and date must match exactly.

Example:

Trip: Oct 10 → Oct 12

Day	Valid date
1	Oct 10
2	Oct 11
3	Oct 12
4	❌
Day 2 + Oct 12	❌

Add this method to ItineraryService:

private void validateDayAgainstTrip(Trip trip, ItineraryDayRequest request) {

    LocalDate startDate = trip.getStartDate();
    LocalDate endDate = trip.getEndDate();

    long tripDuration = ChronoUnit.DAYS.between(startDate, endDate) + 1;

    if (request.getDayNumber() > tripDuration) {
        throw new RuntimeException("Day number exceeds trip duration");
    }

    if (request.getDate().isBefore(startDate)
            || request.getDate().isAfter(endDate)) {
        throw new RuntimeException("Day date must be within trip dates");
    }

    LocalDate expectedDate =
            startDate.plusDays(request.getDayNumber() - 1);

    if (!request.getDate().equals(expectedDate)) {
        throw new RuntimeException(
                "Day number and date do not match the trip schedule"
        );
    }
}

Add this import:

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
Step 2 — Call it in addDay()

After:

Trip trip = getOwnedTrip(tripId, userId);

add:

validateDayAgainstTrip(trip, request);
Step 3 — Call it in updateDay()

After you get the owned trip:

Trip trip = getOwnedTrip(tripId, userId);

add:

validateDayAgainstTrip(trip, request);

That's it for this step.

Don't change the DTO or database yet.
We are keeping this simple and learning the business-logic layer properly.

After adding it, test one valid day + one invalid day in Postman. Then we'll close P2 and start P3 Activity.



-------------------------








----------------------------





---------------------------------------------
## postman apis testing


**
Use a Trip that belongs to your logged-in user.

POST 
http://localhost:8080/api/trips/1/itinerary

Headers:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

No body.

Expected:
201 Created

op-
{
    "id": 1,
    "tripId": 1
}


**
Get itinerary
GET http://localhost:8080/api/trips/1/itinerary

Headers:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

No body.

op>
{"id":1,"tripId":1}


**
- Add Day 1
POST 
http://localhost:8080/api/trips/1/itinerary/days

Body:
{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival in Goa",
    "description": "Check-in and relax at the beach"
}


Expected:
201 Created

Response:
{
    "id": 1,
    "itineraryId": 1,
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival in Goa",
    "description": "Check-in and relax at the beach"
}
or
{"date":"2026-10-10","dayNumber":1,"description":"Check-in and relax at the beach","id":1,"itineraryId":1,"title":"Arrival in Goa"}


**
-Add Day 2

Same endpoint:
POST 
http://localhost:8080/api/trips/1/itinerary/days
{
    "dayNumber": 2,
    "date": "2026-10-11",
    "title": "North Goa Exploration",
    "description": "Visit Fort Aguada and Baga Beach"
}

op>
{"date":"2026-10-11","dayNumber":2,"description":"Visit Fort Aguada and Baga Beach","id":2,"itineraryId":1,"title":"North Goa Exploration"}


**
Get all days
GET 
http://localhost:8080/api/trips/1/itinerary/days

Expected order:
Day 1
Day 2

op>
[{"date":"2026-10-10","dayNumber":1,"description":"Check-in and relax at the beach","id":1,"itineraryId":1,"title":"Arrival in Goa"},{"date":"2026-10-11","dayNumber":2,"description":"Visit Fort Aguada and Baga Beach","id":2,"itineraryId":1,"title":"North Goa Exploration"}]


**
PUT req
Now test UPDATE in Postman

Suppose Trip 1 has:
dayId = 1

Call:
PUT http://localhost:8080/api/trips/1/itinerary/days/1

Headers:
Authorization: Bearer <your JWT>
Content-Type: application/json

Body:
{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival + Baga Beach",
    "description": "Check-in, lunch and evening at Baga Beach"
}

Expected:
200 OK

Then check PostgreSQL:
SELECT *
FROM itinerary_days
WHERE id = 1;

The title/description should now be updated.

**
PUT
http://localhost:8080/api/trips/1/itinerary/days/2

Header-bearer token
token=val add

body-
{
    "dayNumber": 4,
    "date": "2026-10-14",
    "title": "Arrival + coca Beach",
    "description": "Check-in, lunch and evening at coca Beach"
}

op>
{"date":"2026-10-14","dayNumber":4,"description":"Check-in, lunch and evening at coca Beach","id":2,"itineraryId":1,"title":"Arrival + coca Beach"}


tripnest_db=# SELECT
tripnest_db-#     i.id AS itinerary_id,
tripnest_db-#     i.trip_id,
tripnest_db-#     d.id AS day_id,
tripnest_db-#     d.day_number,
tripnest_db-#     d.date,
tripnest_db-#     d.title,
tripnest_db-#     d.description
tripnest_db-# FROM itineraries i
tripnest_db-# JOIN itinerary_days d
tripnest_db-#     ON i.id = d.itinerary_id
tripnest_db-# ORDER BY i.trip_id, d.day_number;
 itinerary_id | trip_id | day_id | day_number |    date    |          title          |                description
--------------+---------+--------+------------+------------+-------------------------+-------------------------------------------
            1 |       1 |      1 |          1 | 2026-10-10 | Arrival in Goa          | Check-in and relax at the beach
            1 |       1 |      3 |          2 | 2026-10-11 | North Goa Exploration   | Visit Fort Aguada and Baga Beach
            1 |       1 |      2 |          4 | 2026-10-14 | Arrival + coca Beach    | Check-in, lunch and evening at coca Beach
            1 |       1 |      4 |          8 | 2026-10-12 | North beach Exploration | Visit  Beach N
            2 |       2 |      6 |          2 | 2026-10-13 | s beach Exploration     | Visit s Beach md
            2 |       2 |      5 |          8 | 2026-10-12 | North beach Exploration | Visit  Beach N
(6 rows)



**
Test DELETE

Take another day, say:
Trip 2
dayId = 5

Call:
DELETE 
http://localhost:8080/api/trips/2/itinerary/days/5

Expected:
204 No Content

Then PostgreSQL:
SELECT *
FROM itinerary_days
WHERE id = 5;

It should return 0 rows.

Or simply:

SELECT *
FROM itinerary_days
ORDER BY itinerary_id, day_number;

and verify Day 5 disappeared.


op>
tripnest_db=# SELECT *
tripnest_db-# FROM itinerary_days
tripnest_db-# WHERE id = 5;
 id | date | day_number | description | title | itinerary_id
----+------+------------+-------------+-------+--------------
(0 rows)


tripnest_db=# SELECT *
tripnest_db-# FROM itinerary_days
tripnest_db-# ORDER BY itinerary_id, day_number;
 id |    date    | day_number |                description                |          title          | itinerary_id
----+------------+------------+-------------------------------------------+-------------------------+--------------
  1 | 2026-10-10 |          1 | Check-in and relax at the beach           | Arrival in Goa          |            1
  3 | 2026-10-11 |          2 | Visit Fort Aguada and Baga Beach          | North Goa Exploration   |            1
  2 | 2026-10-14 |          4 | Check-in, lunch and evening at coca Beach | Arrival + coca Beach    |            1
  4 | 2026-10-12 |          8 | Visit  Beach N                            | North beach Exploration |            1
  6 | 2026-10-13 |          2 | Visit s Beach md                          | s beach Exploration     |            2
(5 rows)

*
SELECT
    i.id AS itinerary_id,
    i.trip_id,
    d.id AS day_id,
    d.day_number,
    d.date,
    d.title,
    d.description
FROM itineraries i
JOIN itinerary_days d
    ON i.id = d.itinerary_id
ORDER BY i.trip_id, d.day_number;

op>
 itinerary_id | trip_id | day_id | day_number |    date    |          title          |                description
--------------+---------+--------+------------+------------+-------------------------+-------------------------------------------
            1 |       1 |      1 |          1 | 2026-10-10 | Arrival in Goa          | Check-in and relax at the beach
            1 |       1 |      3 |          2 | 2026-10-11 | North Goa Exploration   | Visit Fort Aguada and Baga Beach
            1 |       1 |      2 |          4 | 2026-10-14 | Arrival + coca Beach    | Check-in, lunch and evening at coca Beach
            1 |       1 |      4 |          8 | 2026-10-12 | North beach Exploration | Visit  Beach N
            2 |       2 |      6 |          2 | 2026-10-13 | s beach Exploration     | Visit s Beach md
(5 rows)

op> 
rows decd from 6 to 5 
below row is deleted, that is for tripId=2, dayId= 5 - 
                     2 |       2 |      5 |          8 | 2026-10-12 | North beach Exploration | Visit  Beach N

---------------------------------------------------





















---------------------------------------------------
