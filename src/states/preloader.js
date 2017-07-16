class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    //setup loading bar
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    //Setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  update() {
      if (this.ready) {
        this.game.state.start('menu');
      }
  }

  loadResources() {
      // load your resources here
      this.game.load.spritesheet('ground', 'assets/sprites/ground.png', 64, 64);
      this.game.load.spritesheet('lava', 'assets/sprites/lava.png', 64, 64);
      this.game.load.spritesheet('drill0', 'assets/sprites/drill.png', 64, 64);
      this.game.load.spritesheet('drill1', 'assets/sprites/drill2.png', 64, 64);
  }

  onLoadComplete() {
    this.ready = true;
  }
}

export default Preloader;
