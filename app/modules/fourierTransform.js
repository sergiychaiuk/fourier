export default class fourierSeries {
    constructor(canvasWidth, canvasHeight, bgColor, div) {
        new p5(function (p5) {
            let Y = [];
            let fourierY;

            let time = 0;
            let wave = [];

            function dft(x) {
                let X = [];
                const N = x.length;

                for (let k = 0; k < N; k++) {
                    let re = 0;
                    let im = 0;

                    for (let n = 0; n < N; n++) {
                        const phi = (p5.TWO_PI * k * n) /N;
                        re += x[n] * p5.cos(phi);
                        im -= x[n] * p5.sin(phi);
                    }

                    re = re / N;
                    im = im / N;

                    let freq = k;
                    let amp = p5.sqrt(re * re + im * im);
                    let phase = p5.atan2(im, re);

                    X[k] = { re, im, freq, amp, phase };
                }

                return X;
            }

            let angle = 0;

            p5.setup = function () {
                p5.createCanvas(canvasWidth, canvasHeight);
                for (let i = 0; i < 100; i++) {
                    Y[i] = 500 * p5.noise(angle) - 250;
                    angle += 0.02;
                }
                fourierY = dft(Y);
            }

            p5.draw = function () {
                p5.background(bgColor);
                p5.translate(150, 200);
                let x = 0;
                let y = 0;

                for (let i = 0; i < fourierY.length; i++) {
                    let prevX = x;
                    let prevY = y;

                    let freq = fourierY[i].freq;
                    let radius = fourierY[i].amp;
                    let phase = fourierY[i].phase;
                    x += radius * p5.cos(freq * time + phase + p5.HALF_PI);
                    y += radius * p5.sin(freq * time + phase + p5.HALF_PI);

                    p5.noFill();
                    p5.stroke(0);
                    p5.ellipse(prevX, prevY, radius * 2);

                    p5.stroke(0);
                    p5.line(prevX, prevY, x, y);
                }

                wave.unshift(y);

                p5.translate(200, 0);
                p5.line(x - 200, y, 0, wave[0]);
                p5.fill(0);
                p5.triangle(-20, wave[0] - 5, -20, wave[0] + 5, 0, wave[0]);

                p5.beginShape();
                p5.noFill();
                wave.forEach((y, index) => {
                    p5.vertex(index, y);
                });
                p5.endShape();

                const dt = p5.TWO_PI / fourierY.length;
                time -= dt;

                if (wave.length > 255) {
                    wave.pop();
                }
            }
        }, div);
    }
}
