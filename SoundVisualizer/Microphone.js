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

const audioAnalyser = audioCtx.createAnalyser();
audioAnalyser.fftSize = 256;
audioAnalyser.minDecibels = -90;
audioAnalyser.maxDecibels = -10;

const buffSize = audioAnalyser.frequencyBinCount;
const dataBuff = new Uint8Array(buffSize);

const barWidth = WIDTH/buffSize;
var mic;

var timeOffset = 0;
const SoundStates = {LIVE:0, RECORDING:1, PLAYBACK:2};

var recordedAudio = [];
var soundState = SoundStates.LIVE;
var scriptNode;
var buffersource;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (s) {
        mic = audioCtx.createMediaStreamSource(s);
        buffersource = audioCtx.createBufferSource();
        scriptNode = audioCtx.createScriptProcessor(256, 1, 1);
        scriptNode.onaudioprocess = function(audioData){
            var inputData = audioData.inputBuffer.getChannelData(0);
            if(soundState === SoundStates.RECORDING)
            {
                recordedAudio.push(new Float32Array(inputData));
            }
            //Pass audio through.
            var outputData = audioData.outputBuffer.getChannelData(0);
            for (var sample = 0; sample < inputData.length; sample++) {
              outputData[sample] = inputData[sample];
            }
        }
        mic.connect(scriptNode);
        scriptNode.connect(audioAnalyser);
        
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
    switch(soundState){
        case SoundStates.LIVE: drawCtx.fillStyle = 'rgb(0,0,255)'; break;
        case SoundStates.RECORDING: drawCtx.fillStyle = 'rgb(255,0,0)'; break;
        case SoundStates.PLAYBACK: drawCtx.fillStyle = 'rgb(0,255,0)'; break;
        default: drawCtx.fillStyle = 'rgb(0,0,255)'; break; break;
    }
    
    if(timeOffset===0){
        plotdrawCtx.clearRect(0, 0, PLOTWIDTH, PLOTHEIGHT);
        plotdrawCtx.fillStyle = 'rgb(0,0,0)';
        plotdrawCtx.fillRect(0, 0, PLOTWIDTH, PLOTHEIGHT);
    }
    
    var offset = 0;
    for (var d=0; d<buffSize; d++)
    {
        var s = buff[d];
        drawCtx.fillRect(offset, HEIGHT-s/2, barWidth, s);
        switch(soundState){
            case SoundStates.LIVE: plotdrawCtx.fillStyle = 'rgb(0,0,'+s+')'; break;
            case SoundStates.RECORDING: plotdrawCtx.fillStyle = 'rgb('+s+',0,0)'; break;
            case SoundStates.PLAYBACK: plotdrawCtx.fillStyle = 'rgb(0,'+s+',0)'; break;
            default: plotdrawCtx.fillStyle = 'rgb(0,0,'+s+')'; break; break;
        }
        plotdrawCtx.fillRect(offset, timeOffset, barWidth, barWidth);
        
        offset = offset + barWidth;
    }
    timeOffset = (timeOffset+1)%PLOTHEIGHT;
}

function setupLiveAudio()
{
    soundState = SoundStates.LIVE;
    buffersource.disconnect();
    audioAnalyser.disconnect();
    mic.connect(scriptNode);
    scriptNode.connect(audioAnalyser);
}

var recBtn = document.getElementById("record");
recBtn.classList.remove("disabled");
recBtn.addEventListener("click",()=>{
    if(soundState !== SoundStates.RECORDING){
        recordedAudio = [];
        if(soundState === SoundStates.PLAYBACK){
            setupLiveAudio();
        }
        soundState = SoundStates.RECORDING;
        playBtn.classList.remove("playing");
        recBtn.classList.add("recording");
    }else{
        soundState = SoundStates.LIVE;
        recBtn.classList.remove("recording");
    }
})

var playBtn = document.getElementById("play");
playBtn.classList.remove("disabled");
playBtn.addEventListener("click",()=>{
    
    if(soundState === SoundStates.PLAYBACK) return;    
    if(recordedAudio.length<=0) return;
    recBtn.classList.remove("recording");

    scriptNode.disconnect();
    mic.disconnect();
    audioAnalyser.disconnect();
    buffersource = audioCtx.createBufferSource();
    
    var buff = audioCtx.createBuffer(1, recordedAudio.length*256, audioCtx.sampleRate);
    var chanData = buff.getChannelData(0);
    var tb = 0;
    for(var b=0; b<recordedAudio.length;b++){
        for(var ab=0; ab<recordedAudio[b].length; ab++){
            chanData[tb] = recordedAudio[b][ab];
            tb++;
        }
    }
    
    buffersource.buffer = buff
    buffersource.onended = ()=>{
        setupLiveAudio();
        playBtn.classList.remove("playing");
    }
    buffersource.connect(audioAnalyser);
    audioAnalyser.connect(audioCtx.destination);
    buffersource.start();
    soundState = SoundStates.PLAYBACK;
    playBtn.classList.add("playing");
})

}

const enable = document.querySelector("#enable");
enable.addEventListener("click",()=>{
    AudioViz();
})



