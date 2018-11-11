const canvas = document.getElementById("viz");

const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

function findLineEquation(x1,y1,x2,y2)
{
   var m = (y2-y1)/(x2-x1);
   return function(x){
       return m*(x-x1) + y1;
   }
}

const LeftLine = findLineEquation(0,0,320,300);
Lines = []
for(var i=0;i<40;++i)
{
    Lines.push(findLineEquation(i*20,0,320,300));
}

function Square(x,y)
{
    this.bActivated = false;
    this.Intensity = 255;
    this.hW = 10;
    this.hH = 10;
    this.Height = 20;
    this.Width = 20;
    this.X = x;
    this.Y = y;
    this.CheckBoundary = function(x,y)
    {
        if(x>this.X-this.hW && x<this.X+this.hW &&
            y>this.Y-this.hH && y<this.Y+this.hH)
            {
                //this.Activate(255);
                return true;
            }
            return false;
    }
    this.Toggle = function()
    {
        this.bActivated = !this.bActivated;
    }
    //this.Activate = function(intensity){
    //    this.bActivated = !this.bActivated;
    //    this.Intensity = intensity;
    //}
    this.Update = function(ctx){
        if(this.bActivated)
        {
            ctx.fillStyle = 'rgb('+this.Intensity+',0,0)';
        }
        else
        {
            ctx.fillStyle = 'blue';
        }
        ctx.fillRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    }
}

canvas.onmousedown = function(e)
{
    var x = e.offsetX;
    var y = e.offsetY;
    for(var s in Squares)
    {
        for(var s2 in Squares[s])
        {
            if(Squares[s][s2].CheckBoundary(x,y))
            {
                Squares[s][s2].Toggle();
                //Projection[0][s2].Activate(255-255*(y/512));
                return;
            }
        }
    }
}
canvas.onmousemove = function(e)
{
        //uPLX = e.offsetX;
        //uPLY = e.offsetY;
}

function update()
{
    drawCtx.clearRect(0,0,512,512);
    for(var s in Squares)
    {
        for(var s2 in Squares[s])
        {
            Squares[s][s2].Update(drawCtx);
        }
    }
    for(var s in Projection)
    {
        for(var s2 in Projection[s])
        {
            Projection[s][s2].Update(drawCtx);
        }
    }
    for(var line in Lines)
    {
        for(var x=0;x<40;++x)
        {
            var y = Math.floor(Lines[line](x*20)/20)*20;
            if(y>100 && y<640)
            {
                if(Squares[y/20 - 5][x].bActivated){
                    //console.log("Active");
                    Projection[0][x].bActivated = true;
                    Projection[0][x].Intensity = (255-255*(y/512));
                    break;
                }
                Squares[y/20 - 5][x].Toggle();
            }
            
        }
    }
    window.requestAnimationFrame(update);
}

var Projection = [];
for(var j=0;j<1;++j)
{
    var srow = [];
    for(var i=0;i<40;++i)
    {
        var s = new Square(20+20*i,20+20*j);
        srow.push(s);
    }
    Projection.push(srow);
}

var Squares = [];
for(var j=5;j<40;++j)
{
    var srow = [];
    for(var i=0;i<40;++i)
    {
        var s = new Square(20+20*i,20+20*j);
        srow.push(s);
    }
    Squares.push(srow);
}

update();