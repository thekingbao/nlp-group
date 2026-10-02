# **ĐỀ ÁN CONCEPT APP SẠC XE ĐIỆN THẾ HỆ MỚI: NLP-EGREEN**

*Real-time Truth. Zero Anxiety. — Quy chuẩn Thiết kế UI/UX & Kiến trúc Hạ tầng Sản phẩm*

# **1\. Định vị Sản phẩm & Nguyên tắc Thiết kế**

* **Slogan:** *Real-time Truth. Zero Anxiety.* (Dữ liệu xác thực \- Xóa tan âu lo).  
* **Định vị:** Nền tảng điều phối hạ tầng sạc mở (Open Roaming Aggregator) tích hợp xác thực thực địa bằng AI/Crowdsource và kết nối dữ liệu xe thông minh (Telemetry-linked).  
* **Ứng dụng Design System:**  
  * **Typography:** Sử dụng phông chữ **Work Sans** mang tính kỹ thuật, sạch sẽ, tối ưu độ hiển thị ở tốc độ cao khi tài xế đang lưu thông.  
  * **Màu sắc chủ đạo:** Tông nền Dark Mode (`#0D1117` / `#161B22`) giúp chống chói mắt khi lái xe ban đêm; kết hợp điểm nhấn thương hiệu `--primitive-brand-teal` (`#49DBC8`) và `--primitive-brand-green` (`#BEFF6C`) cho trạng thái năng lượng.  
  * **Hệ thống cảnh báo TLP (Trust Level Protocol):** Trực tiếp chuẩn hóa hệ màu TLP token để phản ánh độ tin cậy thực tế của từng điểm sạc.

# **2\. 5 Giải pháp Đột phá Triệt hạ Nhược điểm Cố hữu**

# **2.1 Triệt tiêu "Cổng trống ảo" bằng Giao thức TLP (Trust Level Protocol)**

Hệ thống phân loại mức độ sẵn sàng của cổng sạc dựa trên đa nguồn dữ liệu real-time:

| Cấp độ TLP | Mã Token & Hex Color | Điều kiện Kích hoạt | Trạng thái Hiển thị |
| :---- | :---- | :---- | :---- |
| **TLP Safe** | `--tlp-safe` (`#00D68F`) | Trụ online qua API OCPP \+ có giao dịch sạc thành công \< 15 phút \+ cảm biến/AI xác nhận ô trống. | Khả dụng cao, đảm bảo cắm sạc được ngay. |
| **TLP Caution** | `--tlp-caution` (`#FFAA00`) | Trụ online nhưng không có dữ liệu giao dịch \> 4 giờ, hoặc có báo cáo xe xăng đỗ lấn một phần. | Cần lưu ý, có nguy cơ nghẽn hoặc bị cản trở. |
| **TLP Blocked** | `--tlp-blocked` (`#FF3D71`) | Trụ mất tín hiệu, hỏng ngàm súng sạc, trạm mất điện hoặc bị rào chắn hoàn toàn. | Tạm dừng hoạt động hoặc bị phong tỏa. |
| **TLP System** | `--tlp-system` (`#57606A`) | Trạm bảo trì định kỳ hoặc thuộc mạng lưới nội bộ restricted. | Không phục vụ công cộng. |

* **Check-in nhanh 1-Tap Crowdsourcing:** Thưởng điểm token/voucher sạc trực tiếp cho tài xế cắm sạc nếu xác nhận nhanh trạng thái thực tế (*"Trụ số 2 hỏng súng"*, *"Bị xe xăng đỗ chắn"*).

# **2.2 Dẫn đường Vi mô (Micro-Navigation) & Hàng rào Thực tế**

* **Ghim chính xác cổng vào (Ingress Pin):** Không ghim vị trí giữa trung tâm thương mại. Ghim chuẩn xác ram dốc hầm B2 (kèm giới hạn chiều cao xe) hoặc cổng bảo vệ cho phép xe ngoài vào.  
* **Thẻ thông tin rào cản:** Hiển thị minh bạch trên thẻ trạm: *Phí gửi xe theo giờ*, *Trạm đóng cổng sau 22:00*, *Có bảo vệ hỗ trợ dẫn chỗ đỗ*.

# **2.3 Lập Lộ trình Động học (Dynamic SoC & Elevation Routing)**

* **Kết nối BLE OBD2 / Apple CarKey / Google Auto API:** Tự động đọc chỉ số % SoC, nhiệt độ pin và công suất tiêu thụ thực tế của xe theo thời gian thực.  
* **Thuật toán bù trừ địa hình & tải trọng:** Tự động tính toán độ dốc đèo (tái tạo năng lượng khi đổ dốc, tăng mức tiêu hao khi leo dốc) để gợi ý điểm dừng sạc chuẩn xác từng 1%. Tự động tìm trạm thay thế nếu phát hiện pin tụt nhanh do ngược gió hoặc chạy tốc độ cao.

# **2.4 Thanh toán "Zero-Lock" và Tách biệt Phiên sạc**

* **Cơ chế ký quỹ minh bạch (Escrow Block):** Tiền sạc giữ trong tài khoản trung gian theo từng block nhỏ (10.000 VNĐ).  
* **Xử lý sự cố tức thì:** Nếu trụ ngắt điện đột ngột, phiên sạc tự động hủy trong 3 giây, tiền thừa hoàn trả về ví ngay lập tức—**tuyệt đối không khóa cọc hay chặn cắm trụ kế tiếp**.

# **2.5 Tối ưu Hiệu năng & Năng lượng**

* **Thiết kế tối giản:** Sử dụng bảng màu semantic tối giản, loại bỏ hoàn toàn các hiệu ứng 3D không cần thiết gây hao pin thiết bị.  
* **Viewport Culling Rendering:** Chỉ render các trạm trong bán kính tầm nhìn bản đồ, giảm 70% tải RAM/GPU, duy trì khung hình mượt mà 60/120fps tại các đô thị mật độ cao như Hà Nội và TP.HCM.

# **3\. Design System & UI Wireframe Concept**

# **Quy chuẩn Token UI Màn hình Chính (Map Hub \- Dark Mode)**

| Thành phần UI | Design Token | Giá trị Thiết lập |
| :---- | :---- | :---- |
| **Nền bản đồ / App Background** | `--color-background-primary` | `#0D1117` |
| **Thanh tìm kiếm (Floating Search)** | `--color-surface-raised` | `#22272E` |
| **Viền thanh tìm kiếm** | `--color-border-subtle` | `#21262D` |
| **Bo góc khung tìm kiếm** | `--radius-input` | `12px` |
| **Font chữ chủ đạo** | `--font-sans` | `Work Sans, sans-serif` |
| **Cỡ chữ tìm kiếm** | `--type-body-sm` | `14px` |
| **Ghim trạm Safe** | `--tlp-safe` | `#00D68F` (`20px` icon) |
| **Ghim trạm Caution** | `--tlp-caution` | `#FFAA00` (`20px` icon) |
| **Thanh Bottom Navigation** | `--color-surface-default` | `#1C2128` (Border top: `#30363D`) |
| **Nút Sạc Nhanh Trung Tâm** | `--primitive-brand-teal` | `#49DBC8` (Icon: `#000000`) |

# **4\. Chi tiết Cấu trúc 3 Màn hình Nòng cốt**

# **4.1 Màn hình Chi tiết Trạm (Station Details)**

* **Khối Trust Index:** Đặt ngay dưới tên trạm với dạng Badge bo góc `--radius-badge` (`4px`).  
  * *Hiển thị:* **Độ tin cậy 98% (TLP Safe)** sử dụng màu chữ `--tlp-safe-text` trên nền `--tlp-safe-bg`.  
* **Sơ đồ cổng trực quan (Slot Layout):** Phân chia chi tiết từng trụ sạc A1, A2, B1:  
  * *Trụ A1 (180kW \- CCS2):* Màu `--primitive-brand-green`, nhãn "Sẵn sàng sạc".  
  * *Trụ A2 (180kW \- CCS2):* Màu `--primitive-grey-400`, nhãn "Xe khác đang sạc: 62% \- Còn \~12 phút".  
* **Hướng dẫn vào trạm (Micro-Guide):** Ảnh chụp thực tế lối vào ram dốc hoặc barie kèm chỉ dẫn đường vẽ trực quan.

# **4.2 Màn hình Tiến trình Sạc (Active Charge Dashboard)**

* **Khối hiển thị trung tâm:**  
  * Vòng tròn tiến trình SVG lớn với viền màu `--primitive-brand-teal` (`#49DBC8`).  
  * Chỉ số SoC hiển thị kích thước lớn bằng `--type-h2` (`60px`) kết hợp font `--font-sans` bán đậm (Semi-bold).  
* **Dữ liệu kỹ thuật chuyên sâu (Live Telemetry):**  
  * Dòng điện & Điện áp: `385V - 195A` (Font định dạng mono: `--font-mono`, size `--type-caption`).  
  * Công suất nạp: `75.2 kW` (Nổi bật bằng màu `--color-accent-teal`).  
* **Nút dừng khẩn cấp an toàn:**  
  * Thiết kế dạng trượt dài (Slider Button) bo tròn `--radius-button` (`24px`) viền màu `--primitive-error-500` (`#FF3D71`) nhằm triệt tiêu rủi ro vô tình bấm nhầm.

# **4.3 Màn hình Lập Lộ trình Thông minh (Smart Dynamic Planner)**

* **Đồ thị Elevation & SoC:** Đồ thị trực quan biểu diễn toàn bộ hành trình dài:  
  * Đoạn đường đèo dốc đi kèm cảnh báo màu `--primitive-warning-500`: *"Đoạn đèo dốc \- Mức tiêu hao pin dự kiến \+18%"*.  
  * Điểm dừng sạc tối ưu: Tự động đề xuất dừng tại trạm sạc công suất cao nhất để đạt thời gian chờ tối thiểu (Ví dụ: Chỉ sạc từ 10% đến 65% thay vì mất thời gian chờ sạc đầy 100%).

# **4.4 Sơ đồ Prototype App Screen & Luồng thao tác người dùng (Interaction Architecture)**

* **Luồng Luân chuyển Màn hình (Screen Flow):** \[Màn hình 1: Map Hub\] → Chọn trạm sạc trên bản đồ → \[Màn hình 2: Station Details\] → Nhấn "Dẫn đường" hoặc "Đặt chỗ trước" → \[Màn hình 3: Micro-Navigation\] → Đến nơi & Cắm súng sạc → \[Màn hình 4: QR / Auto-Charge Auth\] → \[Màn hình 5: Active Charge Dashboard\] → Hoàn tất/Ngắt sạc khẩn cấp → \[Màn hình 6: Payment & Escrow Settlement\].  
* **Cấu trúc Tương tác Tối ưu Lái xe (Driver-centric Interaction):**  
  * **Thao tác 1-Tap Check-in:** Nút bấm nhanh nổi góc phải bottom bar với màu `--primitive-brand-teal` cho phép xác nhận TLP Safe/Caution chỉ trong 1 thao tác vuốt.  
  * **Phản hồi Haptic & Visual Feedback:** Mọi thay đổi trạng thái TLP token lập tức cập nhật màu nền ô thông tin với độ trễ \< 200ms.

# **5\. Đánh giá Tính Khả thi & Lộ trình Phát triển**

1. **Giai đoạn 1 (MVP Aggregator):** Xây dựng bản đồ tích hợp chuẩn Open Charge Point Interface (OCPI) kết nối các bên thứ 3 và triển khai cơ chế xác thực TLP bằng đóng góp cộng đồng.  
2. **Giai đoạn 2 (Micro-Data Standard):** Chuẩn hóa tọa độ ram dốc, lối vào hầm và tình trạng barie của 100% trạm sạc tại các đô thị loại 1\.  
3. **Giai đoạn 3 (Hardware Integration):** Ra mắt thiết bị kết nối BLE Dongle, đưa VoltSync trở thành ứng dụng tiên phong tại Việt Nam tự động điều phối lộ trình sạc theo năng lượng thực tế cho mọi dòng xe điện.

# **6\. Chuyên đề Phân tích Chiến lược Đầu tư & Đánh giá Rủi ro Hạ tầng Sạc**

## **6.1 Bảng So sánh 4 Mô hình / Đơn vị Hợp tác Đầu tư**

| Tiêu chí | 1\. TMT-EGREEN (Tập đoàn TMT) | 2\. VN SOLAR (Điện mặt trời \+ BESS) | 3\. Trụ sạc ABB 24kW (Độc lập) | 4\. Nhượng quyền Trụ sạc VP (40–240kW) |
| :---- | :---- | :---- | :---- | :---- |
| **Bản chất mô hình** | Mạng lưới trạm sạc mở quốc gia (CPO), đa dạng mức hợp tác (Zero Capital đến Nhượng quyền). | Mô hình kết hợp Điện mặt trời áp mái \+ Pin lưu trữ BESS \+ Trụ sạc. | Đầu tư trụ DC công suất nhỏ (24kW) ăn chia doanh thu cố định với App. | Bán/nhượng quyền phần cứng trụ sạc DC công suất lớn, chủ đầu tư tự quản lý doanh thu. |
| **Phân khúc công suất** | Rất rộng: AC 7.4–22kW, DC 20–30kW, DC 60–120kW, Trạm siêu tốc 240–1040kW. | Phụ thuộc vào công suất hệ thống BESS và tải điện mặt trời. | Cố định DC 24kW (sạc chậm \- trung bình cho xe con). | DC 40kW, 60kW, 120kW, 240kW (chuẩn súng kép). |
| **Chi phí đầu tư ban đầu** | **0 đồng** (Mô hình TMT đầu tư) hoặc làm hạ tầng, hoặc mua trọn gói. | **0 đồng** chi phí thiết bị (chủ nhà cho thuê mặt bằng mái/đất). | **135 triệu VNĐ** (100tr tiền trụ \+ 35tr lắp đặt, bảo hành, bảo hiểm 5 năm). | Vốn mua trụ lớn (chi phí cao tùy công suất từ 40kW đến 240kW). |
| **Cơ chế thu nhập / Lợi nhuận** | • TMT bao trọn: 800đ/kWh• Cùng làm: 1.000đ/kWh• Tự mua trụ: 1.500đ/kWh• Phí quá giờ: 800–1.500đ/phút. | • Nhận **400đ/kWh** điện dùng cho trụ sạc• Tiết kiệm tiền điện sinh hoạt/kinh doanh tại chỗ (\~1.652đ/kWh). | Chia sẻ doanh thu: **33% cho Nhà đầu tư** (EVN 48%, App vận hành 19%). Cam kết tối thiểu 3.3 tr/tháng. | Hưởng trọn chênh lệch: Tự thu 7.000đ/kWh, trừ điện EVN 50% → **Lời \~3.500đ/kWh**. |
| **Nguồn khách sạc** | Tự động hút khách qua hệ sinh thái: **Grab Driver, VETC, xe Wuling, xe tải HOWO**. | Khách vãng lai tại địa điểm đặt trụ. | Khách vãng lai qua App liên kết. | Tự tìm kiếm hoặc thông qua app đối tác liên kết. |

## **6.2 Mổ xẻ Chi tiết Ưu & Nhược điểm từng Mô hình**

### **1\. TMT-EGREEN (Toàn diện & Tiềm năng nhất cho mặt bằng lớn)**

* **Ưu điểm thực chiến:**  
  * **Hệ sinh thái kéo khách vượt trội:** Kéo trực tiếp tài xế từ **VETC** (hàng triệu xe ô tô), **Grab Driver** (xe công nghệ chạy liên tục) và xe thương mại do TMT phân phối (Wuling, HOWO).  
  * **Linh hoạt phương thức bỏ vốn:** Lựa chọn linh hoạt giữa Mô hình 0 đồng (TMT đầu tư 100%, chia 800đ/kWh) hoặc tự mua trụ để nhận 1.500đ/kWh.  
  * **Pháp lý và chuẩn hóa rõ ràng:** Hợp đồng 10 năm, thẩm định trạm biến áp, PCCC và mặt bằng chuẩn hóa.  
* **Nhược điểm & Rủi ro:**  
  * Yêu cầu nguồn điện 3 pha công nghiệp/trạm biến áp đủ tải và tối thiểu 2 ô đỗ xe chuẩn kèm hợp đồng thuê dài hạn.  
  * Biên lợi nhuận trên mỗi kWh bị chia sẻ thấp hơn mô hình tự làm chủ 100%.

### **2\. VN SOLAR – Điện mặt trời áp mái \+ BESS (Giải pháp cho vùng lưới điện yếu)**

* **Ưu điểm thực chiến:**  
  * **Khắc phục quá tải trạm biến áp:** Sử dụng BESS tích trữ điện mặt trời, cho phép cấp điện ngay cả khi cúp điện lưới hoặc sụt áp.  
  * **Mô hình Zero Capital:** Chủ mặt bằng không mất chi phí đầu tư thiết bị, vừa tiết kiệm chi phí điện tại chỗ (\~1.652đ/kWh) vừa nhận 400đ/kWh từ trụ sạc.  
* **Nhược điểm & Rủi ro:**  
  * Thu nhập từ sạc xe thấp (400đ/kWh).  
  * Yêu cầu diện tích mái lớn và phụ thuộc điều kiện thời tiết/dung lượng pin BESS ban đêm.

### **3\. Đầu tư Trụ sạc ABB 24kW (Bẫy lợi nhuận trên giấy tờ)**

* **Rủi ro chí mạng:**  
  * **Công suất 24kW "lửng lơ":** Sạc pin xe con 60kWh từ 20% lên 80% mất ít nhất 1.5 tiếng (quá chậm cho trạm dừng nghỉ, nhưng lại quá đắt đỏ so với trụ AC 7–11kW ở khách sạn/bãi xe qua đêm).  
  * **Tỷ lệ phân chia bất lợi:** Nhà đầu tư chịu 100% rủi ro phần cứng nhưng chỉ nhận 33% doanh thu (EVN chiếm 48%, App chiếm 19%).  
  * **Rủi ro thiếu dòng xe điều hướng:** Khó đạt con số cam kết nếu trụ nằm ở vị trí vắng vẻ.

### **4\. Mô hình Nhượng quyền Trụ VP 40kW–240kW (Tự chủ tài chính \- Rủi ro vận hành)**

* **Ưu điểm thực chiến:** Biên lợi nhuận gộp lớn (\~3.500đ/kWh), dải công suất chuẩn công nghiệp với 2 súng cân bằng tải.  
* **Nhược điểm & Rủi ro:** Thời gian hoàn vốn dưới 1 năm là lý tưởng hóa. Nhà đầu tư tự gánh rủi ro vắng khách, khấu hao thiết bị, phạt công suất EVN và tự xử lý sự cố kỹ thuật.

## **6.3 Lời khuyên Chiến lược Đầu tư & Định hướng cho VoltSync Aggregator**

* **Đối với CPO/Nhà đầu tư:**  
  * Mặt bằng đắc địa (quốc lộ, cây xăng, bãi xe): Ưu tiên hợp tác mô hình hệ sinh thái mở có nguồn xe cố định (như TMT-EGREEN).  
  * Vùng điện yếu/mái xưởng rộng: Kết hợp BESS \+ Solar để giảm áp lực trạm biến áp.  
  * Tránh đầu tư dàn trải trụ công suất lửng lơ (24kW) thiếu kết nối nền tảng.  
* **Đối với Nền tảng VoltSync:**

Định vị VoltSync là **Aggregator tích hợp đa mô hình**, giúp tài xế nhận diện chính xác công suất thực tế (mô hình BESS hay điện lưới) và mức TLP Trust Level của từng trạm, tối ưu hóa lưu lượng xe cho mọi mô hình đối tác.