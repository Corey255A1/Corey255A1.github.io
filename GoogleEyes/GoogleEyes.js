
var eyes = [];
const HALF_PI = Math.PI/2;

document.querySelectorAll(".eye").forEach((eye)=>{
    var pos = eye.getBoundingClientRect();
    eyes.push({
        eye:eye,
        position:pos,
        centerX:pos.x+pos.width/2,
        centerY:pos.y+pos.height/2
    });
})

function getAngle(x1,y1, x2,y2){
    return Math.atan2(y2-y1, x2-x1)+HALF_PI+"rad";
}


document.querySelector("body").addEventListener("mousemove",(e)=>{
    
    eyes.forEach((eye)=>{
        var angle = getAngle(eye.centerX, eye.centerY, e.pageX, e.pageY);
        eye.eye.style.transform = "rotate("+angle+")";
    })
});