# 08. Minimum Viable Product (MVP) Definition & Test Scenario

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. MVP Concept & Hypothesis

The Nomadix MVP validates the core product hypothesis:

> **"A traveler can discover travel options, plan a trip, physically visit a destination, verify the visit, learn through a quiz, earn a badge and use that achievement to establish travel credibility within the community."**

```text
REGISTER → SEARCH → PLAN → TRAVEL → GPS CHECK-IN → QUIZ → BADGE → COMMUNITY
```

---

## 2. 19-Step MVP Success Scenario

The MVP is complete and successful if a tester can walk through this complete script:

| Step | Action | Expected Output | Module |
|---|---|---|---|
| **1** | Open app & select Register | Account registration form renders | Auth |
| **2** | Submit valid registration | User saved in PostgreSQL; JWT returned | Auth |
| **3** | Log into application | Navigates to Home dashboard | Auth |
| **4** | Search for flight (HAN → DAD) | Displays flight comparison cards | Booking Search |
| **5** | Search for hotel in Da Nang | Displays hotel comparison cards | Booking Search |
| **6** | Create trip "Da Nang Adventure" | Trip initialized in database | Itinerary Planner |
| **7** | Add Marble Mountains & Dragon Bridge | Activities scheduled across Day 1 & Day 2 | Itinerary Planner |
| **8** | View trip on Google Map | Route plotted with distance and travel time | Itinerary Planner |
| **9** | Save itinerary | Trip persisted to database | Itinerary Planner |
| **10** | Open Landmarks → "Dragon Bridge" | Landmark card & Check-in button display | Gamification |
| **11** | Trigger GPS Check-in | Requests device GPS location | Gamification |
| **12** | Location validated ($\le 100\text{m}$) | System unlocks check-in button | Gamification |
| **13** | Capture photo via camera | Camera opens, photo captured | Gamification |
| **14** | Upload photo | Photo uploaded to cloud storage | Gamification |
| **15** | Take Cultural Quiz | 3-question quiz presented | Gamification |
| **16** | Submit Quiz | Answers scored; XP awarded | Gamification |
| **17** | View Profile | XP updated; "Da Nang Explorer" badge unlocked | Auth / Gamification |
| **18** | Open Community Q&A → Da Nang | Community questions list loaded | Community |
| **19** | Submit an answer | Answer published with **"Da Nang Verified"** badge | Verified Experience |
