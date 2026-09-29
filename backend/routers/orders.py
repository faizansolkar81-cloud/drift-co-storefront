# =============================================================
# Drift & Co. — Orders Router
# Endpoints for creating orders, viewing a user's orders,
# viewing a specific order, and updating order status
# (admin only for status updates).
# =============================================================
import time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models import Order, OrderItem, Cart, CartItem, User
from schemas import OrderCreate, OrderResponse, OrderStatusUpdate, OrderItemResponse
from database import get_db
from routers.deps import get_current_user, require_admin

router = APIRouter()

# Valid order statuses
VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]


def order_to_response(order: Order) -> OrderResponse:
    """Convert an Order ORM object to an OrderResponse schema."""
    items = [
        OrderItemResponse(
            product_id=item.product_id,
            name=item.name,
            price=item.price,
            quantity=item.quantity,
            size=item.size,
            color=item.color,
            image=item.image,
        )
        for item in order.items
    ]
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        items=items,
        total=order.total,
        date=order.date,
        status=order.status,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        customer_address=order.customer_address,
        customer_city=order.customer_city,
        customer_state=order.customer_state,
        customer_pincode=order.customer_pincode,
        customer_country=order.customer_country,
    )


# ---- POST /api/orders ----
@router.post("", response_model=OrderResponse, status_code=201)
@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new order from the user's cart contents.
    The cart is cleared after the order is placed.
    """
    # Get the user's cart
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty. Add products before placing an order.",
        )

    # Calculate the total from cart items
    total = 0
    order_items = []
    for cart_item in cart.items:
        product = cart_item.product
        line_total = product.price * cart_item.quantity
        total += line_total

        order_item = OrderItem(
            product_id=product.id,
            name=product.name,
            price=product.price,
            quantity=cart_item.quantity,
            size=cart_item.selected_size,
            color=cart_item.selected_color,
            image=product.image,
        )
        order_items.append(order_item)

    # Generate a unique order ID
    order_id = f"ORD-{int(time.time())}-{current_user.id}"

    # Create the order
    order = Order(
        id=order_id,
        user_id=current_user.id,
        total=total,
        status="Pending",
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        customer_address=payload.customer_address,
        customer_city=payload.customer_city,
        customer_state=payload.customer_state,
        customer_pincode=payload.customer_pincode,
        customer_country=payload.customer_country,
        items=order_items,
    )

    db.add(order)
    # Clear the cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)
    return order_to_response(order)


# ---- GET /api/orders ----
@router.get("", response_model=List[OrderResponse])
@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all orders for the current user. Admins see all orders."""
    if current_user.role == "admin":
        orders = db.query(Order).order_by(Order.date.desc()).all()
    else:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.date.desc()).all()
    return [order_to_response(o) for o in orders]


# ---- GET /api/orders/{order_id} ----
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific order by its ID. Users can only see their own orders;
    admins can see any order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found.",
        )
    # Non-admins can only view their own orders
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own orders.",
        )
    return order_to_response(order)


# ---- PUT /api/orders/{order_id}/status (Admin only) ----
@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update the status of an order (admin only)."""
    # Validate the status value
    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found.",
        )

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order_to_response(order)
