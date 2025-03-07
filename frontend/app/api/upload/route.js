import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Use environment variable for backend URL, with a fallback
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    
    // Forward the upload request to the backend
    const response = await fetch(`${backendUrl}/upload-mri`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Upload failed" }, 
        { status: response.status }
      );
    }
    
    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" }, 
      { status: 500 }
    );
  }
}
