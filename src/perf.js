// Adaptive quality. The page picks a starting tier from what it can learn about
// the device, and the 3D scene steps it down at runtime if frames run slow.
// The tier is mirrored on <html data-perf="..."> so CSS can lighten effects too.
//
//   high   – full effects (glass refraction, live blur, 12 shapes, always animating)
//   medium – lighter blur, cheaper materials, fewer shapes, slower idle animation
//   low    – no live blur, simple materials, and the 3D scene only redraws
//            while the visitor is scrolling or interacting
//
// `?quality=low|medium|high` forces a tier (handy for testing).

export const TIERS = ['low', 'medium', 'high'];
const KEY = 'quality';

let gpu;
function gpuName() {
  if (gpu !== undefined) return gpu;
  gpu = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    gpu = String(name || '');
  } catch {
    /* no WebGL */
  }
  return gpu;
}

/** True when WebGL runs on the CPU (no usable GPU), where even antialiasing is costly. */
export const softwareGpu = () => /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpuName());

export function forcedTier() {
  try {
    const q = new URLSearchParams(window.location.search).get('quality');
    return TIERS.includes(q) ? q : null;
  } catch {
    return null;
  }
}

/** Best guess before anything has been measured. */
export function detectTier() {
  const forced = forcedTier();
  if (forced) return forced;
  try {
    const saved = sessionStorage.getItem(KEY);
    if (TIERS.includes(saved)) return saved; // a step-down measured earlier this visit
  } catch {
    /* storage unavailable */
  }
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8; // only reported by Chromium; assume fine elsewhere
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  // integrated / older GPUs that struggle with refraction + blur at full resolution
  const weakGpu = /intel.*(hd|uhd)|mali-[gt]\d{2}\b|adreno.*\b[3-5]\d{2}\b|powervr|radeon.*vega [3-8]\b/i.test(gpuName());

  if (saveData || softwareGpu() || cores <= 2 || memory <= 2) return 'low';
  if (weakGpu || cores <= 4 || memory <= 4) return 'medium';
  return 'high';
}

export function lowerTier(tier) {
  return TIERS[Math.max(0, TIERS.indexOf(tier) - 1)];
}

export function currentTier() {
  const t = document.documentElement.dataset.perf;
  return TIERS.includes(t) ? t : 'high';
}

/** Apply a tier to the page (CSS hook) and remember a step-down for this visit. */
export function applyTier(tier, { remember = false } = {}) {
  document.documentElement.dataset.perf = tier;
  if (remember && !forcedTier()) {
    try {
      sessionStorage.setItem(KEY, tier);
    } catch {
      /* storage unavailable */
    }
  }
  window.dispatchEvent(new CustomEvent('perf-tier', { detail: tier }));
}
