# Personal Finance Tracker

A modern, intuitive web app to help you **track your income and expenses**, **analyze financial behavior**, and **export reports effortlessly**. Built for individuals who want clarity and control over their personal finances.

---

## Features

- **Dashboard Overview**  
  Track your total income, expenses, and current balance in real-time.

- **Monthly Breakdown**  
  Beautifully rendered bar and pie charts help you visualize your spending patterns.

- **Email OTP Login**  
  Secure one-time password (OTP) sent to your email for authentication — no password needed.

- **Category Management**  
  Add, edit, and personalize categories with emoji labels.

- **Detailed Transaction History**  
  Log and filter all transactions with date, amount, type, and description.

- **Export to Excel (.xlsx)**  
  Instantly download your full transaction history for reporting or backup.

- **Swipe-to-Delete**  
  Intuitive swipe gesture for deleting transactions (mobile friendly).

- **Profile Management**  
  Update your full name and avatar image with ease.

---

## Tech Stack

### Frontend

- **React 19 + Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Recharts**
- **Emoji Picker React**
- **React Hot Toast**
- **Moment.js**

### Backend

- **Node.js + Express**
- **MongoDB with Mongoose**
- **Zod** – request validation
- **Nodemailer** – OTP email sending
- **xlsx** – Excel file generation
- **Multer** – file handling (if needed)
- **JWT** – token management (optional/session)

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/alwi2022/personal-finance-tracker.git
```

### 2. Install & Run

#### Frontend

```bash
cd personal-finance-frontend
npm install
npm run dev
```

#### Backend

```bash
cd expanse-tracker-backend
npm install
npm run dev
```

### 3. Configure `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret
```

---

## Upcoming Enhancements

- [ ] Multi-user accounts
- [ ] Recurring transactions
- [ ] Email-based monthly reports
- [ ] Mobile app support
- [ ]  Cloudinary Integration – for secure and optimized avatar image uploads
