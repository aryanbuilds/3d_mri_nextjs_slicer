"use client"; // Client Component for XTK
import { useEffect } from "react";
import * as X from "xtk";

const MRIViewer = ({ mriUrl }) => {
  useEffect(() => {
    if (!mriUrl) return;

    const renderer = new X.renderer3D();
    renderer.container = "mri-container";
    renderer.init();

    const volume = new X.volume();
    volume.file = mriUrl;

    renderer.add(volume);
    renderer.render();
  }, [mriUrl]);

  return <div id="mri-container" style={{ width: "100%", height: "500px" }} />;
};

export default MRIViewer;
