/**
 * Converts a wavelength in nanometers to an RGB color string.
 * This is an approximation and works for the visible spectrum (380nm-750nm).
 * @param wavelength - The wavelength in nanometers.
 * @returns An RGB color string, e.g., "rgb(255, 0, 0)".
 */
export const wavelengthToRgb = (wavelength: number): string => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (wavelength >= 380 && wavelength <= 439) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength <= 489) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength <= 509) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength <= 579) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength <= 644) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity factor adjustment
  let factor = 0;
  if (wavelength >= 380 && wavelength <= 419) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength <= 700) {
    factor = 1.0;
  } else if (wavelength >= 701 && wavelength <= 750) {
    factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
  }

  const gamma = 0.8;
  const adjust = (color: number) => Math.round(255 * Math.pow(color * factor, gamma));

  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
};
