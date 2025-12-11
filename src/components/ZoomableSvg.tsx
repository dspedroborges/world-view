import { useRef, useState, type ReactNode } from 'react';

export default function ZoomableSvg({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [pinchStart, setPinchStart] = useState<{ distance: number; scale: number } | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    setScale(Math.max(0.3, Math.min(next, 8)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const getDistance = (touches: TouchList | any) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      setPinchStart({ distance, scale });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragging) {
      setOffset({
        x: e.touches[0].clientX - start.x,
        y: e.touches[0].clientY - start.y,
      });
    } else if (e.touches.length === 2 && pinchStart) {
      const distance = getDistance(e.touches);
      const nextScale = (distance / pinchStart.distance) * pinchStart.scale;
      setScale(Math.max(0.3, Math.min(nextScale, 8)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) setPinchStart(null);
    if (e.touches.length === 0) setDragging(false);
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
      className="w-screen h-screen overflow-hidden"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}