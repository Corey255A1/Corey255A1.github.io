const canvas = document.getElementById("memory");
const drawCtx = canvas.getContext("2d");
const ctxW = canvas.width;
const ctxH = canvas.height;
var Code = "";
var Running = false;
var PC = 0;
document.getElementById("executeBtn").onmousedown = function(e)
{
    Code = document.getElementById("script").value;
    Running = false;
    PC = 0;
    drawCtx.clearRect(0,0,ctxW,ctxH);
    console.log(Code);
}