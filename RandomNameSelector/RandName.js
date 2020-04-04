const namesList = document.getElementById("names");
const winnerLbl = document.getElementById("winner");
const cnv = document.getElementById("spinwheel");
const ctx = cnv.getContext("2d");
const Width = cnv.width;
const Height = cnv.height;
const TWOPI = Math.PI*2;
let names = [];
function getLines(text){
    return text.split('\n');
}

namesList.addEventListener("input",(e)=>{
    names = getLines(namesList.value);
    namesList.rows = names.length + 1;
});

const radius = (Width/2)*.9;
ctx.translate(Width/2, Height/2);
const colorList = ['teal','red','blue','orange','green','yellow', 'purple'];
let selectionOver = true;
let target = -1;
let spinCount = 0;
let timeToStop = false;
function drawEllipse(angle){
    ctx.fillStyle = 'black';
    ctx.fillRect(-Width/2,-Height/2,Width,Height);
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    ctx.lineWidth =
    ctx.textAlign = 'right';
    ctx.font= '24px Arial';
    ctx.fontWeight ='bold';
    let count = names.length;
    let segmentAngle = Math.PI / (count/2);
    const halfSeg = segmentAngle/2;
    const quaterSeg = segmentAngle/4;
    let colorcount = (count-1)%5!==0?5:count%7!==0?6:7;
    for(let i=0;i<count;i++){
        let ang = i * segmentAngle;
        
        const diff = (ang - angle);
        let isMax = angle < ang+quaterSeg;
        let isMin = angle > ang-quaterSeg;            
        if(ang===0)
        {
            if(angle>Math.PI){
                isMax = true;
                isMin = angle > TWOPI-quaterSeg;
            }else{
                isMin = true;
                isMax = angle < quaterSeg;
            }
        }            
        if(isMax && isMin)
        {     
            if(i === target && timeToStop){
                selectionOver = true;
            }
            winnerLbl.textContent = names[i];
        }

        ctx.beginPath();
        ctx.fillStyle = colorList[i%colorcount];
        ctx.moveTo(0,0);
        ctx.arc(0,0,radius, (diff-halfSeg), (diff + halfSeg));
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.rotate(diff);
        ctx.translate(radius*0.95, 8);
        ctx.fillText(names[i], 0, 0);
        ctx.strokeText(names[i], 0, 0);
        ctx.translate(-radius*0.95, -8);
        ctx.rotate(-diff);
 
    }
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.moveTo(0,0);
    ctx.arc(0,0,25,0,Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(radius*.95,0);
    ctx.lineTo(radius*1.05,-20);
    ctx.lineTo(radius*1.05,20);
    ctx.lineTo(radius*.95,0);
    ctx.fill();
    ctx.stroke();
}

let angle = 0;
let spinStep = 0;
let spinDecay = 0.01;

function animate(){
    if(!selectionOver){
        angle+=spinStep
        if(spinStep>0.1){
            spinStep -= spinDecay;
        }
        else{
            timeToStop = true;
        }
        if(angle>TWOPI){
            angle = angle-TWOPI;
        }
    }
    drawEllipse(angle);
    requestAnimationFrame(animate);
};

function spin(){
    target = Math.ceil(Math.random()*names.length-1);
    console.log(target + ' ' + names[target]);
    selectionOver = false;
    spinStep = 1;
    timeToStop = false;
}
document.getElementById('spinBtn').addEventListener('click',spin);
names = getLines(namesList.value);
namesList.rows = names.length + 1;
animate();