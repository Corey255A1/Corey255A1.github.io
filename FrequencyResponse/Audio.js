const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const canvas = document.getElementById("viz");
const drawCtx = canvas.getContext("2d");

const audioBuff = audioCtx.createBuffer(1, 5000, 10000);
const audioAnalyser = audioCtx.createAnalyser();
audioAnalyser.fftSize = 8192;
audioAnalyser.minDecibels = -90;
audioAnalyser.maxDecibels = -10;

const buffSize = audioAnalyser.frequencyBinCount;
const dataBuff = new Uint8Array(buffSize);

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


function Oscillator(type){
    this.gainNode=audioCtx.createGain();
    this.oscillator=audioCtx.createOscillator();
    this.oscillator.type = type;
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(audioCtx.destination);
    this.oscillator.start();
    this.gainNode.gain.value = 0;
    this.stop = function()
    {
        this.oscillator.frequency.cancelScheduledValues(audioCtx.currentTime);
        this.gainNode.gain.value = 0;
    };
    this.playTone = function(tone)
    {        
        this.oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime);        
        this.gainNode.gain.value = 1;
    };
    this.rampTone = function(start, end, timelength)
    {
        this.oscillator.frequency.setValueAtTime(start, audioCtx.currentTime);  
        this.oscillator.frequency.linearRampToValueAtTime(end, audioCtx.currentTime+parseFloat(timelength));
        this.gainNode.gain.value = 1;
    };
}

const oscil = new Oscillator('sine');
document.getElementById("playTone").onclick = function()
{
    oscil.playTone(document.getElementById("startHz").value);
};
document.getElementById("playRamp").onclick = function()
{
    oscil.rampTone(document.getElementById("startHz").value,
    document.getElementById("endHz").value,
    document.getElementById("rampTime").value);
};
document.getElementById("stopTone").onclick = function()
{
    oscil.stop();
};

//const oscil2 = new Oscillator('square');
//const oscil3 = new Oscillator('square');
//oscil.playTone(220);
//oscil2.playTone(110);
//oscil3.playTone(55);


function update()
{
    audioAnalyser.getByteFrequencyData(dataBuff);
    draw(dataBuff);
    window.requestAnimationFrame(update)
}
function draw(buff)
{
    drawCtx.clearRect(0, 0, 1024, 128);
    drawCtx.fillStyle = 'rgb(0,0,0)';
    drawCtx.fillRect(0, 0, 512, 128);
    drawCtx.fillStyle = 'rgb(255,0,0)';
    var maxFreq = 0;
    var maxVol = 0;
    for (var b =0; b<buffSize; b++)
    {
        var s = buff[b];
        if(s>maxVol){
            maxFreq = b * (22050/buffSize);
            maxVol = s;
        }
        drawCtx.fillRect(b, 128-(s/2), 1, (s/2));
    }
    console.log(maxFreq);
}