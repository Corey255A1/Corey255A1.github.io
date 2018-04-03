const canvas = document.getElementById("viz");

const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


const Speed = 2;

var uPX = 0;
var uPY = 0;
var uPLX = 0;
var uPLY = 0;
var bDrawLine = false;

var TheLines = [];

function MakeLine(x1,y1,x2,y2)
{
    this.X1 = x1;
    this.Y1 = y1;
    this.X2 = x2;
    this.Y2 = y2;
}

canvas.onmousedown = function(e)
{
    audioCtx.resume();
    if(!bDrawLine)
    {
        uPX = e.offsetX;
        uPY = e.offsetY;
        uPLX = e.offsetX;
        uPLY = e.offsetY;
        bDrawLine = true;
    }
    else
    {
        bDrawLine = false;
        TheLines.push(new MakeLine(uPX,uPY,uPLX,uPLY));
    }
}
canvas.onmousemove = function(e)
{
    if(bDrawLine)
    {
        uPLX = e.offsetX;
        uPLY = e.offsetY;
    }
}


function DrawStatic(ctx)
{
    
    //ctx.strokeStyle = 'rgb(0,128,255)';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.rect(0,0,512,512);
    ctx.stroke();
    
}

function DrawDynamic(ctx)
{
    if(bDrawLine)
    {
        ctx.strokeStyle = 'rgb(128,255,255)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(uPX, uPY);
        ctx.lineTo(uPLX, uPLY);
        ctx.stroke();
        var dX = uPLX - uPX;
        var dY = uPLY - uPY;
        var len = Math.sqrt(dX*dX + dY*dY);
        var freq = Math.floor(1660-(len/ctxH *1550));
        ctx.lineWidth=3;
        ctx.strokeStyle='rgb(0,0,0)'
        ctx.strokeText(freq+'Hz',uPLX,uPLY);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(freq+'Hz',uPLX,uPLY);
    }
    ctx.strokeStyle = 'rgb(0,128,255)';
    ctx.beginPath();
    for(var l in TheLines)
    {
        var tl = TheLines[l];
        ctx.moveTo(tl.X1,tl.Y1);
        ctx.lineTo(tl.X2,tl.Y2);
    }
    ctx.stroke();
}

function FindLine(x,y)
{
    //Find the line that this x and y hits
    var len = 0;
    for(var l in TheLines)
    {
        var line = TheLines[l];
        
        var bOnline = IsPointOnLine(x,y,line.X1,line.X2,line.Y1,line.Y2,6);
        if(bOnline) 
        {
            var dX = line.X2 - line.X1;
            var dY = line.Y2 - line.Y1;
            len = Math.sqrt(dX*dX + dY*dY);
            break;
        }
        //console.log(bOnline);
    }
    return len;
}

function IsPointOnLine(x,y,x1,x2,y1,y2,thickness)
{
    var dX = x2 - x1;
    var dY = y2 - y1;
    
    var TotalA = thickness * Math.sqrt(dX*dX + dY*dY);
    
    //console.log("TotalA: "+ TotalA);
    var angle = Math.atan2(dY,dX);
    
    var px1 = x1 + Math.cos(angle+Math.PI/2);
    var py1 = y1 + Math.sin(angle+Math.PI/2);
    
    var px2 = x1 + Math.cos(angle-Math.PI/2);
    var py2 = y1 + Math.sin(angle-Math.PI/2);
    
    var px3 = x2 + Math.cos(angle-Math.PI/2);
    var py3 = y2 + Math.sin(angle-Math.PI/2);
    
    var px4 = x2 + Math.cos(angle+Math.PI/2);
    var py4 = y2 + Math.sin(angle+Math.PI/2);
    
    var A1 = GetAreaOfTriangle(x,y,px1,py1,px2,py2);
    var A2 = GetAreaOfTriangle(x,y,px1,py1,px4,py4);
    var A3 = GetAreaOfTriangle(x,y,px4,py4,px3,py3);
    var A4 = GetAreaOfTriangle(x,y,px3,py3,px2,py2);
    
    var SumA = A1 + A2 + A3 + A4;
    //console.log(SumA);
    
    return (SumA <= TotalA);
}

function GetAreaOfTriangle(x0,y0,x1,y1,x2,y2)
{
    //Shoelace formulae! Who knew!?
    A = x0*y1 + x1*y2 + x2*y0 - x0*y2 - x1*y0 - x2*y1;
    return Math.abs(A)/2;
}

function Box(x,y,vx,vy,type) {
    this.X=x;
    this.Y=y;
    this.Vx=vx;
    this.Vy=vy;
    this.Width=32;
    this.Height=32;
    this.hW=16;
    this.hH=16;
    //Each Box gets its own oscillator
    this.gainNode=audioCtx.createGain();
    this.oscillator=audioCtx.createOscillator();
    this.oscillator.type = type;
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(audioCtx.destination);
    this.oscillator.start();
    this.gainNode.gain.value = 0;
    this.clear=function(ctx)
    {
        ctx.clearRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    };
    this.sense=function(ctx,x,y)
    {
        //This is overly complicated I'm pretty sure.
        //But I am only sampling three points for collision (not a whole box)
        
        //console.log(x + ' ' + y)
        var px0 = ctx.getImageData(this.X, this.Y+y,1,1).data;
        var px1 = ctx.getImageData(this.X+x, this.Y,1,1).data;
        var px2 = ctx.getImageData(this.X+x, this.Y+y,1,1).data;
        
        var sense = {
            TB:false,
            LR:false,
            ANG:false,
            HitLine:false,
            HitX:0,
            HitY:0
        }

        if(y!=0)
        {
            if(this.Y+y>ctxH||this.Y+y<24)
            {
                //hit the boundary
                sense.TB = true;
            }
            else if(px0[1]==128 && px0[2]==255)
            {
                sense.TB = true;
                sense.HitLine = true;
                sense.HitX = this.X;
                sense.HitY = this.Y+y;
            }
        }

        if(x!=0)
        {
            if(this.X+x>ctxW||this.X+x<24)
            {
                //hit the boundary
                sense.LR = true;
            }
            else if(px1[1]==128 && px1[2]==255)
            {
                sense.LR = true;
                sense.HitLine = true;
                sense.HitX = this.X+x;
                sense.HitY = this.Y;
            }
        }


        if(x!=0 && y!=0)
        {
            if((this.X+x>ctxW||this.X+x<24) && (this.Y+y>ctxH||this.Y+y<24))
            {
                sense.ANG = true;
                
            }
            else if(px2[1]==128 && px2[2]==255)
            {
                sense.ANG = true;
                sense.HitLine = true;
                sense.HitX = this.X+x;
                sense.HitY = this.Y+y;
            }
        }
        return sense;
    };
    this.update=function(ctx)
    {
        //If the box doesn't have an initial Vx and Vy .. it will never
        //get one.. because just negating current velocity
        //Bouncing
        var VSense = this.sense(ctx,20*Math.sign(this.Vx),20*Math.sign(this.Vy));

        if(VSense.ANG && !VSense.LR && !VSense.TB)
        {
            //console.log("LOG")
            this.Vx = this.Vx * -1;
            this.Vy = this.Vy * -1;
        }
        else 
        {
            if(VSense.LR)
            {
                this.Vx = this.Vx * -1;
                //console.log(this.Vx) 
            }
            if(VSense.TB)
            {
                this.Vy = this.Vy * -1;
                //console.log(this.Vy) 
            }
        }
        
        if(VSense.HitLine)
        {
           var len = FindLine(VSense.HitX,VSense.HitY);
           if(len>0)
            {
                //console.log("HERE");
                this.playTone(1660-(len/ctxH *1550));
                
            }
        }
        
        this.X += this.Vx;
        this.Y += this.Vy;
    };
    this.draw=function(ctx)
    {
        ctx.fillStyle = 'rgb(0,255,0)';
        drawCtx.fillRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    };
    this.playTone = function(tone)
    {
        //880-(len/ctxH *770)
        this.oscillator.frequency.setValueAtTime(tone, audioCtx.currentTime);
        this.gainNode.gain.value = 1;
        this.gainNode.gain.setTargetAtTime(0,audioCtx.currentTime,0.015);
    };
}

function update()
{
    drawCtx.clearRect(0,0,512,512);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);
    Box1.update(drawCtx);
    Box2.update(drawCtx)
    
    Box1.draw(drawCtx);
    Box2.draw(drawCtx);
    window.requestAnimationFrame(update);
}

Box1 = new Box(16,16,2,2,'sine');
Box2 = new Box(64,64,-2,2,'square');
update();