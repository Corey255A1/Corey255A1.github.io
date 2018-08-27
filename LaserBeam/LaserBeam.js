const canvas = document.getElementById("viz");
const fireBtn = document.getElementById("fireBtn")

const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width;
const ctxH = canvas.height;
const centerX = ctxW/2;
const centerY = ctxH/2;
const sticklength = 50;

var bMoveLine = false;
var uPLX = centerX + 10;
var uPLY = centerY + 10;

var bulletList = [];

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
fireBtn.onclick = function(e)
{
    var u = GetUnitVector(uPLX-centerX,uPLY-centerY);
    for(var i=0;i<20;i++)
    {
        bulletList.push(new Bullet(centerX,centerY,u[0]*5,u[1]*5,i));
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
    var u = GetUnitVector(uPLX-centerX,uPLY-centerY);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX+u[0]*sticklength, centerY+u[1]*sticklength);
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
    //ctx.strokeStyle = 'rgb(0,128,255)';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.rect(0,0,512,512);
    ctx.stroke();
}

function update()
{
    drawCtx.clearRect(0,0,512,512);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);

    window.requestAnimationFrame(update);
}

update();