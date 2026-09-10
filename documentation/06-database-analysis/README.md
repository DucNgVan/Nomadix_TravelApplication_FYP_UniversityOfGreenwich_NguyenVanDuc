# Day 6 — Database Analysis & Preliminary ERD

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D6 - Database Analysis` / `W1 - Requirements & Analysis`  
**Branch:** `docs/database-analysis`  

---

## 📑 DANH MỤC TÀI LIỆU CƠ SỞ DỮ LIỆU (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ hồ sơ phân tích cơ sở dữ liệu, sơ đồ ERD toàn diện và từ điển dữ liệu cho hệ sinh thái Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D6-01** | [**`01-preliminary-erd.md`**](./01-preliminary-erd.md) | **Sơ đồ ERD toàn diện chi tiết 100% bằng Mermaid**: Sơ đồ 9 bảng quan hệ chuẩn 3NF của PostgreSQL (Users, Badges, Checkins, Quizzes), Sơ đồ 4 Collection của MongoDB Atlas và Sơ đồ bản đồ kiến trúc đa cơ sở dữ liệu (Polyglot Map). |
| **D6-02** | [**`02-data-dictionary.md`**](./02-data-dictionary.md) | **Từ điển dữ liệu hoàn chỉnh (Data Dictionary)**: Bảng đặc tả 100% các cột, kiểu dữ liệu, ràng buộc NOT NULL/UNIQUE/CHECK, khóa chính/ngoại, Indexes và Typescript Interfaces. |
| **D6-03** | [**`03-polyglot-data-model.md`**](./03-polyglot-data-model.md) | **Mô hình hóa liên cơ sở dữ liệu (Polyglot Architecture)**: Chiến lược khóa ngoại chéo `userId` UUID, Giao thức kiểm tra danh hiệu "City Verified" thời gian thực giữa Postgres và Mongo, Bảng Taxonomy khóa Redis và công thức tính toán dung lượng RAM. |
| **D6-04** | [**`04-core-users-auth-erd.md`**](./04-core-users-auth-erd.md) | **Sơ đồ ERD & Đặc tả chuyên sâu Core Entities (Users & Authentication)**: Sơ đồ 3NF 9 bảng bảo mật (Users, Roles, Permissions, Sessions/Refresh Tokens, OAuth, Preferences, Password Resets, Audit Logs) kèm DDL PostgreSQL đầy đủ. |

---

## 📊 THỐNG KÊ THÀNH PHẦN CƠ SỞ DỮ LIỆU (DATABASE METRICS)

* **PostgreSQL Relational Tables:** 9 bảng (`roles`, `users`, `landmarks`, `checkins`, `badges`, `user_badges`, `quizzes`, `quiz_questions`, `quiz_attempts`)
* **MongoDB Document Collections:** 4 collections (`itineraries`, `forum_questions`, `forum_answers`, `reports`)
* **Redis Key Patterns:** 4 mẫu khóa (`cache:flights:*`, `cache:hotels:*`, `cache:landmarks:*`, `rate_limit:*`)
* **Mức độ chuẩn hóa:** Chuẩn hóa 3NF tuyệt đối cho dữ liệu quan hệ; Cấu trúc phân cấp tài liệu tối ưu cho lịch trình và diễn đàn.

---

## 🔄 BƯỚC TIẾP THEO (DAY 7 TRANSITION)

Với thiết kế cơ sở dữ liệu đã hoàn tất vững chắc, **Day 7 (D7 - Week 1 Synthesis & Review)** sẽ thực hiện:
1. Rà soát lại toàn bộ 6 ngày làm việc của Tuần 1 theo bảng tiêu chuẩn **Definition of Done (DoD)**.
2. Tổng hợp báo cáo tiến độ tuần (Weekly Progress Report #1) cho Giảng viên hướng dẫn (Supervisor).
3. Soạn thảo khung sườn Chapter 1 (Introduction) và Chapter 3 (System Requirements) cho Luận văn tốt nghiệp.
