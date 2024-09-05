import { useState, useEffect, useCallback } from 'react';

interface TouchState {
  isDragging: boolean;
  draggedElement: HTMLElement | null;
  touchStartX: number;
  touchStartY: number;
}

const useTouchDrag = () => {
  const [touchState, setTouchState] = useState<TouchState>({
    isDragging: false,
    draggedElement: null,
    touchStartX: 0,
    touchStartY: 0,
  });

  const handleTouchStart = useCallback((e: TouchEvent, element: HTMLElement) => {
    if (e.touches.length === 1) {
      setTouchState({
        isDragging: true,
        draggedElement: element,
        touchStartX: e.touches[0].clientX,
        touchStartY: e.touches[0].clientY,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchState.isDragging && touchState.draggedElement) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchState.touchStartX;
      const dy = touch.clientY - touchState.touchStartY;
      touchState.draggedElement.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }, [touchState]);

  const handleTouchEnd = useCallback(() => {
    setTouchState({
      isDragging: false,
      draggedElement: null,
      touchStartX: 0,
      touchStartY: 0,
    });
  }, []);

  useEffect(() => {
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return { touchState, handleTouchStart };
};

export default useTouchDrag;