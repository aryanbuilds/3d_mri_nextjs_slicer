import MRIViewer from "./components/MRIViewer";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`);
  const data = await res.json();
  const mriUrl = data.mriFileUrl;

  return (
    <div>
      <h1>3D MRI Visualizer</h1>
      {mriUrl ? <MRIViewer mriUrl={mriUrl} /> : <p>Loading MRI data...</p>}
    </div>
  );
}
