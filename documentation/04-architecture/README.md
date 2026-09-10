# Day 4 — System Architecture Design & Integration Blueprint

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D4 - System Architecture` / `W1 - Requirements & Analysis`  
**Branch:** `docs/architecture`  

---

## 📑 DANH MỤC TÀI LIỆU KIẾN TRÚC HỆ THỐNG (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ hồ sơ thiết kế kiến trúc phân tầng, phân chia cơ sở dữ liệu và sơ đồ tuần tự cho hệ sinh thái Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D4-01** | [**`01-system-architecture.md`**](./01-system-architecture.md) | **Kiến trúc phân tầng sạch (Clean Layered Architecture)** gồm 5 tầng từ Presentation React Native đến Polyglot Persistence, cơ chế bảo mật JWT/RBAC và chiến lược đồng bộ dữ liệu liên cơ sở dữ liệu (Cross-DB Sync). |
| **D4-02** | [**`02-component-diagrams.md`**](./02-component-diagrams.md) | **Sơ đồ thành phần tổng thể (Component Diagram)** và Cấu trúc tổ chức gói mã nguồn chuẩn mực (Package Structure) cho cả Server Node.js và Mobile Client. |
| **D4-03** | [**`03-data-flow-and-sequence-diagrams.md`**](./03-data-flow-and-sequence-diagrams.md) | **4 Sơ đồ tuần tự (Sequence Diagrams)** chi tiết bằng cú pháp **Mermaid UML** mô hình hóa các luồng dữ liệu cốt lõi: Tìm kiếm Booking + Cache, Lập lịch trình Maps, GPS Geofence + Quiz + Badge, và Gắn nhãn xác thực Diễn đàn. |

---

## 🏛️ CÁC ĐIỂM NHẤN KIẾN TRÚC HỌC THUẬT (ARCHITECTURAL HIGHLIGHTS)

1. **Clean Layered Separation:** Tách bạch 100% giữa tầng giao thức HTTP (Controllers), tầng nghiệp vụ thuần túy (Services) và tầng truy cập dữ liệu (Repositories / Adapters).
2. **Polyglot Persistence Boundary:** 
   * **PostgreSQL:** Lưu trữ dữ liệu quan hệ có cấu trúc chuẩn 3NF và yêu cầu tính toàn vẹn ACID (Users, Badges, Check-ins, Quizzes).
   * **MongoDB Atlas:** Lưu trữ dữ liệu động, lồng nhau không cấu trúc (Itineraries, Forum Q&A, Comments).
   * **Redis:** Tầng đệm bộ nhớ RAM siêu tốc cho các truy vấn tìm kiếm OTA.
3. **Adapter & Strategy Pattern:** Đóng gói độc lập các API đối tác ngoài (Amadeus, RapidAPI, Cloudinary, Maps) kèm cơ chế tự động chuyển mạch sang Mock Provider khi có sự cố.

---

## 🔄 BƯỚC TIẾP THEO (DAY 5 TRANSITION)

Với bản thiết kế kiến trúc hoàn chỉnh, **Day 5 (D5 - Technology Research)** sẽ thực hiện:
1. Đăng ký & kiểm tra tính khả thi của các tài khoản Developer API thực tế (Amadeus, RapidAPI, Google Maps, Cloudinary).
2. Phân tích rủi ro API Rate Limit và thiết kế chi tiết kho dữ liệu mẫu **Mock Provider Fallback Engine**.
3. Khảo sát các thư viện React Native phần cứng (Maps, Geolocation, Camera).
