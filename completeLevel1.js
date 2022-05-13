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
        this.load.audio("song","story song.mp3");
    },
    create: function() {
        bgTrack = this.sound.add("song", .2);
        bgTrack.play();

        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var text = this.add.text(
            400, 
            360, 
            this.message, 
            {
                fontSize: 25,
                color: "#FFFFFF",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);
    },
    update: function() {
        if (Phaser.Input.Keyboard.JustDown(spacebar))
        {
            bgTrack.stop();
            this.scene.start('SceneTwo');
        }
    }
});