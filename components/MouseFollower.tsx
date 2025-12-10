import React, { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const MouseFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  
  // Use refs for animation loop values to avoid re-renders during calculation
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const trailRef = useRef<TrailPoint[]>([]);
  const idCounterRef = useRef(0);
  // Store the last valid angle to keep the plane oriented when it stops
  const angleRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Lerp (Linear Interpolation) for smooth movement
      const ease = 0.12; 
      
      const dx = mouseRef.current.x - posRef.current.x;
      const dy = mouseRef.current.y - posRef.current.y;
      
      posRef.current.x += dx * ease;
      posRef.current.y += dy * ease;

      let currentAngle = angleRef.current;

      // Calculate rotation if moving
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          // Angle in radians
          const angle = Math.atan2(dy, dx);
          currentAngle = angle;
          angleRef.current = angle;
          
          // Convert to degrees for CSS rotation
          // Plane icon naturally points roughly North-East (45deg). 
          // Adding 45 aligns it to the movement vector.
          setRotation((angle * (180 / Math.PI)) + 45); 
      }

      // Trail Logic
      // Add point only if moving significantly to prevent clumping when still
      const speed = Math.sqrt(dx*dx + dy*dy);
      
      if (speed > 0.5) {
        idCounterRef.current += 1;
        
        // Calculate offset to spawn trail at the TAIL of the plane
        // Vector opposite to movement: angle + PI
        // Offset distance approx 16px (half the icon size roughly + padding)
        const offsetDist = 16; 
        const tailX = posRef.current.x - Math.cos(currentAngle) * offsetDist;
        const tailY = posRef.current.y - Math.sin(currentAngle) * offsetDist;

        trailRef.current.push({
          x: tailX, 
          y: tailY, 
          id: idCounterRef.current
        });

        // Limit trail length
        if (trailRef.current.length > 20) {
          trailRef.current.shift();
        }
      } else {
        // Quickly shrink trail if stationary
        if (trailRef.current.length > 0) {
            trailRef.current.shift();
            // Accelerate shrinking
            if (trailRef.current.length > 0) trailRef.current.shift();
        }
      }

      setPosition({ x: posRef.current.x, y: posRef.current.y });
      setTrail([...trailRef.current]);
      
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail Render Layer */}
      {trail.map((point, index) => {
        // Calculate visuals based on position in trail (index 0 is oldest)
        const percentage = index / trail.length;
        // Start smaller at the tail, grow slightly
        const size = 3 + (percentage * 4); 
        // Fade out at the tail end
        const opacity = percentage * 0.8; 

        return (
          <div
            key={point.id}
            className="fixed rounded-full bg-white pointer-events-none z-50"
            style={{
              left: point.x,
              top: point.y,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)', // Glow effect
              willChange: 'opacity, transform',
            }}
          />
        );
      })}

      {/* Main Plane Icon */}
      <div
        className="fixed pointer-events-none z-50 text-white drop-shadow-md"
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      >
        <Plane size={64} fill="currentColor" />
      </div>
    </>
  );
};

export default MouseFollower;
