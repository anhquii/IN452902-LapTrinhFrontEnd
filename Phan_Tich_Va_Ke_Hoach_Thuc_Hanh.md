# PHẦN 1: Phân tích đề thi theo đúng phong cách bài giảng của thầy Kiệt

Đề thi thực hành 90 phút này là bản **rút gọn của dự án EduHub Web** trên lớp (bỏ qua Vite/TypeScript/chia module, gom về 3 file `index.html`, `css/style.css`, `js/app.js`). Khi chấm, thầy soi rất kỹ các quy tắc đã dặn trong slide **"Lỗi hay gặp"**:

## 1. Những điểm đặc trưng trong bài giảng của thầy (rất dễ mất điểm hoặc bị lộ nếu làm sai phong cách)

- **Cấm dùng `#id` để viết CSS (Mục 2.1 & Bài tập Ch2):**
  - Trong slide Ch2, thầy nhấn mạnh: *"ID chỉ dùng cho link neo / JS, **không dùng `#id` để tạo kiểu CSS**"*.
  - Đề bài yêu cầu `id="search-form"`, `id="keyword"`, `id="status"`, `id="event-list"` là để phục vụ **JavaScript (`querySelector`)** và `<label for="keyword">`. Còn khi viết CSS ở `style.css`, bạn nên đặt thêm **class** (ưu tiên kiểu BEM đơn giản như `.search-form`, `.event-list`, `.card`, `.card__body`, `.badge--full`...) thay vì viết `#search-form { ... }` hay `#event-list { ... }`.
- **Không viết mã màu trực tiếp trong component (Mục 2.6 Ch2):**
  - Mọi màu sắc (`#006CB4`, `#E40C24`, màu viền, màu nền...) và khoảng cách đều khai báo trong `:root` rồi gọi qua `var(--...)`.
- **Thứ tự Heading & Accessibility (Mục 1.5 & 1.6 Ch1):**
  - Toàn trang chỉ có **một `<h1>`** (*Sự kiện sắp diễn ra*), tiêu đề mỗi card dùng **`<h2>`** (không nhảy cấp `h1` → `h3`).
  - Ô tìm kiếm bắt buộc có `<label for="keyword">` đi kèm `id="keyword"` (không chỉ dùng `placeholder`).
- **Quy tắc JavaScript chuẩn ESLint của Ch3 (Mục 3.1, 3.5, 3.6, 3.7 Ch3):**
  - Chỉ dùng `const` (và `let` khi thật sự cần gán lại), **cấm `var`**, dùng so sánh chặt `===`, nối chuỗi bằng Template Literal `` `...` ``.
  - Viết hàm mũi tên `const tenHam = (...) => { ... }` đồng bộ với hàm `formatDateTime` thầy cho sẵn.
  - Tạo DOM bằng `createElement` + `textContent` + `setAttribute` + `replaceChildren(...cards)`, **tuyệt đối không dùng `innerHTML`** (chống XSS).
  - Dựng query bằng `URLSearchParams`, kiểm tra `if (!response.ok)` sau `fetch`.

---

# PHẦN 2: Kế hoạch thực hành 6 bước (Bạn tự gõ — Mình hướng dẫn & chấm từng bước)

Để bạn thực sự hiểu và tự viết được trong phòng thi, mình sẽ **không viết sẵn cả bài nữa**. Chúng ta sẽ đi từng bước ngắn:

| Bước | Nội dung thực hành | File làm việc | Thời lượng dự kiến |
| :--- | :--- | :--- | :--- |
| **Bước 1** | Dựng khung HTML5 ngữ nghĩa: `<head>`, `<header>`, `<main>`, `<form>`, `<footer>` | `site/index.html` | ~10 phút |
| **Bước 2** | Viết 2 `<article>` card sự kiện mẫu đúng chuẩn semantic + BEM của thầy | `site/index.html` | ~10 phút |
| **Bước 3** | Viết CSS nền tảng: `:root` tokens, `box-sizing`, style `body`, Flexbox cho Header & Form (chỉ dùng `.class`, không dùng `#id`) | `site/css/style.css` | ~10 phút |
| **Bước 4** | Viết CSS Grid mobile-first (1 → 2 → 3 cột) và style cho Card + nhãn "Hết chỗ" | `site/css/style.css` | ~10 phút |
| **Bước 5** | Viết JS Câu 2a (`formatSeats`) và Câu 2b (`renderEvents` bằng DOM thuần + `replaceChildren`) | `site/js/app.js` | ~15 phút |
| **Bước 6** | Viết JS Câu 2c (`loadEvents` với `URLSearchParams`, `fetch`, `response.ok`, 4 trạng thái `#status`, sự kiện `submit`) & Test lỗi `--fail` | `site/js/app.js` | ~15 phút |

## Cách chúng ta phối hợp:

1. Trước khi bắt đầu, bạn có thể **xoá trắng nội dung cũ** trong `site/index.html`, `site/css/style.css`, và phần code thêm trong `site/js/app.js` (chỉ chừa lại 11 dòng đầu của thầy) để tự tay làm lại từ đầu.
2. Ở mỗi bước, mình sẽ nêu **yêu cầu + công thức ngắn gọn**, bạn tự gõ vào VS Code theo ý bạn rồi bấm `Ctrl + S`.
3. Khi bạn nhắn **"xong bước 1"** (hoặc hỏi chỗ đang vướng), mình sẽ đọc file của bạn để kiểm tra và hướng dẫn bước tiếp theo.
