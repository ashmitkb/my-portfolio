// Shared, non-reactive scroll value read by the 3D scene every frame.
export const scrollState = { y: 0 };

if (typeof window !== 'undefined') {
  const update = () => {
    scrollState.y = window.scrollY;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}
