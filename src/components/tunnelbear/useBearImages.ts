export function useBearImages() {
  const watchBearImages = Array.from({ length: 21 }, (_, i) => `/tunnelbear/watch_bear_${i}.png`);
  const hideBearImages = Array.from({ length: 6 }, (_, i) => `/tunnelbear/hide_bear_${i}.png`);
  const peakBearImages = Array.from({ length: 4 }, (_, i) => `/tunnelbear/peak_bear_${i}.png`);

  return { watchBearImages, hideBearImages, peakBearImages };
}