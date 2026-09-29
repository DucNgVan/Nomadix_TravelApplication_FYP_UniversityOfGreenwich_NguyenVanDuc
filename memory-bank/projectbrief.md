# Project Brief: Nomadix — All-in-one Smart Travel Platform

## 1. Executive Summary & Project Identification
* **Project Name:** **Nomadix** — All-in-one Smart Travel Platform with Collaborative Planning & Cultural Gamification
* **Project Type:** Final Year Project (FYP) — BSc (Hons) Computing
* **Institution:** University of Greenwich (in partnership with FPT)
* **Author / Student:** Nguyễn Văn Đức
* **Duration:** 5 Months (August 2026 – January 2027 / 16 Agile Sprints)
* **Target Platforms:** Cross-platform Mobile (iOS & Android) via React Native

---

## 2. Vision & Problem Statement

### 2.1 The Problem: "Travel App Sprawl" & Group Travel Chaos
Independent travelers and group squads currently suffer from severe digital fragmentation across the travel lifecycle:
1. **App Sprawl:** Switching between 5+ single-purpose apps (Skyscanner for flights, Agoda for hotels, Google Maps for pins, Splitwise/Excel for group expense splitting, and TripAdvisor/Facebook groups for unvetted reviews).
2. **Collaborative Planning Friction:** Out-of-sync itineraries shared over fragmented messaging apps (Zalo/Messenger), where itinerary changes by one member leave others with outdated schedules.
3. **Group Expense Conflicts:** In-trip shared spending (dining, lodging, transit) creates awkward debt tracking, lost paper receipts, and tedious manual calculations.
4. **Fake Reviews Epidemic:** Traditional platforms are overrun with unverified, sponsored, or crowd-manipulated travel advice without proof of visit.

### 2.2 The Nomadix Vision
Nomadix provides a **single, unified mobile ecosystem** that consolidates the entire travel continuum:
* Discover deals $\rightarrow$ Plan collaboratively $\rightarrow$ Travel together $\rightarrow$ Split expenses transparently $\rightarrow$ Explore culture via GPS Gamification $\rightarrow$ Share verified experiences with guaranteed trust.

---

## 3. Core Functional Pillars

### 3.1 Smart & Collaborative Itinerary Planner
* **Dynamic Multi-Day Scheduling:** Hierarchical planning (`Itinerary` $\rightarrow$ `Days[]` $\rightarrow$ `Items[]` $\rightarrow$ `TransitLeg`) supporting flights, hotels, restaurants, landmarks, and custom stops.
* **Interactive Map & Turn-by-Turn Routing:** Embedded Google Maps routing with color-coded polylines, duration/distance calculations, and offline Haversine distance fallback.
* **Drag-and-Drop Reordering:** Atomic reordering of daily stops with automatic recalculation of arrival times and travel legs.
* **Squad Collaboration:** Trip organizers can invite travel companions via email or username (`owner`, `editor`, `viewer`). All invited squad members see the exact same synchronized timeline and live map updates.

### 3.2 Group Expense Tracking & Bill Splitting Hub
* **Multi-Currency Shared Treasury:** Centralized group spending ledger tied directly to the shared itinerary.
* **Bill Receipt Capture:** Direct receipt photo uploads to Cloudinary CDN (`/nomadix/receipts/{tripId}/`) with automated WebP compression and $< 1\text{MB}$ client-side optimization.
* **Flexible Cost Splitting:** Supports equal split, exact amounts, percentage allocations, and custom shares among squad members.
* **Invariant Conservation & Live Balances:** Real-time personal balance computation enforcing the mathematical invariant:
  $$\sum_{i=1}^N \text{NetBalance}_i = 0$$
* **Greedy Minimum Cash-Flow Debt Simplification:** Algorithmic debt resolution reducing circular multi-member debts from $O(N^2)$ down to at most $N - 1$ direct transfer payments.
* **Settlement Verification:** Debtor submits bank transfer slip (VietQR / mobile banking proof), creditor marks "Confirmed", and the debt ledger is updated in an ACID transaction.

### 3.3 Cultural Gamification & Location Engine (Unique Selling Proposition)
* **GPS Geofence Validation:** Strict on-site verification requiring physical presence within a $\le 100\text{m}$ radius of registered cultural landmarks.
* **Native Camera Proof-of-Visit:** Watermarked photo capture with real-time GPS coordinates, timestamp, and landmark badge overlay.
* **Educational Cultural Quizzes:** 1:1 landmark-specific 4-option quizzes testing historical and cultural comprehension.
* **Gamified Progression:** XP points rewarding check-ins (+150 XP) and quiz completion (+50 XP), leveling up traveler ranks.
* **Collectible City Badges:** Unlocked upon completing $\ge 3$ check-ins and $\ge 66\%$ quiz accuracy in a destination (e.g., "Da Nang Explorer", +300 XP bonus).

### 3.4 Verified Community Q&A Forum
* **Destination-Anchored Q&A:** Question and answer threads categorized by destination city and travel tags.
* **The "City Verified" Golden Trust Indicator:** When a traveler holding an unlocked City Explorer Badge answers a question for that specific city, the backend cross-references PostgreSQL and MongoDB to automatically render the response with a gold-framed **"City Verified"** badge.
* **Anti-Abuse Reporting Queue:** Community flagging system for spam, commercial solicitation, and inappropriate advice.

### 3.5 Smart Booking Search & Aggregator
* **Live Meta-Search:** Simultaneous search and price comparison across Amadeus Flight Offers and RapidAPI Hotel providers.
* **Sub-50ms Redis Cache-Aside:** High-speed in-memory caching (30-min flight TTL, 60-min hotel TTL) mitigating external API rate limits.
* **Resilient Mock Fallback Engine:** Automatic circuit breaker switching to structured mock generators if external APIs fail or exceed quotas.

---

## 4. Technical Constraints & Academic Boundaries

1. **Development Framework:** Extreme Programming (XP) with Test-Driven Development (TDD) as the core engineering discipline.
2. **Academic Standards:** Compliant with IEEE Software Engineering Standards, RUP analysis artifacts, and ISO/IEC 25010 software quality benchmarks.
3. **Out-of-Scope Clarification:** Direct automated bank-to-bank wire clearing gateways are intentionally excluded to eliminate PCI-DSS compliance and banking licensing overhead. Nomadix operates as an intelligent peer-to-peer debt ledger with manual transfer proof validation.
