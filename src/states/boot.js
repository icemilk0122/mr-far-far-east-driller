class Boot extends Phaser.State {

  constructor() {
    super();
  }

  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {
    this.game.input.maxPointers = 1;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    this.game.time.advancedTiming = true;

    //setup device scaling
    if (this.game.device.desktop) {

    } else {

    }
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.game.scale.maxWidth = 832;
    //this.game.scale.maxHeight = 448;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
    this.game.world.setBounds(0,0,this.game.width);
    //this.game.stage.backgroundColor = 0x4488cc;

    this.initGlobalVariables();

    this.game.state.start('preloader');
  }

  initGlobalVariables(){
    this.game.global = {
      'drillLen':2,
      'blockHeight':64,
      'blockWidth':64,
      'player1Score':0,
      'player2Score':0,
    };
  }

}

export default Boot;
