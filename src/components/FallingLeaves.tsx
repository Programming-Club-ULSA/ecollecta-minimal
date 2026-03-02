import { useEffect, useState } from "react";
import leaf_img from "@/assets/eco_256.png";

type LeafConfig = {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  drift: string;
  rotate: string;
};

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<LeafConfig[]>([]);

  useEffect(() => {
    const count = window.innerWidth > 768 ? 8 : 0;
    const generatedLeaves = Array.from({ length: count }, (_, id) => ({
      id,
      left: `${Math.random() * 100}%`,
      size: 30 + Math.random() * 22,
      duration: `${16 + Math.random() * 10}s`,
      delay: `${Math.random() * 8}s`,
      drift: `${(Math.random() - 0.5) * 140}px`,
      rotate: `${200 + Math.random() * 340}deg`,
    }));

    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {leaves.map((leaf) => (
        <img
          key={leaf.id}
          src={leaf_img}
          className="absolute opacity-15 animate-fall motion-reduce:hidden"
          style={{
            left: leaf.left,
            top: "-15vh",
            width: `${leaf.size}px`,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
            ["--drift" as string]: leaf.drift,
            ["--leaf-rotate" as string]: leaf.rotate,
          }}
          alt=""
        />
      ))}
    </div>
  );
}