function StartGame() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'matter'//,
            //matter: {
            //    debug: true
            //}
        }
    };

    var game = new Phaser.Game(config);
    game.scene.add('GameArea', new BaseLevel('GameArea'));
    game.scene.add('HUD', new Overlay('HUD'));
    game.scene.start('GameArea');
    game.scene.start('HUD');
}
window.onload = StartGame;