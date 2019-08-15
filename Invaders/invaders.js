const drawctx = document.getElementById("gamearea").getContext('2d');
const Width = 400;
const Height = 400;
const aibtn = document.getElementById("ai");
var aiEnabled = false;
aibtn.addEventListener("click",()=>{
    aiEnabled = !aiEnabled;
    aibtn.value = aiEnabled?"Disable AI":"Enable AI";
});
function Hero(x, y, size, step, bound, color)
{
    const self = this;
    self.X = x;
    self.Y = y;
    self.MaxX = Width-bound;
    self.MinX = bound;
    self.Color = color;
    self.Step = step;
    self.Size = size;
    self.HSize = size/2;
    self.Direction = "none";
    self.BulletCount = 21;
    self.FireCB = null;
    self.Fired = false;
    self.BulletSpeed = 2;
    self.Input = function(keycode, down){
        if((keycode == 37 || keycode == 39) && !down){
            self.Direction = "none";
        }
        else if(keycode == 37 && down){
            self.Direction = "left";
        }
        else if(keycode == 39 && down){
            self.Direction = "right";
        }
        else if(keycode == 32 && down && !self.Fired){
            if(self.FireCB != null && self.BulletCount>0){
                self.Fired = true;
                self.BulletCount--;
                self.FireCB(new Bullet(self.X, self.Y, "up", 5, self.BulletSpeed,"yellow"))
            }
        }
        else if(keycode == 32 && !down && self.Fired){
            self.Fired = false;
        }
        else{
            console.log(keycode);
        }
    }
    self.Draw = function(ctx){
        ctx.fillStyle = self.Color;
        ctx.fillRect(self.X-self.HSize, self.Y-self.HSize, self.Size, self.Size);
    }
    self.Update = function(){
        if(self.Direction == "right")
        {
            if(self.X < self.MaxX){
                self.X = self.X + self.Step;
            }
        }
        else if(self.Direction == "left"){
            if(self.X > self.MinX){
                self.X = self.X - self.Step;
            }
        }
    }
    self.Contains = function(obj){
        return (self.X-self.HSize<=obj.X && (self.X+self.HSize)>=obj.X && 
            self.Y-self.HSize<=obj.Y && (self.Y+self.HSize)>=obj.Y)
    }
    self.DistanceTo = function(obj)
    {
        dx = obj.X-self.X;
        dy = obj.Y-self.Y;
        return Math.sqrt(dx*dx+dy*dy)
    }
    
    //AI Code
    self.FlyoutTimeout = 0;
    self.CurrentTarget = null;
    self.CurrentTargetIdx = 0;
    self.State = "Aquire";
    self.TargetFX = -1;
    self.TargetIX = -1;
    self.TargetVX = -1;
    self.AI = function(level, invaders){
        if(self.FlyoutTimeout>0){
            self.FlyoutTimeout--;
        }
        if(invaders.length>0){
            if(self.CurrentTargetIdx>=invaders.length)
            {
                self.CurrentTargetIdx = 0;
            }
            if(self.CurrentTarget != invaders[self.CurrentTargetIdx]){
                self.State = "Aquire";
            }
            if(self.State == "Aquire"){
                if(level == 0){
                    self.CurrentTarget = invaders[self.CurrentTargetIdx];
                }
                else if(level == 1){
                    self.CurrentTargetIdx = 0;
                    var shortest = self.DistanceTo(invaders[0]);
                    for(var i=1;i<invaders.length;i++){
                        var curdist = self.DistanceTo(invaders[i]);
                        if(curdist<shortest)
                        {
                            shortest = curdist;
                            self.CurrentTargetIdx = i;
                        }
                    }
                    self.CurrentTarget = invaders[self.CurrentTargetIdx];
                }
                self.FlyoutTimeout = 0;
                self.State = "Target";
            }
            else if(self.State == "Target")
            {
                var ydist = self.Y - self.CurrentTarget.Y - self.CurrentTarget.HSize;
                var timetoy = Math.ceil(ydist/self.BulletSpeed);
                self.TargetIX = self.CurrentTarget.X;
                self.TargetFX = self.TargetIX;
                self.TargetVX = self.CurrentTarget.Vx;
                var vx = self.CurrentTarget.Vx;
                for(;timetoy>=0;timetoy--){
                    self.TargetFX = self.TargetFX + vx;
                    if(vx>0 && self.TargetFX>=self.CurrentTarget.MaxX){
                        vx = -vx;
                    }else if(vx<0 && self.TargetFX<=self.CurrentTarget.MinX){
                        vx = -vx;
                    }
                }
                self.State = "Locked";
            }
            else if(self.State == "Locked"){
                if(self.TargetFX>self.X){
                    self.Direction = "right";
                }
                else if(self.TargetFX<self.X){
                    self.Direction = "left";
                }
                else{
                    self.Direction = "none";
                    self.State = "FirePhase";
                }
            }
            else if(self.State == "FirePhase"){
                if(self.FlyoutTimeout==0 && 
                self.CurrentTarget.X == self.TargetIX && 
                self.CurrentTarget.Vx == self.TargetVX &&
                self.FireCB != null && self.BulletCount>0){
                    if(level==0){ self.CurrentTargetIdx++; }
                    self.FlyoutTimeout = 100;
                    self.Fired = true;
                    self.BulletCount--;
                    self.FireCB(new Bullet(self.X, self.Y, "up", 5, self.BulletSpeed,"yellow"))
                    self.State = "Aquire";
                }
            }
           
        }
    }
}

function Invader(x, y, size, step, bound, color){
    const self = this;
    self.X = x;
    self.Y = y;
    self.MaxX = x+bound;
    self.MinX = x-bound;
    self.Color = color;
    self.Step = step;
    self.Size = size;
    self.HSize = size/2;
    self.Vx = step;
    self.Update = function(){
        self.X = self.X + self.Vx;
        if(self.Vx > 0)
        {
            if(self.X >= self.MaxX){
                self.Vx = -self.Vx;
                self.Y += 10;
            }
        }
        else if(self.Vx < 0){
            if(self.X<=self.MinX){
                self.Vx = -self.Vx;
            }
        }
    }
    self.Draw = function(ctx){
        ctx.fillStyle = self.Color;
        ctx.fillRect(self.X-self.HSize, self.Y-self.HSize, self.Size, self.Size);
    }
    self.Contains = function(obj){
        return (self.X-self.HSize<=obj.X && (self.X+self.HSize)>=obj.X && 
            self.Y-self.HSize<=obj.Y && (self.Y+self.HSize)>=obj.Y)
    }
}

function Bullet(x,y,dir,size, step, color){
    const self = this;
    self.X = x;
    self.Y = y;
    self.Direction = dir;
    self.Color = color;
    self.Step = step;
    self.Size = size;
    self.HSize = size/2;
    self.OutOfBounds = null;
    self.Index = 0;
    self.Update = function()
    {
        if(self.Direction == "up"){self.Y -= self.Step;}
        else if(self.Direction == "down"){self.Y += self.Step;}
        else if(self.Direction == "left"){self.X -= self.Step;}
        else if(self.Direction == "right"){self.X += self.Step;}
        if(self.Y<0 || self.Y>400 || self.X<0 || self.X>400){
            if(self.OutOfBounds != null){
                self.OutOfBounds(self);
            }
        }
    }
    self.Draw = function(ctx){
        ctx.fillStyle = self.Color;
        ctx.fillRect(self.X-self.HSize, self.Y-self.HSize, self.Size, self.Size);
    }
    
}

var invaders = [];
for(var x = 100; x<300; x+=30){
    for(var y=30; y<110; y+=30){
        invaders.push(new Invader(x, y, 20, 1, 50, "green"));
    }
    
}

var firedObjects = [];
var deletedObjects = [];
function PlayerFired(firedObject){
    firedObject.OutOfBounds = BulletOutOfBounds;
    firedObjects.push(firedObject);
}
function BulletOutOfBounds(bullet){
    deletedObjects.push(bullet);
}

const Player = new Hero(200, 350, 20, 1, 50, "blue");
Player.FireCB = PlayerFired;

function keyDown(k){
    Player.Input(k.keyCode, true);
}
function keyUp(k){
    Player.Input(k.keyCode, false);
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);



var exit = false;
function update(){
    drawctx.clearRect(0,0,400,400);
    drawctx.fillStyle = "black";
    drawctx.fillRect(0,0,400,400);
    drawctx.fillStyle = "white";
    drawctx.fillText("Shots Left:" + Player.BulletCount, 10,10)
    drawctx.fillText("Invaders Left:" + invaders.length, 10,20)
    for(var i in invaders){
        invaders[i].Update();
        invaders[i].Draw(drawctx);
    }
    for(var f in firedObjects){
        firedObjects[f].Update();
        var found = -1;
        for(var i in invaders){
            if(invaders[i].Contains(firedObjects[f])){
                found = i;
                break;
            }
        }
        if(found>=0){
            deletedObjects.push(firedObjects[f]);
            invaders.splice(found,1);
        }

        firedObjects[f].Draw(drawctx);
    }
    for(var b in deletedObjects){
        var i = firedObjects.findIndex(f=>f==deletedObjects[b]);
        firedObjects.splice(i,1);
    }
    if(deletedObjects.length>0){
        deletedObjects = [];
    }
    if(aiEnabled){
        Player.AI(1,invaders);
    }
    Player.Update();
    Player.Draw(drawctx);

    if(!exit){
        window.requestAnimationFrame(update);
    }
    if(invaders.length == 0){
        drawctx.fillStyle = "white";
        drawctx.fillText("WINNER", 200, 200)
        exit = true; //exit next frame
    }
}

update();