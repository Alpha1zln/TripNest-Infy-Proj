
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








---------------------------------














---------------------------------





















---------------------------------

















---------------------------------






















---------------------------------

















---------------------------------

















---------------------------------
















---------------------------------













---------------------------------------------
## postman apis testing








---------------------------------------------
