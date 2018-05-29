const canvas = document.getElementById("viz");

const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width-24;
const ctxH = canvas.height-24;

var uPX = 0;
var uPY = 0;
var uPLX = 0;
var uPLY = 0;
var bDrawLine = false;
var SelectedPoint = null;
var SelectedLine = null;

var TheLines = [];
var ThePoints = [];

function FindMidPoint(x1,y1,x2,y2){
    return {x:(x2+x1)/2, y:(y2+y1)/2}
}

function MakePoint(x,y){
    this.X = x;
    this.Y = y;
    this.Size = 15;
    this.Lines = [];
    this.Selected = false;
    this.ConnectLine = function(line)
    {
        this.Lines.push(line);
    }
    this.CheckPoint = function(x,y){
        if(x>this.X-7.5 && x<this.X+7.5 && y>this.Y-7.5 && y<this.Y+7.5)
        {
            return {x:this.X, y:this.Y};
        }
        return null;
    }
    this.SetSelected = function(selected){
        this.Selected = selected;
    }
    this.Draw = function(ctx){
        if(this.Selected)
        {
            ctx.fillStyle = 'rgb(255,255,255)';
        }
        else
        {
            ctx.fillStyle = 'rgb(0,255,0)';
        }
        ctx.fillRect(this.X-this.Size/2, this.Y-this.Size/2, this.Size, this.Size);
    }
    this.DrawAllAngles = function(ctx){
        ctx.lineWidth=3;
        //for(var i=0;i<this.Lines.length;++i)
        if(this.Lines.length>1)
        {
            var i = 0;
            var l1 = this.Lines[i];
            var p1 = l1.P2;
            var p2 = l1.P1;
            if(l1.P1 == this) {p1 = l1.P1; p2=l1.P2;}
            var pX =p2.X - p1.X;
            var pY = p2.Y - p1.Y;
            for(var j=0;j<this.Lines.length;j++)
            {
                if(i!=j)
                {
                    
                    var ang = this.FindAngle(j,pX, pY, l1.Length);
                    var dang = Math.round(ang*180/Math.PI);
                    var vp = this.VectorFromThisPoint(j)
                    var mid = FindMidPoint(pX,pY,vp.x,vp.y)
                    pX = (mid.x/10+p1.X);
                    pY = (mid.y/10+p1.Y);
                    ctx.strokeStyle='rgb(0,0,0)';
                    ctx.strokeText(dang +'°',pX,pY);
                    ctx.fillStyle = 'rgb(255,255,255)';
                    ctx.fillText(dang +'°',pX,pY);
                    
                }
            }
        }
        ctx.lineWidth=6;
    }
    this.VectorFromThisPoint = function(lineidx)
    {
        var xt=0;
        var yt=0;
        if(this.Lines[lineidx].P2 == this)
        { 
            xt = this.Lines[lineidx].P1.X - this.X; 
            yt = this.Lines[lineidx].P1.Y - this.Y;
            
        }
        else
        {
            xt = this.Lines[lineidx].P2.X - this.X; 
            yt = this.Lines[lineidx].P2.Y - this.Y;
        }
        return {x:xt, y:yt};
    }
    this.FindAngle = function(lineidx, x, y, len)
    {
        
        var xt=0;
        var yt=0;
        if(this.Lines[lineidx].P2 == this)
        { 
            xt = this.Lines[lineidx].P1.X - this.X; 
            yt = this.Lines[lineidx].P1.Y - this.Y;
            
        }
        else
        {
            xt = this.Lines[lineidx].P2.X - this.X; 
            yt = this.Lines[lineidx].P2.Y - this.Y;
        }
        var dot = xt*x + yt*y;
        var theta = dot/(len*this.Lines[lineidx].Length);
        return Math.acos(theta);
    }
}

function MakeLine(x1,y1,x2,y2){
    this.X1 = x1;
    this.Y1 = y1;
    this.X2 = x2;
    this.Y2 = y2;
    this.MX = (x1+x2)/2;
    this.MY = (y1+y2)/2;
    this.P1 = null; //MakePoint(x1,y1);
    this.P2 = null; //MakePoint(x2,y2);
    this.Length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    this.Draw = function(ctx){
        ctx.strokeStyle = 'rgb(0,128,255)';
        ctx.beginPath();
        ctx.moveTo(this.X1,this.Y1);
        ctx.lineTo(this.X2,this.Y2);
        ctx.stroke();
        ctx.lineWidth=3;
        ctx.strokeStyle='rgb(0,0,0)';
        var len = Math.round(this.Length);
        ctx.strokeText(len +' units',this.MX,this.MY);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(len +' units',this.MX,this.MY);
        ctx.lineWidth=6;
    }
}

canvas.onmousedown = function(e)
{

    if(!bDrawLine)
    {
        var x = e.offsetX;
        var y = e.offsetY;
        
        var startPoint = null;
        for(var p in ThePoints)
        {
            startPoint = ThePoints[p];
            var coord = startPoint.CheckPoint(x,y);
            if(coord != null)
            {
                startPoint.SetSelected();
                x = coord.x;
                y = coord.y;
                SelectedPoint = startPoint;
                break;
            }
        }
        
        uPX = x;
        uPY = y;
        uPLX = x;
        uPLY = y;
        bDrawLine = true;
    }
    else
    {
        var x = uPLX;
        var y = uPLY;
        var endPoint = null;
        for(var p in ThePoints)
        {
            var coord = ThePoints[p].CheckPoint(x,y);
            if(coord != null)
            {
                endPoint = ThePoints[p];
                endPoint.SetSelected();
                x = coord.x;
                y = coord.y;
                break;
            }
        }
        
        
        bDrawLine = false;
        var line = new MakeLine(uPX,uPY,x,y);
        if(SelectedPoint==null)
        {
            line.P1 = new MakePoint(uPX,uPY);
            line.P1.ConnectLine(line);
            ThePoints.push(line.P1);
        }
        else
        {
            line.P1 = SelectedPoint;
            SelectedPoint.ConnectLine(line);
        }
        if(endPoint==null)
        {
            line.P2 = new MakePoint(x,y);
            line.P2.ConnectLine(line);
            ThePoints.push(line.P2);
        }
        else
        {
            line.P2 = endPoint;
            endPoint.ConnectLine(line);
        }
        
        TheLines.push(line);
        
        SelectedPoint = null;
        SelectedLine = null;
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

function DrawDynamic(ctx){
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
        var ang = 0;
        if(SelectedPoint != null )
        {
            ang = SelectedPoint.FindAngle(0,dX,dY,len);
        }
        var dang = ang*180/Math.PI;
        len = Math.round(len);
        ctx.lineWidth=3;
        ctx.strokeStyle='rgb(0,0,0)';
        ctx.strokeText(ang +' rads',20,20);
        ctx.strokeText(dang +' deg',20,40);
        ctx.strokeText(len+' units',uPLX,uPLY);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(len+' units',uPLX,uPLY);
        ctx.fillText(ang +' rads',20,20);
        ctx.fillText(dang +' deg',20,40);
        ctx.lineWidth=6;
    }
    for(var l in TheLines)
    {
        TheLines[l].Draw(ctx);
    }
    for(var p in ThePoints)
    {
        ThePoints[p].Draw(ctx);
        ThePoints[p].DrawAllAngles(ctx);
    }
    
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

function update()
{
    drawCtx.clearRect(0,0,512,512);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);

    window.requestAnimationFrame(update);
}

update();