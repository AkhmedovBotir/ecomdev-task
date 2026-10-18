# Backend — API (modular monolit)

O‘quv markazi to‘lovlari uchun REST API.

## Stack

- Node.js + **TypeScript**
- **Express** 5
- **MongoDB** + Mongoose
- `tsx` (dev), ESM (`"type": "module"`)

## Ishga tushirish

```bash
cp .env.example .env
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

Default: `http://localhost:4000`

## Environment

| O‘zgaruvchi | Misól | Majburiy |
|-------------|--------|----------|
| `PORT` | `4000` | yo‘q |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/training_center` | ha |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:5174` | yo‘q |

`.env` ni commit qilmang — `.env.example` dan nusxa oling.

## Scripts

| Script | Vazifa |
|--------|--------|
| `npm run dev` | hot-reload (`tsx watch`) |
| `npm run build` | `dist/` ga compile |
| `npm start` | `node dist/index.js` |

## API

### Health

```http
GET /health
→ { "ok": true, "service": "backend" }
```

### Students

| Method | Path | Body / izoh |
|--------|------|-------------|
| `POST` | `/students` | `{ name, phone, group, monthlyFee }` |
| `GET` | `/students` | ro‘yxat |
| `GET` | `/students/:id` | bitta |
| `PUT` | `/students/:id` | qisman yangilash |
| `DELETE` | `/students/:id` | `204` |

`monthlyFee` > 0 bo‘lishi kerak.

### Payments

| Method | Path | Body / izoh |
|--------|------|-------------|
| `POST` | `/payments` | `{ studentId, amount, date? }` |
| `GET` | `/students/:id/payments` | o‘quvchi to‘lovlari |

`date` ixtiyoriy (ISO / `YYYY-MM-DD`); bo‘lmasa — hozirgi vaqt.

### Debtors

```http
GET /debtors?month=YYYY-MM
```

Javob elementi:

```json
{
  "studentId": "...",
  "name": "...",
  "phone": "...",
  "group": "...",
  "monthlyFee": 500000,
  "paid": 200000,
  "debt": 300000
}
```

Oy ichida to‘langan summa `< monthlyFee` bo‘lsa — qarzdor.

## Tuzilma (modular monolit)

```
src/
├── config/
│   ├── env.ts
│   └── db.ts
├── shared/
│   ├── errors.ts        # AppError + error middleware
│   └── asyncHandler.ts
├── modules/
│   ├── students/        # model · service · controller · routes
│   ├── payments/
│   └── debtors/
├── app.ts               # createApp()
└── index.ts             # connectDb + listen
```

Bitta process, domenlar alohida modullarda.

## Xatolar

```json
{ "error": "Student not found" }
```

Status: `400` validatsiya, `404` topilmadi, `500` ichki xato.

## Bog‘liq modullar

- Web: [../Admin](../Admin), [../Students](../Students)
- Bot: [../Bot](../Bot)
- Loyiha: [../README.md](../README.md)
