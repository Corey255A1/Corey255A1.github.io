const canvas = document.getElementById("viz");


const drawCtx = canvas.getContext("2d");

drawCtx.font = "16px Arial";

const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

function Square(x,y,size)
{
    this.Height = size;
    this.Width = size;
    this.hW = this.Width/2;
    this.hH = this.Height/2;
    this.Type = null;
    this.X = x;
    this.Y = y;
    this.CheckBoundary = function(x,y){
        if(x>this.X-this.hW && x<this.X+this.hW &&
            y>this.Y-this.hH && y<this.Y+this.hH)
            {
                return true;
            }
            return false;
    }
    this.Update = function(ctx){
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(this.X-this.hW, this.Y-this.hH, this.Width, this.Height);
    }
}

canvas.onmousedown = function(e)
{
    var x = e.offsetX;
    var y = e.offsetY;
}
canvas.onmousemove = function(e)
{
        //uPLX = e.offsetX;
        //uPLY = e.offsetY;
}
document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch(evt.keyCode)
    {
        case 'w':
            break;
        case 'a':
            break;
        case 's':
            break;
        case 'd':
            break;
    }
};

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
    window.requestAnimationFrame(update);
}

var Squares = [];
var Objects = [];
for(var j=0;j<20;++j)
{
    var srow = [];
    var sobj = [];
    for(var i=0;i<20;++i)
    {
        var s = new Square(20+20*i,20+20*j,20);
        srow.push(s);
        sobj.push(null);
    }
    Squares.push(srow);
    Objects.push(null);
}

update();