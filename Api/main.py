from fastapi import FastAPI, File, UploadFile
import exifread
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

@app.post("/extract")
async def extract_metadata(file: UploadFile = File(...)):
    tags = exifread.process_file(file.file)
    data = {
        "DateTime": str(tags.get("EXIF DateTimeOriginal")),
        "GPSLatitude": str(tags.get("GPS GPSLatitude")),
        "GPSLongitude": str(tags.get("GPS GPSLongitude")),
    }
    return data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- this allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)