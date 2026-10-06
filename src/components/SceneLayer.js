import { Component, lazy, Suspense } from 'react';

const Scene = lazy(() => import('../scene/Scene'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Lazy-loads the 3D scene; the page still works if WebGL is unavailable. */
export default function SceneLayer() {
  if (typeof document === 'undefined' || !hasWebGL()) return null;
  return (
    <div className="scene-layer" aria-hidden="true">
      <Boundary>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Boundary>
    </div>
  );
}
