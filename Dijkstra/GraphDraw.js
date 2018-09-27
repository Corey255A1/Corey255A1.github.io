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

function GetLine(node1,node2)
{
    for(var l in TheLines)
    {
        if(TheLines[l].ContainsNode(node1) && TheLines[l].ContainsNode(node2))
        {
            return TheLines[l];
        }
    }
    return null;
}
function FindMidPoint(x1,y1,x2,y2){
    return {x:(x2+x1)/2, y:(y2+y1)/2}
}
function MakeNode(name)
{
    this.Name = name;
    this.PathDistance = 1000000;
    this.PreviousNode = null;
    this.Visited = false;
    this.Connections = [];
    this.Highlight = false;
    this.Reset = function()
    {
        this.PathDistance = 1000000;
        this.PreviousNode = null;
        this.Visited = false;
        this.Highlight = false;
    }
    this.GetConnection = function(node)
    {
        for(var c in this.Connections)
        {
            var o = this.Connections[c].GetOtherNode(this);
            if(o==node)
            {
                return this.Connections[c];
            }
        }
        return null;
    }
}

function MakeConnection(node1,node2,distance)
{
    this.Distance = distance;
    this.Node1 = node1;
    this.Node2 = node2;
    node1.Connections.push(this);
    node2.Connections.push(this);
    this.GetOtherNode = function(node)
    {
        return node==this.Node1?this.Node2:this.Node1;
    }
}
var POINT_ID = 0;
function MakePoint(x,y){
    this.X = x;
    this.Y = y;
    this.Size = 15;
    this.Lines = [];
    this.Selected = false;
    this.Color = 'rgb(0,255,0)';
    this.Node = new MakeNode(POINT_ID++);
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
        if(this.Node.Highlight)
        {
            ctx.fillStyle = 'rgb(105,255,205)';
        }
        else if(this.Selected)
        {
            ctx.fillStyle = 'rgb(255,255,255)';
        }
        else
        {
            ctx.fillStyle = this.Color;
        }
        ctx.fillRect(this.X-this.Size/2, this.Y-this.Size/2, this.Size, this.Size);
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
    this.Highlight = false;
    this.ContainsNode = function(node)
    {
        return (this.P1.Node==node || this.P2.Node==node);
    }
    this.Draw = function(ctx){
        if(this.Highlight)
        {
            ctx.strokeStyle = 'rgb(255,255,0)';
        }
        else
        {
            ctx.strokeStyle = 'rgb(0,128,255)';
        }
        ctx.beginPath();
        ctx.moveTo(this.X1,this.Y1);
        ctx.lineTo(this.X2,this.Y2);
        ctx.stroke();
        ctx.lineWidth=3;
        ctx.strokeStyle='rgb(0,0,0)';
        var len = Math.round(this.Length);
        ctx.strokeText(len,this.MX,this.MY);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(len,this.MX,this.MY);
        ctx.lineWidth=6;
    }
}
function GetPointDistance(p1,p2)
{
    return GetDistance(p1.X,p2.X,p1.Y,p2.Y);
}
function GetDistance(x1,x2,y1,y2)
{
    dx = x2-x1
    dy = y2-y1
    return Math.sqrt(dx*dx+dy*dy)
}
canvas.onmousedown = function(e)
{

    if(!bDrawLine)
    {
        var x = e.offsetX;
        var y = e.offsetY;
        
        var startPoint = null;
        var bFound = false;
        for(var p in ThePoints)
        {
            startPoint = ThePoints[p];
            var coord = startPoint.CheckPoint(x,y);
            if(coord != null)
            {
                bFound = true;
                startPoint.SetSelected();
                x = coord.x;
                y = coord.y;
                SelectedPoint = startPoint;
                break;
            }
        }
        if(bFound)
        {
            uPX = x;
            uPY = y;
            uPLX = x;
            uPLY = y;
            bDrawLine = true;
        }
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
        
        new MakeConnection(line.P1.Node,line.P2.Node, GetPointDistance(line.P1,line.P2));
        
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
        
        len = Math.round(len);
        ctx.lineWidth=3;
        ctx.strokeStyle='rgb(0,0,0)';
        
        ctx.strokeText(len,uPLX,uPLY);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(len,uPLX,uPLY);
        
        ctx.lineWidth=6;
    }
    for(var l in TheLines)
    {
        TheLines[l].Draw(ctx);
    }
    for(var p in ThePoints)
    {
        ThePoints[p].Draw(ctx);
    }
    
}


function update()
{
    drawCtx.clearRect(0,0,512,512);
    DrawStatic(drawCtx);
    DrawDynamic(drawCtx);

    window.requestAnimationFrame(update);
}
var StartPoint = new MakePoint(20,ctxH/2);
StartPoint.Color = 'rgb(0,0,150)'
ThePoints.push(StartPoint);
var EndPoint = new MakePoint(ctxW-20,ctxH/2);
EndPoint.Color = 'rgb(150,0,0)'
ThePoints.push(EndPoint);
update();