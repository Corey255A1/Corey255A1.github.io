const drawctx = document.getElementById("draw").getContext("2d");
const Width = 480;
const Height = 480;



function Object_3D(x,y,z,size){
    const self = this;
    self.X = x;
    self.Y = y;
    self.Z = z;
    self.Vx = 0;
    self.Vy = 0;
    self.Vz = 0;
    self.Size = size;
    self.Input = function(keycode, down)
    {
        if((keycode == 37 || keycode == 39) && !down){
            self.Vx = 0;
        }
        else if((keycode == 38 || keycode == 40) && !down){
            self.Vy = 0;
        }
        else if((keycode == 81 || keycode == 65) && !down){
            self.Vz = 0;
        }
        else if(keycode == 37 && down){
            self.Vx = -1;
        }
        else if(keycode == 38 && down){
            self.Vy = -1;
        }
        else if(keycode == 39 && down){
            self.Vx = 1;
        }
        else if(keycode == 40 && down){
            self.Vy = 1;
        }
        else if(keycode == 81 && down){
            self.Vz = -1;
        }
        else if(keycode == 65 && down){
            self.Vz = 1;
        }
        else
        {
            console.log(keycode);
        }
    }
    self.applyForce = function(x,y,z){
        self.Vx += x;
        self.Vy += y;
        self.Vz += z;
    }
    self.update = function()
    {
        
        self.X += self.Vx;
        self.Y += self.Vy;
        self.Z += 0.25*self.Vz;
        if(self.X<0 || self.X>480 ||
        self.Y<0 || self.Y>480 ||
        self.Z<0 || self.Z>50){self.Y = 240;self.X = 240; self.Z = 2;}
    }
    self.draw = function(ctx){
        ctx.fillStyle = "rgb("+((self.Z/50) * 205 + 50)+",0,0)";
        var offset = (self.Z*self.Size);
        if(offset<0) offset = 0;
        //if(offset>200) offset = 0;
        ctx.fillRect(self.X-offset/2,self.Y-offset/2,offset,offset);
    }
}

var obj = new Object_3D(50,50,5,10);
function keyDown(k){
    obj.Input(k.keyCode, true);
}
function keyUp(k){
    obj.Input(k.keyCode, false);
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

objVec = [];
for(var i=0;i<200;++i)
{
    var o = new Object_3D(240,240,2,2);
    o.applyForce(Math.random()*4-2,Math.random()*4-2, Math.random()*0.25);
    objVec.push(o);
}

var inc = false;
function update(){
    drawctx.clearRect(0,0,Width,Height);
    drawctx.fillStyle = "black";
    drawctx.fillRect(0,0,Width,Height);
    //obj.update();
    //obj.draw(drawctx);
    
    objVec.sort(function(a,b){return a.Z - b.Z});
    for(o in objVec){
        objVec[o].update();
        objVec[o].draw(drawctx);
        
    }
    
    window.requestAnimationFrame(update);
}

update();