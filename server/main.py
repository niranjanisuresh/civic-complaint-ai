from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

complaints = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Civic Complaint API is running 🚀"}

@app.post("/categorize")
async def categorize(
    text: str = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    text_lower = text.lower()
    if "pothole" in text_lower:
        category = "Road Maintenance"
    elif "garbage" in text_lower:
        category = "Sanitation"
    elif "light" in text_lower:
        category = "Streetlight"
    else:
        category = "Other"

    complaints.append({
        "text": text,
        "category": category,
        "latitude": latitude,
        "longitude": longitude,
        "image_received": bool(image)
    })

    return {
        "category": category,
        "location": {"lat": latitude, "lon": longitude},
        "image_received": bool(image)
    }

@app.get("/complaints")
def get_complaints():
    return complaints
