import os
from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Root directory where MRI images are stored
MRI_IMAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# Create a specific directory for MRI files if it doesn't exist
MRI_UPLOADS_DIR = os.path.join(MRI_IMAGE_DIR, "mri_uploads")
os.makedirs(MRI_UPLOADS_DIR, exist_ok=True)

@app.route("/process-mri", methods=["GET"])
def process_mri():
    # Look in both the root and uploads directory
    all_mri_files = []
    
    # Check root directory
    root_mri_files = [f for f in os.listdir(MRI_IMAGE_DIR) if f.endswith((".dcm", ".nii", ".nii.gz"))]
    for file in root_mri_files:
        all_mri_files.append((file, os.path.join(MRI_IMAGE_DIR, file)))
    
    # Check uploads directory
    if os.path.exists(MRI_UPLOADS_DIR):
        upload_mri_files = [f for f in os.listdir(MRI_UPLOADS_DIR) if f.endswith((".dcm", ".nii", ".nii.gz"))]
        for file in upload_mri_files:
            all_mri_files.append((file, os.path.join(MRI_UPLOADS_DIR, file)))
    
    if not all_mri_files:
        return jsonify({
            "status": "no_files",
            "message": "No MRI files found. Please upload a DICOM or NIfTI file.",
            "uploadEndpoint": "/upload-mri"
        }), 200  # Return 200 instead of 404 to allow the frontend to handle this gracefully
    
    # Sort by creation time and get the latest
    latest_mri_name, latest_mri_path = sorted(all_mri_files, key=lambda x: os.path.getctime(x[1]))[-1]
    
    # Get file metadata
    file_size = os.path.getsize(latest_mri_path)
    file_date = datetime.datetime.fromtimestamp(os.path.getctime(latest_mri_path)).strftime('%Y-%m-%d %H:%M:%S')
    
    return jsonify({
        "status": "success",
        "mriFileUrl": f"/api/mri/{latest_mri_name}",  # Use relative URL for API gateway
        "fileName": latest_mri_name,
        "fileSize": file_size,
        "fileDate": file_date
    })

@app.route("/upload-mri", methods=["POST"])
def upload_mri():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not file.filename.endswith((".dcm", ".nii", ".nii.gz")):
        return jsonify({"error": "Invalid file type. Please upload DICOM or NIfTI files"}), 400
    
    # Save the file
    filepath = os.path.join(MRI_UPLOADS_DIR, file.filename)
    file.save(filepath)
    
    return jsonify({
        "status": "success",
        "message": "File uploaded successfully",
        "fileName": file.filename
    })

@app.route("/mri/<filename>", methods=["GET"])
def get_mri_file(filename):
    # Validate and sanitize filename to prevent directory traversal
    if '..' in filename or filename.startswith('/'):
        return jsonify({"error": "Invalid filename"}), 400
    
    # Check in uploads directory first
    file_path = os.path.join(MRI_UPLOADS_DIR, filename)
    if not os.path.isfile(file_path):
        # If not found in uploads, check root directory
        file_path = os.path.join(MRI_IMAGE_DIR, filename)
        if not os.path.isfile(file_path):
            return jsonify({"error": "File not found"}), 404
    
    # Determine content type based on file extension
    content_type = 'application/octet-stream'
    if filename.endswith('.dcm'):
        content_type = 'application/dicom'
    elif filename.endswith('.nii') or filename.endswith('.nii.gz'):
        content_type = 'application/octet-stream'
    
    return send_file(file_path, mimetype=content_type)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
