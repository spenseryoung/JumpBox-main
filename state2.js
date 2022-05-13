var demogame = {};
var score = 0;
var scoreText;
var globalVol = 0.2;
var text;
var timedEvent;
gameOver = false;
var jumpSigns;
var healthText;
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
var SceneTwo = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, { "key": "SceneTwo" });
  },
  init: function() {},
  preload:function(){
    this.load.image("bg","bg.png");//1000x600
    this.load.image("ground","ground.png"); //150x100
    this.load.audio("track2","metal-blues.mp3");
    this.load.audio("jumpSound","jumpSound.wav");
    this.load.audio("punchSound","snareSound.wav");
    this.load.image("dot","vol_slider_knob.png");
    this.load.image("door","door2.png"); //20x20
    //this.load.image("chest","chest.png");//16x13
    //this.load.image("ladder","ladder.png");//16x48
    this.load.spritesheet("king", "player.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("enemy", "enemy.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("jumpSign", "sig2_bigup.png", {frameWidth: 16, frameHeight: 27});
    this.load.spritesheet("boxSign", "punchSig.png", {frameWidth: 16, frameHeight: 27});
  },

  create:function(){
    for (let i = 0; i<36;i++) {
      this.add.image(500+1000*i,300,"bg").setScale(3,3); //1000x600
    } // all phaser images are positioned by their center
    //camera 
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    //this.physics.arcade.checkCollision.down = false;

    //keyObj.on('down', function(event) {  this.scene.restart() });


    console.log('create');
    // 2:30 in seconds
    this.initialTime = 94;
    text = this.add.text(32, 32, 'Countdown: ' + formatTime(this.initialTime));

    this.health = 3;
    healthText = this.add.text(32, 48, 'Health: ' + this.health);

    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
    timedEvent = this.time.delayedCall(94000, onEvent2, [], this);

    this.cameras.main.setSize(800, 600);
    const cam = this.cameras.add(0, 0, 800, 600);
    // use . setOrigin after .image >> .setOrigin(0,0)
    // phaser builds in order, so top image last

    text.setScrollFactor(0,0);
    healthText.setScrollFactor(0.0);
    
    //this.physics.add.collider(jump, player);

    
    this.add.text(26250, 150, 'Congrats you completed level 1!',{ fontSize: '32px', fill: '#FFF' });

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
    player = this.physics.add.sprite(150,250,"king");
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
    
    

    bgTrack = this.sound.add("track2", .2);
    jumpTrack = this.sound.add("jumpSound");
    punchTrack = this.sound.add("punchSound");
    bgTrack.play();

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    jumpSigns = this.physics.add.staticGroup();
    boxSigns = this.physics.add.staticGroup();
    doors = this.physics.add.staticGroup();

    //doors.create(700, 230, "door").setScale(0.4,0.4);

    //jump tutorial
    jumpSigns.create(1200,275,"jumpSign");
    this.add.text(1000, 150, 'TIME JUMPS WITH SYMBOL',{ fontSize: '32px', fill: '#FFF' });
    jumpSigns.create(1950,275,"jumpSign");
    platforms.create(2175,295,"ground");
    platforms.create(2325,295,"ground");
    platforms.create(2475,295,"ground");
    platforms.create(2625,295,"ground");
    jumpSigns.create(2550,220,"jumpSign");

    //box tutorial
    this.add.text(2800, 150, 'PRESS RIGHT ARROW TO BOX',{ fontSize: '32px', fill: '#FFF' });
    boxSigns.create(3750,275,"boxSign");
    this.add.text(3500, 150, 'TIME WITH THE SYMBOL TO DEFEAT ENEMIES',{ fontSize: '32px', fill: '#FFF' });
    enemies.create(3800,275,"enemy");
    boxSigns.create(4050,275,"boxSign");
    enemies.create(4100,275,"enemy");
    boxSigns.create(4350,275,"boxSign");
    enemies.create(4400,275,"enemy");
    //this.add.text(4800, 150, 'IF HEALTH HITS 0 OR PLATFORM IS HIT, LEVEL WILL RESTART',{ fontSize: '32px', fill: '#FFF' });

    jumpSigns.create(4950,275,"jumpSign");
    platforms.create(5175,295,"ground");
    platforms.create(5325,295,"ground");
    jumpSigns.create(5250,220,"jumpSign");
    platforms.create(5475,240,"ground");
    platforms.create(5625,240,"ground");
    platforms.create(5775,240,"ground");
    
    boxSigns.create(5550,165,"boxSign");
    enemies.create(5600,165,"enemy");
    boxSigns.create(5700,165,"boxSign");
    enemies.create(5750,165,"enemy");
    jumpSigns.create(5850,165,"jumpSign");
    platforms.create(6075,240,"ground");
    platforms.create(6225,240,"ground");
    platforms.create(6375,240,"ground");
    boxSigns.create(6150,165,"boxSign");
    enemies.create(6200,165,"enemy");
    boxSigns.create(6300,165,"boxSign");
    enemies.create(6350,165,"enemy");
    jumpSigns.create(6450,165,"jumpSign");
    platforms.create(6675,240,"ground");
    platforms.create(6825,240,"ground");
    platforms.create(6975,240,"ground");
    boxSigns.create(6750,165,"boxSign");
    enemies.create(6800,165,"enemy");
    boxSigns.create(6900,165,"boxSign");
    enemies.create(6950,165,"enemy");

    boxSigns.create(7350,275,"boxSign");
    enemies.create(7400,275,"enemy");
    boxSigns.create(7425,275,"boxSign");
    enemies.create(7475,275,"enemy");

    boxSigns.create(7650,275,"boxSign");
    enemies.create(7700,275,"enemy");
    boxSigns.create(7725,275,"boxSign");
    enemies.create(7775,275,"enemy");

    boxSigns.create(7950,275,"boxSign");
    enemies.create(8000,275,"enemy");
    boxSigns.create(8025,275,"boxSign");
    enemies.create(8075,275,"enemy");

    jumpSigns.create(8250,275,"jumpSign");
    platforms.create(8475,295,"ground");
    platforms.create(8625,295,"ground");
    jumpSigns.create(8550,220,"jumpSign");
    platforms.create(8775,240,"ground");
    platforms.create(8925,240,"ground");
    jumpSigns.create(8850,165,"jumpSign");
    platforms.create(9075,185,"ground");
    platforms.create(9225,185,"ground");

    jumpSigns.create(9150,110,"jumpSign");
    platforms.create(9525,185,"ground");
    platforms.create(9675,185,"ground");
    boxSigns.create(9450,110,"boxSign");
    enemies.create(9500,110,"enemy");
    jumpSigns.create(9750,110,"jumpSign");

    platforms.create(9975,185,"ground");
    boxSigns.create(10050,110,"boxSign");
    enemies.create(10100,110,"enemy");
    platforms.create(10125,185,"ground");
    jumpSigns.create(10200,110,"jumpSign");

    platforms.create(10475,240,"ground");
    boxSigns.create(10550,165,"boxSign");
    enemies.create(10600,165,"enemy");
    platforms.create(10625,240,"ground");

    platforms.create(10925,295,"ground");
    platforms.create(11075,295,"ground");
    boxSigns.create(11000,220,"boxSign");
    enemies.create(11050,220,"enemy");

    boxSigns.create(11300,275,"boxSign");
    enemies.create(11350,275,"enemy");
    boxSigns.create(11450,275,"boxSign");
    enemies.create(11500,275,"enemy");

    jumpSigns.create(11700,275,"jumpSign");
    platforms.create(11925,295,"ground");
    jumpSigns.create(12000,220,"jumpSign");
    platforms.create(12225,255,"ground");
    platforms.create(12525,295,"ground");
    jumpSigns.create(12600,220,"jumpSign");
    platforms.create(12825,255,"ground");
    platforms.create(13125,295,"ground");
    jumpSigns.create(13200,220,"jumpSign");
    platforms.create(13425,255,"ground");
    jumpSigns.create(13500,180,"jumpSign");
    platforms.create(13725,215,"ground");
    jumpSigns.create(13800,140,"jumpSign");
    platforms.create(14025,215,"ground");
    platforms.create(14175,215,"ground");
    platforms.create(14325,215,"ground");

    platforms.create(14475,215,"ground");
    platforms.create(14625,215,"ground");
    platforms.create(14775,215,"ground");

    boxSigns.create(14250,140,"boxSign");
    enemies.create(14300,140,"enemy");
    boxSigns.create(14325,140,"boxSign");
    enemies.create(14375,140,"enemy");
    boxSigns.create(14400,140,"boxSign");
    enemies.create(14450,140,"enemy");
    boxSigns.create(14475,140,"boxSign");
    enemies.create(14525,140,"enemy");






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


    this.physics.add.overlap(player, doors, hitDoor, null, this);
    this.physics.add.overlap(player, enemies, punchChance, null, this);
    this.physics.add.overlap(player, jumpSigns, jumpNow, null, this);
    this.physics.add.overlap(player, boxSigns, punchNow, null, this);
  }
});


function hitDoor(player, door)
{
  if (this.physics.collide(player, door))
  {
    this.cameras.main.fadeOut(2000, 0, 0, 0);

    this.physics.pause();

    player.setTint(00000);

    player.anims.play('turn');

    bgTrack.stop();

    this.scene.start("CompletedLevelOne", { 
        "message": "Congrats! You completed level 1!\nPress SPACEBAR to start level 2!"
      });
  }
}

function punchChance(player, enemy)
{
  if (cursors.right.isDown)
    {
      player.anims.play('punch', false);
      enemy.disableBody(true, true);
    }
  else
    {
      if (this.health > 0)
      {
        this.health = this.health - 1
      }
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