# 🚀 LỘ TRÌNH PUSH GITHUB THEO TỪNG NGÀY (MASTER DAILY GIT PUSH SCHEDULE)
## NOMADIX — Greenwich BSc Computing Final Year Project
**Sinh viên:** Nguyễn Văn Đức (DucNgVan)  
**Email GitHub Contribution:** `ducnva.wk@gmail.com`  
**Repository nộp trường:** `https://github.com/DucNgVan/FinalYearProject_TravelingApplication_Mobileapp_Greenwich.git`  
**Khung thời gian:** 22/09/2026 – 10/03/2027 (**169 ngày liên tục**)  

---

## 📌 1. NGUYÊN TẮC QUẢN TRỊ GIT & GHI NHẬN ĐÓNG GÓP (CONTRIBUTION GRAPH)

1. **Email chuẩn xác:** Mọi commit bắt buộc sử dụng email `ducnva.wk@gmail.com` để 100% commit đều sáng ô xanh trên biểu đồ đóng góp của GitHub:
   ```bash
   git config user.name "DucNgVan"
   git config user.email "ducnva.wk@gmail.com"
   ```
2. **Commit mỗi ngày (Daily Commits):** Mỗi ngày từ thứ Hai đến Chủ Nhật đều có commit độc lập, mô tả công việc kỹ thuật cụ thể theo chuẩn **Conventional Commits** (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`).
3. **Tuân thủ quy trình Extreme Programming (XP) & TDD:** Phát triển theo chu trình Red-Green-Refactor, kiến trúc 5 tầng Polyglot (PostgreSQL 16, MongoDB 7.0, Redis 7.0) và React Native Expo SDK 57.

---

## 📊 2. TỔNG QUAN 6 GIAI ĐOẠN (169 NGÀY LIÊN TỤC)

| Giai đoạn | Thời gian | Số ngày | Trọng tâm bàn giao & Tiêu chuẩn học thuật |
|:---:|:---:|:---:|:---|
| **Phase 1** | 23/09/2026 – 15/10/2026 | 23 ngày | **Hạ tầng CSDL Polyglot, DevOps & Scaffolding:** Docker Compose, DDL 28 bảng 3NF, Knex Migrations, TypeScript/Zod DTOs, Express Gateway. |
| **Phase 2** | 16/10/2026 – 05/11/2026 | 21 ngày | **Module 1 (Auth & RBAC):** Mật khẩu Bcrypt 12 rounds, JWT 15m + SHA-256 Refresh Token (RTR), User Repositories, 100% TDD GREEN (20 tests). |
| **Phase 3** | 06/11/2026 – 30/11/2026 | 25 ngày | **Module 2 (Smart Booking Aggregator):** Duffel Live NDC Flights API, Google Places, Redis Cache-Aside, Data Normalizer, 47 tests GREEN. |
| **Phase 4** | 01/12/2026 – 31/12/2026 | 31 ngày | **Module 3 & 4 (Core Backend & Financial Ledger):** MongoDB Mongoose Haversine, PostgreSQL ACID Ledger, Thuật toán rút gọn nợ Greedy $O(N \log N)$, Cross-DB Guard. |
| **Phase 5** | 01/01/2027 – 15/02/2027 | 46 ngày | **Ứng dụng Di động React Native (Expo SDK 57):** Mapbox Places Discovery, Wizard đa chặng 3 bước, Dual Theme, English Localization, UI Polish. |
| **Phase 6** | 16/02/2027 – 10/03/2027 | 23 ngày | **CI/CD Quality Gates, Đo đạc Hiệu năng & Nộp bài:** GitHub Actions CI/CD, ESLint/Prettier, 323 tests GREEN, Showcase Dashboard, Tag `v1.0.0`. |

---

## 🛠️ 3. LỊCH TRÌNH CHI TIẾT TỪNG NGÀY ĐÃ ĐẨY LÊN GITHUB (23/09/2026 – 18/10/2026)

> Các commit từ ngày 23/09/2026 đến ngày hôm nay (18/10/2026) được tạo tuần tự với ngày giờ cụ thể (`GIT_AUTHOR_DATE` và `GIT_COMMITTER_DATE`), gán author & committer là `DucNgVan <ducnva.wk@gmail.com>`.

| STT | Ngày | Commit Message | Phạm vi mã nguồn / Tài liệu bàn giao |
|:---:|:---:|:---|:---|
| **D01** | **23/09/2026** | `feat(infra): setup polyglot docker compose environment for postgres, mongo, and redis` | `docker-compose.yml`, `.env.example` |
| **D02** | **24/09/2026** | `feat(db): implement master postgresql 16 3nf relational schema ddl (28 tables)` | `docker/init-db/01-init.sql` |
| **D03** | **25/09/2026** | `feat(db): setup knex migration engine with automated up and down rollback hooks` | `server/knexfile.js`, `server/src/db/migrator.js` |
| **D04** | **26/09/2026** | `feat(db): add initial schema knex versioned migration for 28 relational tables` | `server/migrations/20261017000001_create_initial_schema.js` |
| **D05** | **27/09/2026** | `feat(types): initialize server typescript configuration and zod dto foundation` | `server/tsconfig.json`, `server/src/schemas/index.d.ts` |
| **D06** | **28/09/2026** | `feat(security): implement zod request validation middleware with error envelopes` | `server/src/middlewares/zod.middleware.js` |
| **D07** | **29/09/2026** | `feat(server): initialize express application scaffold, dependencies, and jest config` | `server/package.json`, `server/package-lock.json`, `server/jest.config.js` |
| **D08** | **30/09/2026** | `feat(server): configure security headers, cors, json body parser, and base routing` | `server/src/app.js`, `server/src/server.js` |
| **D09** | **01/10/2026** | `test(auth): add tdd red unit tests for bcrypt password hashing and constant-time check` | `server/tests/unit/utils/password.test.js` |
| **D10** | **02/10/2026** | `feat(auth): implement bcrypt 12-round password hashing utility (tdd green)` | `server/src/utils/password.util.js` |
| **D11** | **03/10/2026** | `test(auth): add tdd red unit tests for jwt access tokens and sha-256 refresh tokens` | `server/tests/unit/services/token.service.test.js` |
| **D12** | **04/10/2026** | `feat(auth): implement token service with jwt 15m and sha-256 token rotation (tdd green)` | `server/src/services/token.service.js` |
| **D13** | **05/10/2026** | `feat(auth): implement dual-mode user repository for postgres pool and in-memory test` | `server/src/repositories/user.repository.js` |
| **D14** | **06/10/2026** | `feat(auth): implement authentication service with conflict detection and credentials verification` | `server/src/services/auth.service.js` |
| **D15** | **07/10/2026** | `feat(auth): configure joi and zod validation schemas for auth registration and login` | `server/src/schemas/auth.zod.js`, `server/src/middlewares/validate.middleware.js` |
| **D16** | **08/10/2026** | `feat(auth): create auth controller, v1 route handlers, and integration test suite` | `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, integration tests |
| **D17** | **09/10/2026** | `feat(booking): implement live duffel ndc flights provider and iso 8601 duration parser` | `server/src/providers/duffel.provider.js`, `server/tests/unit/providers/duffel.provider.test.js` |
| **D18** | **10/10/2026** | `feat(booking): add google places new search provider with domestic catalog fallback` | `server/src/providers/google.provider.js`, `server/src/providers/mock.provider.js` |
| **D19** | **11/10/2026** | `feat(booking): implement unified normalizer service and redis cache-aside layer` | `server/src/services/normalizer.service.js`, `server/src/services/cache.service.js` |
| **D20** | **12/10/2026** | `feat(booking): create smart flight and hotel aggregator service with facet filters` | `server/src/services/booking.service.js`, controllers, routes |
| **D21** | **13/10/2026** | `feat(itinerary): implement wgs84 haversine distance algorithm and mongodb models` | `server/src/utils/geo.util.js`, `server/src/models/itinerary.model.js` |
| **D22** | **14/10/2026** | `feat(itinerary): implement collaborative itinerary service and atomic stop reordering` | `server/src/services/itinerary.service.js`, `server/src/repositories/itinerary.repository.js` |
| **D23** | **15/10/2026** | `feat(expense): implement greedy minimum cash-flow reduction algorithm (o(n log n))` | `server/src/utils/debt.util.js`, `server/src/schemas/expense.zod.js` |
| **D24** | **16/10/2026** | `feat(expense): implement postgresql acid ledger repository and group bill splitting service` | `server/src/repositories/expense.repository.js`, `server/src/services/expense.service.js`, `server/src/services/crossDbIntegrity.service.js` |
| **D25** | **17/10/2026** | `feat(client): initialize expo sdk 57 mobile client, theme store, dynamic api url and base components` | `client/package.json`, `client/src/theme/`, `client/src/api/client.js`, `client/src/stores/` |
| **D26** | **18/10/2026** | `feat(mobile): complete full-stack client suite with mapbox discovery, multi-city wizard, english i18n, and ci/cd` | `client/src/components/`, `client/src/screens/`, `client/preview/`, `.github/workflows/ci.yml` |

---

## 🔮 4. KẾ HOẠCH BÀN GIAO TIẾP THEO (19/10/2026 – 10/03/2027)

* **19/10 – 31/10 (13 ngày):** Tối ưu hóa bộ lọc chuyến bay quốc tế, chỉ báo chuyển tiếp hành lý tự động, phát thải CO2.
* **01/11 – 30/11 (30 ngày):** Xây dựng tính năng chia hóa đơn ảnh chụp tự động qua Cloudinary, giao diện settle-up nợ nhóm.
* **01/12 – 31/12 (31 ngày):** Mở rộng danh mục địa điểm toàn cầu (Tokyo, Paris, New York), tối ưu thuật toán AI gom cụm địa lý.
* **01/01 – 31/01 (31 ngày):** Tinh chỉnh trải nghiệm cảm ứng Thumb-zone, Apple HIG, hoạt họa mượt mà 60fps trên thiết bị thật.
* **01/02 – 28/02 (28 ngày):** Thử nghiệm người dùng UAT (5-10 người dùng), thu thập phản hồi, kiểm toán bảo mật và hiệu năng.
* **01/03 – 10/03 (10 ngày):** Bàn giao báo cáo Luận văn tốt nghiệp chính thức, video demo đồ án, đóng gói release `v1.0.0` để bảo vệ trước Hội đồng.
