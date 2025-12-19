"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Brain } from "@/components/Brain";
import * as THREE from "three";

export default function RTF() {
  return (
    <Canvas
      camera={{ position: [0, 0, -350], fov: 45 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.6,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      {/* ✅ HemisphereLight via args */}
      <hemisphereLight args={["#ffffff", "#444444", 2.2]} />

      <directionalLight position={[200, 150, 300]} intensity={3} color={"#ff0080"} />
      <directionalLight position={[-200, 100, 250]} intensity={2000} color={"#ff0080"}/>
      <directionalLight position={[0, 300, -200]} intensity={2000} color={"#ff0080"} />

      <Environment preset="studio" />

      <Suspense fallback={null}>
        <Brain scale={1.4} position={[0, -0.25, 0]} />
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}