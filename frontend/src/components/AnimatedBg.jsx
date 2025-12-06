import React from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export default function AnimatedBG() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        background: {
          color: "#001a33" // Dark Blue Background
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 120, // Number of stars
            density: { enable: true, area: 1000 }
          },
          color: { value: "#ffffff" }, // White bubbles / stars
          shape: { type: "circle" },
          opacity: {
            value: 0.8,
            random: true
          },
          size: {
            value: 2,
            random: true
          },
          move: {
            enable: true,
            speed: 0.5, // Smooth slow movement
            direction: "none",
            outModes: "out"
          }
        },
        detectRetina: true
      }}
    />
  );
}
