# =============================================================
# Drift & Co. — FastAPI Application Entry Point
# Run with: uvicorn main:app --reload --port 8000
# Then open http://localhost:8000/docs for Swagger documentation.
# =============================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_database
from seed_data import seed_database
from routers import auth, products, cart, orders, reviews, admin

# Create the FastAPI application
app = FastAPI(
    title="Drift & Co. — E-Commerce API",
    description=(
        "Backend API for the Drift & Co. clothing store.\n\n"
        "A B.Sc. IT college project using FastAPI + MySQL.\n\n"
        "## Features\n"
        "- User authentication (register, login, JWT tokens)\n"
        "- Product catalog with search and filters\n"
        "- Shopping cart (add, update, remove)\n"
        "- Orders (create, view, update status)\n"
        "- Product reviews and ratings\n"
        "- Admin dashboard (manage users, products, orders, stats)\n"
    ),
    version="1.0.0",
)

# ---- CORS Configuration ----
# Allow the frontend (running on localhost:5173) to call this API.
# In production, restrict origins to your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",    # Alternative dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Include API Routers ----
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


# ---- Startup Event: Create database + seed data ----
@app.on_event("startup")
def startup_event():
    """
    On first startup: create the MySQL database and tables,
    then insert seed data (admin user, products, reviews).
    """
    init_database()
    seed_database()


# ---- Health Check Endpoint ----
@app.get("/", tags=["Health"])
def health_check():
    """Simple health-check endpoint to verify the API is running."""
    return {"status": "ok", "message": "Drift & Co. API is running", "docs": "/docs"}


# ---- Run the Application ----
# Allows running with: python main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
