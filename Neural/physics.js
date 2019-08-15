// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint;

const Width = 1600;
const StartX = 800;
const StartY = 300;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        width:Width
    }
});


var ground = Bodies.rectangle(Width/2, 610, Width, 60, { isStatic: true });
World.add(engine.world, [ground]);



// add all of the bodies to the world
var dnatest = [
    {
        type:'body',
        w:40,
        h:80,
        xoffset:0,
        yoffset:0
    },
    {
        type:'body',
        w:40,
        h:80,
        xoffset:0,
        yoffset:-5
    },
    {
        type:'constraint',
        b1:0,
        b2:1,
        b1x:0,
        b1y:35,
        b2x:0,
        b2y:-35
    },
    {
        type:'body',
        w:40,
        h:80,
        xoffset:0,
        yoffset:-5
    },
    {
        type:'constraint',
        b1:1,
        b2:2,
        b1x:0,
        b1y:35,
        b2x:0,
        b2y:-35
    },
    {
        type:'body',
        w:40,
        h:80,
        xoffset:0,
        yoffset:-5
    },
    {
        type:'constraint',
        b1:2,
        b2:3,
        b1x:0,
        b1y:35,
        b2x:0,
        b2y:-35
    },
    {
        type:'body',
        w:40,
        h:80,
        xoffset:0,
        yoffset:-5
    },
    {
        type:'constraint',
        b1:3,
        b2:4,
        b1x:0,
        b1y:35,
        b2x:0,
        b2y:-35
    }
];


var CreatureList = [];
for(var i=0;i<20;i++){
    var c = Creatures.CreateCreature(StartX,StartY,dnatest, true, 2.0);
    World.add(engine.world, c.composite);
    CreatureList.push(c);
}
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
var timer = 0;
const offspringrate = [10,5,3,2];
function Update()
{
   
   
   if(timer++ == 600){
    timer = 0;
    var NewList = [];   
    CreatureList.sort(function(a,b){
        
        //return a.bodies[0].position.x - b.bodies[0].position.x //Move Left
        return b.bodies[0].position.x - a.bodies[0].position.x //Move Right
        //return a.MinY - b.MinY //Get Higher
        //return b.Power - a.Power; //Stay Low
        //return b.Power - a.Power; //Jump More
        
    })
    for(var old = 0; old<20; old++){
        Composite.remove(engine.world, CreatureList[old].composite);
    }
    for(var best = 0; best<4; best++){
        for(var offspring=0; offspring<offspringrate[best]; offspring++){
            var c = CreatureList[best].Offspring(StartX,StartY, best*0.05);
            World.add(engine.world, c.composite);
            NewList.push(c);
        }
    }
    CreatureList = NewList;
       
       
   }else{
    for(var cl in CreatureList){
       CreatureList[cl].Update();
    }
   }
   
   window.requestAnimationFrame(Update);
}
Update();


//Body.applyForce(boxB, {x:0,y:0}, {x:-0.1,y:0});