import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { filename } = params;
  
  try {
    // Use environment variable for backend URL, with a fallback
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/mri/${filename}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Get the file content as array buffer
    const fileData = await response.arrayBuffer();
    
    // Return the file with appropriate headers
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching MRI file:", error);
    return NextResponse.json({ error: "Failed to fetch MRI file" }, { status: 500 });
  }
}
