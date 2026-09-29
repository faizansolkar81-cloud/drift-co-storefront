# =============================================================
# Drift & Co. — Products Router
# Endpoints for listing, searching, filtering, creating,
# updating, and deleting products. Admin-only routes are
# protected with the require_admin dependency.
# =============================================================
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List

from models import Product, Category, User
from schemas import ProductCreate, ProductUpdate, ProductResponse
from database import get_db
from routers.deps import require_admin

router = APIRouter()


def product_to_response(p: Product) -> ProductResponse:
    """Convert a Product ORM object to a ProductResponse schema."""
    # Resolve the category name from the FK relationship
    category_name = p.category_rel.name if p.category_rel else ""
    return ProductResponse(
        id=p.id,
        name=p.name,
        price=p.price,
        category=category_name,
        gender=p.gender,
        image=p.image,
        description=p.description,
        sizes=p.sizes.split(",") if p.sizes else [],
        colors=p.colors.split(",") if p.colors else [],
        rating=p.rating,
        reviewCount=p.review_count,
        trending=p.trending,
        newArrival=p.new_arrival,
        stock=p.stock,
    )


# ---- GET /api/products ----
@router.get("", response_model=List[ProductResponse])
@router.get("/", response_model=List[ProductResponse])
def get_products(
    gender: Optional[str] = Query(None, description="Filter by gender: men, women, kids"),
    category: Optional[str] = Query(None, description="Filter by category name"),
    size: Optional[str] = Query(None, description="Filter by available size"),
    color: Optional[str] = Query(None, description="Filter by available color"),
    min_price: Optional[int] = Query(None, ge=0, description="Minimum price in INR"),
    max_price: Optional[int] = Query(None, ge=0, description="Maximum price in INR"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    search: Optional[str] = Query(None, description="Search by product name or category"),
    db: Session = Depends(get_db),
):
    """
    Get all products with optional filters.
    Supports filtering by gender, category, size, color, price range,
    rating, and a text search on product name and category.
    """
    query = db.query(Product)

    # Filter by gender (men, women, kids)
    if gender:
        query = query.filter(Product.gender == gender)

    # Filter by category name — need to join with Category table
    if category:
        query = query.join(Category).filter(Category.name == category)

    # Filter by price range
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Filter by minimum rating
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    # Filter by available size — sizes are comma-separated, use LIKE
    if size:
        query = query.filter(Product.sizes.like(f"%{size}%"))

    # Filter by available color — colors are comma-separated, use LIKE
    if color:
        query = query.filter(Product.colors.like(f"%{color}%"))

    # Text search on product name and category name
    if search:
        query = query.join(Category, Product.category_id == Category.id, isouter=True)
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Category.name.ilike(f"%{search}%"),
            )
        )

    products = query.all()
    return [product_to_response(p) for p in products]


# ---- GET /api/products/{product_id} ----
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by its ID."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )
    return product_to_response(product)


# ---- POST /api/products (Admin only) ----
@router.post("", response_model=ProductResponse, status_code=201)
@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Add a new product to the catalog (admin only)."""
    # Find or create the category
    category = db.query(Category).filter(Category.name == payload.category).first()
    if not category:
        category = Category(name=payload.category, gender=payload.gender)
        db.add(category)
        db.flush()

    product = Product(
        name=payload.name,
        price=payload.price,
        category_id=category.id,
        gender=payload.gender,
        image=payload.image,
        description=payload.description,
        sizes=",".join(payload.sizes),
        colors=",".join(payload.colors),
        rating=payload.rating,
        review_count=payload.review_count,
        trending=payload.trending,
        new_arrival=payload.new_arrival,
        stock=payload.stock,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product_to_response(product)


# ---- PUT /api/products/{product_id} (Admin only) ----
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update an existing product (admin only). Only provided fields are changed."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    # Update only the fields that were provided (not None)
    update_data = payload.model_dump(exclude_unset=True)

    # Handle category name -> category_id conversion
    if "category" in update_data:
        category = db.query(Category).filter(Category.name == update_data["category"]).first()
        if not category:
            category = Category(name=update_data["category"], gender=update_data.get("gender", product.gender))
            db.add(category)
            db.flush()
        product.category_id = category.id
        del update_data["category"]

    # Convert list fields to comma-separated strings
    if "sizes" in update_data and update_data["sizes"] is not None:
        update_data["sizes"] = ",".join(update_data["sizes"])
    if "colors" in update_data and update_data["colors"] is not None:
        update_data["colors"] = ",".join(update_data["colors"])

    # Map camelCase field names from schema to snake_case column names
    if "review_count" in update_data:
        product.review_count = update_data["review_count"]
        del update_data["review_count"]
    if "new_arrival" in update_data:
        product.new_arrival = update_data["new_arrival"]
        del update_data["new_arrival"]

    # Apply remaining updates
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product_to_response(product)


# ---- DELETE /api/products/{product_id} (Admin only) ----
@router.delete("/{product_id}", status_code=200)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete a product from the catalog (admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )
    db.delete(product)
    db.commit()
    return {"message": f"Product '{product.name}' deleted successfully."}
