class Menu extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    var p1text = this.add.text(this.game.width/this.game.global.drillLen*(0.5), this.game.height * 0.5-100, '1P\n'+this.game.global.player1Score*1000+'億', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    p1text.anchor.set(0.5);

    var p2text = this.add.text(this.game.width/this.game.global.drillLen*(1.5), this.game.height * 0.5-100, '2P\n'+this.game.global.player2Score*1000+'億', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    p2text.anchor.set(0.5);

    for(var i=0;i<this.game.global.drillLen;i++)
    {
      // Create drill
      var drill = this.add.sprite(this.game.width/this.game.global.drillLen*(i+0.5), this.game.height * 0.5, 'drill'+i);
      drill.anchor.setTo(0.5, 0.5);
      drill.animations.add('right', [0,1,2], 10, true);
      drill.animations.play('right');
    }

    this.saveVarsToLocalStorage();

    this.input.onDown.add(this.restartGame, this);
  }

  saveVarsToLocalStorage(){

  }

  resetGlobalVariables(){
    this.game.global.player1Score = 0;
    this.game.global.player2Score = 0;
  }

  update() {}

  restartGame () {
    this.resetGlobalVariables();
    this.game.state.start('menu');
  }

}

export default Menu;
