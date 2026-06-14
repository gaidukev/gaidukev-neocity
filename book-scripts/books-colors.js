function linearize(x) {
  let linearized = x / 255;
  return linearized <= 0.03928 ? linearized / 12.92 : ((linearized + 0.055) / 1.055) ** 2.4;
}

function getLuminance(r, g, b) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function getContrast(lightTriplet, darkTriplet) {
  if (lightTriplet && darkTriplet) {
    let [r1, g1, b1] = lightTriplet;
    let [r2, g2, b2] = darkTriplet;
    r2 = linearize(r2);
    g2 = linearize(g2);
    b2 = linearize(b2);
    r1 = linearize(r1);
    g1 = linearize(g1);
    b1 = linearize(b1);
    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);
    return (l1 + 0.05) / (l2 + 0.05);
  }
  return 0.1;
}

function getLightestColorInImage(pixels) {
  let lightestTriplet = null;
  let maxLightness = -1;
  let darkestTriplet = null;
  let minLightness = Infinity;
  let contrast = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

    if (lightness > maxLightness && lightness < 200) {
      const newContrast = getContrast([r, g, b], darkestTriplet);
      if (newContrast > contrast) {
        lightestTriplet = [r, g, b];
        contrast = newContrast;
        maxLightness = lightness;
      }
    }

    if (lightness < minLightness && lightness > 45) {
      const newContrast = getContrast(lightestTriplet, [r, g, b]);
      if (newContrast > contrast) {
        minLightness = lightness;
        darkestTriplet = [r, g, b];
        contrast = newContrast;
      }
    }
  }

  return { lightestTriplet, darkestTriplet };
}

export function getColors(link, canvas) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = link;

    if (!canvas?.getContext) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const ctx = canvas.getContext("2d");
    img.addEventListener("load", () => {
      ctx.drawImage(img, 0, 0, 150, 150);
      const imageData = ctx.getImageData(0, 0, 150, 150);
      resolve(getLightestColorInImage(imageData.data));
    });
    img.addEventListener("error", () => reject(new Error("Failed to load cover image")));
  });
}
