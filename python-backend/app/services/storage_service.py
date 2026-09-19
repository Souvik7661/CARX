import os
import uuid
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}
MAX_FILE_SIZE = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

class StorageService:
    @staticmethod
    def validate_file(file: UploadFile):
        filename = file.filename or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File extension '.{ext}' not supported. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        return ext

    @staticmethod
    async def save_file(file: UploadFile, subfolder: str = "general") -> dict:
        ext = StorageService.validate_file(file)
        folder = os.path.join(settings.UPLOAD_DIR, subfolder)
        os.makedirs(folder, exist_ok=True)
        
        file_id = str(uuid.uuid4())
        safe_filename = f"{file_id}.{ext}"
        target_path = os.path.join(folder, safe_filename)
        
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum permitted limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )
            
        with open(target_path, "wb") as f:
            f.write(content)
            
        return {
            "file_id": file_id,
            "file_name": file.filename,
            "file_path": target_path,
            "file_size": len(content),
            "mime_type": file.content_type or "application/octet-stream",
            "url": f"/uploads/{subfolder}/{safe_filename}"
        }

storage_service = StorageService()
