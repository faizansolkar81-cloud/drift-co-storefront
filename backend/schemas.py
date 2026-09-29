# =============================================================
# Drift & Co. — Pydantic Schemas (Request/Response Models)
# These define the shape of data that the API accepts and
# returns. They also handle validation automatically.
# =============================================================
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ---- Auth Schemas ----
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    joined: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---- Product Schemas ----
class ProductCreate(BaseModel):
    name: str
    price: int = Field(..., gt=0)
    category: str  # category name
    gender: str  # men, women, kids
    image: str
    description: str
    sizes: List[str]
    colors: List[str]
    rating: float = 0.0
    review_count: int = 0
    trending: bool = False
    new_arrival: bool = False
    stock: int = 0


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = Field(None, gt=0)
    category: Optional[str] = None
    gender: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    trending: Optional[bool] = None
    new_arrival: Optional[bool] = None
    stock: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    price: int
    category: str  # category name (resolved from FK)
    gender: str
    image: str
    description: str
    sizes: List[str]
    colors: List[str]
    rating: float
    reviewCount: int
    trending: bool
    newArrival: bool
    stock: int

    class Config:
        from_attributes = True


# ---- Cart Schemas ----
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(1, gt=0)
    selected_size: str
    selected_color: str


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: int
    product_image: str
    quantity: int
    selected_size: str
    selected_color: str

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse]
    subtotal: int


# ---- Order Schemas ----
class OrderItemResponse(BaseModel):
    product_id: int
    name: str
    price: int
    quantity: int
    size: str
    color: str
    image: str

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=15)
    customer_address: str
    customer_city: str
    customer_state: str
    customer_pincode: str = Field(..., min_length=6, max_length=10)
    customer_country: str = "India"


class OrderResponse(BaseModel):
    id: str
    user_id: int
    items: List[OrderItemResponse]
    total: int
    date: datetime
    status: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    customer_city: str
    customer_state: str
    customer_pincode: str
    customer_country: str

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str  # Pending, Processing, Shipped, Delivered, Cancelled


# ---- Review Schemas ----
class ReviewCreate(BaseModel):
    product_id: int
    author: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=5, max_length=1000)


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    author: str
    rating: int
    date: datetime
    comment: str

    class Config:
        from_attributes = True


# ---- Admin Stats Schema ----
class AdminStats(BaseModel):
    total_revenue: int
    total_orders: int
    total_products: int
    total_users: int
