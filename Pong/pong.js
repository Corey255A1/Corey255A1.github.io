const drawctx = document.getElementById("gamearea").getContext("2d");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const aibtn = document.getElementById("ai");
var aiEnabled = false;
aibtn.addEventListener("click",()=>{
    aiEnabled = !aiEnabled;
    aibtn.value = aiEnabled?"Disable AI":"Enable AI";
})

var player1Score = 0;
var player2Score = 0;
const Width = 400;
const Height = 400;
const HWidth = Width/2;
const HHeight = Height/2;
const UpperBound = 10;
const LowerBound = Height - 10;
const LeftBound = 10;
const RightBound = Width - 10;

function InRange(val, min, max){
    return (val>=min && val<=max);
}

function Simulate(obj){
        if(obj.X + obj.Vx > RightBound)
        {
            obj.X = RightBound;
            obj.Vx = -obj.Vx;
        }
        else if(obj.X + obj.Vx < LeftBound)
        {
            obj.X = LeftBound;
            obj.Vx = -obj.Vx;
        }
        else{
            obj.X += obj.Vx;
        }
        if(obj.Y + obj.Vy > LowerBound){
            obj.Y = LowerBound;
            obj.Vy = -obj.Vy;
        }
        else if(obj.Y + obj.Vy < UpperBound){
            obj.Y = UpperBound;
            obj.Vy = -obj.Vy;
        }
        else{
            obj.Y += obj.Vy;
        }
}

function Player(xoffset,speed)
{
    const self = this;
    self.X = xoffset;
    self.Y = HHeight;
    self.Height = 50;
    self.Width = 5;
    self.HHeight = self.Height/2;
    self.HWidth = self.Width/2;
    self.Direction = "none";
    self.Speed = speed;
    self.Draw = function(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(self.X-self.HWidth, self.Y-self.HHeight, self.Width, self.Height);
    }
    self.Update = function(){
        if(self.Direction=="up" && self.Y-self.HHeight>UpperBound){
            self.Y -= self.Speed;
        }else if(self.Direction=="down" && self.Y+self.HHeight<LowerBound){
            self.Y += self.Speed;
        }
    }
    
    self.AI = function(lvl, track){
        //Basic Height Follower
        if(lvl == 0){
            if(track.Y > self.Y+self.HHeight){
                self.Direction = "down";
            }
            else if(track.Y < self.Y-self.HHeight){
                self.Direction = "up";
            }
            else{
                self.Direction = "none";
            }
        }
        else if(lvl == 1){
            var sim = { X: track.X, Y:track.Y, Vx:track.Vx, Vy:track.Vy };
            var left = track.X < self.X;
            var right = track.X > self.X;
            for(var its=180; its>=0; --its){
                if(left && sim.X > self.X){
                    break;
                }
                if(right && sim.X < self.X){
                    break;
                }
                Simulate(sim);
            }
            if(sim.Y > self.Y+self.HHeight/2){
                self.Direction = "down";
            }
            else if(sim.Y < self.Y-self.HHeight/2){
                self.Direction = "up";
            }
            else{
                self.Direction = "none";
            }
        }
    }
    
    self.Input = function(keycode, down)
    {
        if((keycode == 38 || keycode == 40) && !down){
            self.Direction = "none";
        }
        else if(keycode == 38 && down){
            self.Direction = "up";
        }
        else if(keycode == 40 && down){
            self.Direction = "down";
        }
    }
    self.CheckCollision = function(gameobject){
        if(InRange(gameobject.X+gameobject.Vx, self.X-self.HWidth, self.X+self.HWidth) && 
            InRange(gameobject.Y+gameobject.Vy, self.Y-self.HHeight, self.Y+self.HHeight)){
            gameobject.Vx = -gameobject.Vx;
        }
    }
}

function Ball(x,y, speed, radDir){
    const self = this;
    self.X = x;
    self.Y = y;
    self.Vx = speed * Math.cos(radDir);
    self.Vy = speed * Math.sin(radDir);
    self.Update = function(){
        if(self.X + self.Vx > RightBound)
        {
            self.X = RightBound;
            self.Vx = -self.Vx;
            player1Score += 1;
            player1.innerText = player1Score;
        }
        else if(self.X + self.Vx < LeftBound)
        {
            self.X = LeftBound;
            self.Vx = -self.Vx;
            player2Score += 1;
            player2.innerText = player2Score;
        }
        else{
            self.X += self.Vx;
        }
        if(self.Y + self.Vy > LowerBound){
            self.Y = LowerBound;
            self.Vy = -self.Vy;
        }
        else if(self.Y + self.Vy < UpperBound){
            self.Y = UpperBound;
            self.Vy = -self.Vy;
        }
        else{
            self.Y += self.Vy;
        }
    }
    self.Draw = function(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(self.X-5, self.Y-5, 10, 10);
    }
    
}



const HumanPlayer = new Player(40,10);
const BotPlayer = new Player(Width-40,10);
const GameBall = new Ball(HWidth,HHeight, 8, Math.random()*Math.PI*2);

function keyDown(k){
    HumanPlayer.Input(k.keyCode, true);
}
function keyUp(k){
    HumanPlayer.Input(k.keyCode, false);
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);


function update(){
    drawctx.clearRect(0,0, Width, Height);
    drawctx.fillStyle = "black"
    drawctx.fillRect(0,0, Width, Height);
    GameBall.Update();
    
    if(aiEnabled){
        HumanPlayer.AI(1, GameBall);
    }
    HumanPlayer.Update();
    
    BotPlayer.AI(1, GameBall);
    BotPlayer.Update();
    
    HumanPlayer.CheckCollision(GameBall);
    BotPlayer.CheckCollision(GameBall);
    
    BotPlayer.Draw(drawctx);
    GameBall.Draw(drawctx);
    HumanPlayer.Draw(drawctx);
    
    
    
    window.requestAnimationFrame(update);
}

update();