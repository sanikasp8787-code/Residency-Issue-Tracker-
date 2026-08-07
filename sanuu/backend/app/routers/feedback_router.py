from fastapi import APIRouter

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)

feedbacks = []

@router.post("/")
def submit_feedback(data: dict):

    feedbacks.append(data)

    return {
        "message": "Feedback Submitted Successfully",
        "data": data
    }


@router.get("/")
def get_feedback():

    return feedbacks