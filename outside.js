var demogame = {};
var score = 0;
var scoreText;
var globalVol = 0.2;
var text;
var timedEvent;
gameOver = false;
var jumpSigns;
var scoreText;
var spacebar;

//assumed scene params, may want to move to config?
var bpm = 120; // units: Beats Per Minute
var fps = 60; // units: Frames Per Second
var space_btwn_beats = 150*60; // units: Pix*velocity factor
var hero_move = (space_btwn_beats/(fps/(bpm/60))); // PXmove/beat*beat/frame
var beat_counter = 0; // to count beats / timing
var player_last_x = 0; //used for tuning hero_move
var player_max_y = 600; //used for testing jump heights for level design

// demogame.state1 = function(){};
// demogame.state1.prototype = {
var Outside = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, { "key": "Outside" });
  },
  init: function(data) {
    console.log('init', data);
    this.score = data.id;
  },
  preload:function(){
    this.load.image("bg2","forest.png");//1000x600
    this.load.image("ground","ground.png"); //150x100
    this.load.audio("track3","electro-rock.mp3");
    this.load.audio("jumpSound","jumpSound.wav");
    this.load.audio("punchSound","snareSound.wav");
    this.load.image("dot","vol_slider_knob.png");
    this.load.image("door1","vine.png"); //20x20
    //this.load.image("chest","chest.png");//16x13
    //this.load.image("ladder","ladder.png");//16x48
    this.load.spritesheet("king", "player.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("enemy", "enemy.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("jumpSign", "sig2_bigup.png", {frameWidth: 16, frameHeight: 27});
    this.load.spritesheet("boxSign", "punchSig.png", {frameWidth: 16, frameHeight: 27});
  },

  create:function(){
    for (let i = 0; i<36;i++) {
      this.add.image(500+1000*i,300,"bg2").setScale(2,2); //1000x600
    } // all phaser images are positioned by their center
    //camera 
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    //this.physics.arcade.checkCollision.down = false;

    //keyObj.on('down', function(event) {  this.scene.restart() });


    console.log('create');
    // 2:30 in seconds
    this.initialTime = 94;
    text = this.add.text(-300, 32, 'Countdown: ' + formatTime(this.initialTime));

    
    scoreText = this.add.text(-100, 48, 'Score: ' + this.score);

    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
    timedEvent = this.time.delayedCall(94000, onEvent2, [], this);

    this.cameras.main.setSize(800, 600);
    const cam = this.cameras.add(0, 0, 800, 600);
    // use . setOrigin after .image >> .setOrigin(0,0)
    // phaser builds in order, so top image last

    text.setScrollFactor(0,0);
    scoreText.setScrollFactor(0.0);
    
    //this.physics.add.collider(jump, player);

    
    //this.add.text(26250, 150, 'Congrats you completed level 1!',{ fontSize: '32px', fill: '#FFF' });

    

    console.log("hi im state1");
    this.physics.world.setFPS(fps);
    platforms = this.physics.add.staticGroup();
    for (let i = 0; i<240;i++) {
      platforms.create(75+i*150,350,"ground");
    }
    // platforms.create(1690,330,"ground"); // test short hop
    // platforms.create(3265,285,"ground"); // test long hop
    //buildStage1();
    //platforms.create(x,y,"tag");//.setScale(2).refreshBody(); // setScale doubles size, need .refreshBody because we've changed a static body
    console.log("map scene1 made");
    player = this.physics.add.sprite(150, 250,"king");
    player.setBounce(0);
    player.setCollideWorldBounds(false);
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers("king", {start:4, end:9}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers("king", {start:1, end:1}),
      frameRate: 10,
      repeat: 5
    });
    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers("king", {start:12, end:12}),
      frameRate: 10,
      repeat: 5
    });

    enemies = this.physics.add.staticGroup();
    
    
    player.body.setGravityY(200);
    this.physics.add.collider(player, platforms);
    cam.startFollow(target=player, roundPixels=false, lerpX=0.5, lerpY=0.5, offsetX=-280, offsetY=150);
    //cam.startFollow(player); // most basic version of camera
    cursors = this.input.keyboard.createCursorKeys();
    //scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    //beatText = this.add.text(16, 48, 'X', { fontSize: '32px', fill: '#FFF' });
    
    


    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    jumpSigns = this.physics.add.staticGroup();
    boxSigns = this.physics.add.staticGroup();
    doors = this.physics.add.staticGroup();

    this.add.text(1000, 150, 'YOU ARE FINALLY OUT!',{ fontSize: '32px', fill: '#FFF' });
    doors.create(2500, 185, "door1").setScale(1,1);




    //platforms.create(21375,295,"ground");
    







    //this.physics.add.overlap(player, jumpSigns, jumpNow, null, this);
    //this.physics.add.overlap(player, boxSigns, punchNow, null, this);
    //this.physics.add.overlap(player, enemies, punchChance, null, this);
    this.physics.add.overlap(player, platforms, jumpFail, null, this);

    

    //jump.create(1000,275,"jumpSign");
    //jump.create(1100,275,"jumpSign");


    
    //jump.setBounce(0);
    //jump.setCollideWorldBounds(true);
    //this.physics.add.collider(jump, platforms);

    //this.input.once('pointerdown', this.scene.restart());
  },
  update:function(){
    player.setVelocityX(hero_move);
    player.anims.play('right', true);
    
    //game.physics.arcade.collide(player, 'ground');
    //var keyObj = this.input.keyboard.addKey('W');
    //var isDown = keyObj.isDown;
    //keyObj.on('down', function(event) { this.scene.restart() });

    if (Phaser.Input.Keyboard.JustDown(spacebar))
    {
        this.scene.restart();
        bgTrack.stop();
    }

    else if (cursors.right.isDown) // slam
    {
      player.anims.play('punch', false);
      punchTrack.play();
      
    }
    else if (cursors.down.isDown) // drop
    {
      player.anims.play('down', false);
      //this.add.image(player.x,player.y,"down"); 
    }
    // counting beats
    beat_counter += 1;
    if (beat_counter==30) {
      beat_counter = 0;
      console.log(`dX:${player.x - player_last_x}`); 
      console.log(`X:${player.x}`); 
      if (player.x - player_last_x == 0){
        this.scene.restart();
        bgTrack.stop();
      }
      player_last_x = player.x;
    }

    //this.physics.collide(this.player, this.doors, function(){
      //this.scene.start('Lose');
    //});


    this.physics.add.overlap(player, doors, hitDoor3, null, this);
    this.physics.add.overlap(player, enemies, punchChance, null, this);
    this.physics.add.overlap(player, jumpSigns, jumpNow, null, this);
    this.physics.add.overlap(player, boxSigns, punchNow, null, this);
  }
});


function hitDoor3(player, door1)
{
  if (this.physics.collide(player, door1))
  {
    this.cameras.main.fadeOut(2000, 0, 0, 0);

    this.physics.pause();

    player.setTint(00000);

    player.anims.play('turn');

    bgTrack.stop();

    this.scene.start("CompletedLevelTwo", {id: this.score});
  }
}

function punchChance(player, enemy)
{
  if (cursors.right.isDown)
    {
      enemy.disableBody(true, true);
      player.anims.play('punch', false);
      this.score = this.score + 1;
      scoreText.setText('Score: ' + this.score);
    }
}

function jumpFail(player, ground)
{
  print("touch");
}

function punchNow()
{
  player.anims.play('punch', false);
}

function jumpNow()
{
  if (cursors.up.isDown && player.body.touching.down) // short hop, results in 288.5-261.611111111111
    {
      player.anims.play('right', true);
      player.setVelocityY(-250);
      jumpTrack.play();
      console.log("jump");
    }
}



function formatTime(seconds){
  // Minutes
  var minutes = Math.floor(seconds/60);
  // Seconds
  var partInSeconds = seconds%60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2,'0');
  // Returns formated time
  return `${minutes}:${partInSeconds}`;
}

function onEvent(){
  this.initialTime -= 1; // One second
  text.setText('Countdown: ' + formatTime(this.initialTime));
}

function onEvent2()
{
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      this.time.addEvent({
        delay: 2000,
        loop: false,
        callback: () => {
            this.scene.start("Lose", { 
                "message": "Game Over!\nPress SPACEBAR to restart!"
            });
          }
      })

    gameOver = true;

}