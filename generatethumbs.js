const thumbsRow = document.getElementById("thumbs");

const template = `
<div class="col-md-4 square d-flex justify-content-center align-items-center">
<a href="[LINK]">
    <img class="thumb" src="[IMG]">
    <h5 style="text-align:center;">[TITLE]</h5>
</a>
</div>`;

projectList = [
    {"[LINK]":"LetterEtch/LetterEtch.html", "[IMG]":"LetterEtch/LetterEtch.gif", "[TITLE]": "Letter Etching"},
    {"[LINK]":"Fallup/fallup.html", "[IMG]":"Fallup/Fallup.gif", "[TITLE]":"Fallup"},
    {"[LINK]":"Invaders/invaders.html", "[IMG]":"Invaders/Invaders.gif", "[TITLE]":"Invaders!"},
    {"[LINK]":"Pong/pong.html", "[IMG]":"Pong/Pong.gif", "[TITLE]":"Pong"},    
    {"[LINK]":"Gravity/Gravity.html", "[IMG]":"Gravity/Gravity.gif", "[TITLE]":"Gravity Paint"},
    {"[LINK]":"3D/3D.html", "[IMG]":"3D/3Dish.gif", "[TITLE]":"3Dish Rectangles"},
    {"[LINK]":"Neural/physics.html", "[IMG]":"Neural/Evolution.png", "[TITLE]":"Evolution Legs"},
    {"[LINK]":"PunnettSquare/PunnettSquare.html", "[IMG]":"PunnettSquare/PunnettSquare.png", "[TITLE]":"Punnett Square"},
    {"[LINK]":"RandomNameSelector/RandName.html", "[IMG]":"RandomNameSelector/RandName.png", "[TITLE]":"Random Name Wheel"},
    {"[LINK]":"DragWindow/DragWindow.html", "[IMG]":"DragWindow/DragWindow.png", "[TITLE]":"Draggable Windows"},
    {"[LINK]":"Dijkstra/Dijkstra.html", "[IMG]":"Dijkstra/Dijkstra.png", "[TITLE]":"Dijkstra's Algorithm"},
    {"[LINK]":"DistanceTime/DistanceTime.html", "[IMG]":"DistanceTime/DistanceTime.png", "[TITLE]":"DistanceTime"},
    {"[LINK]":"PhaserDemo/PhaserTut.html", "[IMG]":"PhaserDemo/PhaserTut.JPG", "[TITLE]":"Phaser 3 Demo"},
    {"[LINK]":"DrumSequence/DrumSequence.html", "[IMG]":"DrumSequence/DrumSequence.png", "[TITLE]":"Drum Sequencer!"},
    {"[LINK]":"Collatz/Collatz.html", "[IMG]":"Collatz/collatz.png", "[TITLE]":"Collatz Conjecture"},
    {"[LINK]":"LaserBeam/LaserBeam.html", "[IMG]":"LaserBeam/LaserBeam.png", "[TITLE]":"Laser Beam"},
    {"[LINK]":"GeometryFun/GeometryFun.html", "[IMG]":"GeometryFun/GeometryFun.png", "[TITLE]":"Geometry Fun"},
    {"[LINK]":"Mesh/Mesh.html", "[IMG]":"Mesh/Mesh.png", "[TITLE]":"Blue Explosion"},
    {"[LINK]":"SoundVisualizer/Visualizer.html", "[IMG]":"SoundVisualizer/WaveForm.JPG", "[TITLE]":"Sound Visualizer"},
    {"[LINK]":"Bounce/Bouncer.html", "[IMG]":"Bounce/BounceBox.png", "[TITLE]":"A Bouncing Box"},
    {"[LINK]":"SoundBox/SoundBox.html", "[IMG]":"SoundBox/SoundBox.png", "[TITLE]":"Two Musical Boxes"}
];

var allItemsHTML = "";

for(var p in projectList){
    var item = projectList[p];
    allItemsHTML += template.replace(/\[LINK\]|\[IMG\]|\[TITLE\]/g, function(s){
        return item[s];
    });
}

thumbsRow.innerHTML = allItemsHTML;