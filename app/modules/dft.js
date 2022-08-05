class Complex {
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }

    add(c) {
        this.re += c.re;
        this.im += c.im;
    }

    mult(c) {
        const re = this.re * c.re - this.im * c.im;
        const im = this.re * c.im + this.im * c.re;
        return new Complex(re, im);
    }
}

const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

export default class fourierSeries {
    constructor(canvasWidth, canvasHeight, bgColor, div) {
        new p5(function (p5) {
            function dft(x) {
                const X = [];
                const N = x.length;
                for (let k = 0; k < N; k++) {
                    let sum = new Complex(0, 0);
                    for (let n = 0; n < N; n++) {
                        const phi = (p5.TWO_PI * k * n) / N;
                        const c = new Complex(p5.cos(phi), -p5.sin(phi));
                        sum.add(x[n].mult(c));
                    }
                    sum.re = sum.re / N;
                    sum.im = sum.im / N;

                    let freq = k;
                    let amp = p5.sqrt(sum.re * sum.re + sum.im * sum.im);
                    let phase = p5.atan2(sum.im, sum.re);
                    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
                }
                return X;
            }

            function mousePressed () {
                state = USER;
                drawing = [];
                x = [];
                time = 0;
                path = [];
            }

            function mouseReleased () {
                state = FOURIER;
                const skip = 1;
                for (let i = 0; i < drawing.length; i += skip) {
                    x.push(new Complex(drawing[i].x, drawing[i].y));
                }
                fourierX = dft(x);

                fourierX.sort((a, b) => b.amp - a.amp);
            }

            p5.setup = function () {
                let canvas = p5.createCanvas(canvasWidth, canvasHeight);
                canvas.mousePressed(mousePressed);
                canvas.mouseReleased(mouseReleased);
                p5.background(bgColor);
            }

            function epicycles(x, y, rotation, fourier) {
                for (let i = 0; i < fourier.length; i++) {
                    let prevX = x;
                    let prevY = y;

                    let freq = fourier[i].freq;
                    let radius = fourier[i].amp;
                    let phase = fourier[i].phase;

                    x += radius * p5.cos(freq * time + phase + rotation);
                    y += radius * p5.sin(freq * time + phase + rotation);

                    p5.stroke(0);
                    p5.noFill();
                    p5.ellipse(prevX, prevY, radius * 2);

                    p5.stroke(0);
                    p5.line(prevX, prevY, x, y);
                }
                return p5.createVector(x, y);
            }

            p5.draw = function () {
                if (state === USER) {
                    p5.background(bgColor);
                    let point = p5.createVector(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2);
                    drawing.push(point);
                    p5.stroke(0);
                    p5.noFill();
                    p5.beginShape();
                    for (let v of drawing) {
                        p5.vertex(v.x + p5.width / 2, v.y + p5.height / 2);
                    }
                    p5.endShape();
                } else if (state === FOURIER) {
                    p5.background(bgColor);
                    let v = epicycles(p5.width / 2, p5.height / 2, 0, fourierX);
                    path.unshift(v);
                    p5.beginShape();
                    p5.noFill();
                    p5.stroke(255, 0, 255);
                    for (let i = 0; i < path.length; i++) {
                        p5.vertex(path[i].x, path[i].y);
                    }
                    p5.endShape();

                    const dt = p5.TWO_PI / fourierX.length;
                    time += dt;

                    if (time > p5.TWO_PI) {
                        time = 0;
                        path = [];
                    }
                }
            }
        }, div);
    }
}
