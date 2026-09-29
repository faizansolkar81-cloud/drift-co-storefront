# =============================================================
# Drift & Co. — Admin Router
# Admin-only endpoints for managing users, products, orders,
# and viewing basic sales statistics.
# =============================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from models import User, Product, Order, OrderItem
from schemas import UserResponse, AdminStats, OrderResponse, OrderStatusUpdate
from database import get_db
from routers.deps import require_admin

router = APIRouter()

VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]


def order_to_response(order: Order) -> OrderResponse:
    """Convert an Order ORM object to an OrderResponse schema."""
    from schemas import OrderItemResponse
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


# ---- GET /api/admin/stats ----
@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get basic sales statistics: total revenue, orders, products, users."""
    total_revenue = db.query(func.coalesce(func.sum(Order.total), 0)).scalar()
    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    total_users = db.query(User).count()
    return AdminStats(
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_products=total_products,
        total_users=total_users,
    )


# ---- GET /api/admin/users ----
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get a list of all registered users (admin only)."""
    users = db.query(User).order_by(User.joined.desc()).all()
    return [
        UserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            joined=u.joined,
        )
        for u in users
    ]


# ---- DELETE /api/admin/users/{user_id} ----
@router.delete("/users/{user_id}", status_code=200)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete a user account (admin only). Cannot delete admin accounts."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found.",
        )
    if user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an admin account.",
        )
    db.delete(user)
    db.commit()
    return {"message": f"User '{user.name}' deleted successfully."}


# ---- GET /api/admin/orders ----
@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get all orders across all users (admin only)."""
    orders = db.query(Order).order_by(Order.date.desc()).all()
    return [order_to_response(o) for o in orders]


# ---- PUT /api/admin/orders/{order_id}/status ----
@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def admin_update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Update the status of any order (admin only)."""
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


# ---- GET /api/admin/revenue-by-gender ----
@router.get("/revenue-by-gender")
def revenue_by_gender(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get total revenue broken down by product gender (men/women/kids)."""
    results = (
        db.query(Product.gender, func.sum(OrderItem.price * OrderItem.quantity))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.gender)
        .all()
    )
    return {gender: total for gender, total in results}


# ---- GET /api/admin/orders-by-status ----
@router.get("/orders-by-status")
def orders_by_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get order counts grouped by status."""
    results = (
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    return {status_val: count for status_val, count in results}
