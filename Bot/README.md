# Bot — Telegram (Grammy)

Topshiriq **Часть 2 — Variant A**.

Backend API orqali qarzdorlarni ko‘rsatadi va to‘lov qo‘shadi.

## Stack

- Node.js + **TypeScript**
- **[Grammy](https://grammy.dev)**
- `dotenv`, `tsx`

## Ishga tushirish

1. [@BotFather](https://t.me/BotFather) dan token oling  
2. [Backend](../Backend) ishlayotgan bo‘lsin  

```bash
cp .env.example .env
# BOT_TOKEN=123456:ABC...
# API_URL=http://localhost:4000
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Environment

| O‘zgaruvchi | Tavsif | Majburiy |
|-------------|--------|----------|
| `BOT_TOKEN` | Telegram bot token | ha |
| `API_URL` | Backend base URL | yo‘q (default `http://localhost:4000`) |

`.env` ni commit qilmang.

## Buyruqlar

| Buyruq | Vazifa |
|--------|--------|
| `/start` | Yordam matni |
| `/debt` | Joriy oy (`YYYY-MM`) qarzdorlari |
| `/pay <studentId> <amount>` | To‘lov kiritish |

Misol:

```text
/debt
/pay 67f1a2b3c4d5e6f789012345 150000
```

`studentId` — MongoDB ObjectId (Admin/Students’da o‘quvchi ID yoki `/debt` javobidagi ID).

## Tuzilma

```
src/
├── config/
│   └── env.ts
├── api/
│   └── client.ts      # fetchDebtors, createPayment
├── commands/
│   ├── debt.ts
│   └── pay.ts
└── index.ts
```

## Backend bog‘lanishi

- `GET {API_URL}/debtors?month=YYYY-MM`
- `POST {API_URL}/payments` — `{ studentId, amount }`

## Scripts

| Script | Vazifa |
|--------|--------|
| `npm run dev` | watch mode |
| `npm run build` | compile |
| `npm start` | production |

## Muammolar

| Muammo | Yechim |
|--------|--------|
| `Missing BOT_TOKEN` | `.env` ga token yozing |
| API xatosi | Backend yoqiqmi, `API_URL` to‘g‘rimi? |
| Qarzdorlar bo‘sh | Oy uchun to‘lovlar / o‘quvchilar borligini tekshiring |

## Bog‘liq

- API: [../Backend](../Backend)
- Loyiha: [../README.md](../README.md)
