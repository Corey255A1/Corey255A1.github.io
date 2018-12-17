class Player {
    constructor(scene, x, y, key) {
        //super(scene, x, y, key);
        this._normalSpeed = 6;
        this._boostSpeed = -330;

        this.Score = 0;
        this.UserDirection = 0;
        this.sprite = scene.matter.add.sprite(x, y, key, 0);

        console.log(scene.anims.generateFrameNames(key, { prefix: 'Zip/Roll/Zip', start:1, end:2, zeroPad:4}));

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNames(key, { prefix: 'Zip/Roll/Zip', start: 1, end: 2, zeroPad: 4 }),
            frameRate: 10
            //repeat: -1
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNames(key, { prefix: 'Zip/Roll/Zip', start: 4, end: 5, zeroPad: 4 }),
            frameRate: 10
            //repeat: -1
        });
        scene.anims.create({
            key: 'turn',
            frames: scene.anims.generateFrameNames(key, { prefix: 'Zip/Roll/Zip', start: 3, end: 3, zeroPad: 4 }),
            frameRate: 20
        });

        //const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        //const mainbody = Bodies.circle(10, 0, 40);
        //const body = Body.create({
        //    parts: [mainbody],
        //    frictionStatic: 0,
        //    frictionAir: 0.02,
        //    friction: 0.1
        //});
        //this.sprite
        //    .setExistingBody(body)
        //    .setPosition(x, y);


        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w * 0.4, h, { chamfer: { radius: 20 } });
        //this.sensors = {
        //    bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
        //    left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
        //    right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
        //};
        const compoundBody = Body.create({
            parts: [mainBody],//, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.01
        });
        this.sprite
            .setExistingBody(compoundBody)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setPosition(x, y);
        
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

        //if (input.up.isDown && this.body.touching.down) {
        //    this.boost();
        //}
    }

    move(dir) {
        if (dir === 0) {
            if (this.sprite.body.velocity.x === 0) {
                if (this.UserDirection === 2) {
                    this.sprite.anims.playReverse('right');
                    this.UserDirection = 0;
                    //this.sprite.setVelocityX(0);
                }
                else if (this.UserDirection === 1) {
                    this.sprite.anims.playReverse('left');
                    this.UserDirection = 0;
                    //this.sprite.setVelocityX(0);
                }
                else if (!this.sprite.anims.isPlaying) {
                        this.sprite.anims.play('turn');
                }
            }
        }
        else if (dir === 1) {            
            this.sprite.setVelocityX(-this._normalSpeed);
            if (this.UserDirection !== 1) {
                this.sprite.anims.play('left', true);
                this.UserDirection = dir;
            }
        }
        else if (dir === 2) {            
            this.sprite.setVelocityX(this._normalSpeed);
            if (this.UserDirection !== 2) {
                this.sprite.anims.play('right', true);
                this.UserDirection = dir;
            }
        }

    }
    boost() {
        this.sprite.setVelocityY(this._boostSpeed);
    }

    collide(player, object) {
        player.terminate();
    }

    terminate() {
        //this.physics.pause();
        this.sprite.setTint(0xff0000);
        this.sprite.anims.play('turn');
    }

}