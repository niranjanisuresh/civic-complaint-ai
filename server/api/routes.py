from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ComplaintText(BaseModel):
    text: str

@router.post("/categorize")
def categorize(data: ComplaintText):
    text = data.text
    if "pothole" in text.lower():
        return {"category": "Road Maintenance"}
    elif "garbage" in text.lower():
        return {"category": "Sanitation"}
    elif "light" in text.lower():
        return {"category": "Streetlight"}
    else:
        return {"category": "Other"}
