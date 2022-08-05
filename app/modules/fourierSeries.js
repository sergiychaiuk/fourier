export default class fourierSeries {
    constructor(canvasWidth, canvasHeight, bgColor, div) {
        new p5(function (p5) {
            let time = 0;
            let wave = [];

            let slider;

            p5.setup = function () {
                p5.createCanvas(canvasWidth, canvasHeight);
                slider = p5.createSlider(1, 5, 5);
            }

            p5.draw = function () {
                p5.background(bgColor);
                p5.translate(200, 200);
                let x = 0;
                let y = 0;

                for (let i = 0; i < slider.value(); i++) {
                    let prevX = x;
                    let prevY = y;

                    let n = i * 2 + 1;
                    let radius = 75 * (4 / (n * p5.PI));
                    x += radius * p5.cos(n * time);
                    y += radius * p5.sin(n * time);

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

                time -= 0.05;

                if (wave.length > 255) {
                    wave.pop();
                }
            }
        }, div);
    }
}
