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
    this.game.input.keyboard.addKey([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
    ]);
    this.game.world.setBounds(0,0,this.game.width);
    // Create ground
    this.createGround();
    // Create driller
    this.createDriller();
  }

  update() {
    this.game.physics.arcade.collide(this.drillArr[0],this.drillArr[1]);
    this.game.physics.arcade.collide(this.drillArr, this.ground);

    for(var i=0;i<this.drillArr.length;i++)
    {
      // Move
      this.drillArr[i].body.velocity.x = 0;
      if (!this.game.tweens.isTweening(this.drillArr[i])) {
        this.move(this.drillArr[i]);
      }
      // Dig
      if (this.drillArr[i].alive) {
        this.drillmove(this.drillArr[i]);
      }
    }
  }

  collisionHandler (obj1, obj2) {
    this.game.stage.backgroundColor = '#992d2d';
  }

  endGame() {
    this.game.state.start('gameover');
  }

  move(drill) {
    if (this.input.keyboard.isDown(this.controls['p'+drill.id][0]) && drill.x > this.blockWidth/2) {
        // for(var i = 0; i<this.drillArr.length;i++)
        // {
        //   if(i!=drill.id && (Math.abs(drill.x-this.drillArr[i].x) <= this.blockWidth)&&(drill.y == this.drillArr[i].y))
        //   {
        //     return;
        //   }
        // }
        this.game.add.tween(drill).to({ x: drill.x - this.blockWidth }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        drill.animations.play('left');
    } else if (this.input.keyboard.isDown(this.controls['p'+drill.id][1]) && drill.x < this.game.width - this.blockWidth/2) {
        // for(var j = 0; j<this.drillArr.length;j++)
        // {
        //   if(j!=drill.id && (Math.abs(drill.x-this.drillArr[j].x) <= this.blockWidth )&&(drill.y == this.drillArr[j].y))
        //   {
        //     return;
        //   }
        // }
        this.game.add.tween(drill).to({ x: drill.x + this.blockWidth }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        drill.animations.play('right');
    } else if (this.input.keyboard.isDown(this.controls['p'+drill.id][2])) {
        this.game.add.tween(drill).to({ y: drill.y + this.blockHeight }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
        this.addMoreGround();
       //  if (drill.y >= this.game.camera.y + this.middle) {
       //      this.game.add.tween(this.game.camera).to({ y: this.game.camera.y + this.blockHeight }, this.drillMoveSpeed, Phaser.Easing.Sinusoidal.InOut, true);
       //  }
        drill.animations.play('down');
        this.depth++;
    }
  }

  drillmove(drill) {
    this.ground.forEachAlive(function(ground) {
        if (this.game.math.distance(drill.x, drill.y, ground.x, ground.y) < this.blockWidth*0.8) {
            if (!ground.animations.getAnimation('crush').isPlaying) {
                ground.tween = this.game.add.tween(ground).to({ alpha: 0 }, 180, Phaser.Easing.Cubic.In, true);
                ground.animations.play('crush');
            }
        }

        if (ground.y < this.game.camera.y - this.blockHeight) {
            ground.kill();
        }
    }, this);
  }

  createDriller() {
    for(var i=0;i<this.game.global.drillLen;i++)
    {
      // Create drill
      var drill;
      drill = this.game.add.sprite(this.blockWidth * 1.5*(i*2+1), this.middle, 'drill'+i);
      drill.id = i;
      drill.anchor.setTo(0.5, 0.5);
      drill.animations.add('right', [0,1,2], 10, true);
      drill.animations.add('left', [3,4,5], 10, true);
      drill.animations.add('down', [6,7,8], 10, true);
      drill.animations.add('up', [9,10,11], 10, true);
      drill.animations.play('right');
      this.game.physics.arcade.enable(drill);
      //drill.body.bounce.x=1;
      //drill.body.bounce.y=1;
      //drill.body.collideWorldBounds = true;
      //drill.body.onCollide = new Phaser.Signal();
      //drill.body.onCollide.add(this.hitDrill, this);
      this.drillArr.push(drill);
    }
    this.game.camera.follow(this.drillArr[0]);
  }

  createGround() {
    this.groundDepth = this.middle + this.blockHeight;
    this.ground = this.game.add.group();
    this.addMoreGround();
  };

  addMoreGround() {
      //if (this.game.camera.y + this.game.camera.height < G.groundDepth - G.blockHeight) return;

      var x, y;
      var firsttime = true;
      var addlevel=(firsttime)?10:5;
      firsttime = false;
      for(x = this.blockWidth * 0.5; x < this.game.width; x += this.blockWidth) {
          for(y = this.groundDepth; y < this.groundDepth + this.blockHeight*addlevel ; y += this.blockHeight) {
              // var difficulty = 50 * this.game.camera.y/(this.game.world.height * 0.8);
              // var obstacleChance = this.game.math.chanceRoll(10 + difficulty);
              // if (obstacleChance && y > G.groundDepth) {
              //     // Randomly place obstacles based on depth
              //     var lavaChance = this.game.math.chanceRoll(50);
              //     if (lavaChance) {
              //         // Place lava
              //         Lava.create(this.game, x, y);
              //     } else {
              //         // Place monster
              //         Monster.create(this.game, x, y);
              //     }
              //} else {
                  // Place ground
                  var ground = this.ground.getFirstDead();
                  if (ground === null) {
                      ground = this.game.add.sprite(x, y, 'ground', 0, this.ground);
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
              //}
          }
      }

      this.groundDepth = y;
  };

  render() {
    // this.game.debug.body(this.drillArr[0]);
    // this.game.debug.body(this.drillArr[1]);
    //this.game.debug.bodyInfo(this.drillArr[0]);
  }
}

export default Game;
