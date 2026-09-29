# =============================================================
# Drift & Co. — SQLAlchemy ORM Models
# Each class maps to a MySQL table. Relationships between tables
# are defined using ForeignKey and relationship().
# =============================================================
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, ForeignKey,
    DateTime, func
)
from sqlalchemy.orm import relationship
from database import Base


class Category(Base):
    """Product categories (e.g. T-Shirts, Sarees, Jackets)."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    gender = Column(String(20), nullable=False)  # men, women, kids

    # One category has many products
    products = relationship("Product", back_populates="category_rel")


class User(Base):
    """Registered users — both regular users and admins."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # hashed with bcrypt
    role = Column(String(20), default="user", nullable=False)  # user or admin
    joined = Column(DateTime, server_default=func.now())

    # A user has one cart, many orders, and many reviews
    cart = relationship("Cart", uselist=False, back_populates="user")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")


class Product(Base):
    """Products in the catalog. Prices are in INR (₹)."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    price = Column(Integer, nullable=False)  # INR price
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    gender = Column(String(20), nullable=False, index=True)  # men, women, kids
    image = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    sizes = Column(Text, nullable=False)    # comma-separated: "S,M,L,XL"
    colors = Column(Text, nullable=False)   # comma-separated: "Black,White"
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    trending = Column(Boolean, default=False)
    new_arrival = Column(Boolean, default=False)
    stock = Column(Integer, default=0)

    # Relationships
    category_rel = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product")


class Cart(Base):
    """A user's shopping cart (one per user)."""
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    """Individual items inside a cart."""
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("cart.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    selected_size = Column(String(20), nullable=False)
    selected_color = Column(String(50), nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")


class Order(Base):
    """A placed order."""
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True)  # e.g. "ORD-1695000000"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total = Column(Integer, nullable=False)  # total in INR
    date = Column(DateTime, server_default=func.now())
    status = Column(String(20), default="Pending", nullable=False)
    # Customer/shipping info
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(200), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_address = Column(Text, nullable=False)
    customer_city = Column(String(100), nullable=False)
    customer_state = Column(String(100), nullable=False)
    customer_pincode = Column(String(20), nullable=False)
    customer_country = Column(String(50), default="India")

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Individual products inside an order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    name = Column(String(200), nullable=False)
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    size = Column(String(20), nullable=False)
    color = Column(String(50), nullable=False)
    image = Column(Text, nullable=False)

    order = relationship("Order", back_populates="items")


class Review(Base):
    """Customer reviews for products."""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for guest reviews
    author = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)  # 1–5
    date = Column(DateTime, server_default=func.now())
    comment = Column(Text, nullable=False)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
