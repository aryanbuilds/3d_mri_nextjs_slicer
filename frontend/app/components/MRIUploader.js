"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MRIUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Validate file type
    const validTypes = ['.dcm', '.nii', '.nii.gz'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload DICOM (.dcm) or NIfTI (.nii, .nii.gz) files.`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${backendUrl}/upload-mri`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }
      
      setSuccess(`File "${result.fileName}" uploaded successfully!`);
      
      // Refresh the page after a short delay to load the new file
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Upload MRI File</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select DICOM (.dcm) or NIfTI (.nii, .nii.gz) file:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded text-sm"
            accept=".dcm,.nii,.nii.gz"
            disabled={uploading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!file || uploading}
          className={`px-4 py-2 rounded text-white ${
            !file || uploading 
              ? 'bg-blue-300' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload MRI File'}
        </button>
      </form>
    </div>
  );
};

export default MRIUploader;
