from pydantic import BaseModel

class IssueCreate(BaseModel):
    name: str
    email: str
    issue_type: str
    description: str
    flat_number: str
    priority: str


class IssueResponse(IssueCreate):
    id: int
    status: str

    class Config:
        from_attributes = True


class IssueStatusUpdate(BaseModel):
    status: str


# ===============================
# Feedback Schema
# ===============================

class FeedbackCreate(BaseModel):
    issue_id: int
    rating: int
    comment: str


class FeedbackResponse(FeedbackCreate):
    id: int

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    rating: int
    feedback: str

