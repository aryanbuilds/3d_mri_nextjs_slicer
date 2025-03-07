import MRIViewer from "./components/MRIViewer";
import MRIUploader from "./components/MRIUploader";

export default async function Home() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api`, { 
      next: { revalidate: 60 },
      cache: 'no-store' // Don't cache this request
    });
    
    if (!res.ok && res.status !== 200) {
      throw new Error(`Failed to fetch MRI data: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (data.error) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">3D MRI Visualizer</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            Error: {data.error}
          </div>
          <div className="mt-4">
            <MRIUploader />
          </div>
        </div>
      );
    }

    // Handle the "no files" case
    if (data.status === "no_files") {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">3D MRI Visualizer</h1>
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md mb-4">
            {data.message}
          </div>
          <MRIUploader />
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">3D MRI Visualizer</h1>
        {data.mriFileUrl ? (
          <>
            <div className="mb-4 p-2 bg-gray-100 rounded">
              <p><strong>File:</strong> {data.fileName}</p>
              <p><strong>Date:</strong> {data.fileDate}</p>
              <p><strong>Size:</strong> {Math.round(data.fileSize / 1024)} KB</p>
            </div>
            <MRIViewer mriUrl={data.mriFileUrl} />
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Upload a different MRI file</h2>
              <MRIUploader />
            </div>
          </>
        ) : (
          <div>
            <p>No MRI data available. Please upload an MRI file.</p>
            <MRIUploader />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">3D MRI Visualizer</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          Failed to load MRI data. Please try again later or upload a file directly.
        </div>
        <MRIUploader />
      </div>
    );
  }
}
