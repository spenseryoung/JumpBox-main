var spacebar;
var CompletedLevelOne = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "CompletedLevelOne" });
    },
    init: function(data) {
        this.message = data.message;
    },
    preload: function() {
        this.load.audio("song2","completed.mp3");
    },
    create: function() {
        bgTrack = this.sound.add("song2", .2);
        bgTrack.play();


        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.text(20, 250, "Congrats! or so you thought...\nAs you open the door, there's another long hallway...\nAnd a newsong plays...\nPress SPACEBAR to start level 2!",{ fontSize: '20px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" });

    },
    update: function() {
        if (Phaser.Input.Keyboard.JustDown(spacebar))
        {
            bgTrack.stop();
            this.scene.start('SceneTwo');
        }
    }
});