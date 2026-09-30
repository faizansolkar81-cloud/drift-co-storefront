# Drift & Co. — E-Commerce Website (B.Sc. IT College Project)

A full-stack clothing e-commerce website with a React + TypeScript frontend and a FastAPI + MySQL backend.

## Project Structure

```
project/
├── src/                    # Frontend (React + TypeScript + Tailwind CSS)
│   ├── components/          # Reusable UI components
│   ├── context/             # Global state (cart, auth, orders)
│   ├── data/                # Sample product data (fallback)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   └── utils/               # API client & formatting helpers
│
├── backend/                # Backend (Python + FastAPI + MySQL)
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # Database connection & setup
│   ├── models.py            # SQLAlchemy ORM models (tables)
│   ├── schemas.py           # Pydantic validation schemas
│   ├── auth_utils.py        # Password hashing & JWT tokens
│   ├── seed_data.py         # Sample data (24 products, reviews, admin user)
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── routers/             # API route handlers
│       ├── auth.py          # Register, login, profile
│       ├── products.py      # CRUD, search, filter products
│       ├── cart.py           # Add, update, remove cart items
│       ├── orders.py        # Create, view, update orders
│       ├── reviews.py       # Add & fetch reviews
│       └── admin.py          # Admin dashboard (users, orders, stats)
│
└── README.md               # This file
```

---

## Prerequisites

1. **Python 3.10+** — [Download here](https://www.python.org/downloads/)
2. **MySQL 8.0+** — [Download here](https://dev.mysql.com/downloads/installer/)
3. **Node.js 18+** — [Download here](https://nodejs.org/)

---

## Setup Instructions

### Step 1: Install MySQL

1. Install MySQL Server on your computer.
2. During installation, set a root password and remember it.
3. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```
   (Enter your password when prompted. Type `exit` to quit.)

> **Note:** You do NOT need to manually create the database. The FastAPI backend creates the `drift_and_co` database automatically on first startup.
>
> **Alternative:** You can also set up the database manually using the SQL script:
> ```bash
> mysql -u root -p < backend/database_setup.sql
> ```
> This creates the database, all tables, and inserts 24 sample products, sample reviews, and a demo admin user.

### Step 2: Set Up the Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy the environment file and update it with your MySQL credentials:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in a text editor and set your MySQL password:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   DB_NAME=drift_and_co
   ```

6. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   You should see output like:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

7. Open the Swagger API documentation in your browser:
   ```
   http://localhost:8000/docs
   ```
   This lets you test all API endpoints interactively.

### Step 3: Set Up the Frontend

1. Open a **new terminal** (keep the backend running in the first one).

2. Navigate to the project root folder:
   ```bash
   cd project
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the website in your browser:
   ```
   http://localhost:5173
   ```

> **Note:** The frontend works even without the backend running. It falls back to localStorage. When the backend is running, the frontend automatically uses the API.
>
> **Changing the API URL:** The frontend defaults to `http://localhost:8000`. To point it at a different backend (e.g. production), create a `.env` file in the project root:
> ```
> VITE_API_URL=https://your-api-domain.com
> ```

### Render Showcase Deployment

The root `render.yaml` defines a free Render static site and FastAPI web service. To deploy, sign in to Render, choose **New > Blueprint**, connect this GitHub repository, and apply the Blueprint.

This configuration is for a public demo, not production customer data. By default, the free API service uses temporary SQLite storage; registered users, carts, and orders can be lost when the service restarts or redeploys. To use managed PostgreSQL, set `DATABASE_URL` as a secret environment variable on the Render API service. This takes precedence over `DB_ENGINE` and `DB_PATH`; do not commit a real connection URL. Free services may take about a minute to wake after inactivity, and free database plans have storage and usage limits. The hosted demo disables the seeded admin and demo accounts. Use private admin credentials and backups before real transactions.

---

## Demo Accounts (Local Only)

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@driftandco.com   | admin123   |
| User  | rahul@example.com      | pass123    |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| POST   | /register   | Register a new user      |
| POST   | /login      | Log in (returns JWT)     |
| GET    | /profile    | Get current user profile  |

### Products (`/api/products`)
| Method | Endpoint          | Description                              |
|--------|-------------------|------------------------------------------|
| GET    | /                 | List products (with filters)             |
| GET    | /{id}             | Get a single product                     |
| POST   | /                 | Add a product (admin only)               |
| PUT    | /{id}             | Update a product (admin only)            |
| DELETE | /{id}             | Delete a product (admin only)            |

**Query parameters for GET /api/products:**
- `gender` — men, women, kids
- `category` — category name (e.g. T-Shirts, Sarees)
- `size` — available size (e.g. M, L, 32)
- `color` — available color (e.g. Black, White)
- `min_price` — minimum price in INR
- `max_price` — maximum price in INR
- `min_rating` — minimum rating (0–5)
- `search` — search by product name or category

### Cart (`/api/cart`)
| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| GET    | /              | View cart                      |
| POST   | /items         | Add item to cart               |
| PUT    | /items/{id}    | Update item quantity           |
| DELETE | /items/{id}    | Remove item from cart          |
| DELETE | /              | Clear entire cart              |

### Orders (`/api/orders`)
| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | /                  | Create order from cart         |
| GET    | /                  | List user's orders             |
| GET    | /{id}              | Get a specific order           |
| PUT    | /{id}/status       | Update order status (admin)    |

### Reviews (`/api/reviews`)
| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /product/{id}         | Get reviews for a product      |
| POST   | /                     | Add a review                   |

### Admin (`/api/admin`)
| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | /stats                    | Sales statistics               |
| GET    | /users                    | List all users                 |
| DELETE | /users/{id}               | Delete a user                  |
| GET    | /orders                   | List all orders                |
| PUT    | /orders/{id}/status       | Update order status            |
| GET    | /revenue-by-gender        | Revenue by gender              |
| GET    | /orders-by-status         | Orders grouped by status       |

---

## Database Schema

The MySQL database `drift_and_co` has 8 tables with proper primary keys, foreign keys, and indexes. A complete SQL setup script is in `backend/database_setup.sql`.

### Table: `users`
Stores registered users (both regular customers and admins).

| Column    | Type         | Key       | Description                        |
|-----------|--------------|-----------|------------------------------------|
| id        | INT          | PK, AUTO  | Unique user ID                     |
| name      | VARCHAR(100) |           | Full name                          |
| email     | VARCHAR(200) | UNIQUE    | Login email                        |
| password  | VARCHAR(255) |           | Bcrypt hash (never plain text)     |
| role      | VARCHAR(20)  |           | `user` or `admin`                  |
| joined    | DATETIME     |           | Registration timestamp             |

### Table: `categories`
Product categories grouped by gender (men, women, kids).

| Column | Type         | Key       | Description                        |
|--------|--------------|-----------|------------------------------------|
| id     | INT          | PK, AUTO  | Unique category ID                 |
| name   | VARCHAR(100) | UNIQUE    | e.g. T-Shirts, Sarees, Jeans       |
| gender | VARCHAR(20)  |           | `men`, `women`, or `kids`          |

### Table: `products`
The product catalog. Prices in INR. Sizes and colors are comma-separated strings.

| Column       | Type         | Key       | Description                        |
|--------------|--------------|-----------|------------------------------------|
| id           | INT          | PK, AUTO  | Unique product ID                  |
| name         | VARCHAR(200) |           | Product name                       |
| price        | INT          |           | Price in INR (₹)                   |
| category_id  | INT          | FK → categories.id | Category link            |
| gender       | VARCHAR(20)  |           | `men`, `women`, or `kids`          |
| image        | TEXT         |           | Product image URL                  |
| description  | TEXT         |           | Product description                |
| sizes        | TEXT         |           | Comma-separated (e.g. "S,M,L,XL")  |
| colors       | TEXT         |           | Comma-separated (e.g. "Black,Red") |
| rating       | FLOAT        |           | Average rating (0–5)               |
| review_count | INT          |           | Number of reviews                  |
| trending     | BOOLEAN      |           | Shown in "Trending" section        |
| new_arrival  | BOOLEAN      |           | Shown in "New Arrivals" section    |
| stock        | INT          |           | Available inventory count          |

### Table: `cart`
One cart per user (1:1 relationship).

| Column | Type | Key               | Description              |
|--------|------|-------------------|--------------------------|
| id     | INT  | PK, AUTO          | Unique cart ID           |
| user_id| INT  | FK → users.id, UNIQUE | Owning user          |

### Table: `cart_items`
Individual items inside a cart (many-to-one with cart).

| Column         | Type        | Key                | Description                    |
|----------------|-------------|--------------------|--------------------------------|
| id             | INT         | PK, AUTO           | Unique cart item ID            |
| cart_id        | INT         | FK → cart.id       | Parent cart                    |
| product_id     | INT         | FK → products.id   | Product added to cart          |
| quantity       | INT         |                    | Quantity selected              |
| selected_size  | VARCHAR(20) |                    | Chosen size                    |
| selected_color | VARCHAR(50) |                    | Chosen color                   |

### Table: `orders`
Placed orders with customer shipping information.

| Column            | Type         | Key                | Description                    |
|-------------------|--------------|--------------------|--------------------------------|
| id                | VARCHAR(50)  | PK                 | Order ID (e.g. ORD-1695000000-1) |
| user_id           | INT          | FK → users.id      | Placing user                   |
| total             | INT          |                    | Total amount in INR            |
| date              | DATETIME     |                    | Order timestamp                |
| status            | VARCHAR(20)  |                    | Pending/Processing/Shipped/etc. |
| customer_name     | VARCHAR(100) |                    | Shipping name                  |
| customer_email    | VARCHAR(200) |                    | Contact email                  |
| customer_phone    | VARCHAR(20)  |                    | Contact phone                  |
| customer_address  | TEXT         |                    | Street address                 |
| customer_city     | VARCHAR(100) |                    | City                           |
| customer_state    | VARCHAR(100) |                    | State                          |
| customer_pincode  | VARCHAR(20)  |                    | Postal pincode                 |
| customer_country  | VARCHAR(50)  |                    | Country (default: India)       |

### Table: `order_items`
Products within an order (snapshot of product details at time of purchase).

| Column     | Type         | Key                | Description                    |
|------------|--------------|--------------------|--------------------------------|
| id         | INT          | PK, AUTO           | Unique order item ID           |
| order_id   | VARCHAR(50)  | FK → orders.id     | Parent order                   |
| product_id | INT          | FK → products.id   | Product reference              |
| name       | VARCHAR(200) |                    | Product name (snapshot)        |
| price      | INT          |                    | Price in INR (snapshot)        |
| quantity   | INT          |                    | Quantity ordered               |
| size       | VARCHAR(20)  |                    | Selected size                  |
| color      | VARCHAR(50)  |                    | Selected color                 |
| image      | TEXT         |                    | Product image (snapshot)       |

### Table: `reviews`
Customer reviews and ratings for products.

| Column     | Type         | Key                  | Description                  |
|------------|--------------|----------------------|------------------------------|
| id         | INT          | PK, AUTO             | Unique review ID             |
| product_id | INT          | FK → products.id     | Product being reviewed       |
| user_id    | INT          | FK → users.id (NULL) | Reviewing user (nullable)   |
| author     | VARCHAR(100) |                      | Reviewer name                |
| rating     | INT          |                      | Star rating (1–5)            |
| date       | DATETIME     |                      | Review timestamp             |
| comment    | TEXT         |                      | Review text                  |

### Entity Relationships

```
users (1) ──< (1) cart ──< (N) cart_items >── (1) products
users (1) ──< (N) orders ──< (N) order_items >── (1) products
users (1) ──< (N) reviews >── (1) products
categories (1) ──< (N) products
```

### Indexes

| Index                  | Table       | Purpose                          |
|------------------------|-------------|----------------------------------|
| idx_users_email        | users       | Fast login lookup by email       |
| idx_categories_name    | categories  | Fast category name lookups       |
| idx_products_name      | products    | Product search by name           |
| idx_products_gender    | products    | Filter products by gender        |
| idx_orders_user_id     | orders      | List a user's orders quickly     |
| idx_orders_status      | orders      | Filter orders by status          |
| idx_reviews_product_id | reviews     | Fetch a product's reviews fast   |

---

## Testing the APIs

### Option 1: Swagger UI (Recommended)
1. Start the backend server.
2. Open `http://localhost:8000/docs`.
3. Click any endpoint to expand it.
4. Click "Try it out" to test with sample data.

### Option 2: Using curl
```bash
# Register a user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@driftandco.com","password":"admin123"}'

# Get all products
curl http://localhost:8000/api/products

# Search products
curl "http://localhost:8000/api/products?search=kurta"

# Filter by gender and price
curl "http://localhost:8000/api/products?gender=women&max_price=2000"
```

---

## Technologies Used

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite      |
| Backend  | Python, FastAPI, SQLAlchemy                   |
| Database | MySQL 8.0                                     |
| Auth     | JWT tokens, bcrypt password hashing           |
| API Docs | Swagger / OpenAPI (auto-generated by FastAPI) |
