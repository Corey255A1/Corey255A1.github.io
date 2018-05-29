const canvas = document.getElementById("viz");

const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

function Square(x,y)
{
    this.TOP = null;
    this.BOTTOM = null;
    this.LEFT = null;
    this.RIGHT = null;
    this.bActivated = false;
    this.nActivationTimeout = 0;
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
                this.Activate(100);
                return true;
            }
            return false;
    }
    this.Activate = function(intensity){
        if(!this.bActivated && intensity>0)
        {
            this.bActivated = true;
            this.nActivationTimeout = (intensity/100)*3;
        }
    }
    this.Emit = function(){
        var intensity = (this.nActivationTimeout/3)*100-10;
        if(this.TOP!==null)
        {
            this.TOP.Activate(intensity);
        }
        if(this.BOTTOM!==null)
        {
            this.BOTTOM.Activate(intensity);
        }
        if(this.LEFT!==null)
        {
            this.LEFT.Activate(intensity);
        }
        if(this.RIGHT!==null)
        {
            this.RIGHT.Activate(intensity);
        }
    }
    this.Update = function(ctx){
        if(this.bActivated)
        {
            var c = (this.nActivationTimeout/3) * 255;
            ctx.fillStyle = 'rgb('+c+','+c+',255)';
            this.nActivationTimeout = this.nActivationTimeout - (1/60);
            if(this.nActivationTimeout<=0)
            {
                this.nActivationTimeout = 0;
                this.bActivated = false;
            }
            this.Emit();
        }
        else
        {
            ctx.fillStyle = 'rgb(0,0,255)';
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
    window.requestAnimationFrame(update);
}

var Squares = [];
for(var j=0;j<40;++j)
{
    var srow = [];
    for(var i=0;i<40;++i)
    {
        var s = new Square(20+20*i,20+20*j);
        if(i>0)
        {
            srow[i-1].RIGHT = s;
            s.LEFT = srow[i-1];
        }
        if(j>0)
        {
            Squares[j-1][i].BOTTOM = s;
            s.TOP = Squares[j-1][i];
        }
        srow.push(s);
    }
    Squares.push(srow);
}

update();