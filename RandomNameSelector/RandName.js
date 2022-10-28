const namesList = document.getElementById("names");
const winnerLbl = document.getElementById("winner");
const title = document.getElementById("title");
const cnv = document.getElementById("spinwheel");

const ctx = cnv.getContext("2d");
let CNV_Rect = cnv.getBoundingClientRect();
let CNV_Width = CNV_Rect.width;
let CNV_Height = CNV_Rect.height;
if(CNV_Width>CNV_Height){
    CNV_Width = CNV_Height;
}else{
    CNV_Height = CNV_Width;
}
cnv.width = CNV_Width;
cnv.height = CNV_Height;
console.log(CNV_Rect);
const TWOPI = Math.PI*2;

document.getElementById("hideBtn").addEventListener('click',function(){
    document.getElementById("controls").classList.add('hide');
});

let names = [];
function getLines(text){
    return text.split('\n');
}

namesList.addEventListener("input",(e)=>{
    names = getLines(namesList.value);
    namesList.rows = names.length + 1;
});
title.innerText = document.getElementById("titleEdit").value;
document.getElementById("titleEdit").addEventListener("input",function(){
    title.innerText = this.value;
});

const radius = (CNV_Width/2)*.95;
ctx.translate(CNV_Width/2, CNV_Height/2);
const colorList = ['teal','red','blue','orange','green','yellow', 'purple'];
let selectionOver = true;
let target = -1;
let spinCount = 0;
let timeToStop = false;
ctx.textAlign = 'right';
ctx.font= '900 21px Arial';
function drawEllipse(angle){
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    let count = names.length;
    let segmentAngle = Math.PI / (count/2);
    const halfSeg = segmentAngle/2;
    const quaterSeg = segmentAngle/4;
    let colorcount = (count-1)%5!==0?5:count%7!==0?6:7;
    for(let i=0;i<count;i++){
        let ang = i * segmentAngle;
        let currentName = names[i];
        if(currentName.startsWith("-")){
            currentName = currentName.substr(1);
        }
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
            winnerLbl.textContent = currentName;
            if(i === target && timeToStop){
                selectionOver = true;
                winnerLbl.textContent += " IS THE WINNER!";
            }
            
        }

        ctx.fillStyle = colorList[i%colorcount];
        ctx.beginPath();        
        ctx.moveTo(0,0);
        ctx.arc(0,0,radius, (diff-halfSeg), (diff + halfSeg));
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.rotate(diff);
        ctx.translate(radius*0.98, 8);
        ctx.fillText(currentName, 0, 0);
        ctx.strokeText(currentName, 0, 0);
        ctx.translate(-radius*0.98, -8);
        ctx.rotate(-diff);
 
    }
    //Center Disk
    //ctx.fillStyle = 'blue';
    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.arc(0,0,25,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    //Wedge
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
        if(spinStep>0.1)
        {
            spinStep -= spinDecay;
        }
        else
        {
            timeToStop = true;
        }
        if(angle>TWOPI){
            angle = angle-TWOPI;
        }
    }
    //ctx.fillStyle = 'black';
    //ctx.fillRect(-Width/2,-Height/2,Width,Height);
    ctx.clearRect(-CNV_Width/2,-CNV_Height/2,CNV_Width,CNV_Height);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "black";
    ctx.strokeStyle = "white";
    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.arc(0,0,radius*1.01,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    drawEllipse(angle);
    requestAnimationFrame(animate);
};

function spin(){
    do{
    target = Math.ceil(Math.random()*names.length-1);
    console.log(target + ' ' + names[target]);
    }while(names[target].startsWith("-"));
    selectionOver = false;
    spinStep = 1;
    timeToStop = false;
}
cnv.addEventListener('click',spin);
names = getLines(namesList.value);
namesList.rows = names.length + 1;
animate();