const thumbsRow = document.getElementById("thumbs");

const template = `
<div class="col-md-4 p-1">
<a class="cardlink square" href="[LINK]">
    <img class="thumb" src="[IMG]">
    <h5 class="cardlink-text">[TITLE]</h5>
</a>
</div>`;

projectList = [
	
    {"[LINK]":"TimeList/TimeList.html", "[IMG]":"TimeList/TimeList.jpg", "[TITLE]":"Time Tracker"},
    {"[LINK]":"SnowGlobe/SnowGlobe.html", "[IMG]":"SnowGlobe/SnowGlobe.gif", "[TITLE]":"Snow Globe"},
    
    
    {"[LINK]":"Fallup/fallup.html", "[IMG]":"Fallup/Fallup.gif", "[TITLE]":"Fallup"},
    {"[LINK]":"Invaders/invaders.html", "[IMG]":"Invaders/Invaders.gif", "[TITLE]":"Invaders!"},
    {"[LINK]":"Pong/pong.html", "[IMG]":"Pong/Pong.gif", "[TITLE]":"Pong"},    
    {"[LINK]":"Gravity/Gravity.html", "[IMG]":"Gravity/Gravity.gif", "[TITLE]":"Gravity Paint"},
    {"[LINK]":"LetterEtch/LetterEtch.html", "[IMG]":"LetterEtch/LetterEtch.gif", "[TITLE]": "Letter Etching"},
    {"[LINK]":"Dijkstra/Dijkstra.html", "[IMG]":"Dijkstra/Dijkstra.png", "[TITLE]":"Dijkstra's Algorithm"},
    {"[LINK]":"SoundBox/SoundBox.html", "[IMG]":"SoundBox/SoundBox.png", "[TITLE]":"Two Musical Boxes"},
    {"[LINK]":"GeometryFun/GeometryFun.html", "[IMG]":"GeometryFun/GeometryFun.png", "[TITLE]":"Geometry Fun"},
    {"[LINK]":"DistanceTime/DistanceTime.html", "[IMG]":"DistanceTime/DistanceTime.png", "[TITLE]":"DistanceTime"},
    {"[LINK]":"ZipDemo/ZipDemo.html", "[IMG]":"ZipDemo/ZipDemo.png", "[TITLE]":"Zip Demo"},
    {"[LINK]":"Neural/physics.html", "[IMG]":"Neural/Evolution.png", "[TITLE]":"Evolution Legs"},
    {"[LINK]":"PunnettSquare/PunnettSquare.html", "[IMG]":"PunnettSquare/PunnettSquare.png", "[TITLE]":"Punnett Square"},
    {"[LINK]":"RandomNameSelector/RandName.html", "[IMG]":"RandomNameSelector/RandName.png", "[TITLE]":"Random Name Wheel"},
    {"[LINK]":"CheckoutCheckin/checkoutcheckin.html", "[IMG]":"CheckoutCheckin/checkoutcheckin.gif", "[TITLE]":"Check Out"},
    {"[LINK]":"DragWindow/DragWindow.html", "[IMG]":"DragWindow/DragWindow.png", "[TITLE]":"Draggable Windows"},
    {"[LINK]":"GoogleEyes/GoogleEyes.html", "[IMG]":"GoogleEyes/GoogleEyes.png", "[TITLE]":"Googly Eyes"},
    {"[LINK]":"DrumSequence/DrumSequence.html", "[IMG]":"DrumSequence/DrumSequence.png", "[TITLE]":"Drum Sequencer!"},
    {"[LINK]":"3D/3D.html", "[IMG]":"3D/3Dish.gif", "[TITLE]":"3Dish Rectangles"},
    {"[LINK]":"Collatz/Collatz.html", "[IMG]":"Collatz/collatz.png", "[TITLE]":"Collatz Conjecture"},
    {"[LINK]":"LaserBeam/LaserBeam.html", "[IMG]":"LaserBeam/LaserBeam.png", "[TITLE]":"Laser Beam"},
    {"[LINK]":"Mesh/Mesh.html", "[IMG]":"Mesh/Mesh.png", "[TITLE]":"Blue Explosion"},
    {"[LINK]":"SoundVisualizer/Visualizer.html", "[IMG]":"SoundVisualizer/WaveForm.png", "[TITLE]":"Sound Visualizer"},
    {"[LINK]":"Bounce/Bouncer.html", "[IMG]":"Bounce/BounceBox.png", "[TITLE]":"A Bouncing Box"}
    
];

var allItemsHTML = "";

for(var p in projectList){
    var item = projectList[p];
    allItemsHTML += template.replace(/\[LINK\]|\[IMG\]|\[TITLE\]/g, function(s){
        return item[s];
    });
}

thumbsRow.innerHTML = allItemsHTML;
