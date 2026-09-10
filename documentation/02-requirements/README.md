# Day 2 — Requirements Analysis & Formal Specification

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D2 - Requirements Definition` / `W1 - Requirements & Analysis`  
**Branch:** `docs/requirements`  

---

## 📑 DANH MỤC TÀI LIỆU ĐẶC TẢ YÊU CẦU (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ bộ đặc tả yêu cầu phần mềm chính thức (Software Requirements Specification - SRS) cho đồ án Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D2-01** | [**`01-functional-requirements.md`**](./01-functional-requirements.md) | Đặc tả chi tiết **35 Yêu cầu Chức năng (`FR-01` đến `FR-35`)** bao quát toàn bộ 6 module cốt lõi và module quản trị. |
| **D2-02** | [**`02-non-functional-requirements.md`**](./02-non-functional-requirements.md) | Đặc tả **8 nhóm Yêu cầu Phi Chức năng (`NFR-01` đến `NFR-08`)** theo chuẩn quốc tế **ISO/IEC 25010** (Performance, Security, Reliability, Usability, Scalability...). |
| **D2-03** | [**`03-user-stories.md`**](./03-user-stories.md) | Bộ sưu tập **28 User Stories (`US-01` đến `US-28`)** chuẩn Agile theo cấu trúc *As a... I want to... So that...* |
| **D2-04** | [**`04-acceptance-criteria.md`**](./04-acceptance-criteria.md) | **14 Kịch bản nghiệm thu chấp nhận** chuẩn ngôn ngữ **BDD Gherkin** (*Given – When – Then*) làm tiêu chuẩn kiểm thử tự động. |
| **D2-05** | [**`05-traceability-matrix.md`**](./05-traceability-matrix.md) | **Ma trận truy xuất nguồn gốc yêu cầu (RTM)** kết nối Mục tiêu Đồ án ➔ User Stories ➔ FR/NFR ➔ Database ➔ API ➔ Test Cases ➔ Tuần triển khai. |
| **D2-06** | [**`06-detailed-booking-and-itinerary-specs.md`**](./06-detailed-booking-and-itinerary-specs.md) | **Đặc tả chuyên sâu User Stories & BDD Acceptance Criteria** cho Module 2 (Booking Aggregator) và Module 3 (Itinerary Planner). |
| **D2-07** | [**`07-detailed-gamification-and-community-specs.md`**](./07-detailed-gamification-and-community-specs.md) | **Đặc tả chuyên sâu User Stories & BDD Acceptance Criteria** cho Module 4 (Gamification & Geofencing) và Module 5 (Community Q&A Forum). |

---

## 📊 THỐNG KÊ CHỈ SỐ YÊU CẦU (REQUIREMENTS METRICS)

* **Tổng số Functional Requirements (FR):** 35 yêu cầu
* **Tổng số Non-Functional Requirements (NFR):** 8 nhóm chuẩn ISO/IEC 25010
* **Tổng số User Stories (US):** 28 câu chuyện người dùng
* **Tổng số Gherkin Acceptance Scenarios:** 14 kịch bản
* **Tỷ lệ ánh xạ ma trận RTM:** 100% hoàn thiện

---

## 🔄 BƯỚC TIẾP THEO (DAY 3 TRANSITION)

Với bộ đặc tả yêu cầu đã được xác lập vững chắc, **Day 3 (D3 - Use Case Analysis)** sẽ chuyển đổi các yêu cầu này thành:
1. Xác định 4 nhóm Actors hệ thống.
2. Sơ đồ Use Case Diagram tổng thể (Mermaid / PlantUML).
3. Bản đặc tả chi tiết 8 Use Case Specification cốt lõi (Main Flow, Alternative Flow, Exception Flow).
