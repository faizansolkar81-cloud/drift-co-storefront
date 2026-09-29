# =============================================================
# Drift & Co. — Reviews Router
# Endpoints for adding reviews and fetching reviews for a
# product. Reviews include a 1–5 star rating and a comment.
# =============================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models import Review, Product, User
from schemas import ReviewCreate, ReviewResponse
from database import get_db
from routers.deps import get_current_user

router = APIRouter()


# ---- GET /api/reviews/product/{product_id} ----
@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific product, newest first."""
    # Verify the product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(Review.date.desc()).all()
    return [
        ReviewResponse(
            id=r.id,
            product_id=r.product_id,
            author=r.author,
            rating=r.rating,
            date=r.date,
            comment=r.comment,
        )
        for r in reviews
    ]


# ---- POST /api/reviews ----
@router.post("", response_model=ReviewResponse, status_code=201)
@router.post("/", response_model=ReviewResponse, status_code=201)
def add_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a review for a product. Updates the product's average rating
    and review count automatically."""
    # Verify the product exists
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {payload.product_id} not found.",
        )

    # Create the review
    review = Review(
        product_id=payload.product_id,
        user_id=current_user.id,
        author=payload.author,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.flush()  # flush to get the review ID

    # Update the product's rating and review count
    all_reviews = db.query(Review).filter(Review.product_id == payload.product_id).all()
    total_rating = sum(r.rating for r in all_reviews)
    product.review_count = len(all_reviews)
    product.rating = round(total_rating / len(all_reviews), 1) if all_reviews else 0.0

    db.commit()
    db.refresh(review)
    return ReviewResponse(
        id=review.id,
        product_id=review.product_id,
        author=review.author,
        rating=review.rating,
        date=review.date,
        comment=review.comment,
    )
