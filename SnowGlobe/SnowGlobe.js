class Globe{
    
    constructor(context, x, y, size, text){
        this.drawContext = context;
        this.X = x;
        this.Y = y;
        this.Size = size;
        this.RSize = (size)*(size);
        this.Text = text;
        this.Flakes = [];
        this.DY = 0.5;
        this.DX = 0.5;
    }
    
    resize(x,y,size){
        let dX = x-this.X
        let dY = y-this.Y
        //let scale = size/;
        this.Flakes.forEach(f=>{
            f.resize(x, dX, y, dY, size, this.Size);
        });
        this.X = x;
        this.Y = y;
        this.Size = size;
        this.RSize = (size)*(size);
    }
    
    addFlake(flake){
        this.Flakes.push(flake);
    }
    
    shake(){
        this.DX = 2;
        this.DY = 2;
    }
    
    setVelocity(dx, dy){
        if(dx!==0) this.DX = dx;
        if(dy!==0) this.DY = dy;
    }
    
    animate(){
        this.render();
        this.Flakes.forEach(f=>{
            let dy = Math.random()*this.DY - this.DY/2
            let dx = Math.random()*this.DX - this.DX/2
            f.update(dx,dy + 0.01, this.X, this.Y, this.RSize);
            f.render(this.drawContext);
        });
        this.DY = this.DY*0.99;//this.DY + (this.DY>0?-0.01:0.01);
        this.DX = this.DX*0.99;//this.DX + (this.DX>0?-0.01:0.01);
    }
    
    render(){
        this.drawContext.beginPath();
        this.drawContext.fillStyle = "blue";
        
        //this.drawContext.lineWidth = 5;
        this.drawContext.arc(this.X,this.Y,this.Size,Math.PI,0);
        this.drawContext.fill();
        //this.drawContext.stroke();
        
        this.drawContext.fillStyle = "brown"
        this.drawContext.fillRect(this.X-this.Size,this.Y, 2*this.Size, this.Size/2);
        this.drawContext.textAlign = "center"
        this.drawContext.font = (this.Size/5) + "px arial"
        this.drawContext.fillStyle = "black";
        this.drawContext.fillText(this.Text, this.X+2, this.Y+this.Size/4+2);
        this.drawContext.fillStyle = "White";
        this.drawContext.fillText(this.Text, this.X, this.Y+this.Size/4);
        //this.drawContext.strokeRect(this.X-this.Size,this.Y, 2*this.Size, this.Size/2);
    }
}

class SnowFlake{
    constructor(x,y,size){
        this.X = x;
        this.Y = y;
        this.Vy = 0;
        this.Vx = 0;
        this.Size = size;
    }
    
    resize(xoffset,dx,yoffset,dy,size,oldSize){
        this.X = xoffset + ((this.X+dx-xoffset)*size)/oldSize;
        this.Y = yoffset + ((this.Y+dy-yoffset)*size)/oldSize;
    }
    
    update(fx,fy, bx, by, br){
        this.Vx += fx +(-this.Vx/100);
        this.Vy += fy+(-this.Vy/100);
        if((this.Y + this.Vy) > by)
        {
            this.Vy = 0;
        }
        let dx = (this.X + this.Vx) - bx;
        let dy = (this.Y +this.Vy) - by;
        if( (dx*dx+dy*dy) > br ){
            this.Vx = 0;
            this.Vy = 0;
        }
        this.Y += this.Vy;
        this.X += this.Vx
    }
    
    render(ctx){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.X,this.Y, this.Size, 0, 2*Math.PI);
        ctx.fill();
    }
}



const cnv = document.getElementById('cnv');
const ctx = cnv.getContext('2d');
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
var WIDTH = cnv.width;
var HEIGHT = cnv.height;

let size = HEIGHT/2;
if(WIDTH/2<size){
    size = WIDTH/2;
}
const globe = new Globe(ctx, WIDTH/2, HEIGHT/2, size, "Merry Christmas!");

for(let f=0;f<150;f++){
    let angle = Math.random() * -Math.PI;
    let radius = Math.random()*(globe.Size)-15;
    let x = radius*Math.cos(angle) + globe.X;
    let y = radius*Math.sin(angle) + globe.Y-10;
    globe.addFlake(new SnowFlake(x,y,10));
}

globe.render();

window.addEventListener('resize', ()=>{
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    WIDTH = cnv.width;
    HEIGHT = cnv.height;
    let size = HEIGHT/2;
    if(WIDTH/2<size){
        size = WIDTH/2;
    }
    globe.resize(WIDTH/2,HEIGHT/2,size);
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    globe.animate();
});

window.addEventListener('devicemotion',(e)=>{
    globe.setVelocity(e.acceleration.x, e.acceleration.y);
});

cnv.addEventListener('mousedown',()=>{
    globe.shake();
});
cnv.addEventListener('touchstart',()=>{
    globe.shake();
});
var lastX = window.screenX;
var lastY = window.screenY;
function animate(){
    globe.setVelocity(window.screenX - lastX, window.screenY - lastY);
    globe.animate();
    lastX = window.screenX;
    lastY = window.screenY;
    window.requestAnimationFrame(animate);
}
animate();
