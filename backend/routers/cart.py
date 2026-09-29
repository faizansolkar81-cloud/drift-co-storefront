# =============================================================
# Drift & Co. — Cart Router
# Endpoints for adding items to cart, viewing the cart,
# updating item quantities, and removing items.
# All routes require authentication (the cart is per-user).
# =============================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models import Cart, CartItem, Product, User
from schemas import CartItemCreate, CartItemResponse, CartItemUpdate, CartResponse
from database import get_db
from routers.deps import get_current_user

router = APIRouter()


def get_or_create_cart(db: Session, user: User) -> Cart:
    """Get the user's cart, or create one if it doesn't exist."""
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def cart_item_to_response(item: CartItem) -> CartItemResponse:
    """Convert a CartItem ORM object to a CartItemResponse schema."""
    return CartItemResponse(
        id=item.id,
        product_id=item.product_id,
        product_name=item.product.name,
        product_price=item.product.price,
        product_image=item.product.image,
        quantity=item.quantity,
        selected_size=item.selected_size,
        selected_color=item.selected_color,
    )


def cart_to_response(cart: Cart) -> CartResponse:
    """Convert a Cart ORM object to a CartResponse schema with subtotal."""
    items = [cart_item_to_response(item) for item in cart.items]
    subtotal = sum(item.product.price * item.quantity for item in cart.items)
    return CartResponse(
        id=cart.id,
        user_id=cart.user_id,
        items=items,
        subtotal=subtotal,
    )


# ---- GET /api/cart ----
@router.get("", response_model=CartResponse)
@router.get("/", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """View the current user's shopping cart."""
    cart = get_or_create_cart(db, current_user)
    return cart_to_response(cart)


# ---- POST /api/cart/items ----
@router.post("/items", response_model=CartResponse, status_code=201)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add an item to the cart. If the same product+size+color already
    exists in the cart, the quantity is increased instead of adding a duplicate."""
    # Verify the product exists
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {payload.product_id} not found.",
        )

    cart = get_or_create_cart(db, current_user)

    # Check if this product+size+color is already in the cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == payload.product_id,
        CartItem.selected_size == payload.selected_size,
        CartItem.selected_color == payload.selected_color,
    ).first()

    if existing_item:
        # Increase quantity of the existing item
        existing_item.quantity += payload.quantity
    else:
        # Add a new cart item
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
            selected_size=payload.selected_size,
            selected_color=payload.selected_color,
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart)
    return cart_to_response(cart)


# ---- PUT /api/cart/items/{item_id} ----
@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the quantity of a cart item."""
    cart = get_or_create_cart(db, current_user)
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart item with ID {item_id} not found in your cart.",
        )

    item.quantity = payload.quantity
    db.commit()
    db.refresh(cart)
    return cart_to_response(cart)


# ---- DELETE /api/cart/items/{item_id} ----
@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove an item from the cart."""
    cart = get_or_create_cart(db, current_user)
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart item with ID {item_id} not found in your cart.",
        )

    db.delete(item)
    db.commit()
    db.refresh(cart)
    return cart_to_response(cart)


# ---- DELETE /api/cart ----
@router.delete("", response_model=CartResponse)
@router.delete("/", response_model=CartResponse)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove all items from the cart."""
    cart = get_or_create_cart(db, current_user)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return cart_to_response(cart)
