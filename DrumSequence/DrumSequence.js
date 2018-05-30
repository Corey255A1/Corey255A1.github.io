var dgrid = document.getElementById("draggrid");

var kick = document.getElementById("kick");
var snare = document.getElementById("snare");
var hihat = document.getElementById("hihat");

document.getElementById("kickIcon").addEventListener("click",playKick);
document.getElementById("snareIcon").addEventListener("click",playSnare);
document.getElementById("hihatIcon").addEventListener("click",playHiHat);

function playKick()
{
    kick.play();
}
function playSnare()
{
    snare.play();
}
function playHiHat()
{
    hihat.play();
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.innerText);
}

function drop(ev){
    ev.preventDefault();
    ev.target.innerText = ev.dataTransfer.getData("text/plain");
}

function dragover(ev){
    ev.preventDefault();
}

function CreateCell(){
    var cell = document.createElement('div');
    var atts = document.createAttribute('class');
    var ondrop = document.createAttribute('ondrop');
    var ondrag = document.createAttribute('ondragover');
    atts.value = "col-sm-3 dcell Normal";
    ondrop.value = "drop(event)";
    ondrag.value = "dragover(event)";
    
    cell.setAttributeNode(atts);
    cell.setAttributeNode(ondrop);
    cell.setAttributeNode(ondrag);
    //cell.innerText = "E";
    
    return cell;
}

function update()
{
    if(currentCellIdx>=CellList.length)
    {
        currentCellIdx = 0;
    }
    CellList[currentCellIdx].style.backgroundColor = "yellow";
    var prev = currentCellIdx - 1 >= 0 ? 
            currentCellIdx - 1 :
            CellList.length-1;
    CellList[prev].style.backgroundColor = "transparent";
    if(CellList[currentCellIdx].innerText == "K")
    {
        kick.play();
    }
    else if(CellList[currentCellIdx].innerText == "S")
    {
        snare.play();
    }
    else if(CellList[currentCellIdx].innerText == "H")
    {
        hihat.play();
    }
    currentCellIdx = currentCellIdx + 1;
    
}
var Interval = null;
function startSequence()
{
    Interval = setInterval(update,200);
    currentCellIdx = 0;
}
function stopSequence()
{
    if(Interval!==null)
    {
        window.clearInterval(Interval);
        Interval = null;
        CellList[currentCellIdx-1].style.backgroundColor = "transparent";
    }
}
function addMeasure()
{
    for(var i=0; i<4; i++)
    {
        var cell = CreateCell();
        CellList.push(cell);
        dgrid.appendChild(cell);
    }
}

var CellList = []
var currentCellIdx = 0;

for(var i=0; i<12; i++)
{
    var cell = CreateCell();
    CellList.push(cell);
    dgrid.appendChild(cell);
}



