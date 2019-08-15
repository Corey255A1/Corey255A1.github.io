const canvas = document.getElementById("draw");
const blackHoleEnable = document.getElementById("blackHoleEnable");

var bBlackHoleEnabled = false;
function onBHEEnableClick(){
    bBlackHoleEnabled = !bBlackHoleEnabled;
}
blackHoleEnable.addEventListener("click",onBHEEnableClick);

const blackHoleMotionEnable = document.getElementById("blackHoleMotionEnable");

var bBlackHoleMotionEnabled = false;
function onBHEMotionEnableClick(){
    bBlackHoleMotionEnabled = !bBlackHoleMotionEnabled;
}
blackHoleMotionEnable.addEventListener("click",onBHEMotionEnableClick);


function Point(x,y,c,s){
    const self = this;
    self.X = Math.floor(x);
    self.Y = Math.floor(y);
    self.Vx = 0;
    self.Vy = 0;
    self.Color = c;
    self.Size = s/2;
    self.Draw = function(ctx){
        ctx.fillStyle = self.Color;
        ctx.fillRect(self.X+self.Size, self.Y+self.Size, self.Size*2, self.Size*2);
    }
    self.Update = function(){
        self.X += self.Vx;
        self.Y += self.Vy;
    }
    self.CalcGravity = function(x,y,m)
    {
        var dx = x - self.X;
        var dy = y - self.Y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        self.Vx = dx/dist * 8/dist;
        self.Vy = dy/dist * 8/dist;
    }
}

var pointList = [];
var bMouseDown = false;
function drawPoint(x,y){
    pointList.push(new Point(x,y,"blue",2));
}

function onmousedown(e){
 //console.log(e);
 bMouseDown = true;
 drawPoint(e.offsetX, e.offsetY);
}
function onmousemove(e){
 //console.log(e);
 if(bMouseDown){
   drawPoint(e.offsetX, e.offsetY);
 }
}
function onmouseup(e){
 //console.log(e);
 bMouseDown = false;
}
canvas.addEventListener('mousedown',onmousedown);
canvas.addEventListener('mouseup',onmouseup);
canvas.addEventListener('mousemove',onmousemove);
const drawCtx = canvas.getContext("2d");
drawCtx.font = "16px Arial";

const ctxW = canvas.width;
const ctxH = canvas.height;

var blackHoleX = 200;
var blackHoleY = 200;
var blackHoleVx = Math.random()*2 - 1;
var blackHoleVy = Math.random()*2 - 1;

function update()
{
    drawCtx.clearRect(0,0,ctxW,ctxH);
    drawCtx.fillStyle = 'black';
    drawCtx.fillRect(0,0,ctxW, ctxH);
    if(bBlackHoleMotionEnabled){
     blackHoleX += blackHoleVx;
     blackHoleY += blackHoleVy;
     if(blackHoleY>ctxH || blackHoleY<0) blackHoleVy = -blackHoleVy;
     if(blackHoleX>ctxW || blackHoleX<0) blackHoleVx = -blackHoleVx;
    }
    for(var p in pointList){
        if(bBlackHoleEnabled)
        {
         pointList[p].CalcGravity(blackHoleX,blackHoleY,0);
         pointList[p].Update();
        }
        pointList[p].Draw(drawCtx);
    }
    
    window.requestAnimationFrame(update);
}

update();