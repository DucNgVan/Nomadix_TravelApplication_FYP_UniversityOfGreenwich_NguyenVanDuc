# 03. Data Flow & Sequence Diagrams

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** UML 2.5 Sequence Modeling (Mermaid Syntax)  
**Phase:** Day 4 — System Architecture Design  

---

## 1. TỔNG QUAN CÁC SƠ ĐỒ TUẦN TỰ (OVERVIEW)

Tài liệu này mô hình hóa 4 luồng dữ liệu nghiệp vụ quan trọng nhất của hệ thống Nomadix bằng **Sequence Diagrams**, làm cơ sở cho quá trình lập trình ở Month 2, 3 và 4:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE SYSTEM SEQUENCE FLOWS                      │
├────────┬──────────────────────────────────────┬────────────────────────┤
│ Flow 1 │ Smart Booking Search & Redis Cache   │ Module 2: Booking      │
│ Flow 2 │ Itinerary Drag-and-Drop & Maps Route │ Module 3: Itinerary    │
│ Flow 3 │ GPS Geofence Check-in & Quiz Loop    │ Module 4: Gamification │
│ Flow 4 │ Cross-DB "City Verified" Attachment  │ Module 5: Community    │
└────────┴──────────────────────────────────────┴────────────────────────┘
```

---

## 2. CHI TIẾT CÁC SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)

---

### 🔹 FLOW 1: BOOKING SEARCH WITH REDIS CACHING & ADAPTER NORMALIZATION

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler (Mobile)
    participant Client as React Native Client
    participant Gateway as Express API Router
    participant Service as BookingAggregatorService
    participant Cache as Redis In-Memory Cache
    participant Adapter as Provider Adapters Engine
    participant Amadeus as Amadeus / RapidAPI
    participant Normalizer as Normalizer Engine

    User->>Client: Nhập chặng bay (HAN -> DAD, 15/11/2026)
    Client->>Gateway: GET /api/v1/flights/search?origin=HAN&dest=DAD...
    Gateway->>Service: searchFlights(params)
    Service->>Cache: GET nomadix:flight:HAN_DAD_2026-11-15...
    
    alt Cache HIT (Dữ liệu có sẵn trong RAM)
        Cache-->>Service: Trả về Cached JSON Results
        Service-->>Gateway: Return Normalized Flight Array (Header: HIT, <50ms)
        Gateway-->>Client: HTTP 200 OK (Instant Display)
    else Cache MISS (Chưa có trong Cache)
        Cache-->>Service: Return null (Key not found)
        Service->>Adapter: queryAllProvidersParallel(params)
        par Gọi song song Provider A & B
            Adapter->>Amadeus: GET /v2/shopping/flight-offers
            Amadeus-->>Adapter: Return Raw Amadeus JSON
        and
            Adapter->>Amadeus: GET RapidAPI Travel Flights
            Amadeus-->>Adapter: Return Raw RapidAPI JSON
        end
        Adapter->>Normalizer: normalizeToUnifiedModel(rawResults)
        Normalizer-->>Service: Return UnifiedFlight[] (Deduplicated & Sorted)
        Service->>Cache: SETEX key 1800 JSON.stringify(results)
        Service-->>Gateway: Return Results (Header: MISS, ~1200ms)
        Gateway-->>Client: HTTP 200 OK + Unified Results List
    end
    Client->>User: Hiển thị danh sách vé máy bay đã sắp xếp giá rẻ nhất
```

---

### 🔹 FLOW 2: ITINERARY DRAG-AND-DROP & ROUTE RE-CALCULATION

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler (Mobile)
    participant Client as React Native Client
    participant Gateway as Express API Gateway
    participant ItinService as ItineraryService
    participant MapService as Google Maps Service
    participant Mongo as MongoDB Atlas (itineraries)

    User->>Client: Kéo thẻ "Bảo tàng Chăm" lên trước "Cầu Rồng" (Drag & Drop)
    Client->>Client: Cập nhật UI tức thì (Optimistic UI Update)
    Client->>Gateway: PUT /api/v1/itineraries/:id (New Day Items Order)
    Gateway->>ItinService: updateDaySequence(itineraryId, dayIndex, reorderedItems)
    
    ItinService->>MapService: calculateRouteMetrics(coordinatesList)
    alt Online Google Maps API
        MapService->>MapService: Call Google Distance Matrix API
        MapService-->>ItinService: Return { distanceKm: 1.2, durationMins: 5 }
    else Offline Fallback (Quota Limit / Network Drop)
        MapService->>MapService: Calculate Haversine Straight-line Distance
        MapService-->>ItinService: Return { distanceKm: 1.1, durationMins: 4 }
    end

    ItinService->>Mongo: findOneAndUpdate({ _id: itineraryId }, { days: updatedDays })
    Mongo-->>ItinService: Acknowledge Write Success
    ItinService-->>Gateway: Return Updated Itinerary Document
    Gateway-->>Client: HTTP 200 OK + Updated Route Data
    Client->>Client: Vẽ lại Polyline bản đồ & Cập nhật nhãn khoảng cách
    Client->>User: Hiển thị thứ tự mới và lộ trình bản đồ chính xác
```

---

### 🔹 FLOW 3: GPS GEOFENCE VALIDATION, CAMERA WATERMARK & QUIZ PROGRESSION

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler (At Landmark)
    participant Mobile as React Native App
    participant GPS as Device GPS Hardware
    participant Camera as Device In-App Camera
    participant Gateway as Express API Gateway
    participant GeoEngine as Geofence & Haversine Engine
    participant Cloudinary as Cloudinary CDN
    participant QuizService as Quiz & Badge Evaluator
    participant Postgres as PostgreSQL Database

    User->>Mobile: Bấm nút "Bắt đầu Check-in" tại Cầu Rồng
    Mobile->>GPS: getCurrentPosition({ enableHighAccuracy: true })
    GPS-->>Mobile: Return (16.0612° N, 108.2275° E)
    Mobile->>Gateway: POST /api/v1/checkins/validate (landmarkId, lat, lng)
    Gateway->>GeoEngine: validateProximity(userLat, userLng, landmarkId)
    GeoEngine->>Postgres: SELECT latitude, longitude, radius FROM landmarks WHERE id = ...
    Postgres-->>GeoEngine: Landmark Coords (16.0610° N, 108.2272° E, Radius: 100m)
    GeoEngine->>GeoEngine: Haversine Distance = 42m <= 100m
    GeoEngine-->>Gateway: Return { isValid: true, distanceMeters: 42 }
    Gateway-->>Mobile: HTTP 200 OK (Geofence Unlocked)

    Mobile->>Camera: Mở In-App Camera kèm Watermark Overlay
    User->>Camera: Chụp ảnh bằng chứng ➔ Bấm "Xác nhận gửi"
    Camera->>Cloudinary: Upload Photo (Auto-compress WebP)
    Cloudinary-->>Mobile: Return Secure HTTPS Image URL

    Mobile->>Gateway: POST /api/v1/checkins (landmarkId, photoUrl, lat, lng)
    Gateway->>Postgres: INSERT INTO checkins (user_id, landmark_id, photo_url...)
    Gateway-->>Mobile: HTTP 201 Created (Checkin Recorded)

    Mobile->>Gateway: GET /api/v1/quizzes/:landmarkId
    Gateway->>Postgres: SELECT questions (RANDOM LIMIT 3) FROM quiz_questions
    Postgres-->>Gateway: Return 3 Questions (Answers hidden)
    Gateway-->>Mobile: Render 3-question Cultural Quiz
    User->>Mobile: Chọn đáp án A, B, C ➔ Bấm "Nộp bài"

    Mobile->>Gateway: POST /api/v1/quizzes/submit (answers)
    Gateway->>QuizService: evaluateQuizAndAwardXP(userId, landmarkId, answers)
    QuizService->>Postgres: Score = 3/3 (Passed) ➔ UPDATE users SET xp = xp + 150
    QuizService->>QuizService: evaluateCityBadgeEligibility(userId, "Da Nang")
    QuizService->>Postgres: Check-ins >= 3 & Quiz Passed ➔ INSERT INTO user_badges
    Postgres-->>QuizService: Badge "Da Nang Explorer" Unlocked!
    QuizService-->>Gateway: Return { score: "3/3", xpEarned: 150, badgeUnlocked: {...} }
    Gateway-->>Mobile: HTTP 200 OK + Level Up & Badge Payload
    Mobile->>User: Bật Modal pháo hoa chúc mừng mở khóa Huy hiệu Đà Nẵng!
```

---

### 🔹 FLOW 4: CROSS-DATABASE "CITY VERIFIED" COMMUNITY TRUST ATTACHMENT

```mermaid
sequenceDiagram
    autonumber
    actor User as Experienced Traveler (Has Badge)
    participant Mobile as React Native App
    participant Gateway as Express API Gateway
    participant CommService as CommunityService
    participant Postgres as PostgreSQL (user_badges)
    participant Mongo as MongoDB Atlas (forum_answers)
    actor OtherUser as Independent Traveler (Reader)

    User->>Mobile: Nhập câu trả lời trong mục Diễn đàn Đà Nẵng
    User->>Mobile: Bấm nút "Gửi câu trả lời"
    Mobile->>Gateway: POST /api/v1/community/questions/:id/answers (content)
    Gateway->>CommService: createAnswer(userId, questionId, content)
    
    CommService->>Mongo: findQuestionById(questionId) ➔ Read city = "Da Nang"
    CommService->>Postgres: SELECT * FROM user_badges JOIN badges WHERE user_id = $1 AND city = 'Da Nang'
    
    alt User đã có Huy hiệu Thành phố Đà Nẵng
        Postgres-->>CommService: Found Record (badge: "Da Nang Explorer")
        CommService->>Mongo: INSERT forum_answers { content, isCityVerified: true, hasCityBadge: true, badgeTitle: "Da Nang Explorer" }
        Mongo-->>CommService: Answer Document Saved
        CommService-->>Gateway: Return Answer Object (Verified)
    else User chưa có Huy hiệu
        Postgres-->>CommService: Record not found (null)
        CommService->>Mongo: INSERT forum_answers { content, isCityVerified: false }
        Mongo-->>CommService: Answer Document Saved
        CommService-->>Gateway: Return Answer Object (Standard)
    end

    Gateway-->>Mobile: HTTP 201 Created
    OtherUser->>Mobile: Mở xem câu hỏi Diễn đàn Đà Nẵng
    Mobile->>Gateway: GET /api/v1/community/questions/:id
    Gateway->>Mongo: findAnswersByQuestionId(id) (SORT BY isCityVerified DESC, upvotes DESC)
    Mongo-->>Gateway: Return Answers List (Verified Answers Pinned at Top)
    Gateway-->>Mobile: HTTP 200 OK
    Mobile->>OtherUser: Hiển thị câu trả lời với KHUNG VIỀN VÀNG NỔI BẬT & Nhãn "✓ Da Nang Verified"!
```
