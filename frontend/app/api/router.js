export async function GET() {
    const res = await fetch("https://mybinder-api-url/process-mri");
    const data = await res.json();
  
    return Response.json(data);
  }
  