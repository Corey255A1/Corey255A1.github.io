const timer = document.getElementById("countdown");
const now = new Date();

const title = document.getElementById("title");

const cnv = document.getElementById("cnv");
cnv.width = cnv.clientWidth;
cnv.height = cnv.clientHeight;
var halfWidth = cnv.width/2;
const ctx = cnv.getContext('2d');

const nextNewYears = new Date(now.getFullYear()+1, 0).getTime();
//const nextNewYears = Date.now() + 11000;
var msRemaining = nextNewYears-Date.now();
var newyears = false;

const ballSize = 100;
var ballPosition = ballSize;
var ballStep = (cnv.height-200) / 600;

function hhmmss(seconds){
    let hour = Math.floor(seconds/3600);
    seconds = seconds - (hour*3600);
    let minutes = Math.floor(seconds/60);
    seconds = Math.round(seconds - (minutes*60));
    return (hour<10?"0" + hour:hour)+
            ":" + (minutes<10?"0"+minutes:minutes)+
            ":" + (seconds<10?"0"+seconds:seconds);
}
function hhmmssFromMs(milliseconds){
    let seconds = milliseconds/1000;
    return hhmmss(seconds);
}

timer.textContent = hhmmssFromMs(msRemaining);

var r = 125;
var g = 125;
var b = 125;

function animation()
{
    if(!newyears){
        msRemaining = nextNewYears-Date.now();
        timer.textContent = hhmmssFromMs(msRemaining);
        if((msRemaining <= 10000) && ((ballPosition + ballStep) < (cnv.height-100))){
            ballPosition += ballStep;
        }
        else if(msRemaining<=0){
            newyears = true;
            timer.textContent = "WOOO!"
            title.textContent = "Happy New Years!"
        }
    }
    
    if(newyears){
        r = (r + Math.floor(Math.random()*10)) % 255;
        g = (g + Math.floor(Math.random()*10)) % 255;
        b = (b + Math.floor(Math.random()*10)) % 255;
        ctx.fillStyle = 'rgb('+ r + "," + g + "," + b + ")";
    }
    else{
        ctx.fillStyle = 'black';
    }
    ctx.fillRect(0,0,cnv.width,cnv.height);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(halfWidth-10, 0, 20, cnv.height);
    
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(halfWidth, ballPosition, 100, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = "40px bold arial";
    ctx.textAlign = "center";
    ctx.fillText("2020",halfWidth,ballPosition);
    window.requestAnimationFrame(animation);
}
animation();

