"use client"; // Client Component for XTK
import { useEffect, useState, useRef } from "react";
import Script from "next/script";

const MRIViewer = ({ mriUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef(null);
  
  // Handle XTK script load
  const handleXtkLoad = () => {
    setScriptLoaded(true);
  };
  
  useEffect(() => {
    if (!mriUrl || !scriptLoaded || !containerRef.current) return;
    
    let renderer;
    let volume;

    const initializeViewer = async () => {
      try {
        setLoading(true);
        
        // Access XTK from the window global (loaded via script)
        const XTK = window.X;
        if (!XTK) {
          throw new Error("XTK library not available");
        }
        
        // Create and initialize renderer
        renderer = new XTK.renderer3D();
        renderer.container = containerRef.current;
        await renderer.init();
        
        // Create and load volume
        volume = new XTK.volume();
        volume.file = mriUrl;
        
        // Add volume to renderer and render
        renderer.add(volume);
        await renderer.render();
        
        setLoading(false);
      } catch (err) {
        console.error("Error initializing XTK viewer:", err);
        setError("Failed to load MRI visualization. Please check if the file format is supported.");
        setLoading(false);
      }
    };

    initializeViewer();

    // Cleanup function
    return () => {
      if (renderer) {
        try {
          renderer.destroy();
        } catch (e) {
          console.error("Error destroying renderer:", e);
        }
      }
    };
  }, [mriUrl, scriptLoaded]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Load XTK from CDN */}
      <Script 
        src="https://get.goXTK.com/xtk_xdat.js"
        strategy="beforeInteractive"
        onLoad={handleXtkLoad}
        onError={() => setError("Failed to load visualization library")}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div 
        id="mri-container"
        ref={containerRef}
        style={{ width: "100%", height: "500px", background: "#000" }} 
      />
    </div>
  );
};

export default MRIViewer;
