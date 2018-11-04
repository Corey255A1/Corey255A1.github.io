const canvas = document.getElementById("SpinWheel");
const drawCtx = canvas.getContext('2d');
const backbuffer = document.createElement('canvas');
backbuffer.width = canvas.width;
backbuffer.height  = canvas.height;
const backDrawCtx = backbuffer.getContext('2d');
backDrawCtx.font = "26px arial"
backDrawCtx.textBaseline="middle";
backDrawCtx.textAlign="center";

//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const ctxW = canvas.width;
const ctxH = canvas.height;
const PiOver2 = Math.PI/2;
const TwoPi = Math.PI*2;
const SpinStep = (TwoPi)/(90);
function Name(name, idx)
{
    this.Name = name;
    this.Index = idx;
}

// const Beeper = new function Ticker()
// {
//     this.gainNode=audioCtx.createGain();
//     this.oscillator=audioCtx.createOscillator();
//     this.oscillator.type = 'square';
//     this.oscillator.connect(this.gainNode);
//     this.gainNode.connect(audioCtx.destination);
//     this.oscillator.start();
//     this.gainNode.gain.value = 0;
//     this.playTone = function()
//     {
//         this.oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
//         this.gainNode.gain.value = 1;
//         this.gainNode.gain.setTargetAtTime(0,audioCtx.currentTime,0.015);
//     };
// }();

function DrawTriangle(ctx,alt)
{
    ctx.beginPath();
    if(alt)
    {
        ctx.fillStyle = 'yellow';
    }
    else
    {
        ctx.fillStyle = 'red';
    }
    ctx.moveTo(320,0);
    ctx.lineTo(320,20);
    ctx.lineTo(280,0);
    ctx.lineTo(320,-20);
    ctx.lineTo(320,0);
    
    ctx.lineWidth=4;
    ctx.strokeStyle='black';
    ctx.stroke();
    ctx.fill();
    
}

function DrawWheel(ctx)
{
    
    var grd=ctx.createRadialGradient(0,0,5,0,0,320);
    grd.addColorStop(0,"green");
    grd.addColorStop(0.5,"blue");
    grd.addColorStop(1,"teal");

    // Fill with gradient
    
    ctx.translate(320,320);
    ctx.beginPath();
    ctx.arc(0, 0, 310, 0, TwoPi);
    //ctx.fillStyle = 'teal';
    ctx.fillStyle=grd;
    ctx.fill();
    ctx.lineWidth=5;
    ctx.strokeStyle='aqua'
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, TwoPi);
    ctx.fillStyle = 'blue';
    ctx.fill();
}


function DrawNames(ctx, namelist, angleoffset)
{
    var ang;
    var nang;
    var num;
    var radius = 200;
 
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'aqua';
    ctx.lineWidth = 3;
    var len = namelist.length;
    var mdiv = Math.PI/len;
    var IndicatedNameIndex = -1
    var angleList = [];
    for(num= 0; num < len; num++){
        nang = num * (mdiv*2);
        ang = nang + angleoffset;
        if(ang>(TwoPi)){ 
            ang = ang - (TwoPi); 
        }
        nang = TwoPi - nang;
        ctx.rotate(ang);
        ctx.moveTo(0,0);
        ctx.rotate(mdiv);
        ctx.lineTo(0,-310);
        ctx.stroke();
        ctx.rotate(-mdiv);
        
        ctx.translate(0, -175);
        ctx.rotate(-PiOver2);
        ctx.fillText(namelist[num], 30, 0, 190);
        ctx.rotate(PiOver2);
        ctx.translate(0, 175);
        ctx.rotate(-ang);
        
        angleList.push(nang);
    }
    ctx.stroke();
    return angleList;
}

function GetCurrentNameIndex(angle, anglelist)
{
    for(var aidx in anglelist)
    {
        var a = anglelist[aidx];
        if(a+SpinStep/2 >= angle && a-SpinStep/2 <= angle)
        {
            return parseInt(aidx);
        }
    }
    return -1;
}
function GetNextIndex(idx)
{
    if(idx-1>=0)
    {
        return idx-1;
    }
    return NameList.length-1;
}
function NameIsSelected(angle,anglelist,idx)
{
    var a = anglelist[idx];
    if(angle <= a+SpinStep && angle >= a-SpinStep)
    {
        //console.log("idx:"+idx);
        //Beeper.playTone();
        return true;
    }
    return false;
}
var Angle = 0;
var NameList = [];
var Players = [];
var AngleList = null;
var CurrentNameIdx = 0;
var NextNameIdx = 1;
document.getElementById("setBtn").onmousedown = function(e)
{
    var nameList = document.getElementById("names").value.split("\n");
    //audioCtx.resume();
    for(var nidx in nameList)
    {
        var n = nameList[nidx];
        if(n=="") continue;
        
        if(n.charAt(0) == '*')
        {
            NameList.push(n.substring(1).trim());
        }
        else
        {
            Players.push(new Name(n.trim(),NameList.length));
            NameList.push(n.trim());
        }
        
    }
    document.getElementById("names").style.display = "none";
    document.getElementById("setBtn").style.display = "none";
    
    backDrawCtx.setTransform(1, 0, 0, 1, 0, 0);
    backDrawCtx.clearRect(0,0,640,640);
    DrawWheel(backDrawCtx);
    AngleList = DrawNames(backDrawCtx, NameList, PiOver2);
    CurrentNameIdx = GetCurrentNameIndex(TwoPi, AngleList);
    NextNameIdx = GetNextIndex(CurrentNameIdx);
    
    drawCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawCtx.clearRect(0,0,640,640);
    drawCtx.drawImage(backbuffer,0,0);
    drawCtx.translate(320,320);
    DrawTriangle(drawCtx);
}


var Spinning = false;
var SelectedNameIndex = 0;
var SpinTimes = 0;
var SpinRate = 0;
var SpinRateCount = 0;
document.getElementById("spinBtn").onmousedown = function(e)
{
    if(!Spinning)
    {
        SelectedNameIndex = Players[Math.floor(Math.random()*Players.length)].Index;
        SpinTimes = Math.floor((Math.random()*3)+2);
        Spinning = true;
        SpinRateCount = 0;
        SpinRate = 1;
        document.getElementById("winner").innerText = "Who will win!?";
        update();
    }
}
var changed = false;
function update()
{
    if((SpinRateCount++)>=SpinRate)
    {
        document.getElementById("winner").innerText = NameList[CurrentNameIdx];
        if(NameIsSelected(Angle,AngleList,NextNameIdx))
        {
            CurrentNameIdx = NextNameIdx;
            NextNameIdx = GetNextIndex(NextNameIdx);
            changed = true;
            if(CurrentNameIdx == SelectedNameIndex)
            {
                SpinTimes--;
            }
        }
        drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        drawCtx.clearRect(0,0,640,640);
        drawCtx.translate(320,320);
        drawCtx.rotate(Angle);
        drawCtx.drawImage(backbuffer,-320,-320);
        drawCtx.rotate(-Angle);
        DrawTriangle(drawCtx,changed);
        if(changed) changed = false;
        
        
        Angle = Angle + SpinStep;
        SpinRateCount = 0;
        SpinRate*=1.003;
        if(Angle>=TwoPi) 
        {
            Angle = 0;
        }
    }
    if(SpinTimes<=0)
    {
        Spinning = false;
        document.getElementById("winner").innerText = NameList[SelectedNameIndex] + " is the WINNER!!!";
    }
    else
    {
        
        window.requestAnimationFrame(update);
    }
}