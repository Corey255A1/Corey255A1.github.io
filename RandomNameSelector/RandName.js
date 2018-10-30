const canvas = document.getElementById("SpinWheel");
const drawCtx = canvas.getContext("2d");
const ctxW = canvas.width;
const ctxH = canvas.height;
const PiOver2 = Math.PI/2;
const TwoPi = Math.PI*2;
function Name(name, idx)
{
    this.Name = name;
    this.Index = idx;
}

function DrawTriangle(ctx)
{
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.moveTo(320,0);
    ctx.lineTo(320,20);
    ctx.lineTo(300,0);
    ctx.lineTo(320,-20);
    ctx.lineTo(320,0);
    
    ctx.lineWidth=3;
    ctx.strokeStyle='rgb(0,0,0)';
    ctx.stroke();
    ctx.fill();
    
    ctx.moveTo(0,-20);
    ctx.lineTo(0,20);
    ctx.lineTo(320,20);
    ctx.lineTo(320,-20);
    ctx.lineTo(0,-20);
    ctx.lineWidth=3;
    ctx.strokeStyle='rgb(0,0,0)';
    ctx.stroke();
}

function DrawWheel(ctx)
{
    ctx.translate(320,320);
    ctx.beginPath();
    ctx.arc(0, 0, 320, 0, TwoPi);
    ctx.fillStyle = 'teal';
    ctx.fill();
}
const SpinStep = (TwoPi)/(60);
var ThreshLow = (PiOver2)-SpinStep/1.5;
var ThreshHigh = (PiOver2)+SpinStep/1.5;
function DrawNames(ctx, namelist, angleoffset)
{
    var ang;
    var num;
    var radius = 200;
    ctx.font = radius*0.15 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillStyle = 'white';
    var len = namelist.length;
    var IndicatedNameIndex = -1
    for(num= 0; num < len; num++){
        ang = num * Math.PI / (len/2) + angleoffset;
        if(ang>(TwoPi)){ 
            ang = ang - (TwoPi); 
        }
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-PiOver2);
        ctx.fillText(namelist[num], 40, 0, 200);
        ctx.rotate(PiOver2);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
        if(ang<ThreshHigh && ang>ThreshLow)
        {
            IndicatedNameIndex = num;
        }
    }
    return IndicatedNameIndex;
}


var NameList = [];
var Players = [];
document.getElementById("setBtn").onmousedown = function(e)
{
    var nameList = document.getElementById("names").value.split("\n");
    for(var nidx in nameList)
    {
        var n = nameList[nidx];
        if(n=="") continue;
        
        if(n.charAt(0) == '*')
        {
            console.log("Skip");
            NameList.push(n.substring(1).trim());
        }
        else
        {
            Players.push(new Name(n.trim(),nidx));
            NameList.push(n.trim());
        }
        
    }
    document.getElementById("names").style.display = "none";
    document.getElementById("setBtn").style.display = "none";
    //ThreshLow = (PiOver2)*(1-1/NameList.length);
    //ThreshHigh = (PiOver2)*(1+1/NameList.length);
    DrawWheel(drawCtx);
    DrawNames(drawCtx,NameList,0);
    DrawTriangle(drawCtx);
    
}

var Angle = 0;
var Spinning = false;
var CurrentIndex = ""
var SelectedNameIndex = ""
var SpinTimes = 0;
var SpinRate = 1
var SpinRateCount = 0;

document.getElementById("spinBtn").onmousedown = function(e)
{
    if(!Spinning)
    {
        SelectedNameIndex = Players[Math.floor(Math.random()*Players.length)].Index;
        SpinTimes = Math.floor((Math.random()*3)+2);
        
        SpinRateCount = 0;
        SpinRate = 1;
        document.getElementById("winner").innerText = "Who will win!?";
        update();
    }
}

function update()
{
    if((SpinRateCount++)>=SpinRate)
    {
        drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        drawCtx.clearRect(0,0,640,640);
        DrawWheel(drawCtx);
        var nameidx = DrawNames(drawCtx,NameList,Angle);
        DrawTriangle(drawCtx);
        if(nameidx!=CurrentIndex)
        {
            CurrentIndex = nameidx;
            if(CurrentIndex == SelectedNameIndex)
            {
                SpinTimes--;
            }
        }
        
        Angle = Angle + SpinStep;
        if(Angle>=TwoPi) 
        {
            SpinRate*=1.3;
            Angle = 0;
        }
        SpinRateCount = 0;
    }
    if(SpinTimes<=0)
    {
        Spinning = false;
        document.getElementById("winner").innerText = "Winner is " + NameList[SelectedNameIndex] + "!!";
    }
    else
    {
        
        window.requestAnimationFrame(update);
    }
}