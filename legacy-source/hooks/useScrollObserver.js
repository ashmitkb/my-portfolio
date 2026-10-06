// hooks/useScrollObserver.js
import { useEffect } from 'react';

/**
 * Custom hook for smoothly detecting elements in viewport during scroll
 * @param {Object} sectionsRef - References to sections to observe
 * @param {Function} setActiveSection - Function to update active section
 */
const useScrollObserver = (sectionsRef, setActiveSection) => {
  useEffect(() => {
    // Skip if refs aren't ready
    if (!sectionsRef || Object.values(sectionsRef).some(ref => !ref.current)) {
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Get the entry with the largest intersection ratio
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio (how much of the element is visible)
          const mostVisible = visibleEntries.reduce((prev, current) => {
            return prev.intersectionRatio > current.intersectionRatio ? prev : current;
          });
          
          setActiveSection(mostVisible.target.id);
        }
      },
      { 
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for smoother detection
        rootMargin: '-20% 0px -20% 0px' // Adjust this to change when sections activate
      }
    );

    // Observe all sections
    Object.values(sectionsRef).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup
    return () => {
      Object.values(sectionsRef).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionsRef, setActiveSection]);
};

export default useScrollObserver;