
var eyes = [];
const HALF_PI = Math.PI/2;

document.querySelectorAll(".eye").forEach((eye)=>{
    eyes.push({
        eye:eye,
        position:eye.getBoundingClientRect()
    });
})

function getAngle(x1,y1, x2,y2){
    return Math.atan2(y2-y1, x2-x1)+HALF_PI+"rad";
}


document.querySelector("body").addEventListener("mousemove",(e)=>{
    
    eyes.forEach((eye)=>{
        var angle = getAngle(eye.position.x, eye.position.y, e.pageX, e.pageY);
        eye.eye.style.transform = "rotate("+angle+")";
    })
});