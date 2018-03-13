const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const canvas = document.getElementById("viz");
const drawCtx = canvas.getContext("2d");

const audioBuff = audioCtx.createBuffer(1, 5000, 10000);
const audioAnalyser = audioCtx.createAnalyser();
audioAnalyser.fftSize = 1024;
audioAnalyser.minDecibels = -90;
audioAnalyser.maxDecibels = -10;

const buffSize = audioAnalyser.frequencyBinCount;
const dataBuff = new Float32Array(buffSize);

var mic;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (s) {
        mic = audioCtx.createMediaStreamSource(s);
        mic.connect(audioAnalyser);
        window.requestAnimationFrame(update)
    }
    ).catch(
    function (e) {
        console.log('Darn something bad happened');
        document.getElementById('message').innerHTML = e.message;
    }
    );


function update()
{
    audioAnalyser.getFloatFrequencyData(dataBuff);
    draw(dataBuff);
    window.requestAnimationFrame(update)
}
function draw(buff)
{
    drawCtx.clearRect(0, 0, 512, 128);
    drawCtx.fillStyle = 'rgb(0,0,0)';
    drawCtx.fillRect(0, 0, 512, 128);
    drawCtx.fillStyle = 'rgb(255,0,0)';
    var offset = 0;
    for (var d in buff)
    {
        var s = 200+buff[d];
        drawCtx.fillRect(offset, 128-(s), 1, (s));
        
        offset = offset + 1;
    }
}