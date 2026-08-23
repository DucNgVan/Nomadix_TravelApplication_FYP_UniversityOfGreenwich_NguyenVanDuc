# 07. Project Scope & Boundary Definition

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Scope Classification

```text
┌─────────────────────────────────────────────────────────────┐
│                       PROJECT SCOPE                         │
├──────────────────────────────┬──────────────────────────────┤
│ 1. Must Have (Core MVP)      │ Required for core FYP        │
├──────────────────────────────┼──────────────────────────────┤
│ 2. Should Have               │ Implemented if time permits  │
├──────────────────────────────┼──────────────────────────────┤
│ 3. Future Development        │ Documented for roadmap       │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Feature Prioritization Breakdown

### 2.1 Must-Have Features (Core FYP)
* **Authentication:** User registration, login, JWT token auth, profile management.
* **Booking Search:** Flight search, hotel search, multi-provider results, filtering, data normalization, mock provider fallback.
* **Itinerary:** Create trip, add/remove destinations, reorder activities, multi-day planning, Google Map display, distance & time calculation, publish & clone trips.
* **Gamification:** Landmarks catalog, GPS geofence validation, check-in, camera photo upload, cultural quizzes, XP & badge engine.
* **Community:** Ask questions, post answers, filter by city categories, verified city badge indicators.

### 2.2 Should-Have Features (Post-Core Enhancements)
* **Redis Caching:** API response caching with measured latency improvements for the thesis.
* **Advanced Filtering:** Complex multi-parameter search filters.
* **Travel History:** Detailed visual trip logs.
* **Image Optimization:** Automated image compression on upload.
* **Community Moderation:** Flag and report inappropriate content.
* **Badge Levels:** Tiered progression for badges (Bronze, Silver, Gold).

### 2.3 Future Development (Deferred Features)
* AI Travel Assistant (LLM conversational planner).
* Advanced GPS Anti-cheat (mock-location sensor detection).
* Real-time traveler-to-traveler chat.
* Social following feeds.
* ML personalized recommendation engine.

---

## 3. Core Design Principle

> **"Every feature must contribute to the travel lifecycle."**

```text
BOOKING → PLANNING → TRAVEL → EXPERIENCE → GAMIFICATION → COMMUNITY
```

---

## 4. Final Scope Map

```text
                         NOMADIX
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       DISCOVER            PLAN             EXPERIENCE
          │                 │                 │
          ▼                 ▼                 ▼
       Booking          Itinerary           GPS
       Search             Map              Check-in
       Compare          Distance            Camera
       Filter           Duration            Quiz
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                         GAMIFY
                            │
                     ┌──────┴──────┐
                     ▼             ▼
                    XP           Badge
                     │             │
                     └──────┬──────┘
                            ▼
                       COMMUNITY
                            │
                     ┌──────┴──────┐
                     ▼             ▼
                  Question       Answer
                                    │
                                    ▼
                             City Verification
```
