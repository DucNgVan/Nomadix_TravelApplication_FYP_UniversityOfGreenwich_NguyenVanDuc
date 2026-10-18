# 🚀 LỘ TRÌNH PUSH GITHUB THEO TỪNG NGÀY (MASTER DAILY GIT PUSH SCHEDULE)
## NOMADIX — Greenwich BSc Computing Final Year Project
**Sinh viên:** Nguyễn Văn Đức (DucNgVan)  
**Email GitHub Contribution:** `ducnva.wk@gmail.com`  
**Repository nộp trường:** `https://github.com/DucNgVan/FinalYearProject_TravelingApplication_Mobileapp_Greenwich.git`  
**Khung thời gian:** 22/09/2026 – 10/03/2027 (**169 ngày liên tục**)  

---

## 📌 1. NGUYÊN TẮC BÁO CÁO TIẾN ĐỘ HỌC THUẬT (ACADEMIC PROGRESSION ALIGNMENT)

1. **Email đóng góp chuẩn xác:** Toàn bộ commit đều mang danh tính author & committer là `DucNgVan <ducnva.wk@gmail.com>` để 100% commit đều sáng ô xanh trên biểu đồ đóng góp của GitHub.
2. **Khớp 100% mốc báo cáo với Giảng viên hướng dẫn (Supervisor Sign-off):**
   * **Từ 23/09/2026 đến 13/10/2026 (21 ngày):** Tập trung nghiên cứu UX, đặc tả Design Tokens (WCAG 2.1 AA, Plus Jakarta Sans, 8pt grid), dựng wireframe và hoàn thiện 2 bộ **HTML Interactive Mobile Prototype Preview** (`index.html` và `plan-map-preview.html`). **Chốt và ký duyệt bản Prototype Preview HTML vào ngày 13/10/2026**.
   * **Từ 14/10/2026 đến 18/10/2026 (5 ngày):** Chuyển sang giai đoạn lập trình mã nguồn (Implementation Phase): Thiết lập CSDL Polyglot & Docker, xây dựng 4 Backend Core Modules với 100% TDD, hoàn thiện ứng dụng di động React Native trên Expo SDK 57 (Mapbox Discovery, Multi-City Wizard, Dual Theme, English Localization và CI/CD).
   * **Từ 19/10/2026 đến 10/03/2027:** Tối ưu hóa tính năng nâng cao, chia hóa đơn ảnh chụp Cloudinary, mở rộng kho địa điểm toàn cầu, thử nghiệm người dùng UAT và nộp luận văn hoàn chỉnh.

---

## 📊 2. TỔNG QUAN 6 GIAI ĐOẠN (169 NGÀY LIÊN TỤC)

| Giai đoạn | Thời gian | Số ngày | Trọng tâm bàn giao & Tiêu chuẩn học thuật |
|:---:|:---:|:---:|:---|
| **Phase 1** | 23/09/2026 – 13/10/2026 | 21 ngày | **UX/UI Research, Wireframing & Chốt Prototype HTML Preview:** Design Tokens WCAG AA, iPhone 16 Pro Frame, Mapbox GL JS v3, Chốt Preview HTML với Nhà trường ngày 13/10. |
| **Phase 2** | 14/10/2026 – 18/10/2026 | 5 ngày | **Core Full-Stack Implementation (MVP Ready):** Docker 3NF, Module 1 (Auth), Module 2 (Booking Live NDC), Module 3 & 4 (Itinerary Haversine & Greedy Debt $O(N \log N)$), Mobile React Native Expo SDK 57, Mapbox Discovery, 323 tests GREEN. |
| **Phase 3** | 19/10/2026 – 15/11/2026 | 28 ngày | **Advanced Booking & Live Amenities:** Tối ưu hóa bộ lọc chuyến bay quốc tế, chỉ báo chuyển tiếp hành lý tự động, đo phát thải CO2, voucher ưu đãi nhóm. |
| **Phase 4** | 16/11/2026 – 31/12/2026 | 46 ngày | **Receipt OCR Media Pipeline & Settle-up Hub:** Tích hợp Cloudinary receipt storage, chia tiền hóa đơn tự động, đồng bộ hóa số dư tức thời. |
| **Phase 5** | 01/01/2027 – 15/02/2027 | 46 ngày | **Global Places Expansion & Touch Ergonomics:** Mở rộng Tokyo, Paris, New York, tối ưu thuật toán AI gom cụm địa lý, tinh chỉnh chuyển động 60fps trên thiết bị thật. |
| **Phase 6** | 16/02/2027 – 10/03/2027 | 23 ngày | **UAT Testing, Benchmarks, Thesis & Final Defense:** Kiểm toán bảo mật, thử nghiệm 10 người dùng, đo độ trễ Redis/Mongo, đóng gói Luận văn và gắn tag `v1.0.0`. |

---

## 🛠️ 3. LỊCH TRÌNH CHI TIẾT TỪNG NGÀY ĐÃ ĐẨY LÊN GITHUB (23/09/2026 – 18/10/2026)

### 🎨 Chặng A: Nghiên cứu UX/UI, Wireframing & Chốt Preview HTML (23/09 – 13/10/2026)
* **23/09/2026:** `docs(ux): research user journey and interaction models for collaborative squad planning`
* **24/09/2026:** `docs(ui): define accessibility contrast standards and color tokens (wcag 2.1 aa)`
* **25/09/2026:** `docs(ui): specify typography hierarchy using plus jakarta sans and jetbrains mono`
* **26/09/2026:** `docs(ui): establish 8pt spatial grid system and thumb-zone ergonomics for mobile`
* **27/09/2026:** `docs(wireframe): create low-fidelity wireframes for flight search and airline offer cards`
* **28/09/2026:** `docs(wireframe): create low-fidelity wireframes for hotel search and curated stays spotlight`
* **29/09/2026:** `docs(wireframe): create low-fidelity wireframes for map-centric places discovery workspace`
* **30/09/2026:** `docs(wireframe): design multi-city step-by-step guided wizard wireframes and budget estimator`
* **01/10/2026:** `docs(wireframe): design squad collaboration timeline and expense settlement matrix wireframes`
* **02/10/2026:** `feat(prototype): scaffold 3-column panoramic showcase dashboard in html preview`
* **03/10/2026:** `feat(prototype): implement iphone 16 pro frame with dynamic island and status bar in preview`
* **04/10/2026:** `feat(prototype): integrate mapbox gl js v3 interactive map canvas in html preview`
* **05/10/2026:** `feat(prototype): implement floating search bar and category filter chips in map preview`
* **06/10/2026:** `feat(prototype): add multi-city destination switcher (da nang, hoi an, tokyo, paris) in preview`
* **07/10/2026:** `feat(prototype): implement place selection wishlist drawer and animated pin markers in preview`
* **08/10/2026:** `feat(prototype): simulate ai hierarchical agglomerative clustering transition in preview`
* **09/10/2026:** `feat(prototype): implement dual-theme switching (pale blue light and deep navy dark) in preview`
* **10/10/2026:** `feat(prototype): simulate live duffel flight offers, co2 emissions and baggage transfer indicators`
* **11/10/2026:** `feat(prototype): enrich preview with trending flight deals carousel and nomadix flight guarantee`
* **12/10/2026:** `feat(prototype): enrich preview with stay vibe chips and featured curated stays spotlight`
* **13/10/2026:** `feat(prototype): finalize interactive html preview suite and sign off with academic supervisor`

---

### 💻 Chặng B: Lập trình Mã nguồn Hệ thống (Implementation Phase: 14/10 – 18/10/2026)
* **14/10/2026:** `feat(infra): setup polyglot docker compose, 28-table 3nf postgresql ddl, knex migrations, and zod dto foundation`
  * Khởi tạo `docker-compose.yml`, `01-init.sql` (28 bảng PostgreSQL 3NF), `knexfile.js`, `migrator.js`, `tsconfig.json`, `zod.middleware.js`.
* **15/10/2026:** `feat(auth): implement module 1 - user identity, rbac, bcrypt 12 rounds, and dual-token security with strict tdd`
  * Express server gateway, mã hóa mật khẩu Bcrypt 12 rounds, JWT 15m + SHA-256 Refresh Token (RTR), User repository, 20 test cases GREEN.
* **16/10/2026:** `feat(booking): implement module 2 - smart flight and hotel aggregator with duffel live ndc api and redis cache`
  * Adapter Duffel Live NDC Flights API, Google Places API, Redis Cache-Aside layer (TTL 1800s/3600s), Data normalizer, 47 test cases GREEN.
* **17/10/2026:** `feat(core-backend): implement module 3 (itinerary haversine) and module 4 (postgresql acid ledger & greedy debt algorithm)`
  * CSDL MongoDB timeline, Haversine WGS84, Sổ cái tài chính PostgreSQL ACID transactions (`NUMERIC(12, 2)`), thuật toán Greedy Minimum Cash-Flow Reduction $O(N \log N)$, Cross-DB integrity guard, 117 test cases GREEN.
* **18/10/2026 (Hôm nay):** `feat(mobile): implement complete react native client (expo sdk 57, mapbox discovery, multi-city wizard, english i18n, and ci/cd)`
  * Ứng dụng di động React Native trên Expo SDK 57, Mapbox Places Discovery, Wizard đa chặng 3 bước, Dual Theme Sáng/Tối, tiếng Anh chuẩn quốc tế, CI/CD GitHub Actions workflow, **323/323 tests GREEN**.

---

## 🔮 4. KẾ HOẠCH BÀN GIAO TIẾP THEO (19/10/2026 – 10/03/2027)

* **19/10 – 31/10 (13 ngày):** Tối ưu hóa bộ lọc chuyến bay quốc tế, chỉ báo chuyển tiếp hành lý tự động, phát thải CO2.
* **01/11 – 30/11 (30 ngày):** Xây dựng tính năng chia hóa đơn ảnh chụp tự động qua Cloudinary, giao diện settle-up nợ nhóm.
* **01/12 – 31/12 (31 ngày):** Mở rộng danh mục địa điểm toàn cầu (Tokyo, Paris, New York), tối ưu thuật toán AI gom cụm địa lý.
* **01/01 – 31/01 (31 ngày):** Tinh chỉnh trải nghiệm cảm ứng Thumb-zone, Apple HIG, hoạt họa mượt mà 60fps trên thiết bị thật.
* **01/02 – 28/02 (28 ngày):** Thử nghiệm người dùng UAT (5-10 người dùng), thu thập phản hồi, kiểm toán bảo mật và hiệu năng.
* **01/03 – 10/03 (10 ngày):** Bàn giao báo cáo Luận văn tốt nghiệp chính thức, video demo đồ án, đóng gói release `v1.0.0` để bảo vệ trước Hội đồng.
