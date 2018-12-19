class Overlay {

    constructor(scene) {
        this._scoreText = scene.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#000' });
    }

    updateScore(score) {
        this._scoreText.setText('SCORE: ' + score);
    }

}