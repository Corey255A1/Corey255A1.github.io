const drawctx = document.getElementById("gamearea").getContext("2d");
const playerscore = document.getElementById("player1");
const aibtn = document.getElementById("ai");
var aiEnabled = false;
aibtn.addEventListener("click",()=>{
    aiEnabled = !aiEnabled;
    aibtn.value = aiEnabled?"Disable AI":"Enable AI";
})

const Width = 400;
const Height = 400;
const HWidth = Width/2;
const HHeight = Height/2;
const UpperBound = 10;
const LowerBound = Height - 10;
const LeftBound = 10;
const RightBound = Width - 10;
var score = 0;

function InRange(val, min, max){
    return (val>=min && val<=max);
}

function Player(xoffset, yoffset, speed)
{
    const self = this;
    self.X = xoffset;
    self.Y = yoffset;
    self.LastY = yoffset;
    self.LastX = xoffset;
    self.Height = 10;
    self.Width = 10;
    self.HHeight = self.Height/2;
    self.HWidth = self.Width/2;
    self.Direction = "none";
    self.Speed = speed;
    self.KeysDown = {};
    self.Draw = function(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(self.X-self.HWidth, self.Y-self.HHeight, self.Width, self.Height);
    }
    self.Update = function(){
        self.LastY = self.Y;
        self.LastX = self.X;
        if(self.Direction=="up" && self.Y-self.HHeight>UpperBound){
            self.Y -= self.Speed;
        }else if(self.Direction=="down" && self.Y+self.HHeight<LowerBound){
            self.Y += self.Speed;
        }else if(self.Direction=="left" && self.X-self.HWidth>LeftBound){
            self.X -= self.Speed;
        }else if(self.Direction=="right" && self.X+self.HWidth<RightBound){
            self.X += self.Speed;
        }
    }
    
    self.AI = function(lvl, wall){
        if(lvl == 0){
            if(wall.Y < (self.Y - self.HHeight)){
                if(self.X < wall.HoleCenter - self.HWidth){
                    self.Direction = "right";
                }
                else if(self.X > wall.HoleCenter + self.HWidth){
                    self.Direction = "left";
                }
                else if(self.Y-wall.Y>20){
                    self.Direction = "up";
                }
                else{
                    if(self.X > HWidth){
                        self.Direction = "left"
                    }else if(self.X < HWidth){
                        self.Direction = "right"
                    }
                    else{
                        self.Direction = "none";
                    }
                }
                return true;
            }
            else{
                if(self.X > HWidth){
                    self.Direction = "left"
                }else if(self.X < HWidth){
                    self.Direction = "right"
                }
                else{
                    self.Direction = "none";
                }
                return false;
            }
        }
    }
    
    self.Input = function(keycode, down)
    {
        self.KeysDown[keycode] = down;
        if(self.KeysDown[38] == true){
            self.Direction = "up";
            return true;
        }else if(self.KeysDown[40] == true){
            self.Direction = "down";
            return true;
        }else if(self.KeysDown[37] == true){
            self.Direction = "left";
            return true;
        }else if(self.KeysDown[39] == true){
            self.Direction = "right";
            return true;
        }else{
            self.Direction = "none";
        }
        return false;
    }
    self.CheckCollision = function(wall){
        var topedge = (self.Y - self.HHeight);
        if(InRange(topedge, wall.Y, wall.Y + wall.Thickness))
        {
            if(self.X < wall.Wall1End || self.X>wall.Wall2Start)
            {
                self.Y = (wall.Y + wall.Thickness) + self.HHeight;
            }
        }
        else if(topedge < wall.Y && (self.LastY-self.HHeight) > wall.Y)
        {
            if(self.X < wall.Wall1End || self.X>wall.Wall2Start)
            {
                self.Y = (wall.Y + wall.Thickness) + self.HHeight;
            }
        }
    }
}

function Wall(holewidth, holeoffset){
    const self = this;
    self.Y = 0;
    self.Thickness = 5;
    self.Wall1End = holeoffset - holewidth/2;
    self.Wall2Start = holeoffset + holewidth/2;
    self.Wall2End = Width - self.Wall2Start;
    self.Holewidth = holewidth;
    self.HHolewidth = holewidth/2;
    self.HoleCenter = self.Wall1End + self.HHolewidth;
    
    self.Update = function(fallrate)
    {
        self.Y += fallrate;
        if(self.Y>Height)
        {
            return false;
        }
        return true;
    }
    self.Draw = function(ctx){
        ctx.fillStyle = "limegreen";
        ctx.fillRect(0,self.Y, self.Wall1End, self.Thickness);
        ctx.fillRect(self.Wall2Start ,self.Y, self.Wall2End , self.Thickness);
    }
    
    
}

const HumanPlayer = new Player(HWidth, Height-50, 5);
function keyDown(k){
    if(HumanPlayer.Input(k.keyCode, true))
    {
        k.preventDefault();
    }
}
function keyUp(k){
    if(HumanPlayer.Input(k.keyCode, false))
    {
        k.preventDefault();
    }
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

var generationCount = 0;
var generationFreq = 60;
var hholesize = 75;
var fallspeed = 1;
var walls = [];
var removewalls = [];
var popcount = 0;
function createWall(){
    walls.push(new Wall((Math.random()*hholesize)+hholesize, (Math.random()*(Width-hholesize*2))+hholesize))
}
function update(){
    drawctx.clearRect(0,0, Width, Height);
    drawctx.fillStyle = "blue";
    drawctx.fillRect(0,0, Width, Height);
    
    if(++generationCount % Math.floor(generationFreq) == 0){
        createWall();
        generationCount = 0;
        if(hholesize>15){hholesize--;}
        if(generationFreq>5){generationFreq-=1;}
        fallspeed+=0.05;
    }
    
    //
    HumanPlayer.Update();
    var nearest = false;
    for(var w in walls){
        if(walls[w].Update(fallspeed))
        {
            walls[w].Draw(drawctx);
        }else{
            popcount++;
        }
        if(aiEnabled && !nearest) { 
           nearest =  HumanPlayer.AI(0, walls[w]); 
        }
        HumanPlayer.CheckCollision(walls[w]);
    }
    
    if(HumanPlayer.Y>Height){
        playerscore.innerText = "Game Over! Final: " + score;
        return;
    }
 
    HumanPlayer.Draw(drawctx);
    //to-do object pool
    for(;popcount>0;popcount--){
        walls.shift();
        score+=1;
        playerscore.innerText = score;
    }
    window.requestAnimationFrame(update);
}

update();