from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session

from app.Database import get_db
from app.repositories.userRepository import UserRepository
from app.schemas.userSchema import UserCreate, UserInDB, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

@router.get("/list", response_model=list[UserInDB])
async def get_all_users(
        skip: int = Query(default=0, ge=0, description="Skip first N users"),
        limit: int = Query(default=100, ge=1, le=100, description="Limit the number of users returned"),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Get all users with pagination"""
    return user_repo.get_all_users(skip=skip, limit=limit)

@router.post("/signup", response_model=UserInDB)
def create_user(
        user_create: UserCreate,
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user"""
    if user_repo.get_by_email(user_create.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return user_repo.create(user_create)

@router.get("/{user_id}", response_model=UserInDB)
def get_user(
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Get a user by ID"""
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserInDB)
def update_user(
        user_update: UserUpdate,
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Update user details"""
    updated_user = user_repo.update(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}")
def delete_user(
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Permanently delete a user"""
    if not user_repo.delete(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/{user_id}/deactivate")
def deactivate_user(
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Deactivate a user (soft delete)"""
    if not user_repo.deactivate(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deactivated successfully"}

@router.post("/{user_id}/verify-email")
def verify_email(
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Verify user's email"""
    if not user_repo.verify_email(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Email verified successfully"}

@router.post("/{user_id}/change-password")
def change_password(
        new_password: str,
        user_id: UUID = Path(...),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Change user's password"""
    if not user_repo.change_password(user_id, new_password):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password changed successfully"}

@router.get("/{user_id}/login-history")
def get_login_history(
        user_id: UUID = Path(...),
        limit: int = Query(10, ge=1, le=100),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Get user's login history"""
    return user_repo.get_login_history(user_id, limit)

@router.get("/search")
def search_users(
        query: str = Query(..., min_length=1),
        limit: int = Query(10, ge=1, le=100),
        user_repo: UserRepository = Depends(get_user_repository)
):
    """Search users by email or full name"""
    return user_repo.search_users(query, limit)