const drawctx = document.getElementById("gamearea").getContext('2d');

function Hero(x, y, size, step, bound, color)
{
    const self = this;
    self.X = x;
    self.Y = y;
    self.MaxX = x+bound;
    self.MinX = x-bound;
    self.Color = color;
    self.Step = step;
    self.Size = size;
    self.Direction = "none";
    self.BulletCount = 21;
    self.FireCB = null;
    self.Fired = false;
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
                self.FireCB(new Bullet(self.X+self.Size/2, self.Y, "up", 5, 2,"yellow"))
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
        ctx.fillRect(self.X, self.Y, self.Size, self.Size);
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
        return (self.X<=obj.X && (self.X+self.Size)>=obj.X && self.Y<=obj.Y && (self.Y+self.Size)>=obj.Y)
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
    self.Direction = "right";
    self.Update = function(){
        if(self.Direction == "right")
        {
            self.X = self.X + self.Step;
            if(self.X >= self.MaxX){
                self.Direction = "left";
                self.Y += 10;
            }
        }
        else if(self.Direction == "left"){
            self.X = self.X - self.Step;
            if(self.X<=self.MinX){
                self.Direction = "right";
            }
        }
    }
    self.Draw = function(ctx){
        ctx.fillStyle = self.Color;
        ctx.fillRect(self.X, self.Y, self.Size, self.Size);
    }
    self.Contains = function(obj){
        return (self.X<=obj.X && (self.X+self.Size)>=obj.X && self.Y<=obj.Y && (self.Y+self.Size)>=obj.Y)
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
        ctx.fillRect(self.X, self.Y, self.Size, self.Size);
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

const Player = new Hero(200, 350, 20, 1, 100, "blue");
Player.FireCB = PlayerFired;

function keyDown(k){
    Player.Input(k.keyCode, true);
}
function keyUp(k){
    Player.Input(k.keyCode, false);
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);




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
    Player.Update();
    Player.Draw(drawctx);
    
    window.requestAnimationFrame(update);
}

update();