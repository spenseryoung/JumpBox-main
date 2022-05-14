var spacebar;
var score;
var CompletedLevelOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    
    function CompletedLevelOne() {
        Phaser.Scene.call(this, { "key": "CompletedLevelOne" });
    },
    init: function (data)
    {
        console.log('init', data);
        this.score = data.id;
        
    },
    preload: function() {
        this.load.audio("song2","completed.mp3");
    },
    create: function() {
        bgTrack = this.sound.add("song2", .2);
        bgTrack.play();


        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.add.text(20, 250, "Congrats! or so you thought...\nAs you open the door, there's another long hallway...\nPress SPACEBAR to start level 2!",{ fontSize: '20px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" });

    },
    update: function() {
        if (Phaser.Input.Keyboard.JustDown(spacebar))
        {
            bgTrack.stop();
            this.scene.start('SceneTwo', {id: this.score});
        }
    }
});