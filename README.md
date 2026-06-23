# 🍹 مشروبات مشبرة (Cold Drinks & Juices Store)

"مشروبات مشبرة" is a modern, responsive, full-stack e-commerce web application for a premium cold juices and iced beverages brand. It features a stunning customer digital menu, custom item customization options, an interactive cart system, pin-on-map location checkout, and an administrative control panel for managing products, prices, and preparing orders.

---

## 🧱 Technology Stack

### Frontend
* **Core Framework**: React.js (v19) with TypeScript
* **Routing**: React Router DOM (v7)
* **Styling**: Tailwind CSS (v4) for premium look and feel
* **Form & Validation**: React Hook Form + Zod validation
* **Animations**: Framer Motion for smooth micro-animations and status transitions
* **State & Flow**: Context APIs (Auth, Cart, Favorites, Orders)

### Backend & Database
* **Server Framework**: Node.js with Express.js (TypeScript)
* **Database**: SQLite (Self-contained file database via `sqlite3` and `sqlite` wrapper)
* **Security & Auth**: JWT (JSON Web Tokens), `bcryptjs` password hashing, Helmet security headers, CORS protection
* **Uploads**: Cloudinary integration with local filesystem static fallback
* **Rate Limiter**: Express Rate Limit protection on API endpoints

---

## 📂 Project Directory Structure

```
عصاير/
├── frontend/             # React Client SPA
│   ├── src/
│   │   ├── assets/       # Media, SVGs, images
│   │   ├── components/   # UI elements (Cards, Customizer, Navbar, Footer)
│   │   ├── context/      # AuthContext, CartContext, FavoriteContext, OrderContext
│   │   ├── pages/        # Customer (Home, Menu, Checkout, Profile) & Admin dashboard
│   │   ├── services/     # Axios API service instances (auth, products, orders)
│   │   └── types/        # Type definition files
│   └── package.json
├── backend/              # Node.js Express REST API
│   ├── src/
│   │   ├── config/       # SQLite Connection pool & Cloudinary settings
│   │   ├── controllers/  # REST Logic (Auth, Products, Orders, Categories)
│   │   ├── middleware/   # JWT verify guard, role limits, error handling
│   │   ├── models/       # Table structures & db seeding script
│   │   ├── routes/       # API router tables
│   │   └── index.ts      # Server bootstrap script
│   ├── database.sqlite   # Local SQLite database file
│   └── package.json
├── docker-compose.yml    # Monorepo container deployment configurations
└── README.md             # Setup and developer guidelines (this file)
```

---

## 🧩 Database Schema (SQLite)

We use SQLite for local persistence with the following schema mappings:

### 1. `users` Table
* `id` (TEXT PRIMARY KEY) - UUID based on timestamp.
* `name` (TEXT NOT NULL) - Customer's full name.
* `email` (TEXT UNIQUE NOT NULL) - Login credential email.
* `phone` (TEXT) - Primary contact phone.
* `role` (TEXT DEFAULT 'customer') - Admin / Customer access level.
* `password` (TEXT NOT NULL) - Bcrypt hashed password.
* `savedAddresses` (TEXT) - JSON array of delivery address strings.
* `createdAt` (DATETIME) - Creation timestamp.

### 2. `products` Table
* `id` (TEXT PRIMARY KEY) - Product identification code.
* `name` (TEXT NOT NULL) - Beverage name in Arabic.
* `description` (TEXT) - Descriptive description.
* `image` (TEXT) - Hosted link or uploaded file path.
* `category` (TEXT) - Category filter slug (`juices`, `cocktails`, `cold-coffee`, `specials`).
* `price` (REAL NOT NULL) - Base price for medium size.
* `rating` (REAL DEFAULT 5.0) - Ratings (1-5).
* `reviewsCount` (INTEGER DEFAULT 1) - Number of reviews.
* `isFeatured` (INTEGER DEFAULT 0) - Banner feature toggle (0 or 1).
* `isSpecial` (INTEGER DEFAULT 0) - Special menu indicator (0 or 1).
* `availableSizes` / `availableSugar` / `availableIce` / `availableExtras` (TEXT) - JSON-encoded customization profiles.

### 3. `orders` Table
* `id` (TEXT PRIMARY KEY) - Custom order string (e.g. `ORD-9201`).
* `userId` (TEXT) - Associated customer account (FOREIGN KEY -> users.id).
* `customerName` (TEXT NOT NULL) - Receiver name.
* `phone` (TEXT NOT NULL) - Customer phone.
* `address` (TEXT NOT NULL) - Delivery details.
* `totalPrice` (REAL NOT NULL) - Order total price.
* `deliveryFee` (REAL DEFAULT 10) - Flat delivery fee.
* `status` (TEXT DEFAULT 'received') - Order status (`received`, `preparing`, `delivering`, `completed`).
* `paymentMethod` (TEXT DEFAULT 'cod') - `cod` (Cash on Delivery) or `online` (Stripe integration).
* `createdAt` (TEXT) - Order placement timestamp.
* `estimatedDelivery` (TEXT) - Arrival window.

### 4. `order_items` Table
* `id` (TEXT PRIMARY KEY) - Item unique index.
* `orderId` (TEXT NOT NULL) - Parent order (FOREIGN KEY -> orders.id ON DELETE CASCADE).
* `productId` (TEXT NOT NULL) - Purchased product code.
* `name` (TEXT NOT NULL) - Product title.
* `image` (TEXT) - Product image link.
* `quantity` (INTEGER NOT NULL) - Quantity ordered.
* `selectedSize` (TEXT) - Chosen size.
* `selectedSugar` (INTEGER) - Chosen sugar content (%).
* `selectedIce` (TEXT) - Chosen ice content.
* `selectedExtras` (TEXT) - JSON array of selected custom toppings/additions.
* `customizedPrice` (REAL NOT NULL) - Price per item with modifiers.

---

## 🔐 REST API Routes

### Authentication (`/api/auth`)
* `POST /register` - Register a new customer account.
* `POST /login` - Login, returns JWT token and user profile.
* `GET /me` - Get current active profile data (requires token).
* `PUT /profile` - Update profile data (name, phone, addresses) (requires token).

### Products (`/api/products`)
* `GET /` - List products (filters by category `?category=xxx` or search `?q=xxx`).
* `GET /:id` - Get details of a single product.
* `POST /` - Add a new product (requires admin token).
* `PUT /:id` - Modify product details (requires admin token).
* `DELETE /:id` - Remove a product (requires admin token).
* `POST /upload` - Upload product image to Cloudinary/local fallback (requires admin token).

### Orders (`/api/orders`)
* `POST /` - Submit a new checkout order (guest or authenticated).
* `GET /` - List order logs. (Admin retrieves all orders. Customers retrieve their own orders).
* `GET /customer/:phone` - Query orders matching a phone number (tracking utility).
* `GET /:id` - Query a specific order details.
* `PUT /:id/status` - Update order progression status (requires admin token).

### Categories (`/api/categories`)
* `GET /` - Fetch classification categories.

---

## ⚙️ Quick Start Installation

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Option A: Local Run (No Docker)

#### 1. Setup the Backend
1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Set up the environment variables in a `.env` file (one has been preloaded for you):
   ```env
   PORT=5000
   JWT_SECRET=super_secret_shabar_key_2026_drink_cold
   DATABASE_FILE=./database.sqlite
   ```
4. Run the seed script to compile and setup the SQLite DB with default admin and products:
   ```bash
   npm run seed
   ```
   * *Created Admin Account:* `admin@mshabar.com` (password: `admin123`)
   * *Created Customer Account:* `user@mshabar.com` (password: `user123`)
5. Start the Express development server:
   ```bash
   npm run dev
   ```

#### 2. Setup the Frontend
1. Open a new terminal and go to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

### Option B: Run with Docker Compose (Recommended for Production)

Run the entire monorepo with single command using Docker. This boots backend on port 5000 and frontend on port 3000:

1. In the root directory (containing `docker-compose.yml`), run:
   ```bash
   docker-compose up --build
   ```
2. Once the container compilation completes, access:
   * **Frontend Application:** [http://localhost:3000/](http://localhost:3000/)
   * **Backend API Base:** [http://localhost:5000/api](http://localhost:5000/api)
3. DB structures are automatically created and seeded inside the backend container storage volume.
