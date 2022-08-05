import fourierSeries from "./modules/fourierSeries.js";
import fourierTransform from "./modules/fourierTransform.js";
import fft from "./modules/fft.js";
import dft from "./modules/dft.js";

new fourierSeries(600, 400, 220, 'fourierSeries');
new fourierTransform(600, 400, 220, 'fourierTransform');
new fft(600, 100, 220, 'fft');
new dft(600, 400, 220, 'dft');
