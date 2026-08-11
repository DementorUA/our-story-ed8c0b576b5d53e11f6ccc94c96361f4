export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function nextPaint() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export function finishAnimation(animation) {
  return animation.finished.catch(() => {});
}

export async function decodeImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  if (image.decode) {
    try {
      await image.decode();
    } catch {
      await new Promise(resolve => { image.onload = image.onerror = resolve; });
    }
  } else {
    await new Promise(resolve => { image.onload = image.onerror = resolve; });
  }
  return image;
}
