"""
Validation utilities for dataset upload and request processing.
"""

from fastapi import UploadFile, HTTPException
from backend.config import settings

def validate_csv_upload(file: UploadFile) -> None:
    """
    Validates uploaded file extension, content type, and file size.
    Raises HTTPException if validation fails.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded or filename is missing.")

    # Check extension
    filename_lower = file.filename.lower()
    if not filename_lower.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.filename}'. Please upload a valid CSV (.csv) file."
        )

    # Check content type if available
    valid_content_types = ["text/csv", "application/vnd.ms-excel", "text/plain", "application/octet-stream"]
    if file.content_type and file.content_type not in valid_content_types:
        # Some browsers send text/plain or octet-stream for CSVs, so only reject if clearly non-text
        if not ("csv" in file.content_type or "text" in file.content_type or "excel" in file.content_type):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file MIME type: '{file.content_type}'. Must be a CSV file."
            )
