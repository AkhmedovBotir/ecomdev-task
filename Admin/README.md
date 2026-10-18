# Admin — web panel

Admin uchun mobilga qulay interfeys: qarzdorlar, to‘lovlar, o‘quvchilar CRUD.

Topshiriq **Часть 2 — Variant B** (va undan ko‘proq: to‘liq CRUD).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion

## Ishga tushirish

Avval [Backend](../Backend) ishlashi kerak (`http://localhost:4000`).

```bash
cp .env.example .env
npm install
npm run dev
```

Brauzer: [http://localhost:5173](http://localhost:5173)

Build:

```bash
npm run build
npm run preview
```

## Environment

| O‘zgaruvchi | Default |
|-------------|---------|
| `VITE_API_URL` | `http://localhost:4000` |

Vite proxy: `/api` → Backend (ixtiyoriy; asosan to‘g‘ridan `VITE_API_URL` ishlatiladi).

## Bo‘limlar

| Tab | Imkoniyat |
|-----|-----------|
| **Qarzdorlar** | Oy tanlash (`YYYY-MM`), ro‘yxat, tezkor **To‘lov** modal |
| **To‘lovlar** | To‘lov qo‘shish (modal), o‘quvchi tarixini ko‘rish |
| **O‘quvchilar** | CRUD (qo‘shish / tahrir / o‘chirish — modallar + iconlar) |

## Tuzilma

```
src/
├── components/
│   ├── DebtorsSection.tsx
│   ├── PaymentsSection.tsx
│   ├── StudentsSection.tsx
│   ├── StudentFormModal.tsx
│   ├── PaymentFormModal.tsx
│   ├── ConfirmModal.tsx
│   ├── Modal.tsx
│   └── icons.tsx
├── lib/
│   ├── api.ts      # apiFetch (204 / error JSON)
│   └── format.ts   # pul, sana DD.MM.YYYY
├── types.ts
├── App.tsx
└── main.tsx
```

## API chaqiriqlari

- `GET /debtors?month=`
- `GET|POST /students`, `PUT|DELETE /students/:id`
- `POST /payments`
- `GET /students/:id/payments`

## Scripts

| Script | Vazifa |
|--------|--------|
| `npm run dev` | development |
| `npm run build` | production build |
| `npm run preview` | build’ni ko‘rish |
| `npm run lint` | ESLint |

## Bog‘liq

- API: [../Backend](../Backend)
- Loyiha: [../README.md](../README.md)
