const canvas = document.getElementById("viz");

const drawCtx = canvas.getContext("2d");
const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

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
    //ctx.beginPath();
    //ctx.moveTo(0, 0);
    //ctx.lineTo(0, 128);
    //ctx.lineTo(64, 128);
    //ctx.lineTo(256, 128);
    //ctx.lineTo(300, 300);
    //ctx.lineTo(300, 500);
    //ctx.stroke();
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
    for(var l in TheLines)
    {
        var line = TheLines[l];

    }
}

var robby = {
    X:16,
    Y:16,
    Vx:2,
    Vy:2,
    Width:32,
    Height:32,
    hW:16,
    hH:16,
    clear:function(ctx)
    {
        ctx.clearRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    },
    sense:function(ctx,x,y)
    {
        //console.log(x + ' ' + y)
        var px0 = ctx.getImageData(this.X, this.Y+y,1,1).data;
        var px1 = ctx.getImageData(this.X+x, this.Y,1,1).data;
        var px2 = ctx.getImageData(this.X+x, this.Y+y,1,1).data;
        
        var sense = {
            TB:false,
            LR:false,
            ANG:false,
            HitLine:false
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
            }
        }


        if(x!=0 && y!=0 && px2[1]==128 && px2[2]==255)
        {
            sense.ANG = true;
        }
        return sense;
    },
    update:function(ctx)
    {
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

        
        this.X += this.Vx;
        this.Y += this.Vy;
    },
    draw:function(ctx)
    {
        ctx.fillStyle = 'rgb(0,255,0)';
        drawCtx.fillRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    }
}

function update()
{
    drawCtx.clearRect(0,0,512,512);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);
    robby.update(drawCtx);
    
    
    robby.draw(drawCtx);
    window.requestAnimationFrame(update);
}


update();