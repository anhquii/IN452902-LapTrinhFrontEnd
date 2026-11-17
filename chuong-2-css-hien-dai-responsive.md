# IN4529 · Chương 2: CSS hiện đại & Responsive

- **Học phần:** Lập trình Front End (`IN4529`)
- **Trường:** Trường Đại học Đồng Tháp — Khoa Công nghệ và Kỹ thuật
- **Giảng viên:** ThS. Nguyễn Tuấn Kiệt
- **Năm học:** 2026–2027
- **Từ khoá:** `CSS`, `Flexbox`, `Grid`, `Responsive`

---

## Nội dung Chương 2

- Ôn lại Chương 1
- **2.1** Selector, specificity, cascade, `@layer`
- **2.2** Box model, đơn vị, màu, font
- **2.3** Flexbox — dàn hàng một chiều
- **2.4** Grid — lưới hai chiều
- **2.5** Responsive mobile-first *(Mở rộng)*
- **2.6** CSS hiện đại: token, nesting, `:has()`
- **2.7** Tổ chức CSS: BEM · Tailwind v4

> **Mục tiêu thực hành:** EduHub Web sau Chương 2 ở `1280px` (4 cột) và `375px` (1 cột). Giữ nguyên HTML của Chương 1, chỉ viết CSS.

---

## Ôn lại Chương 1

1. Trình duyệt dựng trang từ HTML ra **DOM**. CSS thì được dựng thành cái gì (CSSOM), và hai thứ đó gặp nhau ở bước nào (Render Tree)?
2. Trang `events.html` có `<nav>`, `<main>`, `aria-current="page"`. Ba thứ này giúp gì cho người dùng trình đọc màn hình?
3. Vì sao ta tách **nội dung (HTML)** khỏi **trình bày (CSS)**? Nếu muốn đổi màu xanh của cả 4 trang, sửa ở đâu là nhanh nhất? *(Đây chính là lý do chương này có design token ở mục 2.6).*

---

## 2.1 Selector, specificity, cascade & kế thừa

### Ví dụ đời thường: nội quy nhiều cấp
- **Nội quy trường** (*“Sinh viên mặc áo trắng.”*): Áp cho mọi người — giống selector thẻ `p`.
- **Quy định lớp** (*“Lớp IN4529 mặc áo xanh ngày thứ Hai.”*): Cụ thể hơn — giống `.class`.
- **Riêng một bạn** (*“Bạn An làm MC, mặc áo dài.”*): Cụ thể nhất — giống `#id`.
- **Con giống cha mẹ** (họ, quê quán truyền từ cha mẹ sang con): giống **kế thừa** (`color`, font).

### Cú pháp một rule CSS

```css
h1 { font-size: var(--text-3xl); }
```

- `h1`: **selector** (chọn ai?)
- `font-size`: **property** (đổi gì?)
- `var(--text-3xl)`: **value** (thành gì?)
- `font-size: var(--text-3xl);`: **declaration** (khai báo)
- Cả khối `selector { ... }` gọi là một **rule** (quy tắc). Một tệp CSS = nhiều rule.

Gắn CSS bằng `<link>` trong `<head>` (4 trang chỉ liên kết một tệp `main.css`):

```html
<link rel="stylesheet" href="css/main.css">
```

### Các loại selector hay dùng

| Loại | Ví dụ trong EduHub | Chọn phần tử nào |
|---|---|---|
| Thẻ | `h1`, `a`, `img` | Mọi thẻ cùng tên |
| Class | `.btn`, `.card__title` | Phần tử có `class="btn"` |
| Thuộc tính | `[aria-current="page"]` | Phần tử có thuộc tính đó |
| Con cháu | `.card__title a` | `a` nằm bên trong `.card__title` |
| Pseudo-class | `:hover`, `:focus-visible`, `:user-invalid` | Theo **trạng thái** (đang rê chuột, đang focus…) |
| Pseudo-element | `::before`, `::after`, `::marker` | Một **phần** của phần tử (dấu đầu dòng…) |
| ID | `#noi-dung` | Một phần tử duy nhất — **không dùng để tạo kiểu** (chỉ dùng cho link neo “Bỏ qua…”) |

### Specificity — “điểm cụ thể” của selector

So từ cột trái sang phải `(ID - Class - Thẻ)`, giống so số 3 chữ số (`1-0-0` thắng `0-9-9`):

| Selector | ID | Class | Thẻ |
|---|---:|---:|---:|
| `h1` | 0 | 0 | 1 |
| `.card__title a` | 0 | 1 | 1 |
| `.site-nav__link[aria-current="page"]` | 0 | 2 | 0 |
| `#noi-dung` | 1 | 0 | 0 |
| `:where(h1, p)` | 0 | 0 | 0 |

Hai rule cùng chọn một phần tử, cùng đổi một thuộc tính → rule có **điểm cao hơn** thắng.

### Cascade — trình duyệt chọn rule nào?

Bốn bước phân xử của cascade (bước trên còn hoà mới xét bước dưới):
1. **Nguồn gốc:** trình duyệt `<` tác giả (`!important` đảo lại)
2. **`@layer`:** lớp khai báo SAU thắng lớp trước
3. **Specificity:** điểm cao hơn thắng
4. **Thứ tự:** rule viết SAU thắng rule trước

Ví dụ: `a { color: var(--color-link); }` ở `base.css` (lớp `base`, điểm `0-0-1`) bị `.site-nav__link { color: ... }` ở `components.css` (lớp sau, điểm `0-1-0`) thắng.

### Kế thừa (inheritance)
- **Kế thừa từ cha:** `color`, `font-family`, `font-size`, `line-height` → đặt một lần ở `body`, cả trang dùng theo.
- **Không kế thừa:** `margin`, `padding`, `border`, `background`, `width` → phải đặt riêng cho từng phần tử.
- Ô nhập, nút *mặc định không kế thừa font* → ép bằng `inherit`:

```css
body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
}

:where(input, button, select, textarea) {
  font: inherit;
  color: inherit;
}
```

### `@layer` — xếp CSS thành các tầng

Thứ tự ưu tiên tăng dần: `tokens` → `base` → `layout` → `components`.
- Lớp khai báo SAU thắng lớp TRƯỚC, bất kể specificity.
- Rule không thuộc lớp nào thắng mọi lớp.
- Nhờ `@layer`, không cần “đua điểm” specificity hay `!important`: `components` luôn thắng `base`.

Trong `css/main.css`:

```css
@layer tokens, base, layout, components;

/* @import phải đứng đầu tệp (chỉ sau dòng @layer ở trên) */
@import url("tokens.css") layer(tokens);
@import url("base.css") layer(base);
@import url("layout.css") layer(layout);
@import url("components.css") layer(components);
```

### Lỗi hay gặp — selector & cascade
- ✗ Dùng `#id` để tạo kiểu → điểm `1-0-0`, sau này không ghi đè nổi → ✓ Dùng `class`; ID chỉ để làm neo link.
- ✗ Thêm `!important` mỗi khi CSS “không ăn” → ✓ Mở DevTools → Styles: tìm rule bị gạch ngang và lý do.
- ✗ Viết `@import` giữa tệp → bị bỏ qua, không báo lỗi → ✓ `@layer` rồi `@import` ở **đầu** tệp.
- ✗ Đặt `margin` ở `body` mong các thẻ con kế thừa → ✓ `margin` không kế thừa; đặt cho đúng phần tử.

### Thử ngay 2.1 & Đáp án gợi ý
- `.card:has(.badge--hot)` = `0-2-0` (`:has()` lấy điểm của thứ bên trong); `.field input:focus-visible` = `0-2-1`; `:where(h1, p)` = `0-0-0`.
- `a { color: blue }` (`base`) vs `.site-nav__link { color: white }` (`components`): **Trắng** vì lớp `components` khai báo sau. Nếu đổi `@layer` thành `components, base` thì `base` thành lớp sau → chữ màu **xanh** dù điểm thấp hơn (lớp quyết định trước specificity).
- `:where()` để reset margin có specificity `0-0-0` nên các rule sau ghi đè dễ dàng.

---

## 2.2 Box model, đơn vị, màu & font

### Ví dụ đời thường: khung tranh treo tường
- **Bức tranh:** phần vẽ chính = `content` (chữ, ảnh).
- **Viền giấy trắng:** khoảng đệm quanh tranh, cùng màu nền tranh = `padding`.
- **Khung gỗ:** đường bao ngoài cùng của tranh = `border`.
- **Khoảng cách tới tranh bên cạnh:** chỗ trống bên ngoài khung = `margin`.

### Box model & `box-sizing`
- Bốn lớp từ ngoài vào: `margin` → `border` → `padding` → `content`.
- **`content-box` (mặc định):** `width: 260px` + `padding: 20px` + `border: 8px` → hộp thật rộng `260 + 2×20 + 2×8 = 316px`.
- **`border-box`:** `width: 260px` → hộp thật rộng **đúng `260px`**, `content` tự co lại.

```css
/* Tính width/height gồm cả padding và border → dễ đoán kích thước hơn */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### Đơn vị đo: `px`, `rem`, `%`, `vw`, `ch`

| Đơn vị | Nghĩa | Dùng trong EduHub |
|---|---|---|
| `px` | Điểm ảnh cố định | Viền mỏng `1px`, bóng đổ |
| `rem` | Bội số cỡ chữ gốc (mặc định `16px`) | Khoảng cách `--space-4: 1rem`, breakpoint `40rem` |
| `%` | Phần trăm của phần tử cha | `max-inline-size: 100%` cho ảnh |
| `vw` / `vh` | 1% bề rộng / chiều cao màn hình | Trong `clamp()`, `min-block-size: 100vh` |
| `ch` | Bề rộng chữ “0” | `max-inline-size: 60ch` → dòng chữ dễ đọc |

> Nếu người dùng tăng cỡ chữ trình duyệt lên `20px`: `1rem` thành `20px`, còn `16px` vẫn là `16px`.

### `clamp()` — chữ to dần theo màn hình
Cú pháp: `clamp(nhỏ nhất, ưu tiên (co giãn), lớn nhất)`

```css
--text-3xl: clamp(1.875rem, 1.3rem + 2.4vw, 3rem);
```

- `h1` của EduHub: sàn `30px` (`1.875rem`), co giãn theo màn hình, trần `48px` (`3rem`, chạm trần khi màn hình khoảng `1133px`).

### Màu trong CSS

| Cách viết | Ví dụ | Ghi chú |
|---|---|---|
| Hex | `#003f87` | Palette EduHub trong `tokens.css` |
| `rgb()` + độ trong | `rgb(0 29 69 / 0.08)` | Bóng đổ `--shadow-sm` |
| `color-mix()` | `color-mix(in srgb, var(--color-surface-muted) 40%, transparent)` | Hàng chẵn của bảng |
| `oklch()` | `oklch(38% 0.134 257)` ≈ `#003f87` | Sáng · đậm · sắc độ — chỉnh độ sáng “đều mắt” hơn (sửa số đầu `38%` để sáng/tối hơn) |

### Font: system font stack và Google Fonts

```css
--font-sans: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

- **Font stack:** thiếu font trước thì lấy font sau → nhanh, chạy cả khi mất mạng.
- `font-display: swap`: hiện chữ bằng font dự phòng ngay, tải xong mới đổi → không bị “trắng chữ”. Google Fonts bật sẵn bằng `&display=swap` trong URL.

### Lỗi hay gặp — box model & đơn vị
- ✗ `width: 100%` + `padding` → tràn ngang, hiện thanh cuộn → ✓ `box-sizing: border-box` cho mọi phần tử.
- ✗ Cỡ chữ, khoảng cách viết toàn `px` → ✓ `rem` để tôn trọng cỡ chữ người dùng chọn.
- ✗ `font-size: 5vw` → điện thoại chữ tí hon, màn to chữ khổng lồ → ✓ `clamp(min, ...vw, max)` có sàn và trần.
- ✗ Tải 6 kiểu font từ Google Fonts “cho chắc” → ✓ Chỉ tải đúng độ đậm dùng tới, kèm `display=swap`.

> **Ghi chú:** EduHub dùng thuộc tính logic `inline-size` thay cho `width`, `block-size` thay cho `height`, `margin-block-start`... để tương thích theo chiều viết chữ. Nút `.btn` có `min-block-size: 2.75rem` (44px) để vừa ngón tay.

---

## 2.3 Flexbox — dàn hàng một chiều

### Ví dụ đời thường: xếp hàng chào cờ
- **Một hàng ngang:** Flexbox dàn phần tử theo **một chiều**.
- **Giãn đều:** `justify-content: space-between`.
- **Thẳng hàng:** `align-items: center`.
- **Hết chỗ thì xuống hàng:** `flex-wrap: wrap`.

### Hai trục của Flexbox
- Bật bằng `display: flex` ở **cha** (flex container); các con trực tiếp thành flex item.
- `flex-direction: row` (mặc định): trục chính ngang (`justify-content`), trục phụ dọc (`align-items`).
- `flex-direction: column`: hai trục đổi chỗ — trục chính quay dọc (`justify-content`), trục phụ nằm ngang (`align-items`).

### Thuộc tính hay dùng

**Đặt ở cha (container):**
- `display: flex`: Bật Flexbox
- `flex-direction`: `row` | `column`
- `flex-wrap: wrap`: Hết chỗ thì xuống dòng
- `justify-content`: Căn trục chính (`flex-start`, `center`, `space-between`, ...)
- `align-items`: Căn trục phụ
- `gap`: Khoảng cách giữa các con (có thể viết 2 giá trị: `hàng cột`)

**Đặt ở con (item):**
- `flex: 1`: Giãn ra lấp chỗ trống
- `margin-block-start: auto`: Đẩy item xuống cuối (trong cột)
- `align-self`: Căn riêng một item
- `order`: Đổi thứ tự hiển thị *(cẩn thận a11y)*

### Header & Card trong EduHub

```css
.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
  padding-block: var(--space-3);
}

.site-nav__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: 0;
  list-style: none;
}
```

Card cao bằng nhau, dòng “Còn … chỗ” luôn nằm đáy nhờ `margin-block-start: auto`:

```css
.card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.event-card__seats {
  margin-block-start: auto;
  padding-block-start: var(--space-3);
}
```

### Lỗi hay gặp — Flexbox
- ✗ Đặt `justify-content` ở con → ✓ Đặt ở **cha** có `display: flex`.
- ✗ Đổi `flex-direction: column` rồi vẫn dùng `justify-content` để căn ngang → ✓ Cột thì trục chính dọc → căn ngang bằng `align-items`.
- ✗ Menu nhiều mục tràn ngang trên điện thoại → ✓ `flex-wrap: wrap` + `gap`.
- ✗ Dùng `margin-right` cho từng mục để tạo khoảng cách → ✓ `gap` ở cha — không thừa khoảng ở mục cuối.

---

## 2.4 Grid — lưới hai chiều

### Ví dụ đời thường: sơ đồ chỗ ngồi phòng thi
- **Hàng và cột:** Grid điều khiển **hai chiều** cùng lúc.
- **Bàn giám thị:** một phần tử trải nhiều ô (vùng `area`).
- **Lối đi:** khoảng trống cố định giữa các dãy = `gap`.
- **Phòng to, phòng nhỏ:** phòng rộng kê nhiều cột, phòng hẹp ít cột = `auto-fit`.

### Giải phẫu một lưới
- Đường kẻ (`line`) đánh số từ `1` · cột/hàng = `track` · khoảng giữa = `gap`.
- `fr` = “một phần” chỗ trống còn lại (`2fr 1fr` → cột trái gấp đôi cột phải).
- `grid-template-columns: 1fr 1fr 1fr` → ba cột chia đều phần còn lại.
- `grid-column: 2 / 4` → trải từ đường kẻ dọc số 2 đến số 4.

### `grid-template-areas` — vẽ bố cục bằng chữ (trang chi tiết)

```css
.detail {
  display: grid;
  gap: var(--space-6);

  @media (width >= 64rem) {
    grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
    grid-template-areas:
      "head head"
      "media info"
      "content info"
      "prep info"
      "foot foot";
    column-gap: var(--space-8);
  }
}

/* Gán vùng chỉ trong @media: tên vùng không tồn tại ở 1 cột sẽ sinh ra cột ngầm thừa */
@media (width >= 64rem) {
  .detail__head    { grid-area: head; }
  .detail__media   { grid-area: media; }
  .detail__content { grid-area: content; }
  .detail__prep    { grid-area: prep; }
  .detail__foot    { grid-area: foot; }

  .detail__info {
    grid-area: info;
    align-self: start;
    position: sticky;        /* cột phải đứng yên khi cuộn nội dung */
    inset-block-start: 6rem; /* chừa chỗ cho header sticky */
  }
}
```

> Mỗi chuỗi = **một hàng**; tên lặp lại = vùng trải nhiều ô.

### `auto-fit` + `minmax()`: lưới tự đổi số cột

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
  gap: var(--space-6);
  padding: 0;
  list-style: none;
}
```

- Mỗi cột tối thiểu `16rem` (hoặc `100%` nếu màn nhỏ hơn `16rem` để không tràn ngang).
- Còn chỗ thì thêm cột, thiếu chỗ thì xuống hàng — **không cần media query** (`375px` → 1 cột, `768px` → 2 cột, `1280px` → 4 cột).

### `subgrid` — hàng con thẳng theo lưới cha
`subgrid` giúp lưới con mượn đường kẻ của lưới cha → tiêu đề, mô tả của các card dài ngắn khác nhau vẫn thẳng hàng.

```css
.card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}
```

### So sánh Flexbox và Grid

| | Flexbox | Grid |
|---|---|---|
| **Số chiều** | Một chiều: hàng *hoặc* cột | Hai chiều: hàng *và* cột |
| **Ai quyết định kích thước** | Nội dung đẩy ra ngoài | Lưới định sẵn, nội dung xếp vào |
| **Trong EduHub** | Header, menu, nhóm nút, thân card, radio “viên thuốc” | Lưới card, trang chi tiết, form 2 cột, `<dl>` 2 cột |
| **Mẹo nhớ** | “Xếp hàng” | “Kẻ ô bàn cờ” |

> Hai cách không loại trừ nhau: card nằm trong **Grid**, bên trong card lại là **Flexbox**.

### Lỗi hay gặp — Grid
- ✗ Gán `grid-area` ở ngoài `@media` → ở 1 cột sinh cột ngầm thừa → ✓ Chỉ gán vùng trong `@media` nơi có `grid-template-areas`.
- ✗ `minmax(16rem, 1fr)` → màn `240px` vẫn tràn ngang → ✓ `minmax(min(16rem, 100%), 1fr)`.
- ✗ Chuỗi areas thiếu ô hoặc vùng không thành hình chữ nhật → ✓ Mỗi hàng đủ số cột; vùng phải là hình chữ nhật liền.
- ✗ Thêm 3 media query để đổi `1→2→3` cột cho lưới card → ✓ `auto-fit` + `minmax` tự xử lý.

---

## 2.5 Responsive mobile-first

### Tư duy Mobile-first & 2 breakpoint của EduHub
- Bắt buộc có trong `<head>`: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **CSS mặc định (ngoài `@media`):** điện thoại (1 cột, menu xuống dòng).
- **Mốc `40rem` (`640px`, `sm`):** header sticky, form 2 cột.
- **Mốc `64rem` (`1024px`, `lg`):** hero 2 cột, trang chi tiết 2 cột.
- Mỗi tầng chỉ thêm/đổi vài dòng; màn rộng nhận cả 3 tầng cộng dồn.

### Media query: cú pháp range + lồng trong rule

```css
.container {
  inline-size: 100%;
  max-inline-size: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--space-4);

  @media (width >= 40rem) {
    padding-inline: var(--space-6);
  }
}

.site-header {
  z-index: 10;
  background-color: var(--color-header-bg);
  color: var(--color-header-text);
  box-shadow: var(--shadow-md);

  @media (width >= 40rem) {
    position: sticky;
    inset-block-start: 0;
  }
}
```

- `width >= 40rem` (cú pháp range) dễ đọc hơn `min-width: 40rem` — cùng nghĩa.

### Ảnh & Bảng responsive

```css
img,
svg {
  display: block;
  max-inline-size: 100%;
  block-size: auto;
}

.card__media {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

- `srcset` / `sizes` giúp trình duyệt tự chọn ảnh vừa đủ nét; thuộc tính `width`/`height` giữ chỗ để trang không “nhảy” (EduHub dùng SVG nên không cần `srcset`).
- Bảng quá rộng cho `375px`: bọc trong `.table-wrap { overflow-x: auto; }` để chỉ bảng cuộn ngang, cả trang không cuộn ngang.

### Mở rộng: Container queries (`@container`)
- `@media` hỏi *“màn hình rộng bao nhiêu?”*.
- `@container` hỏi *“khung chứa rộng bao nhiêu?”* → một component dùng được ở mọi chỗ:

```css
.card-slot { container-type: inline-size; }

@container (width >= 28rem) {
  .card { flex-direction: row; }
}
```

### Lỗi hay gặp — responsive
- ✗ Viết desktop trước, rồi `max-width` để “sửa” cho điện thoại → ✓ Mobile-first: mặc định = điện thoại, `width >= ...` để mở rộng.
- ✗ Mỗi trang một bộ breakpoint `600, 768, 992, 1200…` → ✓ Đúng 2 mốc chung `40rem`, `64rem` (ghi trong `tokens.css`).
- ✗ Quên `<meta name="viewport">` → điện thoại hiện bản thu nhỏ → ✓ Luôn có meta viewport trong `<head>`.
- ✗ `fieldset`/bảng làm cả trang cuộn ngang → ✓ `min-inline-size: 0` cho `fieldset`; bảng bọc `.table-wrap`.
- **Kiểm tra không cuộn ngang:** Chạy trong Console ở `375 / 768 / 1280px`: `document.documentElement.scrollWidth <= innerWidth` phải trả về `true`.

---

## 2.6 CSS hiện đại

### Design token: 3 tầng biến & Dark mode
1. **Palette (giá trị gốc):** `--palette-blue-700: #003f87;`
2. **Token theo vai trò:** `--color-primary: var(--palette-blue-700);`
3. **Component dùng token:** `.btn--primary { background-color: var(--color-primary); }`

Khai báo trong `:root`, đọc bằng `var(--ten-bien)`. Component **không viết mã màu trực tiếp**.

Dark mode bằng `prefers-color-scheme` (chỉ đổi giá trị token ở giữa, component không sửa một dòng nào):

```css
:root {
  color-scheme: light dark;
  --palette-blue-900: #001d45;
  --palette-blue-700: #003f87;
  --color-primary: var(--palette-blue-700);
  --space-4: 1rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: var(--palette-blue-300);
    --color-primary-hover: #a9cbff;
    --color-on-primary: var(--palette-blue-900);
    --color-accent-strong: var(--palette-cyan-500);
    --color-bg: #000f26;
  }
}
```

### Nesting gốc & `:has()` (chọn cha theo con)
- `&` = “chính selector cha” (`&:hover` nghĩa là `.card:hover`). Đừng lồng quá 3 cấp.
- `:has()` chọn phần tử cha dựa vào trạng thái/sự tồn tại của con:

```css
.card {
  &:hover {
    translate: 0 -4px;
    box-shadow: var(--shadow-lg);
  }
  &:has(.badge--hot) {
    border-color: var(--color-warning);
  }
}

.choice {
  &:has(input:checked) {
    border-color: var(--color-primary);
    background-color: var(--color-surface-muted);
    font-weight: var(--weight-semibold);
  }
}
```

### `:is()` và `:where()` — viết gọn danh sách

| | `:is(A, B)` | `:where(A, B)` |
|---|---|---|
| **Nghĩa** | “là A *hoặc* B” | “là A *hoặc* B” |
| **Điểm specificity** | Cao nhất trong danh sách | Luôn `0-0-0` |
| **Dùng khi** | Kiểu của component (vd `& :is(th, td)`) | Reset, mặc định (vd `:where(body, h1, p) { margin: 0; }`) |

### Transition, Animation & `prefers-reduced-motion`
- `transition`: đổi từ trạng thái A → B mượt; liệt kê đúng thuộc tính cần chuyển (ưu tiên `translate`, `opacity`, `box-shadow`, tránh `transition: all`).
- `animation` + `@keyframes`: tự chạy, lặp lại.
- **Tôn trọng người dùng:** tắt chuyển động khi hệ điều hành bật `prefers-reduced-motion: reduce` (**đây là chỗ duy nhất được dùng `!important`**):

```css
@keyframes pulse {
  50% { opacity: 0.3; }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Lỗi hay gặp — CSS hiện đại
- ✗ Viết `color: #003f87` thẳng trong component → ✓ `color: var(--color-primary)` để dark mode tự đúng.
- ✗ Dark mode viết lại `.card`, `.btn`… trong `@media` → ✓ Chỉ đổi giá trị token trong `:root`.
- ✗ `var(--color-primay)` gõ sai tên → màu mất, không báo lỗi → ✓ Dùng autocomplete VS Code & DevTools → Computed.
- ✗ Dùng `:invalid` → form đỏ lòm ngay khi vừa mở → ✓ `:user-invalid` chỉ báo lỗi sau khi người dùng nhập/rời ô.
- ✗ `transition: all` trên mọi thứ → ✓ Liệt kê thuộc tính cần chuyển; tôn trọng `reduced-motion`.

---

## 2.7 Tổ chức CSS: BEM & Tailwind

### BEM — đặt tên class có hệ thống
- **Block** (khối độc lập): `.card`, `.btn`
- **Element** (bộ phận của khối, nối bằng `__`): `.card__media`, `.card__body`, `.card__title`
- **Modifier** (biến thể, nối bằng `--`): `.btn--primary`, `.btn--ghost`, `.badge--hot`
- Tên class phẳng (điểm `0-1-0`), không đụng nhau giữa các khối.
- Element luôn gắn với block: `.card__title`, **không** viết `.card__body__title`.
- `event-card` là block mở rộng của `card`: `<article class="card event-card">`.

### Utility-first: Tailwind CSS v4
- CSS thuần + BEM (Ch2): đặt tên class theo ý nghĩa, HTML gọn, CSS dài — học để hiểu gốc rễ.
- Tailwind CSS (dùng chính từ Ch4 - React): mỗi class = một việc nhỏ (`flex`, `p-6`, `sm:sticky`, `hover:-translate-y-1`).
- **Tailwind CSS v4 cấu hình bằng `@theme` trong CSS** (không còn `tailwind.config.js` kiểu v3):

```css
@import "tailwindcss" source(none);
@source "../events.html";

@theme {
  --color-primary: #003f87;
  --color-primary-light: #7fb2ff;
  --breakpoint-sm: 40rem;
  --breakpoint-lg: 64rem;
}
```

- `--color-primary` trong `@theme` tự sinh class `bg-primary`, `text-primary`; build bằng `npm run build`; nhớ có `.gitignore` để không đẩy `node_modules/` lên GitHub.

---

## Tổng kết Chương 2

- **Cascade:** nguồn → `@layer` → specificity → thứ tự. Dùng class, tránh ID và `!important`.
- **Box model:** `box-sizing: border-box`; đơn vị `rem`, `clamp()` cho chữ co giãn.
- **Layout:** Flexbox một chiều (header, menu, thân card) · Grid hai chiều (lưới card, trang chi tiết).
- **Lưới tự đổi cột:** `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))` không cần media query.
- **Mobile-first:** CSS mặc định cho điện thoại, 2 mốc `40rem` / `64rem`; không cuộn ngang ở `375px`.
- **CSS hiện đại:** Design token → dark mode chỉ đổi token; `:has()`, nesting, `:user-invalid`.
- **Accessibility:** focus rõ, vùng chạm `>= 44px`, `prefers-reduced-motion`.
- **Tổ chức CSS:** Đặt tên BEM; Tailwind v4 (`@theme`) là hướng utility-first dùng chính từ Ch4.

---

## Câu hỏi tự kiểm tra (Checkpoint — Chương 2)

1. `.nav a` và `a:hover` cùng đổi màu link. Điểm specificity mỗi bên? Nếu bằng nhau thì sao?
2. Hộp `width: 300px; padding: 16px; border: 2px` rộng bao nhiêu khi `content-box`? `border-box`?
3. Khi nào chọn Flexbox, khi nào chọn Grid? Cho một ví dụ mỗi loại trong EduHub.
4. Vì sao CSS mặc định (ngoài `@media`) nên viết cho điện thoại?
5. Làm dark mode mà không sửa component: token đặt ở đâu, đổi ở khối nào?

---

## Bài tập Chương 2 — EduHub Web responsive

| Mã | Cấp | Việc | Điểm |
|---|---|---|---:|
| `ch2-T1` | Warm-up | Design token + dark mode (`tokens.css`) | 15 |
| `ch2-T2` | Warm-up | `@layer` + `@import`; base: `box-sizing`, focus, `reduced-motion` | 15 |
| `ch2-T3` | Applied | Khung mobile-first: header Flexbox, hero 1→2 cột, nút, skip link | 20 |
| `ch2-T4` | Applied | Lưới card `auto-fit`, card BEM + nesting, `:has()`, FAQ | 20 |
| `ch2-T5` | Applied | Trang chi tiết `grid-template-areas`, bảng cuộn trong khung | 15 |
| `ch2-T6` | Applied | Form 2 cột, radio `:has(input:checked)`, `:user-invalid` | 15 |
| `ch2-T7` | Challenge | Trang sự kiện bằng Tailwind CSS v4 + `@theme` | +10 |

- Starter: `02_Projects/ch02/starter/` — HTML có sẵn, chỉ viết CSS theo `TODO(ch2-Tk)`.
- Không `float`, không `!important` (trừ `reduced-motion`), không ID selector.

---

## Xem trước Chương 3 — JavaScript hiện đại & DOM

- **Nội dung Chương 3:** JavaScript ES2025 (biến, hàm, mảng, đối tượng); DOM (tìm phần tử, sự kiện `click`, `submit`); `fetch` + `async/await` gọi mock API; sinh card sự kiện từ API thay cho HTML tĩnh; tìm kiếm, lọc, đăng ký sự kiện thật. *(CSS Ch2 giữ nguyên — JS chỉ thêm/bớt class).*
- **Cần chuẩn bị:** Xong `ch2-T1…T6`, kiểm `375 / 768 / 1280px` không cuộn ngang, `npx -y html-validate@latest "*.html"` → 0 lỗi, cài **Node.js 24 LTS** (`node -v`).
