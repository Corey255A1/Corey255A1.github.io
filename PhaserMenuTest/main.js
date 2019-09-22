

class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        //this.load.image('background','warehouse.jpg');
    }
    create(){
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.on('camerafadeoutcomplete', function (){
            this.scene.start('Title');
        },this);
        console.log(w);
        console.log(h);
        
        //this.add.image(0,0,'background').setOrigin(0,0);
        
        this.titleText = this.add.text(w/2, h/2-150, 'Stack', { align:'center', fontSize: '96px', fill: '#0000FF' }).setOrigin(0.5,0.5);
    
        this.subtitleText = this.add.text(w/2, h/2-70, 'Block Stacking Fun', { fontSize: '48px', fill: '#0000FF' }).setOrigin(0.5,0.5);
        this.startText = this.add.text(w/2, h/2, 'Start', { align:'center', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5,0.5);
        this.startText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startText.width, this.startText.height), Phaser.Geom.Rectangle.Contains);
        
        this.startText.on('pointerdown', function(p){
            this.startText.setFill('#00FF00');
            this.cameras.main.fadeOut(1000);
            //this.scene.start('Title');
        },this);
        
        this.startText.on('pointerover', function(p){
            this.startText.setFill('#0000FF');
        },this);
        
        this.startText.on('pointerout', function(p){
            this.startText.setFill('#FFFFFF');
        },this);
    }
    update(){
        
    }
}
class Title extends Phaser.Scene{
    constructor(){
        super({key:"Title"});
    }
    preload(){
        this.load.image('santa','circle_santa-512.png');
    }
    create(){
        this.backText = this.add.text(16, 16, 'Back', { fontSize: '32px', fill: '#FFFFFF' });
        this.backText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.backText.width, this.backText.height), Phaser.Geom.Rectangle.Contains);
        this.matter.world.setBounds(0, 0, 800, 600);
        this.player = this.matter.add.sprite(100,100,'santa','player');
        let rectTop = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, 32, 8, {
            friction: 5.0,
            frictionStatic: 5.0
        });
        let rectBottom = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 24, 32, 8, {
            friction: 5.0
        });
        const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [rectTop,rectBottom]
        });
        this.player
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setPosition(400,300)
        this.player.setScale(4,1);
        
        this.backText.on('pointerdown', function(p){
            this.backText.setFill('#FF0000');
            this.scene.start('Menu');
        },this);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.input.on("pointerdown", function(p){
            // getting Matter bodies under the pointer
            var bodiesUnderPointer = Phaser.Physics.Matter.Matter.Query.point(this.matter.world.localWorld.bodies, p);
 
            // if there isn't any body under the pointer...
            if(bodiesUnderPointer.length == 0){
 
                // create a crate
                this.matter.add.sprite(p.x, p.y, "santa")
                .setFriction(5.0)
                .setFrictionStatic(5.0);
            }
 
            // this is where I wanted to remove the crate. Unfortunately I did not find a quick way to delete the Sprite
            // bound to a Matter body, so I am setting it to invisible, then remove the body.
            else{
                bodiesUnderPointer[0].gameObject.visible = false;
                this.matter.world.remove(bodiesUnderPointer[0])
            }
        },this);
        
        this.matter.world.createDebugGraphic();
        
        //Testing...
        /*var ball = Phaser.Physics.Matter.Matter.Bodies.circle(100,100,50,{
            density: 0.04,
            friction: 0.01,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                fillStyle: '#FF0000',
                strokeStyle: 'black',
                lineWidth: 1
            }
            
        });*/
        
        //this.matter.add(ball);
    }
    update(){
        if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-10);
        }
        else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(10);
        }
        
    }
}

function Start()
{
    const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'matter'//,
                //matter: {
                //    gravity: { y: 200 }
                //}
            },
            scene:[Menu,Title]
    };
    
    var game = new Phaser.Game(config);
    game.scene.start('Title');
}
window.onload = Start;