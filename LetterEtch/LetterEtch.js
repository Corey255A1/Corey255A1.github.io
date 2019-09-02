const cnv = document.getElementById("draw")
const ctx = cnv.getContext("2d");

const Width = cnv.width;
const Height = cnv.height;

function Letter()
{
    const self = this;
    self.LineDefs=[];
    self.LastX = 0;
    self.LastY = 0;
    self.AddLine = function(x1,y1,x2,y2){
        self.LineDefs.push({X1:x1,Y1:y1,X2:x2,Y2:y2})
        self.LastX = x2;
        self.LastY = y2;
        return self;
    }
    self.NextLine = function(x2,y2){
        self.LineDefs.push({X1:self.LastX,Y1:self.LastY,X2:x2,Y2:y2})
        self.LastX = x2;
        self.LastY = y2;
        return self;
    }
    
    self.GetLines = function(x,y,w,h){
        var ret = [];
        for(var l in self.LineDefs){
            var line =self.LineDefs[l];
            ret.push({
                startX:(x + w*line.X1),
                startY:(y + h*line.Y1),
                endX:(x + w*line.X2),
                endY:(y + h*line.Y2)
            });
        }
        return ret;
    }
    
    return self;
}

function DrawLetter(lines){
    const self = this;
    self.Lines = lines;
    self.lineIdx = 0;
    self.lineCount = self.Lines.length;
    self.currentLine = self.Lines[self.lineIdx];
    self.currentStep = 1;
    self.xStep = (self.currentLine.endX - self.currentLine.startX)/10;
    self.yStep = (self.currentLine.endY - self.currentLine.startY)/10;
    self.sx = self.currentLine.startX;
    self.sy = self.currentLine.startY;
    self.ex = self.sx;
    self.ey = self.sy;
    self.DrawNext = function(ctx){
        ctx.beginPath();
        ctx.moveTo(self.sx, self.sy);
        ctx.lineTo(self.sx+self.xStep, self.sy+self.yStep);
        ctx.stroke();
        
        if(self.currentStep<10){
            self.currentStep++;
            self.sx = self.sx + self.xStep;
            self.sy = self.sy + self.yStep;
        }
        else
        {
            self.lineIdx++;
            if(self.lineIdx < self.lineCount){
                self.currentLine = self.Lines[self.lineIdx];
                self.xStep = (self.currentLine.endX - self.currentLine.startX)/10;
                self.yStep = (self.currentLine.endY - self.currentLine.startY)/10;
                self.currentStep = 1;
                self.sx = self.currentLine.startX;
                self.sy = self.currentLine.startY;
            }
            else
            {
                return false;
            }
        }
        return true;
    }
}

function distance(line){
    var dx = line.endX - line.startX;
    var dy = line.endY - line.startY;
    return Math.sqrt(dx*dx + dy*dy);
}

AllLetters = {
A: new Letter()
 .AddLine(0.5,0,0,1)
 .AddLine(0.5,0,1,1)
 .AddLine(0,0.5,1,0.5),

B: new Letter()
  .AddLine(0,0, 0.7,0)
  .NextLine(1,0.2)
  .NextLine(0.7,0.4)
  .NextLine(0.4,0.5)
  .NextLine(0.4,0.5)
  .NextLine(0.7,0.6)
  .NextLine(1,0.8)
  .NextLine(0.7, 1)
  .NextLine(0, 1)
  .NextLine(0,0),
  
C: new Letter()
    .AddLine(1,0, 0,0)
    .NextLine(0,1)
    .NextLine(1,1),
    
D: new Letter()
    .AddLine(0,0, 0.7,0)
    .NextLine(1,0.5)
    .NextLine(0.7,1)
    .NextLine(0,1)
    .NextLine(0,0),
    
E: new Letter()
    .AddLine(1,0, 0,0)
    .NextLine(0,1)
    .NextLine(1,1)
    .AddLine(0,0.5, 1,0.5),
    
F: new Letter()
    .AddLine(1,0, 0,0)
    .NextLine(0,1)
    .AddLine(0,0.5, 1,0.5),
    
G: new Letter()
    .AddLine(1,0, 0,0)
    .NextLine(0,1)
    .NextLine(1,1)
    .NextLine(1,0.5)
    .NextLine(0.5,0.5),
    
H: new Letter()
    .AddLine(0,0, 0,1)
    .AddLine(1,0, 1,1)
    .AddLine(0,0.5, 1,0.5),

I: new Letter()
    .AddLine(0,0, 1,0)
    .AddLine(0.5,0, 0.5,1)
    .AddLine(0,1, 1,1),
    
J: new Letter()
    .AddLine(0,0, 1,0)
    .AddLine(0.5,0, 0.5,1)
    .NextLine(0,1)
    .NextLine(0,0.5),
    
K: new Letter()
    .AddLine(0,0, 0,1)
    .AddLine(0,0.5, 1,0)
    .AddLine(0,0.5, 1,1),
    
L: new Letter()
    .AddLine(0,0, 0,1)
    .NextLine(1,1),
    
M: new Letter()
    .AddLine(0,1, 0,0)
    .NextLine(0.5,1)
    .NextLine(1,0)
    .NextLine(1,1),
    
N: new Letter()
    .AddLine(0,1, 0,0)
    .NextLine(1,1)
    .NextLine(1,0),
    
O: new Letter()
    .AddLine(0,0, 1,0)
    .NextLine(1,1)
    .NextLine(0,1)
    .NextLine(0,0),
    
P: new Letter()
    .AddLine(0,1, 0,0)
    .NextLine(1,0)
    .NextLine(1,0.5)
    .NextLine(0,0.5),
    
Q: new Letter()
    .AddLine(0,0, 1,0)
    .NextLine(1,1)
    .NextLine(0,1)
    .NextLine(0,0),
    
R: new Letter()
    .AddLine(0,1, 0,0)
    .NextLine(1,0)
    .NextLine(1,0.5)
    .NextLine(0,0.5)
    .NextLine(1,1),
    
S: new Letter()
    .AddLine(1,0, 0,0)
    .NextLine(0,0.5)
    .NextLine(1,0.5)
    .NextLine(1,1)
    .NextLine(0,1),

T: new Letter()
    .AddLine(0,0, 1,0)
    .AddLine(0.5,0, 0.5,1),
    
U: new Letter()
    .AddLine(0,0, 0,1)
    .NextLine(1,1)
    .NextLine(1,0),
    
V: new Letter()
    .AddLine(0,0, 0.5,1)
    .NextLine(1,0),
    
W: new Letter()
    .AddLine(0,0, 0.25,1)
    .NextLine(0.5,0)
    .NextLine(0.75,1)
    .NextLine(1,0),
    
X: new Letter()
    .AddLine(0,0, 1,1)
    .AddLine(1,0, 0,1),
    
Y: new Letter()
    .AddLine(0,0, 0.5,0.5)
    .AddLine(1,0, 0.5,0.5)
    .NextLine(0.5, 1),
    
Z: new Letter()
    .AddLine(0,0, 1,0)
    .NextLine(0,1)
    .NextLine(1,1)

}

var chars = "WUNDERVISION";
var letters = [];
var xidx = 10;
var size = 30;
for(var a in chars){
letters.push(new DrawLetter(AllLetters[chars[a]].GetLines(xidx,10, size, size)));
xidx += size+5;
}
ctx.strokeStyle='rgb(0,0,255)';

var currentLetter = 0;
var letterCount = letters.length;
function Update()
{
    if(!letters[currentLetter].DrawNext(ctx))
    {
        currentLetter++;
        if(currentLetter<letterCount)
        {
            window.requestAnimationFrame(Update);
        }
    }
    else{
        window.requestAnimationFrame(Update);
    }
}

Update();
