class Menu extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    var title = this.add.text(this.game.width * 0.5, this.game.height * 0.5-100, 'FARFAREAST DRILLER', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    title.anchor.set(0.5);
    var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'START', {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    text.anchor.set(0.5);

    this.input.onDown.add(this.startGame, this);

    // Listen for messages from other devices
    this.game.air_console.onMessage = function(from, data) {
        if(this.game.air_console.convertDeviceIdToPlayerNumber(from) == 0)
        {
          switch(data){
            case 'A':
              startGame();
              break;
          }
        }
    };
  }

  update() {}

  startGame () {
    this.game.state.start('game');
  }

}

export default Menu;
