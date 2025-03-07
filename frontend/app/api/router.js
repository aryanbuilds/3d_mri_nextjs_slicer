export async function GET() {
  try {
    // Use environment variable for backend URL, with a fallback
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/process-mri`, {
      cache: 'no-store' // Don't cache this request
    });
    
    // Even if no files are found, the backend will return 200 with appropriate message
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching MRI data:", error);
    return Response.json({ error: "Failed to fetch MRI data" }, { status: 500 });
  }
}
