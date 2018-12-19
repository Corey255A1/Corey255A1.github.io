class Player extends Phaser.Physics.Arcade.Sprite {


    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this._normalSpeed = 160;
        this._boostSpeed = -330;

        this.Score = 0;


        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers(key, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'turn',
            frames: [{ key: key, frame: 4 }],
            frameRate: 20
        });
        
    }

    handleUserInput(input) {
        if (input.left.isDown) {
            this.move(1);
        }
        else if (input.right.isDown) {
            this.move(2);
        }
        else {
            this.move(0);
        }

        if (input.up.isDown && this.body.touching.down) {
            this.boost();
        }
    }

    move(dir) {
        if (dir === 0) {
            this.body.setVelocityX(0);
            this.anims.play('turn');
        }
        else if (dir === 1) {
            this.body.setVelocityX(-this._normalSpeed);
            this.anims.play('left', true);
        }
        else if (dir === 2) {
            this.body.setVelocityX(this._normalSpeed);
            this.anims.play('right', true);
        }

    }
    boost() {
        this.body.setVelocityY(this._boostSpeed);
    }

    collide(player, object) {
        player.terminate();
    }

    terminate() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
    }

}