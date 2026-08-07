from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Issue
from app.schemas.schemas import IssueCreate, IssueStatusUpdate

router = APIRouter(
    prefix="/issues",
    tags=["Issues"]
)


@router.post("/")
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    new_issue = Issue(
        name=issue.name,
        email=issue.email,
        issue_type=issue.issue_type,
        description=issue.description,
        status="Pending",
        flat_number=issue.flat_number,
        priority=issue.priority,
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return {
        "message": "Issue Created Successfully",
        "data": {
            "id": new_issue.id,
            "name": new_issue.name,
            "email": new_issue.email,
            "issue_type": new_issue.issue_type,
            "description": new_issue.description,
            "status": new_issue.status,
            "flat_number":new_issue.flat_number,
            "priority":new_issue.priority
        }
    }


@router.get("/")
def get_issues(db: Session = Depends(get_db)):
    return db.query(Issue).all()


@router.put("/{issue_id}")
def update_issue(issue_id: int, issue: IssueCreate, db: Session = Depends(get_db)):
    existing_issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not existing_issue:
        return {"message": "Issue not found"}

    existing_issue.name = issue.name
    existing_issue.email = issue.email
    existing_issue.issue_type = issue.issue_type
    existing_issue.description = issue.description

    db.commit()
    db.refresh(existing_issue)

    return {
        "message": "Issue Updated Successfully",
        "data": existing_issue
    }


@router.patch("/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    status_data: IssueStatusUpdate,
    db: Session = Depends(get_db)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not issue:
        return {"message": "Issue not found"}

    issue.status = status_data.status

    db.commit()
    db.refresh(issue)

    return {
        "message": "Issue Status Updated Successfully",
        "data": issue
    }


@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not issue:
        return {"message": "Issue not found"}

    db.delete(issue)
    db.commit()

    return {"message": "Issue Deleted Successfully"}