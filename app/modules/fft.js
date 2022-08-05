let fft = new p5.FFT();

export default class fourierSeries {
    constructor(canvasWidth, canvasHeight, bgColor, div) {
        new p5(function (p5) {
            let sound;

            function togglePlay() {
                if (sound.isPlaying()) {
                    sound.pause();
                } else {
                    sound.loop();
                }
            }

            p5.preload = function () {
                sound = p5.loadSound('../assets/audio.mp3');
            }

            p5.setup = function () {
                let cnv = p5.createCanvas(canvasWidth,canvasHeight);
                cnv.mouseClicked(togglePlay);
                sound.amp(0.2);
            }

            p5.draw = function () {
                p5.background(bgColor);

                let spectrum = fft.analyze();
                p5.noStroke();
                p5.fill(255, 0, 255);
                for (let i = 0; i< spectrum.length; i++){
                    let x = p5.map(i, 0, spectrum.length, 0, p5.width);
                    let h = -p5.height + p5.map(spectrum[i], 0, 255, p5.height, 0);
                    p5.rect(x, p5.height, p5.width / spectrum.length, h )
                }

                let waveform = fft.waveform();
                p5.noFill();
                p5.beginShape();
                p5.stroke(20);
                for (let i = 0; i < waveform.length; i++){
                    let x = p5.map(i, 0, waveform.length, 0, p5.width);
                    let y = p5.map( waveform[i], -1, 1, 0, p5.height);
                    p5.vertex(x,y);
                }
                p5.endShape();

                p5.text('Слава Україні', 20, 20);
            }
        }, div);
    }
}
