# 💸 Expense Tracker

A simple full-stack expense tracker that allows users to manage and track their daily expenses with ease.

## 🚀 Features

- 🔐 User authentication and login with Google
- ➕ Add, update, and delete expenses
- 📊 View total spending and breakdown by category
- 📅 Filter expenses by category
- 🌐 Responsive UI for desktop and mobile


## 🛠 Tech Stack

### 🔹 Frontend

- React.js (Vite)
- Axios
- React Router
- Tailwind CSS

### 🔹 Backend

- Node.js
- Express.js
- MongoDB (via Mongoose)

## 🧑‍💻 Getting Started

To run this project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/kalgi18/ExpenseTracker.git
```

### 2. Install and Run the Frontend

```bash
cd ExpenseTracker/frontend
npm install
npm run dev
```

### 3. Install and Run the Backend

```bash
cd ../server
npm install
npm start
```

### ✅ Requirements

- [Node.js](https://nodejs.org/) and npm installed
- [MongoDB](https://www.mongodb.com/) running locally or with a cloud connection string

### 📍 Default Ports

- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:5000/`

## 📌 Notes

- Make sure MongoDB is running or the connection string is correctly configured in the backend (`server/.env` file).
- You can add environment variables like `MONGODB_URI`, `PORT`, etc., in the backend `.env` file.
