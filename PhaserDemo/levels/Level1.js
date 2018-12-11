class Level1 extends BaseLevel {
    constructor() {
        super("Level1");        
        this.stars;
        this.bombs;
        this.platforms;    
    }

    preload() {
        super.preload();
        this.load.image('sky', 'tut/assets/sky.png');
        this.load.image('ground', 'tut/assets/platform.png');
        this.load.image('star', 'tut/assets/star.png');
        this.load.image('bomb', 'tut/assets/bomb.png');
    }
    create() {
        this.add.image(400, 300, 'sky');
        super.create();
              

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');         



        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.player.terminate, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
                            
    }
    collectStar(player, star) {
        star.disableBody(true, true);
        player.Score += 10;
        this.overlay.updateScore(player.Score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

}