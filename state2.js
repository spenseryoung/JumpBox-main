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
var SceneTwo = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, { "key": "SceneTwo" });
  },
  init: function(data) {
    console.log('init', data);
    this.score = data.id;
  },
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

<<<<<<< HEAD
    this.score = 0;
    scoreText = this.add.text(32, 48, 'Score: ' + this.score);
=======
    
    scoreText = this.add.text(32, 48, 'Score ' + this.score);
>>>>>>> 8a4e30def285c5cacc3211b9afacc716b39ea1b0

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
    
    

    bgTrack = this.sound.add("track2", .2);
    jumpTrack = this.sound.add("jumpSound");
    punchTrack = this.sound.add("punchSound");
    bgTrack.play();

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    jumpSigns = this.physics.add.staticGroup();
    boxSigns = this.physics.add.staticGroup();
    doors = this.physics.add.staticGroup();

    //doors.create(26250, 230, "door").setScale(0.4,0.4);
    doors.create(750, 230, "door").setScale(0.4,0.4);


    jumpSigns.create(1200,275,"jumpSign");
    platforms.create(1425,295,"ground");
    jumpSigns.create(1500,220,"jumpSign");
    platforms.create(1725,255,"ground");
    jumpSigns.create(1800,175,"jumpSign");
    platforms.create(2025,215,"ground");
    jumpSigns.create(2100,120,"jumpSign");
    platforms.create(2325,175,"ground");

    platforms.create(2475,295,"ground");
    platforms.create(2625,295,"ground");


    //box tutorial

    boxSigns.create(3750,275,"boxSign");
    enemies.create(3800,275,"enemy");
    boxSigns.create(3825,275,"boxSign");
    enemies.create(3875,275,"enemy");

    boxSigns.create(4350,275,"boxSign");
    enemies.create(4400,275,"enemy");
    boxSigns.create(4425,275,"boxSign");
    enemies.create(4475,275,"enemy");
    boxSigns.create(4500,275,"boxSign");
    enemies.create(4550,275,"enemy");

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
    boxSigns.create(7500,275,"boxSign");
    enemies.create(7550,275,"enemy");

    boxSigns.create(7650,275,"boxSign");
    enemies.create(7700,275,"enemy");
    boxSigns.create(7725,275,"boxSign");
    enemies.create(7775,275,"enemy");
    boxSigns.create(7800,275,"boxSign");
    enemies.create(7850,275,"enemy");

    boxSigns.create(7950,275,"boxSign");
    enemies.create(8000,275,"enemy");
    boxSigns.create(8025,275,"boxSign");
    enemies.create(8075,275,"enemy");
    boxSigns.create(8100,275,"boxSign");
    enemies.create(8150,275,"enemy");

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

    platforms.create(9975,130,"ground");
    boxSigns.create(10050,55,"boxSign");
    enemies.create(10100,55,"enemy");
    platforms.create(10125,130,"ground");
    jumpSigns.create(10200,55,"jumpSign");

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
    jumpSigns.create(12300,165,"jumpSign");
    platforms.create(12525,215,"ground");
    jumpSigns.create(12600,110,"jumpSign");
    platforms.create(12825,175,"ground");
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
    boxSigns.create(14537.5,140,"boxSign");
    enemies.create(14575,140,"enemy");

    jumpSigns.create(14700, 140, "jumpSign");
    platforms.create(14925,160,"ground");
    jumpSigns.create(15000, 90, "jumpSign");
    platforms.create(15225,120,"ground");
    //jumpSigns.create(15300, 140, "jumpSign");
    platforms.create(15525,160,"ground");
    platforms.create(15825,215,"ground");
    jumpSigns.create(15900, 140, "jumpSign");
    platforms.create(16125,160,"ground");
    platforms.create(16275,215,"ground");
    platforms.create(16425,215,"ground");
    platforms.create(16575,215,"ground");
    platforms.create(16725,215,"ground");
    platforms.create(16875,215,"ground");
    platforms.create(17025,215,"ground");

    boxSigns.create(16350, 140, "boxSign");
    enemies.create(16400,140,"enemy");
    boxSigns.create(16500, 140, "boxSign");
    enemies.create(16550,140,"enemy");
    boxSigns.create(16650, 140, "boxSign");
    enemies.create(16700,140,"enemy");
    boxSigns.create(16712.5, 140, "boxSign");
    enemies.create(16750,140,"enemy");
    boxSigns.create(16762.5, 140, "boxSign");
    enemies.create(16800,140,"enemy");
    boxSigns.create(16950, 140, "boxSign");
    enemies.create(17000,140,"enemy");
    boxSigns.create(17025, 140, "boxSign");
    enemies.create(17075,140,"enemy");
    jumpSigns.create(17100, 140, "jumpSign");

    platforms.create(17325,215,"ground");
    platforms.create(17475,255,"ground");
    platforms.create(17625,295,"ground");
    platforms.create(17475,235,"ground");

    boxSigns.create(18000,275,"boxSign");
    enemies.create(18050, 275, "enemy");
    boxSigns.create(18150,275,"boxSign");
    enemies.create(18200, 275, "enemy");
    boxSigns.create(18300,275,"boxSign");
    enemies.create(18350, 275, "enemy");
    boxSigns.create(18450,275,"boxSign");
    enemies.create(18500, 275, "enemy");
    boxSigns.create(18512.5,275,"boxSign");
    enemies.create(18550, 275, "enemy");
    boxSigns.create(18562.5,275,"boxSign");
    enemies.create(18600, 275, "enemy");

    boxSigns.create(18675,275,"boxSign");
    enemies.create(18725, 275, "enemy");
    boxSigns.create(18750,275,"boxSign");
    enemies.create(18800, 275, "enemy");
    boxSigns.create(18825,275,"boxSign");
    enemies.create(18875, 275, "enemy");
    boxSigns.create(18900,275,"boxSign");
    enemies.create(18950, 275, "enemy");
    boxSigns.create(18962.5,275,"boxSign");
    enemies.create(19000, 275, "enemy");
    boxSigns.create(19012.5,275,"boxSign");
    enemies.create(19050, 275, "enemy");

    boxSigns.create(19200,275,"boxSign");
    enemies.create(19250, 275, "enemy");
    boxSigns.create(19275,275,"boxSign");
    enemies.create(19325, 275, "enemy");
    boxSigns.create(19350,275,"boxSign");
    enemies.create(19400, 275, "enemy");
    boxSigns.create(19425,275,"boxSign");
    enemies.create(19475, 275, "enemy");
    boxSigns.create(19500,275,"boxSign");
    enemies.create(19550, 275, "enemy");
    boxSigns.create(19562.5,275,"boxSign");
    enemies.create(19600, 275, "enemy");

    jumpSigns.create(19900,275,"jumpSign");
    platforms.create(20125,295,"ground");
    jumpSigns.create(20200,220,"jumpSign");
    boxSigns.create(20340,145 ,"boxSign");
    enemies.create(20375, 145, "enemy");
    platforms.create(20425,255,"ground");
    jumpSigns.create(20500,175,"jumpSign");
    platforms.create(20725,215,"ground");
    jumpSigns.create(20800,120,"jumpSign");
    platforms.create(21025,175,"ground");

    platforms.create(21250,295,"ground");
    platforms.create(21475,295,"ground");


    
    jumpSigns.create(21750,275,"jumpSign");
    boxSigns.create(21890,200 ,"boxSign");
    enemies.create(21925, 200, "enemy");
    platforms.create(21975,310,"ground");
    jumpSigns.create(22350,275,"jumpSign");
    boxSigns.create(22490,200 ,"boxSign");
    enemies.create(22525, 200, "enemy");
    platforms.create(22600,310,"ground");
    boxSigns.create(22950,275,"boxSign");
    enemies.create(23000, 275, "enemy");
    boxSigns.create(23025,275,"boxSign");
    enemies.create(23075, 275, "enemy");
    jumpSigns.create(23100,275,"jumpSign");
    platforms.create(23325,295,"ground");

    platforms.create(23475,295,"ground");
    platforms.create(23625,295,"ground");
    platforms.create(23775,295,"ground");
    platforms.create(23925,295,"ground");
    boxSigns.create(23700,220,"boxSign");
    enemies.create(23750, 220, "enemy");
    boxSigns.create(23775,220,"boxSign");
    enemies.create(23825, 220, "enemy");
    boxSigns.create(23850,220,"boxSign");
    enemies.create(23900, 220, "enemy");
    boxSigns.create(23925,220,"boxSign");
    enemies.create(23975, 220, "enemy");

    boxSigns.create(24150,275,"boxSign");
    enemies.create(24200, 275, "enemy");
    boxSigns.create(24450,275,"boxSign");
    enemies.create(24500, 275, "enemy");

    boxSigns.create(24750,275,"boxSign");
    enemies.create(24800, 275, "enemy");
    boxSigns.create(24812.5,275,"boxSign");
    enemies.create(24850, 275, "enemy");
    boxSigns.create(24862.5,275,"boxSign");
    enemies.create(24900, 275, "enemy");
    boxSigns.create(24912.5,275,"boxSign");
    enemies.create(24950, 275, "enemy");
    boxSigns.create(24962.5,275,"boxSign");
    enemies.create(25000, 275, "enemy");
    boxSigns.create(25050,275,"boxSign");
    enemies.create(25100, 275, "enemy");
    boxSigns.create(25112.5,275,"boxSign");
    enemies.create(25150, 275, "enemy");
    boxSigns.create(25200,275,"boxSign");
    enemies.create(25250, 275, "enemy");
    boxSigns.create(25262.5,275,"boxSign");
    enemies.create(25300, 275, "enemy");
    boxSigns.create(25312.5,275,"boxSign");
    enemies.create(25350, 275, "enemy");
    boxSigns.create(25362.5,275,"boxSign");
    enemies.create(25400, 275, "enemy");

    boxSigns.create(25500,275,"boxSign");
    enemies.create(25550, 275, "enemy");
    boxSigns.create(25575,275,"boxSign");
    enemies.create(25625, 275, "enemy");
    boxSigns.create(25650,275,"boxSign");
    enemies.create(25700, 275, "enemy");
    boxSigns.create(25725,275,"boxSign");
    enemies.create(25775, 275, "enemy");
    boxSigns.create(25800,275,"boxSign");
    enemies.create(25850, 275, "enemy");
    boxSigns.create(25875,275,"boxSign");
    enemies.create(25925, 275, "enemy");
    boxSigns.create(25950,275,"boxSign");
    enemies.create(26000, 275, "enemy");
    boxSigns.create(26025,275,"boxSign");
    enemies.create(26075, 275, "enemy");

    doors.create(27075, 230, "door").setScale(0.4,0.4);
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


    this.physics.add.overlap(player, doors, hitDoor2, null, this);
    this.physics.add.overlap(player, enemies, punchChance, null, this);
    this.physics.add.overlap(player, jumpSigns, jumpNow, null, this);
    this.physics.add.overlap(player, boxSigns, punchNow, null, this);
  }
});


<<<<<<< HEAD
function hitDoor2(player, door)
{
  if (this.physics.collide(player, door))
  {
    this.cameras.main.fadeOut(2000, 0, 0, 0);

    this.physics.pause();

    player.setTint(00000);

    player.anims.play('turn');

    bgTrack.stop();

    this.scene.start("Outside");
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
=======
>>>>>>> 8a4e30def285c5cacc3211b9afacc716b39ea1b0



