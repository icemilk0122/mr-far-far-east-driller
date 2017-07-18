import Lava from '../prefabs/lava';

class Game extends Phaser.State {

  constructor() {
    super();
    this.blockHeight = 64;
    this.blockWidth = 64;
    this.middle = this.blockHeight * 10;
    this.drillArr = [];
    this.controls = {
      'p0':[Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT,Phaser.Keyboard.DOWN],
      'p1':[Phaser.Keyboard.A,Phaser.Keyboard.D,Phaser.Keyboard.S]
    }
  }

  create() {
    this.game.camera.reset();
    // Create ground
    this.createGround();
    // Create driller
    this.createDriller();

    this.game.p0action = 'stop';
    this.game.p1action = 'stop';
    var _game = this;
    //Listen for messages from other devices
    this.game.air_console.onMessage = function(from, data) {
        switch(data){
          case 'left':
            _game.game['p'+_game.game.air_console.convertDeviceIdToPlayerNumber(from)+'action'] = 'left';
            break;
          case 'right':
            _game.game['p'+_game.game.air_console.convertDeviceIdToPlayerNumber(from)+'action'] = 'right';
            break;
          case 'down':
            _game.game['p'+_game.game.air_console.convertDeviceIdToPlayerNumber(from)+'action'] = 'down';
            break;
          case 'stop':
            _game.game['p'+_game.game.air_console.convertDeviceIdToPlayerNumber(from)+'action'] = 'stop';
            break;
        }
    };
  }

  update() {
    this.game.physics.arcade.collide(this.drillArr[0],this.drillArr[1]);
    this.game.physics.arcade.collide(this.drillArr, this.game.ground);

    for(var i=0;i<this.drillArr.length;i++)
    {
      // Move
      if (!this.game.tweens.isTweening(this.drillArr[i])) {
        this.move(this.drillArr[i]);
      }
      // Dig
      if (this.drillArr[i].alive) {
        this.drillmove(this.drillArr[i]);
      }
      // Lava kills
      this.game.lava.forEachAlive(function(lava) {
          if (!lava.lethal) return;

          if (this.game.math.distance(this.drillArr[i].x, this.drillArr[i].y, lava.x, lava.y) < this.blockWidth/2) {
              this.drillArr[i].kill();
              if(this.game.driller.countLiving()==0)
              {
                this.game.state.start('gameover');
              }
          }
      }, this);
    }
  }

  collisionHandler (obj1, obj2) {
    this.game.stage.backgroundColor = '#992d2d';
  }

  endGame() {
    this.game.state.start('gameover');
  }

  move(drill) {
    if ((this.game['p'+drill.id+'action']=='left') && drill.x > this.blockWidth/2) {
        this.game.add.tween(drill).to({ x: drill.x - this.blockWidth }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        drill.animations.play('left');
    } else if ((this.game['p'+drill.id+'action']=='right') && drill.x < this.game.width - this.blockWidth/2) {
        this.game.add.tween(drill).to({ x: drill.x + this.blockWidth }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        drill.animations.play('right');
    } else if (this.game['p'+drill.id+'action']=='down') {
        this.game.add.tween(drill).to({ y: drill.y + this.blockHeight }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        this.addMoreGround();
        drill.animations.play('down');
        this.depth++;
        this.game.driller.forEachAlive(function(driller){
          if(driller != this.game.camera.target && driller.y > this.game.camera.target.y)
          {
            this.game.camera.follow(driller);
          }
        }, this)
    }
  }

  drillmove(drill) {
    this.game.ground.forEachAlive(function(ground) {
        if (this.game.math.distance(drill.x, drill.y, ground.x, ground.y) < this.blockWidth*0.8) {
            if (!ground.animations.getAnimation('crush').isPlaying) {
                ground.tween = this.game.add.tween(ground).to({ alpha: 0 }, 180, Phaser.Easing.Cubic.In, true);
                ground.animations.play('crush');
                this.game.global['player'+(drill.id+1)+'Score'] += 1;
            }
        }

        if (ground.y < this.game.camera.y - this.blockHeight) {
            ground.kill();
        }
    }, this);
  }

  createDriller() {
    this.game.driller = this.game.add.group();
    for(var i=0;i<this.game.global.drillLen;i++)
    {
      // Create drill
      var drill = this.game.driller.getFirstDead();
      if (drill === null) {
        drill = this.game.add.sprite(this.blockWidth * 1.5*(i*2+1), this.middle, 'drill'+i, 0, this.game.driller);
        drill.id = i;
        drill.anchor.setTo(0.5, 0.5);
        drill.animations.add('right', [0,1,2], 10, true);
        drill.animations.add('left', [3,4,5], 10, true);
        drill.animations.add('down', [6,7,8], 10, true);
        drill.animations.add('up', [9,10,11], 10, true);
        drill.animations.play('right');
      }
      drill.reset(this.blockWidth * 1.5*(i*2+1), this.middle);
      drill.frame = 0;
      drill.alpha = 1;
      drill.revive();
      this.game.physics.arcade.enable(drill);
      this.drillArr.push(drill);
    }
    this.game.camera.follow(this.game.driller.getFirstAlive());
  }

  createGround() {
    this.groundDepth = this.middle + this.blockHeight;
    this.game.ground = this.game.add.group();
    this.game.lava = this.game.add.group();
    this.game.firsttime = true;
    this.addMoreGround();
  };

  createLava(game, x, y) {
    var lava = this.game.lava.getFirstDead();
    if (lava === null) {
      lava = this.game.lava.add(new Lava(game, x, y));
    }else {
      lava.reset(x, y);
      lava.lethal = false;
      lava.revive();
      lava.animations.stop();
      lava.animations.play('filling');
    }
  };

  addMoreGround() {
      var x, y;
      var addlevel=(this.game.firsttime)?10:1;
      this.game.firsttime = false;
      for(x = this.blockWidth * 0.5; x < this.game.width; x += this.blockWidth) {
          for(y = this.groundDepth; y < this.groundDepth + this.blockHeight*addlevel ; y += this.blockHeight) {
              var difficulty = 0;//this.game.camera.y/100;
              var obstacleChance = Phaser.Utils.chanceRoll(10 + difficulty);
              if (obstacleChance && y >= Math.max(this.groundDepth,this.middle + this.blockHeight*2)) {
                  this.createLava(this.game, x, y);
              } else {
                  // Place ground
                  var ground = this.game.ground.getFirstDead();
                  if (ground === null) {
                      ground = this.game.add.sprite(x, y, 'ground', 0, this.game.ground);
                      ground.anchor.setTo(0.5, 0.5);
                      var animation = ground.animations.add('crush', [0,1,2,3], 20, false);
                      animation.killOnComplete = true;
                  }
                  ground.reset(x, y);
                  ground.frame = 0;
                  ground.alpha = 1;
                  ground.revive();
                  this.game.physics.arcade.enable(ground);
                  ground.body.allowGravity = false;
                  ground.body.immovable = true;
              }
          }
      }

      this.groundDepth = y;
  };

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    this.game.debug.text('lava living:'+this.game.lava.countLiving(), 2,28);
    this.game.debug.text('ground living:'+this.game.ground.countLiving(), 2,42);
    this.game.debug.text(this.game.global.player1Score, 2, 56);
    this.game.debug.text(this.game.global.player2Score, 2, 70);
    //this.game.debug.body(this.drillArr[0]);
    //this.game.debug.body(this.drillArr[1]);
    //this.game.debug.bodyInfo(this.drillArr[0]);
  }
}

export default Game;
