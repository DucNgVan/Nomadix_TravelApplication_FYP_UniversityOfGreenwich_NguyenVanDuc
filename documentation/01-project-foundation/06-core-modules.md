# 06. Core Functional Modules

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Modular Architecture Overview

Nomadix comprises six core functional modules:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        NOMADIX SYSTEM MODULES                          │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Module 1                 │ Authentication & Profile                    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 2                 │ Smart Booking Search                        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 3                 │ Itinerary Planner                           │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 4                 │ Cultural Gamification & Location            │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 5                 │ Community Q&A                               │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 6                 │ Verified Travel Experience                  │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Module Specifications

### Module 1 — Authentication & Profile
* **Purpose:** Identity management, JWT session authorization, and travel profile stats.
* **Functions:** Register, Login, Logout, Profile edit, XP tracker, Level progression, Badges unlocked, Travel history.

### Module 2 — Smart Booking Search
* **Purpose:** Multi-provider travel option search and comparison.
* **Flight Search:** Origin, destination, dates, passenger count, cabin class, pricing, carrier, stops, duration.
* **Hotel Search:** Destination, check-in/out, guests, room type, nightly rate, amenities, ratings.
* **Normalization:** Standardized internal JSON schema with Mock Provider fallback.

### Module 3 — Itinerary Planner
* **Purpose:** Multi-day travel schedule creation and route optimization.
* **Functions:** Create trip, set dates, add/remove destinations, drag-and-drop reordering, interactive Google Map route view, point-to-point distance and travel duration estimation, publish and clone itineraries.

### Module 4 — Cultural Gamification & Location
* **Purpose:** On-site exploration and cultural learning.
* **Functions:** Landmark catalog, GPS geofence validation ($\le 100\text{m}$), native camera photo capture, Cloudinary/S3 photo upload, cultural quizzes, XP awards, Badge unlocking.

### Module 5 — Community Q&A
* **Purpose:** Destination-focused peer-to-peer knowledge sharing.
* **Functions:** Post questions, submit answers, threaded comments, filter by Country/City/Topic, report inappropriate content.

### Module 6 — Verified Travel Experience
* **Purpose:** Connect gamification achievements to community credibility.
* **Verification Rule:** When a user with a City Badge answers questions in that city's forum, the system attaches a visible **"City Verified"** indicator badge to their profile/answer.
