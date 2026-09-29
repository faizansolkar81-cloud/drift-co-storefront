# =============================================================
# Drift & Co. — Shared Dependencies
# Re-exports get_current_user and require_admin so every router
# can import them from one place instead of importing from auth.py
# (which would create circular imports).
# =============================================================
from routers.auth import get_current_user, require_admin

__all__ = ["get_current_user", "require_admin"]
