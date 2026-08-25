# 03. User Stories (Agile Product Backlog)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Format:** Connextra Template (*As a [Role], I want to [Action], so that [Value]*).  
**Phase:** Day 2 — Requirements Definition  

---

## 1. DANH MỤC CÁC EPICS (EPIC BREAKDOWN)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        NOMADIX PRODUCT EPICS                           │
├────────┬──────────────────────────────────────┬────────────────────────┤
│ Epic 1 │ Authentication & Profile Management  │ US-01 đến US-04        │
├────────┼──────────────────────────────────────┼────────────────────────┤
│ Epic 2 │ Smart Booking Search & Aggregation   │ US-05 đến US-09        │
├────────┼──────────────────────────────────────┼────────────────────────┤
│ Epic 3 │ Interactive Itinerary Planner & Maps │ US-10 đến US-14        │
├────────┼──────────────────────────────────────┼────────────────────────┤
│ Epic 4 │ Cultural Gamification & Location USP │ US-15 đến US-20        │
├────────┼──────────────────────────────────────┼────────────────────────┤
│ Epic 5 │ Community Q&A & Verified Experience  │ US-21 đến US-25        │
├────────┼──────────────────────────────────────┼────────────────────────┤
│ Epic 6 │ System Administration & Moderation   │ US-26 đến US-28        │
└────────┴──────────────────────────────────────┴────────────────────────┘
```

---

## 2. CHI TIẾT TỪNG USER STORY

### 🟢 EPIC 1: AUTHENTICATION & PROFILE MANAGEMENT

* **`US-01` (Đăng ký tài khoản):**  
  * **As an** Independent Traveler,  
  * **I want to** tạo một tài khoản Nomadix mới bằng email và mật khẩu an toàn,  
  * **So that** tôi có thể lưu trữ các chuyến đi cá nhân và tích lũy điểm kinh nghiệm (XP) trong suốt hành trình.

* **`US-02` (Đăng nhập an toàn):**  
  * **As a** Registered User,  
  * **I want to** đăng nhập vào ứng dụng và duy trì phiên đăng nhập tự động,  
  * **So that** tôi không phải nhập lại mật khẩu mỗi lần mở ứng dụng trên điện thoại.

* **`US-03` (Xem hồ sơ & thành tựu):**  
  * **As a** Traveler,  
  * **I want to** xem trang hồ sơ cá nhân hiển thị cấp độ (Level), thanh tiến trình XP, bộ sưu tập Huy hiệu thành phố và lịch sử các địa danh đã ghé thăm,  
  * **So that** tôi có thể tự hào theo dõi sự trưởng thành trong hành trình khám phá của mình.

* **`US-04` (Cập nhật thông tin & ảnh đại diện):**  
  * **As a** Traveler,  
  * **I want to** thay đổi ảnh đại diện và chỉnh sửa tiểu sử cá nhân từ thư viện ảnh điện thoại,  
  * **So that** tài khoản của tôi trông ấn tượng và chuyên nghiệp hơn trong mắt cộng đồng du lịch.

---

### 🔵 EPIC 2: SMART BOOKING SEARCH & AGGREGATION

* **`US-05` (Tìm kiếm chuyến bay):**  
  * **As an** Independent Traveler,  
  * **I want to** tìm kiếm và so sánh giá vé máy bay giữa các hãng hàng không theo điểm đi, điểm đến và ngày bay,  
  * **So that** tôi có thể lựa chọn chuyến bay phù hợp nhất với túi tiền và lịch trình của mình.

* **`US-06` (Tìm kiếm khách sạn):**  
  * **As an** Independent Traveler,  
  * **I want to** tìm kiếm khách sạn theo thành phố du lịch, số lượng khách và xếp hạng sao,  
  * **So that** tôi có thể tìm được nơi lưu trú ưng ý gần các địa điểm tham quan chính.

* **`US-07` (Lọc & Sắp xếp kết quả):**  
  * **As a** Budget Traveler,  
  * **I want to** lọc kết quả tìm kiếm theo khoảng giá, hãng hàng không, số điểm dừng và sắp xếp từ rẻ nhất đến đắt nhất,  
  * **So that** tôi nhanh chóng tìm thấy ưu đãi tiết kiệm chi phí nhất.

* **`US-08` (Tải nhanh kết quả qua Cache):**  
  * **As a** Mobile App User,  
  * **I want to** nhận được kết quả tìm kiếm tức thì chỉ trong tích tắc khi tìm lại các chặng bay phổ biến,  
  * **So that** tôi không phải chờ đợi lâu do độ trễ mạng của các hệ thống bên ngoài.

* **`US-09` (Chuyển hướng đặt vé):**  
  * **As a** Traveler,  
  * **I want to** bấm nút "Đặt vé" để mở trực tiếp trang web của hãng bay/khách sạn trong ứng dụng,  
  * **So that** tôi có thể hoàn tất thanh toán chính thức mà không bị mất thông tin tìm kiếm.

---

### 🟡 EPIC 3: INTERACTIVE ITINERARY PLANNER & MAPS

* **`US-10` (Tạo lịch trình nhiều ngày):**  
  * **As a** Trip Planner,  
  * **I want to** tạo một chuyến đi mới kéo dài nhiều ngày (ví dụ: Đà Nẵng 3 ngày 2 đêm),  
  * **So that** tôi có thể tổ chức các hoạt động du lịch theo từng ngày một cách khoa học.

* **`US-11` (Kéo-thả sắp xếp địa điểm):**  
  * **As a** Traveler,  
  * **I want to** dễ dàng kéo và thả các thẻ địa điểm để thay đổi thứ tự tham quan trong ngày,  
  * **So that** tôi tối ưu hóa tuyến đường di chuyển mà không mất công xóa đi tạo lại.

* **`US-12` (Xem bản đồ lộ trình & khoảng cách):**  
  * **As a** Traveler,  
  * **I want to** xem toàn bộ các điểm tham quan trong ngày hiển thị trên Google Maps có đánh số thứ tự và đường kẻ định tuyến kèm khoảng cách km và thời gian di chuyển,  
  * **So that** tôi ước tính được thời gian di chuyển và không bị trễ lịch trình.

* **`US-13` (Chia sẻ lịch trình công khai):**  
  * **As an** Experienced Traveler,  
  * **I want to** chia sẻ lịch trình du lịch tâm đắc của mình lên bảng tin cộng đồng,  
  * **So that** những người du lịch tự túc khác có thể tham khảo và học hỏi kinh nghiệm.

* **`US-14` (Nhân bản lịch trình - Clone Trip):**  
  * **As a** First-time Traveler,  
  * **I want to** sao chép một lịch trình du lịch xuất sắc của người khác về tài khoản của mình chỉ bằng 1 cú chạm,  
  * **So that** tôi tiết kiệm hàng giờ đồng hồ tự tìm kiếm và có thể tùy chỉnh thêm bớt theo ý thích riêng.

---

### 🟣 EPIC 4: CULTURAL GAMIFICATION & LOCATION ENGINE (USP)

* **`US-15` (Khám phá danh mục địa danh văn hóa):**  
  * **As a** Culture Explorer,  
  * **I want to** duyệt danh sách các địa danh lịch sử, văn hóa tại thành phố đang đến kèm khoảng cách thời gian thực tính từ vị trí tôi đứng,  
  * **So that** tôi biết địa điểm nào gần mình nhất để ghé thăm.

* **`US-16` (Xác thực GPS Geofence khi đến gần):**  
  * **As a** Traveler,  
  * **I want to** hệ thống tự động nhận diện và mở khóa nút Check-in khi tôi đứng trong bán kính 100m của địa danh,  
  * **So that** tôi được xác nhận đã thực sự đặt chân tới địa điểm này.

* **`US-17` (Chụp ảnh check-in có Watermark):**  
  * **As a** Traveler,  
  * **I want to** mở máy ảnh trực tiếp trong app để chụp ảnh kỷ niệm kèm khung thông tin địa danh, thời gian và tọa độ GPS,  
  * **So that** tôi có một bức ảnh bằng chứng đẹp mắt lưu vào hồ sơ du lịch.

* **`US-18` (Làm bài trắc nghiệm văn hóa - Quiz):**  
  * **As a** Curious Traveler,  
  * **I want to** trả lời 3 câu hỏi trắc nghiệm ngắn về lịch sử và văn hóa của địa danh sau khi chụp ảnh check-in,  
  * **So that** tôi vừa học thêm kiến thức địa phương vừa nhận được điểm thưởng kinh nghiệm (XP).

* **`US-19` (Nhận thưởng XP & Thăng cấp):**  
  * **As a** Gamer Traveler,  
  * **I want to** nhận điểm XP tức thì và nhìn thấy thanh cấp độ Level tăng lên kèm hiệu ứng chúc mừng,  
  * **So that** tôi cảm thấy hứng khởi và có động lực tiếp tục khám phá các địa danh tiếp theo.

* **`US-20` (Mở khóa Huy hiệu thành phố):**  
  * **As a** Dedicated Explorer,  
  * **I want to** được trao tặng "Huy hiệu Thành phố" (ví dụ: *Da Nang Explorer Badge*) khi hoàn thành đủ 3 địa danh và 1 bài quiz,  
  * **So that** tôi khẳng định được vốn hiểu biết và trải nghiệm thực tế của mình tại thành phố đó.

---

### 🟡 EPIC 5: COMMUNITY Q&A & VERIFIED TRUST ENGINE

* **`US-21` (Tìm kiếm câu hỏi theo thành phố):**  
  * **As an** Independent Traveler,  
  * **I want to** đọc các câu hỏi và thảo luận kinh nghiệm du lịch được phân loại rõ ràng theo từng thành phố và chủ đề,  
  * **So that** tôi dễ dàng tìm thấy câu trả lời cho những thắc mắc cụ thể về chuyến đi.

* **`US-22` (Đặt câu hỏi cho cộng đồng):**  
  * **As a** Traveler,  
  * **I want to** đăng câu hỏi mới trong diễn đàn thành phố (ví dụ: *"Ăn hải sản ở đâu ngon bổ rẻ tại Đà Nẵng?"*),  
  * **So that** tôi nhận được lời khuyên từ những người đã từng đi trước đó.

* **`US-23` (Đóng góp câu trả lời kèm Huy hiệu xác thực):**  
  * **As an** Experienced Traveler đã có Huy hiệu thành phố,  
  * **I want to** câu trả lời của tôi tự động hiển thị viền vàng nổi bật kèm nhãn **"Da Nang Verified"**,  
  * **So that** ý kiến của tôi được mọi người tin tưởng và đánh giá cao vì tôi đã có trải nghiệm thực tế.

* **`US-24` (Ưu tiên đọc câu trả lời uy tín):**  
  * **As a** Question Asker,  
  * **I want to** nhìn thấy câu trả lời của những người có chứng nhận "City Verified" xuất hiện ở vị trí đầu tiên,  
  * **So that** tôi phân biệt được đâu là lời khuyên thực tế từ người đã từng đi và đâu là ý kiến phỏng đoán.

* **`US-25` (Bình luận & Thả Upvote):**  
  * **As a** Community Member,  
  * **I want to** bấm nút Hữu ích (Upvote) hoặc viết bình luận trao đổi thêm bên dưới câu trả lời,  
  * **So that** tôi bày tỏ sự cảm ơn và làm rõ thêm thông tin.

---

### 🔴 EPIC 6: SYSTEM ADMINISTRATION & CONTENT MODERATION

* **`US-26` (Quản trị danh mục địa danh):**  
  * **As an** Administrator,  
  * **I want to** thêm mới và cập nhật tọa độ GPS, bán kính Geofence và bài viết lịch sử cho các địa danh du lịch,  
  * **So that** dữ liệu địa danh trong hệ thống luôn chính xác và phong phú.

* **`US-27` (Quản trị ngân hàng câu hỏi Quiz):**  
  * **As an** Administrator,  
  * **I want to** thêm mới và cập nhật các câu hỏi trắc nghiệm văn hóa kèm giải thích đáp án đúng,  
  * **So that** bài thi Quiz luôn mới mẻ và mang lại giá trị học thuật cao cho người dùng.

* **`US-28` (Kiểm duyệt nội dung cộng đồng):**  
  * **As a** Moderator / Administrator,  
  * **I want to** nhận các thông báo báo cáo vi phạm và có quyền ẩn hoặc xóa các bài viết rác, xúc phạm,  
  * **So that** diễn đàn Nomadix luôn duy trì một môi trường văn minh, tích cực và đáng tin cậy.
