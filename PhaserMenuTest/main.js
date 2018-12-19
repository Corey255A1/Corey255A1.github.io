

class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        this.load.image('background','warehouse.jpg');
    }
    create(){
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.on('camerafadeoutcomplete', function (){
            this.scene.start('Title');
        },this);
        console.log(w);
        console.log(h);
        
        this.add.image(0,0,'background').setOrigin(0,0);
        
        this.titleText = this.add.text(w/2, h/2-150, 'Zip', { align:'center', fontSize: '96px', fill: '#0000FF' }).setOrigin(0.5,0.5);
    
        this.subtitleText = this.add.text(w/2, h/2-70, 'A Drunken Robot Adventure', { fontSize: '48px', fill: '#0000FF' }).setOrigin(0.5,0.5);
        this.startText = this.add.text(w/2, h/2, 'Start', { align:'center', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5,0.5);
        this.startText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startText.width, this.startText.height), Phaser.Geom.Rectangle.Contains);
        
        this.startText.on('pointerdown', function(p){
            this.startText.setFill('#00FF00');
            this.cameras.main.fadeOut(2000);
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
        
    }
    create(){
        this.backText = this.add.text(16, 16, 'Back', { fontSize: '32px', fill: '#FFFFFF' });
        this.backText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.backText.width, this.backText.height), Phaser.Geom.Rectangle.Contains);
    
        this.backText.on('pointerdown', function(p){
            this.backText.setFill('#FF0000');
            this.scene.start('Menu');
        },this);
    }
    update(){
        
    }
}

const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene:[Menu,Title]
};

var game = new Phaser.Game(config);
game.scene.start('Menu');