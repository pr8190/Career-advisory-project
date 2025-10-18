import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function useIdleTimer (timeoutMinutes = 5)  {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const timeoutDuration = timeoutMinutes * 60 * 1000; // Convert to milliseconds

  const logout = () => {
    localStorage.removeItem('loggedInEmployee');
    alert('You have been logged out due to inactivity.');
    navigate('/login');
  };

  function resetTimer()  {
    // Clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutDuration);
  };

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Reset timer on any activity
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
};

export default useIdleTimer;