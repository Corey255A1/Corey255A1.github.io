function CreatureFunctions(){
    // module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint;

function MutateDNA(dna, rate){
    var l = dna.length;
    var bodylist = [];
    for(var i=0; i<l; i++){
        if(dna[i].type == "body"){
            var w = dna[i].w;
            var h = dna[i].h;
            if(rate == 2.0){
                w = (Math.random()*70.0 + 10.0)
                h = (Math.random()*70.0 + 10.0)
            }
            if(Math.random() >= rate)
            {
                if(Math.random()>=0.5){
                    w = w + (Math.random()*10.0 - 5.0)
                    if(w<10.0){
                        w = 10.0;
                    }
                    else if(w>80){
                        w = 80.0;
                    }
                }else{
                    h = h + (Math.random()*10.0 - 5.0)
                    if(h<10.0){
                        h = 10.0
                    }
                    else if(h>80){
                        h=80.0;
                    }
                }
            }
            bodylist.push(i);
            dna[i].w = w;
            dna[i].h = h; 
        }else if(dna[i].type == "constraint"){
            dna[i].b1y = (dna[bodylist[dna[i].b1]].h/2)-5;
            dna[i].b2y = -((dna[bodylist[dna[i].b2]].h/2)-5);
        }
    }
    return dna;
}
function CloneDNA(dnainput){
    var dna = [];
        for(var d in dnainput){
           if(dnainput[d].type == 'body'){
               dna.push({
                   type:dnainput[d].type,
                   w:dnainput[d].w,
                   h:dnainput[d].h,
                   xoffset:dnainput[d].xoffset,
                   yoffset:dnainput[d].yoffset
               });
                
           }
           else if(dnainput[d].type == 'constraint'){
               dna.push({
                    type:dnainput[d].type,
                    b1:dnainput[d].b1,
                    b2:dnainput[d].b2,
                    b1x:dnainput[d].b1x,
                    b1y:dnainput[d].b1y,
                    b2x:dnainput[d].b2x,
                    b2y:dnainput[d].b2y
                });
           }
        }
        return dna;
}

function Creature(x,y, dna, createMoves){
    const self = this;
   
    //DNA Body-Body-Constraint-Body-Contraint
    // Body: Relative Position, Size
    // Constraint: Relative Position
    self.Power = 0;
    self.Yi = y;
    self.Xi = x;
    self.MinY = y;
    self.DNA = dna;
    self.bodies = [];
    self.constraints = [];
    self.weights = [];
    for(var d in self.DNA){
       if(self.DNA[d].type == 'body'){
           x+=self.DNA[d].xoffset;
           y+=self.DNA[d].h/2;
           self.bodies.push(Bodies.rectangle(x+self.DNA[d].xoffset, y+self.DNA[d].yoffset, self.DNA[d].w, self.DNA[d].h, {
                chamfer:10,
                collisionFilter:{group:-1}
            }));
            y+=self.DNA[d].h/2+ self.DNA[d].yoffset;
            
       }
       else if(self.DNA[d].type == 'constraint'){
           self.constraints.push(Constraint.create({
                bodyA:self.bodies[self.DNA[d].b1],
                bodyB:self.bodies[self.DNA[d].b2],
                pointA:{x:self.DNA[d].b1x,y:self.DNA[d].b1y},
                pointB:{x:self.DNA[d].b2x,y:self.DNA[d].b2y},
                length:0,
                stiffness:1
            }));
       }
    }
    self.moveIterator = 0;
    
    if(createMoves){
        for(var b in self.bodies){
            self.weights.push([]);
            for(var b2 in self.bodies){
                self.weights[b].push((Math.random()*0.02 - 0.01));
                //self.weights[b].push((Math.random()*0.02 - 0.01));
                self.weights[b].push((Math.random()*0.02 - 0.01));
                self.weights[b].push((Math.random()*0.02 - 0.01));
            }
        }
    }
    
    self.composite = Composite.create({
        bodies:self.bodies,
        constraints:self.constraints
    })
    self.MovePiece = function(p, v){
        Body.setAngularVelocity(self.bodies[p],v);
    }
    self.Update = function(){
        
        for(var b in self.bodies){
            var w = self.weights[b];
            var woff = 0;
            var v = 0;
            for(var b2 in self.bodies){
                v += w[woff]*self.bodies[b2].angle;
                //v += w[woff+1]*self.bodies[b2].angularVelocity;
                v += w[woff+1]*self.bodies[b2].velocity.x;
                v += w[woff+2]*self.bodies[b2].velocity.y;
                woff+=3;
            }
            
            if(v>0.5){v=0.5;}
            if(v<-0.5){v=-0.5;}
            
            self.MovePiece(b,v)
            
        }
        
        
        var cury = self.bodies[0].position.y;
        if(cury < self.MinY)
        {
            self.MinY = cury;
        }
        self.Power += ((self.Yi) - cury);
    }

    self.Offspring = function(x,y, mutationrate){
        
        var offspring = new Creature(x,y,MutateDNA(CloneDNA(self.DNA), mutationrate),false);
        for(var b in self.weights){
            offspring.weights.push([]);
            for(var i=0;i<self.bodies.length*3;i++)
            {
                offspring.weights[b].push(self.weights[b][i]);
                if(Math.random()>=0.9-mutationrate){
                    if(Math.random()>=0.75){
                        offspring.weights[b][i] = offspring.weights[b][i] +(Math.random()*0.005 - 0.0025)
                    }
                }
            }
        }
        return offspring;
        
    }
}
this.CreateCreature = function(x,y, dna, createMoves, rate){
    return new Creature(x,y, MutateDNA(CloneDNA(dna),rate), createMoves);
}
}
const Creatures = new CreatureFunctions();