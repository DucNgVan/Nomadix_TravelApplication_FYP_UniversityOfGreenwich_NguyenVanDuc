# 02. System & Modular Use Case Diagrams

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** UML 2.5 Specification (Mermaid Syntax)  
**Phase:** Day 3 — Use Case Analysis  

---

## 1. SƠ ĐỒ USE CASE TỔNG THỂ HỆ THỐNG (SYSTEM OVERVIEW USE CASE DIAGRAM)

```mermaid
graph LR
    subgraph "Nomadix System Boundary"
        UC_Auth["UC-01: Authenticate & Manage Profile"]
        UC_Book["UC-03: Search & Compare Booking"]
        UC_Itin["UC-05: Plan Multi-day Itinerary"]
        UC_Gamify["UC-09: GPS Check-in & Cultural Quiz"]
        UC_Forum["UC-13: Community Q&A & City Verified"]
        UC_Admin["UC-16: System Administration & Moderation"]
    end

    Traveler((Traveler)) --> UC_Auth
    Traveler --> UC_Book
    Traveler --> UC_Itin
    Traveler --> UC_Gamify
    Traveler --> UC_Forum

    ExpTraveler((Experienced Traveler)) --> UC_Forum
    ExpTraveler --> UC_Itin

    Administrator((Administrator)) --> UC_Admin

    UC_Book -.-> ExtOTA["<<System>> External OTA APIs"]
    UC_Itin -.-> ExtMaps["<<System>> Google Maps Platform"]
    UC_Gamify -.-> ExtCloud["<<System>> Cloudinary Storage"]
```

---

## 2. SƠ ĐỒ PHÂN RÃ THEO TỪNG MODULE CHỨC NĂNG

### 🟢 MODULE 1: AUTHENTICATION & PROFILE USE CASE DIAGRAM

```mermaid
graph LR
    subgraph "Module 1: Authentication & Profile"
        UC_Reg("Register Account")
        UC_Login("Login with Credentials")
        UC_ViewProf("View Profile & XP/Level")
        UC_EditProf("Edit Profile Info")
        UC_UploadAvatar("Upload Avatar Photo")
        UC_Logout("Logout Session")

        UC_EditProf -.->|<<include>>| UC_UploadAvatar
    end

    Traveler((Traveler)) --> UC_Reg
    Traveler --> UC_Login
    Traveler --> UC_ViewProf
    Traveler --> UC_EditProf
    Traveler --> UC_Logout

    UC_UploadAvatar -.-> Cloudinary["<<System>> Cloudinary CDN"]
```

---

### 🔵 MODULE 2: SMART BOOKING SEARCH & AGGREGATOR USE CASE DIAGRAM

```mermaid
graph LR
    subgraph "Module 2: Smart Booking Search"
        UC_SearchFlight("Search Flights")
        UC_SearchHotel("Search Hotels")
        UC_FilterSort("Filter & Sort Results")
        UC_CheckCache("Check Redis Cache")
        UC_Normalize("Normalize Disparate Data")
        UC_DeepLink("Redirect to Booking Provider")

        UC_SearchFlight -.->|<<include>>| UC_CheckCache
        UC_SearchFlight -.->|<<include>>| UC_Normalize
        UC_SearchHotel -.->|<<include>>| UC_CheckCache
        UC_SearchHotel -.->|<<include>>| UC_Normalize
        UC_SearchFlight -.->|<<extend>>| UC_FilterSort
        UC_SearchFlight -.->|<<extend>>| UC_DeepLink
    end

    Traveler((Traveler)) --> UC_SearchFlight
    Traveler --> UC_SearchHotel
    Traveler --> UC_DeepLink

    UC_CheckCache -.-> Redis[("<<Service>> Redis Cache")]
    UC_Normalize -.-> OTA["<<System>> Amadeus / RapidAPI / Mock"]
```

---

### 🟡 MODULE 3: ITINERARY PLANNER & MAPS USE CASE DIAGRAM

```mermaid
graph LR
    subgraph "Module 3: Itinerary Planner & Maps"
        UC_CreateTrip("Create Multi-day Trip")
        UC_AddPlace("Add Activity to Day")
        UC_Reorder("Drag & Drop Reorder")
        UC_CalcDistance("Calculate Distance & Time")
        UC_RenderMap("Render Numbered Map & Polyline")
        UC_ShareTrip("Publish Itinerary Publicly")
        UC_CloneTrip("One-Click Clone Itinerary")

        UC_AddPlace -.->|<<include>>| UC_CalcDistance
        UC_Reorder -.->|<<include>>| UC_CalcDistance
        UC_CreateTrip -.->|<<include>>| UC_RenderMap
    end

    Traveler((Traveler)) --> UC_CreateTrip
    Traveler --> UC_AddPlace
    Traveler --> UC_Reorder
    Traveler --> UC_CloneTrip

    ExpTraveler((Experienced Traveler)) --> UC_ShareTrip

    UC_CalcDistance -.-> MapsAPI["<<System>> Google Distance Matrix"]
    UC_RenderMap -.-> MapsSDK["<<System>> Google Maps SDK"]
```

---

### 🟣 MODULE 4: GAMIFICATION, GEOFENCE & BADGES USE CASE DIAGRAM (USP)

```mermaid
graph LR
    subgraph "Module 4: Cultural Gamification Engine"
        UC_BrowseLandmark("Browse Cultural Landmarks")
        UC_Checkin("Perform Location Check-in")
        UC_ValidateGPS("Validate GPS Geofence (<=100m)")
        UC_WatermarkCam("Capture Photo with Watermark")
        UC_TakeQuiz("Take Cultural Quiz")
        UC_AwardXP("Award XP & Progress Level")
        UC_UnlockBadge("Unlock City Badge")

        UC_Checkin -.->|<<include>>| UC_ValidateGPS
        UC_Checkin -.->|<<include>>| UC_WatermarkCam
        UC_Checkin -.->|<<include>>| UC_TakeQuiz
        UC_TakeQuiz -.->|<<include>>| UC_AwardXP
        UC_AwardXP -.->|<<extend>>| UC_UnlockBadge
    end

    Traveler((Traveler)) --> UC_BrowseLandmark
    Traveler --> UC_Checkin

    UC_ValidateGPS -.-> GPS["<<Device>> Location GPS"]
    UC_WatermarkCam -.-> Cloudinary["<<System>> Cloudinary Storage"]
```

---

### 🟡 MODULE 5: COMMUNITY Q&A & VERIFIED TRUST USE CASE DIAGRAM

```mermaid
graph LR
    subgraph "Module 5: Community Q&A Forum"
        UC_BrowseForum("Browse City Discussions")
        UC_AskQuestion("Post Travel Question")
        UC_PostAnswer("Submit Answer to Question")
        UC_AttachVerified("Attach 'City Verified' Trust Badge")
        UC_UpvoteComment("Upvote & Comment on Answer")
        UC_ReportPost("Report Abusive Content")

        UC_PostAnswer -.->|<<extend>>| UC_AttachVerified
    end

    Traveler((Traveler)) --> UC_BrowseForum
    Traveler --> UC_AskQuestion
    Traveler --> UC_PostAnswer
    Traveler --> UC_UpvoteComment
    Traveler --> UC_ReportPost

    ExpTraveler((Experienced Traveler)) --> UC_PostAnswer

    UC_AttachVerified -.-> PostgresDB[("<<Database>> PostgreSQL Badges")]
```

---

### 🔴 MODULE 6: ADMINISTRATION & MODERATION USE CASE DIAGRAM

```mermaid
graph LR
    subgraph "Module 6: Administrative Control"
        UC_AdminLandmark("Manage Landmarks & Coordinates")
        UC_AdminQuiz("Manage Quiz Questions & Answers")
        UC_AdminMod("Moderate Reported Content")
        UC_AdminMock("Toggle Mock Travel Provider")
        UC_AdminHealth("Monitor Database & API Health")
    end

    Administrator((Administrator)) --> UC_AdminLandmark
    Administrator --> UC_AdminQuiz
    Administrator --> UC_AdminMod
    Administrator --> UC_AdminMock
    Administrator --> UC_AdminHealth

    UC_AdminHealth -.-> SystemNodes["<<Internal>> Postgres, Mongo, Redis"]
```
