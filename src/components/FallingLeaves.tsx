import { useEffect, useState } from "react";
import leaf_img from "@/assets/eco_256.png";

export function FallingLeaves() {
  const [leaves, setLeaves] = useState<number[]>([]);

  useEffect(() => {
    const count = window.innerWidth > 768 ? 8 : 0;
    setLeaves(Array.from({ length: count }, (_, i) => i));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {leaves.map((leaf) => (
        <img
          key={leaf}
          src={leaf_img}
          className="absolute w-10 opacity-20 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
          alt=""
        />
      ))}
    </div>
  );
}