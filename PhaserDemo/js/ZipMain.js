function StartGame() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        }
    };

    var game = new Phaser.Game(config);
    game.scene.add('Level1', new Level1());
    game.scene.start('Level1');
}
window.onload = StartGame;