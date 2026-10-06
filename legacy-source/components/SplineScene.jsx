// Static SplineScene.jsx - no scroll zoom
import React, { useEffect, useState, useRef } from 'react';
import './SplineScene.css';

const SplineScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const splineRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load the Spline script
    const loadSplineViewer = () => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = "https://unpkg.com/@splinetool/viewer@1.10.2/build/spline-viewer.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setIsLoaded(true);
      };
    };

    loadSplineViewer();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    let splineViewer;
    let orientationSet = false;

    const initInterval = setInterval(() => {
      splineViewer = document.querySelector('spline-viewer');

      if (splineViewer && splineViewer.load) {
        clearInterval(initInterval);

        splineViewer.addEventListener('load', () => {
          if (splineViewer.runtime) {
            console.log('Spline runtime connected');

            // Prevent mouse wheel zoom
            splineViewer.addEventListener(
              'wheel',
              (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
              { passive: false }
            );

            const setInitialOrientation = () => {
              if (orientationSet) return;

              try {
                let objectFound = false;

                splineViewer.runtime.traverse((object) => {
                  if (
                    object.name &&
                    (
                      object.name.toLowerCase().includes('character') ||
                      object.name.toLowerCase().includes('model') ||
                      object.name.toLowerCase().includes('person') ||
                      object.name.toLowerCase().includes('scene') ||
                      object.name.toLowerCase().includes('avatar')
                    )
                  ) {
                    console.log('Found main model:', object.name);
                    splineViewer.runtime.setValueAtPath(`${object.name}.rotation.y`, Math.PI); // 180°
                    objectFound = true;
                  }
                });

                if (!objectFound) {
                  console.log('No specific model found, adjusting camera');

                  if (isMobile) {
                    splineViewer.runtime.setValueAtPath('camera.position.z', 6);
                    splineViewer.runtime.setValueAtPath('camera.position.y', 1);
                    splineViewer.runtime.setValueAtPath('camera.target.y', 0.5);
                  } else {
                    splineViewer.runtime.setValueAtPath('camera.position.z', 5);
                    splineViewer.runtime.setValueAtPath('camera.position.y', 1.5);
                    splineViewer.runtime.setValueAtPath('camera.target.y', 1);
                  }
                }

                try {
                  splineViewer.runtime.setRotation('0', Math.PI, 0, 0);
                } catch (err) {
                  console.log('Scene rotation failed:', err);
                }

                orientationSet = true;
                console.log('Initial orientation set - scene is now static');
              } catch (err) {
                console.log('Error setting orientation:', err);
              }
            };

            // Retry setting orientation
            setTimeout(setInitialOrientation, 500);
            setTimeout(setInitialOrientation, 1000);
            setTimeout(setInitialOrientation, 2000);
          }
        });
      }
    }, 500);

    return () => clearInterval(initInterval);
  }, [isLoaded, isMobile]);

  return (
    <div className="spline-scene" ref={splineRef}>
      {!isLoaded && (
        <div className="spline-loader">
          <div className="spinner"></div>
          <p>Loading 3D scene...</p>
        </div>
      )}
      <spline-viewer
        url="https://prod.spline.design/7-606aBT0PvISi09/scene.splinecode"
        loading-anim
        events-target="global"
        style={{
          touchAction: 'pan-x pan-y',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      ></spline-viewer>
    </div>
  );
};

export default SplineScene;
