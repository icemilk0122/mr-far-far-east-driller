
//Documentation for Phaser's (2.6.2) sprites:: phaser.io/docs/2.6.2/Phaser.Sprite.html
class Lava extends Phaser.Sprite {

  //initialization code in the constructor
  constructor(game, x, y, frame) {
    super(game, x, y, 'lava', frame);

    this.anchor.setTo(0.5, 0.5);
    var fillingAnim = this.animations.add('filling', [0,1,2], 2, false);
    fillingAnim.onComplete.add(function() { this.play('full'); }, this);
    this.animations.add('full', [3,4,5], 1, true);
    this.animations.stop();
    this.animations.play('filling');
  }

  //Code ran on each frame of game
  update() {
    if (this.y < this.game.camera.y - this.game.global.blockHeight) this.kill();
    if (!this.alive) return;

    if (this.animations.getAnimation('full').isPlaying) {
        this.lethal = true;
        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveDown = true;

        this.game.ground.forEachAlive(function(ground) {
            if (ground.y == this.y && ground.x == this.x + this.game.global.blockWidth) this.canMoveRight = false;
            if (ground.y == this.y && ground.x == this.x - this.game.global.blockWidth) this.canMoveLeft = false;
            if (ground.x == this.x && ground.y == this.y + this.game.global.blockHeight) this.canMoveDown = false;
        }, this);

        this.game.lava.forEachAlive(function(lava) {
            if (lava.y == this.y && lava.x == this.x + this.game.global.blockWidth) this.canMoveRight = false;
            if (lava.y == this.y && lava.x == this.x - this.game.global.blockWidth) this.canMoveLeft = false;
            if (lava.x == this.x && lava.y == this.y + this.game.global.blockHeight) this.canMoveDown = false;
        }, this);


        if (this.canMoveRight && this.x < this.game.width - this.game.global.blockWidth/2) {
            this.game.lava.add(new Lava(this.game, this.x + this.game.global.blockWidth, this.y));
        }

        if (this.canMoveLeft && this.x > this.game.global.blockWidth/2) {
            this.game.lava.add(new Lava(this.game, this.x - this.game.global.blockWidth, this.y));
        }

        if (this.canMoveDown && this.y < this.game.camera.y + this.game.camera.height) {
            this.game.lava.add(new Lava(this.game, this.x, this.y + this.game.global.blockHeight));
        }
    }
  }

}

export default Lava;
