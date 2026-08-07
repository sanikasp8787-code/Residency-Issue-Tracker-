from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.security import hash_password, verify_password
from app.auth import create_access_token


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ===============================
# Register User
# ===============================
@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return {
            "message": "Email already registered"
        }


    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role
    )


    db.add(new_user)
    db.commit()
    db.refresh(new_user)


    return {
        "message": "User Registered Successfully",
        "data": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "phone": new_user.phone,
            "role": new_user.role
        }
    }



# ===============================
# Login User
# ===============================
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if not existing_user:
        return {
            "message": "User not found"
        }


    if not verify_password(
        user.password,
        existing_user.password
    ):
        return {
            "message": "Invalid Password"
        }



    token = create_access_token(
        {
            "sub": existing_user.email
        }
    )


    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",

        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email,
            "phone": existing_user.phone,
            "role": existing_user.role
        }
    }
# ===============================
# Get All Users
# ===============================

@router.get("/")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users
# ===============================
# Delete User
# ===============================

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()


    if not user:
        return {
            "message": "User not found"
        }


    db.delete(user)
    db.commit()


    return {
        "message": "User Deleted Successfully"
    }