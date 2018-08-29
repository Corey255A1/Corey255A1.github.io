const canvas = document.getElementById("viz");


const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width;
const ctxH = canvas.height;
const centerX = ctxW/2;
const centerY = ctxH/2;
const sticklength = 50;

var bMoveLine = false;
var rows=4;
var cols=4;

var cannonGridX = 2;
var cannonGridY = 2;
var cannonX = cannonGridX*(ctxW/cols);
var cannonY = cannonGridY*(ctxH/rows);
var uPLX = centerX + 10;
var uPLY = centerY + 10;


var bulletList = [];

document.getElementById("fireBtn").onclick = function(e)
{
    var u = GetUnitVector(uPLX-cannonX,uPLY-cannonY);
    for(var i=0;i<20;i++)
    {
        bulletList.push(new Bullet(cannonX,cannonY,u[0]*5,u[1]*5,i));
    }
}
document.getElementById("addRowBtn").onclick = function(e)
{
    rows = rows+1;
    cannonY = cannonGridY*(ctxH/rows);
}
document.getElementById("remRowBtn").onclick = function(e)
{
    rows = rows-1;
    cannonY = cannonGridY*(ctxH/rows);
}
document.getElementById("addColBtn").onclick = function(e)
{
    cols = cols+1;
    cannonX = cannonGridX*(ctxW/cols);
}
document.getElementById("remColBtn").onclick = function(e)
{
    cols = cols-1;
    cannonX = cannonGridX*(ctxW/cols);
}



document.getElementById("incYBtn").onclick = function(e)
{
    cannonGridY = cannonGridY+1;
    cannonY = cannonGridY*(ctxH/rows);
}
document.getElementById("decYBtn").onclick = function(e)
{
    cannonGridY = cannonGridY-1;
    cannonY = cannonGridY*(ctxH/rows);
}
document.getElementById("incXBtn").onclick = function(e)
{
    cannonGridX = cannonGridX+1;
    cannonX = cannonGridX*(ctxW/cols);
}
document.getElementById("decXBtn").onclick = function(e)
{
    cannonGridX = cannonGridX-1;
    cannonX = cannonGridX*(ctxW/cols);
}


canvas.onmousedown = function(e)
{
    bMoveLine = true;
}

canvas.onmouseup = function(e)
{
    bMoveLine = false;
}

canvas.onmousemove = function(e)
{
    if(bMoveLine)
    {
        uPLX = e.offsetX;
        uPLY = e.offsetY;
    }
}

function Bullet(x,y,vx,vy,delay)
{
    this.X = x;
    this.Y = y;
    this.Vx = vx;
    this.Vy = vy;
    this.Life = 5000;
    this.Delay = delay;
    this.Update = function()
    {
        if((this.Delay-=1)>0) return true;
        if((this.Life -= GetDistanceTravelled(this.Vx,this.Vy)) <=0)
        {
            return false;
        }
        var x = this.X + this.Vx;
        var y = this.Y + this.Vy;
        if(x < 0 || x > ctxW)
        {
            this.Vx = -this.Vx;
            if(y < 0 || y > ctxH)
            {
                this.Vy = -this.Vy;
            }
        }
        else if(y < 0 || y > ctxH)
        {
            this.Vy = -this.Vy;
            if(x < 0 || x > ctxW)
            {
                this.Vx = -this.Vx;
            }
        }
        else
        {
            this.X = x;
            this.Y = y;
        }

        return true;
    }
    this.Draw = function(ctx)
    {
        if(this.Delay>0) return;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.save();
        var r = Math.atan2(this.Vy,this.Vx);
        ctx.translate(this.X+5,this.Y+5);
        ctx.rotate(r);        
        ctx.beginPath();
        ctx.rect(-5,-5,10,10);
        ctx.fill();
        ctx.restore();
    }

}

function GetDistanceTravelled(vx,vy)
{
    return Math.sqrt(vx*vx+vy*vy)
}

function GetUnitVector(x,y)
{
    var d = Math.sqrt(x*x+y*y);
    return [x/d,y/d];
}

function DrawDynamic(ctx)
{
    //ctx.strokeStyle = 'rgb(0,128,255)';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(0,0,255)';
    ctx.beginPath();
    var u = GetUnitVector(uPLX-cannonX,uPLY-cannonY);
    ctx.moveTo(cannonX, cannonY);
    ctx.lineTo(cannonX+u[0]*sticklength, cannonY+u[1]*sticklength);
    ctx.stroke();

    for(b in bulletList)
    {
        if(bulletList[b].Update())
        {
            bulletList[b].Draw(ctx);
        }
        else
        {
            bulletList.splice(b,1)
        }
    }
}



function DrawStatic(ctx)
{
    //draw grid
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(125,125,125)';
    for(var i=0; i<ctxH; i+=ctxH/rows)
    {
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(ctxW,i);
        ctx.stroke();
    }
    for(var i=0; i<ctxW; i+=ctxW/cols)
    {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,ctxH);
        ctx.stroke();
    }
    //ctx.strokeStyle = 'rgb(0,128,255)';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.rect(0,0,ctxW,ctxH);
    ctx.stroke();

}

function update()
{
    drawCtx.clearRect(0,0,ctxW,ctxH);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);

    window.requestAnimationFrame(update);
}

update();