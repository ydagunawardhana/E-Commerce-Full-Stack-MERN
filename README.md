# 🛒 NexaMart - MERN Stack E-Commerce Platform

**NexaMart** is a fully functional, full-stack E-commerce web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It features a comprehensive Customer Storefront and a powerful Admin Dashboard for managing products, orders, and users.

---

## 🚀 Features

### 👤 User Features (Client Side)
* **Authentication:** Secure Login & Registration (JWT & Google Auth).
* **Product Browsing:** Filter by Category, Price, and Ratings.
* **Shopping Cart:** Real-time cart management with subtotal calculation.
* **Checkout Process:** Secure checkout with Address Management.
* **Payment Integration:** Secure payments via **Stripe**.
* **Order History:** View past orders and real-time order status updates.
* **Responsive Design:** Optimized for Mobile and Desktop.

### 🛠 Admin Features (Admin Dashboard)
* **Dashboard Overview:** Visual analytics of Sales, Orders, and Users.
* **Product Management:** Add, Edit, Delete products with Image Upload (Cloudinary).
* **Order Management:** View all orders and update statuses (Processing, Shipped, Delivered).
* **Real-time Updates:** WebSocket integration for instant inventory and order status reflection.
* **User Management:** View and manage registered users.

---

## 💻 Tech Stack

* **Frontend:** React.js, Material UI, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas)
* **Authentication:** JSON Web Tokens (JWT), Firebase (Google Auth)
* **Payment Gateway:** Stripe
* **Image Storage:** Cloudinary
* **Version Control:** Git & GitHub

---

## 🧪 Testing

* **Unit Testing:** Run npm test in the backend directory.

* **API Testing:** Postman collection is included in the docs folder (if available).

---

## ⚙️ Installation & Run Instructions

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/your-repo-name.git](https://github.com/YourUsername/your-repo-name.git)
cd your-repo-name
2. Backend Setup (Server)
Navigate to the backend folder and install dependencies.

Bash

cd backend
npm install
Environment Variables: Create a .env file in the backend directory and add the following:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:3000
Run the Backend Server:

Bash

npm start
# Server will run on http://localhost:5000
3. Client Side Setup (Frontend)
Open a new terminal, navigate to the client folder, and install dependencies.

Bash

cd frontend
npm install
Run the Client Application:

Bash

npm run dev
# App will run on http://localhost:5173
4. Admin Dashboard Setup
Open a new terminal, navigate to the admin folder, and install dependencies.

Bash

cd admin
npm install
Run the Admin Dashboard:

Bash

npm run dev
# Admin Panel will run on http://localhost:3000

