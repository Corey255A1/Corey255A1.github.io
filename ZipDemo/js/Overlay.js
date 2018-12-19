class Overlay extends Phaser.Scene {
    constructor(name) {
        super({ key: name });
    }
    create() {
        this._scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#FFFFFF' });
        //this._scoreText.setScrollFactor(0);
    }

    updateScore(score) {
        this._scoreText.setText('SCORE: ' + score);
    }

}