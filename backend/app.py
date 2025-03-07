import os
from flask import Flask, jsonify

app = Flask(__name__)

# Root directory where MRI images are stored
MRI_IMAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

@app.route("/process-mri", methods=["GET"])
def process_mri():
    # Find the latest MRI image in the root directory
    mri_files = [f for f in os.listdir(MRI_IMAGE_DIR) if f.endswith((".dcm", ".nii", ".nii.gz"))]
    
    if not mri_files:
        return jsonify({"error": "No MRI files found"}), 404
    
    latest_mri = sorted(mri_files, key=lambda x: os.path.getctime(os.path.join(MRI_IMAGE_DIR, x)))[-1]
    mri_file_path = os.path.join(MRI_IMAGE_DIR, latest_mri)

    return jsonify({"mriFileUrl": f"file://{mri_file_path}"})

if __name__ == "__main__":
    app.run(port=5000)
