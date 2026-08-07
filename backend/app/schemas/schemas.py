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
    