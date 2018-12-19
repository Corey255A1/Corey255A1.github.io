class BaseLevel extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
        this.player;
        this.cursors;
        this.gameOver = false;
        this.overlay;
    }
    preload() {
        this.load.atlas('zip', 'assets/textures/Zip.png', 'assets/textures/Zip.json');
        this.load.image('platformtileset', 'assets/textures/metal.png');
        this.load.tilemapTiledJSON('level1', 'levels/tiled/Level1.json');
    }
    create() {
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('platformtiles', 'platformtileset');
        const walkablelayer = map.createDynamicLayer('Platforms', tileset, 0, 0);
        map.createStaticLayer('Decorations', tileset, 0, 0);
        walkablelayer.setCollisionByProperty({ collides: true });

        var startX, startY;
        map.objects.forEach(function (e) {
            if (e.name === 'Triggers') {
                e.objects.forEach(function (o) {
                    if (o.name === 'PlayerStart') {
                        startX = o.x;
                        startY = o.y;
                    }
                });
            };
        });


        this.player = new Player(this, startX, startY, 'zip');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.matter.world.convertTilemapLayer(walkablelayer);
        //this.matter.world.createDebugGraphic();
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);

    }
    update() {
        this.player.handleUserInput(this.cursors);
    }
}