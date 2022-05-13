var globalVol = 0.2;
var spacebar;

// state to display instructions and a play button
var Story = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, { "key": "Story" });
  },
  init: function() {},
  preload:function(){
    this.load.image("demo_instruct","demo_instruct.png");//800x600
    this.load.image("dot","vol_slider_knob.png"); //20x20
    this.load.image("up2","sig2_bigup.png"); //16x27
    this.load.audio("song","story song.mp3");
    //this.load.audio("track1","walkingwithswagger.mp3")
    // //this.load.image("chest","chest.png");//16x13
    // //this.load.image("ladder","ladder.png");//16x48
    // this.load.spritesheet("king", "dude.png", { frameWidth: 17, frameHeight: 23 });
  },
  create:function(){

    bgTrack = this.sound.add("song", .2);
    bgTrack.play();
    //this.add.image(500,420,"up2");
    this.add.text(20, 50, 'After you just broke into one of the \nmost secure companies in the world...',{ fontSize: '32px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" });
    this.add.text(20, 150, 'You try to steal a micro-chip capable of controlling people.\nHowever, it looks a bit odd... almost like a small jukebox.\nThe heist was going well until...\nweirdly timed music starts playing.\nAll of a sudden, a bunch of obstacles appear and enemies \nstart to attack.\nIt seems like your only way to escape is to jump and fight \nbut based on the music...',{ fontSize: '20px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" });
    //this.add.image(400,300,"demo_instruct"); //800x600
    //var volKnob = this.add.sprite(600,324,"dot");
    //volKnob.inputEnabled = true;
    //volKnob.input.enableDrag(true);
    //var bgTrack = this.sound.add("track1",{volume: globalVol});
    this.add.text(150, 500, 'Press spacebar to begin!',{ fontSize: '32px', fill: '#FFF',boundsAlignH: "center", boundsAlignV: "middle" });
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  },
  update:function(){
    if (Phaser.Input.Keyboard.JustDown(spacebar))
    {
        bgTrack.stop();
        this.scene.start('SceneOne');
        //bgTrack.stop();
    }
  
  }
  
});

//https://phaser.io/examples/v3/view/audio/html5-audio/basic-playback-and-events
//https://phaser.io/examples/v2/input/drag
//https://phaser.discourse.group/t/audio-management/5235/2
//https://stackoverflow.com/questions/51601926/how-to-set-volume-in-phaser-3
//https://newdocs.phaser.io/docs/3.55.2/Phaser.Sound.Events.LOOP
//https://phaser.io/examples/v3/view/audio/web-audio/play-sound-on-keypress
// if (score == 120) {
//   console.log(this.scene.get('SceneTwo'));
//   this.scene.start("SceneTwo");
// }