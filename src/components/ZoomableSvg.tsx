import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function ZoomableSvg({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [pinchStart, setPinchStart] = useState<{
    distance: number;
    scale: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setOffset({ x: rect.width / 2, y: rect.height / 2 });
  }, []);

  const clampScale = (v: number) => Math.max(0.3, Math.min(v, 8));

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => clampScale(s + (e.deltaY > 0 ? -0.1 : 0.1)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1) {
      setDragging(true);
      setStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }

    if (e.touches.length === 2) {
      setPinchStart({
        distance: getDistance(e.touches),
        scale,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && dragging) {
      setOffset({
        x: e.touches[0].clientX - start.x,
        y: e.touches[0].clientY - start.y,
      });
    }

    if (e.touches.length === 2 && pinchStart) {
      const next =
        (getDistance(e.touches) / pinchStart.distance) * pinchStart.scale;
      setScale(clampScale(next));
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setPinchStart(null);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        touchAction: 'none',
        overscrollBehavior: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
}