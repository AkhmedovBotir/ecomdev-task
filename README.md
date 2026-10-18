# Mini-учёт оплат учебного центра (Ecomdev)

O‘quv markazi uchun to‘lovlar hisobi — test topshirig‘i.

| Modul | Stack | Port / izoh |
|--------|--------|-------------|
| [Backend](./Backend) | Node.js, Express, TypeScript, MongoDB | `http://localhost:4000` |
| [Admin](./Admin) | React, Vite, Tailwind, Framer Motion | `http://localhost:5173` |
| [Students](./Students) | React, Vite, Tailwind, Framer Motion | `http://localhost:5174` |
| [Bot](./Bot) | Node.js, TypeScript, Grammy | Telegram |

## Talablar

- Node.js **20+**
- **MongoDB** (lokal yoki Atlas)
- Telegram Bot Token — faqat bot uchun ([@BotFather](https://t.me/BotFather))

## Noldan ishga tushirish

### 1. MongoDB

```bash
# misol: lokal
mongodb://127.0.0.1:27017/training_center
```

### 2. Backend

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

Tekshiruv: [http://localhost:4000/health](http://localhost:4000/health)

### 3. Admin (web)

```bash
cd Admin
cp .env.example .env
npm install
npm run dev
```

Ochish: [http://localhost:5173](http://localhost:5173)  
Bo‘limlar: **Qarzdorlar**, **To‘lovlar**, **O‘quvchilar**.

### 4. Students (web)

```bash
cd Students
cp .env.example .env
npm install
npm run dev
```

Ochish: [http://localhost:5174](http://localhost:5174)

### 5. Telegram bot (ixtiyoriy, Variant A)

```bash
cd Bot
cp .env.example .env
# BOT_TOKEN=...  API_URL=http://localhost:4000
npm install
npm run dev
```

- `/debt` — joriy oy qarzdorlari  
- `/pay <studentId> <amount>` — to‘lov kiritish  

> Topshiriqda interfeys **yoki** bot, **yoki** web. Loyihada **ikkalasi** ham bor.

## API (Часть 1)

| Method | Path | Tavsif |
|--------|------|--------|
| `POST` / `GET` | `/students` | Yaratish / ro‘yxat |
| `GET` / `PUT` / `DELETE` | `/students/:id` | Bitta o‘quvchi |
| `POST` | `/payments` | `{ studentId, amount, date? }` |
| `GET` | `/students/:id/payments` | O‘quvchi to‘lovlari |
| `GET` | `/debtors?month=YYYY-MM` | Qarzdorlar |

**Qarzdor:** oy ichida `paid < monthlyFee` → `debt = monthlyFee - paid`.

Maydonlar:

- O‘quvchi: `name`, `phone`, `group`, `monthlyFee`
- To‘lov: `studentId`, `amount`, `date`

## Loyiha tuzilmasi

```
task/
├── Backend/     # modular monolit API
├── Admin/       # admin web (qarzdorlar + to‘lov + CRUD)
├── Students/    # o‘quvchilar paneli
├── Bot/         # Telegram bot
├── README.md
└── PART4.md     # AI haqida matn (Telegram’ga nusxa)
```

## Agar yana bir hafta bo‘lsa (Часть 3.2)

1. **Auth va rollar** — admin / operator; bot uchun `TELEGRAM_ADMIN_IDS`.
2. **Integration testlar** — debtors hisobi, students/payments CRUD.
3. **Validatsiya** — Zod, telefon formatini standartlash.
4. **Observability** — request id, strukturaviy loglar.
5. **UI** — pagination, Excel export, filtrlash.

## Topshiriq checklist

| Qism | Holat |
|------|--------|
| Часть 1 — API | ✅ |
| Часть 2 — Bot va/yoki Web | ✅ (ikkalasi) |
| Часть 3 — README | ✅ |
| Часть 4 — AI matni | ✅ → [PART4.md](./PART4.md) |

## Yuborish (`@code_debugger007`)

1. GitHub repo linki (`.env` commit qilinmasin)
2. [PART4.md](./PART4.md) matni
3. Sarflangan soatlar (o‘zingiz yozing)

Har bir modul ichida alohida README: [Backend](./Backend/README.md), [Admin](./Admin/README.md), [Students](./Students/README.md), [Bot](./Bot/README.md).
