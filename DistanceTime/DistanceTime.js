const canvasViz = document.getElementById("viz");
const drawVizCtx = canvasViz.getContext("2d");
drawVizCtx.font = "12px Arial";
const ctxVizW = canvasViz.width-24;
const ctxVizH = canvasViz.height-24;

const canvasInt = document.getElementById("interact");
const drawIntCtx = canvasInt.getContext("2d");
drawIntCtx.font = "16px Arial"
const ctxIntW = canvasInt.width-24;
const ctxIntH = canvasInt.height-24;
const ctxIntHHalf = ctxIntH/2;
const ctxIntWHalf = ctxIntW/2;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const timer = document.getElementById("timer");

var started = false;
var time = 0;
const MaxTime = 15;

var distance = 0;

var Points = [];
var mousedown = false

function MakeStickFigure(x,y)
{
    this.X = x;
    this.Y = y;
    this.SetPosition = function(x,y)
    {
        this.X = x;
        this.Y = y;
    }
    this.Draw = function(ctx)
    {
        ctx.strokeStyle = 'rgb(0,0,255)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(this.X ,this.Y-10,10,10,0,0,2*Math.PI,false);
        ctx.moveTo(this.X,this.Y);
        ctx.lineTo(this.X,this.Y+20);
        ctx.moveTo(this.X,this.Y);
        ctx.lineTo(this.X-5,this.Y+20);
        ctx.moveTo(this.X,this.Y);
        ctx.lineTo(this.X+5,this.Y+20);
        ctx.moveTo(this.X,this.Y+20);
        ctx.lineTo(this.X-5,this.Y+40);
        ctx.moveTo(this.X,this.Y+20);
        ctx.lineTo(this.X+5,this.Y+40);
        ctx.stroke();
    }
}

const Person = new MakeStickFigure(ctxIntWHalf,ctxIntHHalf);

canvasInt.onmouseup = function(e)
{
    mousedown = false;
}

canvasInt.onmousedown = function(e)
{
    if(started)
    {
        var x = e.offsetX;
        var y = e.offsetY;
        Person.SetPosition(x,y);
        distance = GetDistance(x,ctxIntWHalf,y,ctxIntHHalf)/15;
        console.log(distance);
    }
    mousedown = true;
}

canvasInt.onmousemove = function(e)
{
    if(started && mousedown)
    {
        var x = e.offsetX;
        var y = e.offsetY;
        Person.SetPosition(x,y);
        distance = GetDistance(x,ctxIntWHalf,y,ctxIntHHalf)/15;
        console.log(distance);
    }
}

function GetDistance(x1,x2,y1,y2)
{
    dx = x2-x1
    dy = y2-y1
    return Math.sqrt(dx*dx+dy*dy)
}

function MakePoint(d, t)
{
    this.Distance = d;
    this.Time = t;
}


startBtn.onclick = function(e)
{
    started=true;
    time = 0;
    Points = []
}

stopBtn.onclick = function(e)
{
    started = false;
}

function DrawDynamicInt(ctx)
{
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.moveTo(ctxIntWHalf,ctxIntHHalf);
    ctx.lineTo(Person.X,Person.Y);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeText(distance.toFixed(1) + " meters",ctxIntWHalf-10,ctxIntHHalf-50);
    Person.Draw(ctx);
    
}

function DrawStaticInt(ctx)
{
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.rect(0,0,ctxIntW,ctxIntH);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgb(0,255,0)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(ctxIntWHalf-20,ctxIntHHalf-20,40,40);
    ctx.moveTo(ctxIntWHalf-20,ctxIntHHalf-20);
    ctx.lineTo(ctxIntHHalf,ctxIntHHalf-40);
    ctx.lineTo(ctxIntHHalf+20,ctxIntHHalf-20);
    ctx.stroke();
    
}

function DrawDynamicViz(ctx)
{
    if(started)
    {
        Points.push(new MakePoint(distance,time))
    }
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(0,0,255)';
    ctx.beginPath();
    ctx.moveTo(25,ctxVizH-25);
    for(var pidx in Points)
    {
        var p = Points[pidx];
        ctx.lineTo(25+20*p.Time,ctxVizH-25-20*p.Distance);
        ctx.moveTo(25+20*p.Time,ctxVizH-25-20*p.Distance);
        
    }
    ctx.stroke();
}

function DrawStaticViz(ctx)
{
    //boarder
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(125,125,0)';
    ctx.beginPath();
    ctx.rect(0,0,ctxVizW,ctxVizH);
    ctx.stroke();
    
    //graph Y
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,125,125)';
    ctx.moveTo(25,5);
    ctx.lineTo(25,ctxVizH-5);
    ctx.stroke();
    
    //graph X
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,125,125)';
    ctx.moveTo(5,ctxVizH-25);
    ctx.lineTo(ctxVizW-5,ctxVizH-25);
    ctx.stroke();
    
    //labels
    ctx.lineWidth = 1;
    ctx.strokeStyle='rgb(255,255,255)';
    ctx.strokeText("0",7,ctxVizH-7);
    
    for(var t=0;t<15;++t)
    {
        ctx.strokeText(t+1,45+t*20,ctxVizH-7);
    }
    for(var d=0;d<15;++d)
    {
        ctx.strokeText(d+1,7,ctxVizH-45-d*20);
    }
    
    ctx.strokeStyle='rgb(0,0,255)';
    ctx.strokeText("D",7,20);
    ctx.strokeText("T",ctxVizW-20,ctxVizH-10);
}

function DrawVizual()
{
    drawVizCtx.clearRect(0,0,canvasViz.width,canvasViz.height);
    DrawStaticViz(drawVizCtx);
    DrawDynamicViz(drawVizCtx);
}

function DrawInteract()
{
    drawIntCtx.clearRect(0,0,canvasInt.width,canvasInt.height);
    DrawStaticInt(drawIntCtx);
    DrawDynamicInt(drawIntCtx);
}



function update()
{
    if(started)
    {
        time += 1/60;
        timer.innerText = time.toFixed(1) + " seconds";
        if(time>=MaxTime)
        {
            started = false;
        }
    }
    DrawInteract();
    DrawVizual();
    window.requestAnimationFrame(update);
}

update();