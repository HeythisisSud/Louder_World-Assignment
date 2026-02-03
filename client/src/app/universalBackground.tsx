"use client";

import FloatingLines from "../components/FloatingLines";

export default function UniversalBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={6}
        lineDistance={6}
        bendRadius={10}
        bendStrength={-0.4}
        interactive={true}
        parallax={true}
      />
    </div>
  );
}
