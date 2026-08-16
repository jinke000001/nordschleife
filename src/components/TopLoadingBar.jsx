import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * TopLoadingBar
 * A subtle red progress bar at the very top that appears during route changes.
 */
export default function TopLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start loading
    setVisible(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(60), 200);
    const timer2 = setTimeout(() => setProgress(85), 500);
    let hideTimer;

    const completeTimer = setTimeout(() => {
      setProgress(100);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(completeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div 
      className="top-loading-bar" 
      style={{ 
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1
      }} 
    />
  );
}
