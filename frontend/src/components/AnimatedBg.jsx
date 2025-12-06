import React from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export default function AnimatedBG( {children}) {
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
            value: 160,
            density: { enable: true, area: 1000 }
          },
          color: { value: "#ffffff" },
          shape: { type: "circle" },

          // ⭐✨ Twinkling Sparkle Effect
          opacity: {
            value: 1,
            random: { enable: true, minimumValue: 0.3 },
            animation: {
              enable: true,
              speed: 1.2,
              minimumValue: 0.3,
              sync: false
            }
          },

          // ⭐ Random sizes for realistic star look
          size: {
            value: { min: 1, max: 3 }
          },

          // ⭐ Smooth floating + random paths
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out"
          }
        },
        detectRetina: true
      }}
    >
      {children}
    </Particles>
  );
}
