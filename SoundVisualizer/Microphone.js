function AudioViz(){
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const canvas = document.getElementById("viz");
const drawCtx = canvas.getContext("2d");

const plotcanvas = document.getElementById("plot");
const plotdrawCtx = plotcanvas.getContext("2d");

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var PLOTWIDTH = plotcanvas.width;
var PLOTHEIGHT = plotcanvas.height

const audioBuff = audioCtx.createBuffer(1, 5000, 10000);
const audioAnalyser = audioCtx.createAnalyser();
audioAnalyser.fftSize = 256;
audioAnalyser.minDecibels = -90;
audioAnalyser.maxDecibels = -10;

const buffSize = audioAnalyser.frequencyBinCount;
//const dataBuff = new Float32Array(buffSize);
const dataBuff = new Uint8Array(buffSize);

const barWidth = WIDTH/buffSize;
var mic;

var timeOffset = 0;

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
    audioAnalyser.getByteFrequencyData(dataBuff);
    draw(dataBuff);
    window.requestAnimationFrame(update)
}
function draw(buff)
{
    drawCtx.clearRect(0, 0, WIDTH, HEIGHT);
    drawCtx.fillStyle = 'rgb(0,0,0)';
    drawCtx.fillRect(0, 0, WIDTH, HEIGHT);
    drawCtx.fillStyle = 'rgb(255,0,0)';
    
    if(timeOffset==0){
        plotdrawCtx.clearRect(0, 0, PLOTWIDTH, PLOTHEIGHT);
        plotdrawCtx.fillStyle = 'rgb(0,0,0)';
        plotdrawCtx.fillRect(0, 0, PLOTWIDTH, PLOTHEIGHT);
    }
    
    var offset = 0;
    for (var d=0; d<buffSize; d++)
    {
        var s = buff[d];
        drawCtx.fillRect(offset, HEIGHT-s/2, barWidth, s);
        plotdrawCtx.fillStyle = 'rgb(0,0,'+s+')';
        plotdrawCtx.fillRect(offset, timeOffset, barWidth, barWidth);
        
        offset = offset + barWidth;
    }
    timeOffset = (timeOffset+1)%PLOTHEIGHT;
}

}

const enable = document.querySelector("#enable");
enable.addEventListener("click",()=>{
    AudioViz();
})

