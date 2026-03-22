# Virtual Medical System (Frontend Only)

This project now runs as a frontend-only React app with dummy authentication.

## Structure

```
virtual-medical-system/
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Dummy Login Users

- admin / admin009
- doctor / doctor123
- patient / patient123
- pharmacist / pharma123

## Notes

- No backend is required.
- No JWT token is used.
- Signup and login are handled locally in the browser using dummy users.
