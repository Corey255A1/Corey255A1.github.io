class BaseLevel extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
        this.player;
        this.cursors;
        this.gameOver = false;
        this.overlay;
    }
    preload() {
        this.load.spritesheet('player',
            'tut/assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create() {
        this.player = new Player(this, 100, 450, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);

        this.cameras.main.startFollow(this.player);

        this.overlay = new Overlay(this);

    }
    update() {
        this.player.handleUserInput(this.cursors);

    }
}