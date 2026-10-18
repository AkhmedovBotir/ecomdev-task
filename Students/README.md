# Students — o‘quvchilar paneli

O‘quvchilar bilan ishlash: qidiruv, CRUD, detail, to‘lovlar.

Admin’dan farqi: fokus o‘quvchi kartochkasi va to‘lov tarixida.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion

## Ishga tushirish

Avval [Backend](../Backend) yoqilgan bo‘lsin.

```bash
cp .env.example .env
npm install
npm run dev
```

Brauzer: [http://localhost:5174](http://localhost:5174)

```bash
npm run build
npm run preview
```

## Environment

| O‘zgaruvchi | Default |
|-------------|---------|
| `VITE_API_URL` | `http://localhost:4000` |

## Imkoniyatlar

1. **Ro‘yxat** — ism / telefon / guruh bo‘yicha qidiruv  
2. **Qo‘shish / tahrirlash** — modal  
3. **O‘chirish** — tasdiqlash modali  
4. **Detail** — oylik to‘lov, to‘lovlar ro‘yxati, **To‘lov qo‘shish** modal  

## Tuzilma

```
src/
├── components/
│   ├── StudentList.tsx
│   ├── StudentDetail.tsx
│   ├── StudentFormModal.tsx
│   ├── PaymentFormModal.tsx
│   ├── ConfirmModal.tsx
│   ├── Modal.tsx
│   └── icons.tsx
├── lib/
│   ├── api.ts
│   ├── studentsApi.ts
│   └── format.ts
├── types.ts
├── App.tsx
└── main.tsx
```

## API

- `GET|POST /students`
- `PUT|DELETE /students/:id`
- `GET /students/:id/payments`
- `POST /payments`

## Scripts

| Script | Vazifa |
|--------|--------|
| `npm run dev` | development (port **5174**) |
| `npm run build` | production build |
| `npm run preview` | preview |
| `npm run lint` | ESLint |

## Bog‘liq

- API: [../Backend](../Backend)
- Admin: [../Admin](../Admin)
- Loyiha: [../README.md](../README.md)
