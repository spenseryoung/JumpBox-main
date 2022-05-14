var spacebar;
var CompletedLevelTwo = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "CompletedLevelTwo" });
    },
    init: function(data) {
        console.log('init', data);
        this.score = data.id;
    },
    preload: function() {
        this.load.audio("song4","electro-rock.mp3");
    },
    create: function() {
        bgTrack = this.sound.add("song4", .2);
        bgTrack.play();


        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(75, 200, "Game Score: " + this.score + " out of 162", { fontSize: '20px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" })
        this.add.text(75, 275, "Congrats! You successfully stole the jukebox!\nThe micro-chip is now yours...\nand you have saved the world!\nThanks for playing!\n\nProducer: Paul Toprac\nAssistant Producer: Abhishek Sharma\nCo-Developers: Kyle Feliciano and Spenser Young\n\nPress SPACEBAR to play again!",{ fontSize: '20px', fill: '#FFF', boundsAlignH: "center", boundsAlignV: "middle" });

    },
    update: function() {
        if (Phaser.Input.Keyboard.JustDown(spacebar))
        {
            bgTrack.stop();
            this.scene.start('TitleScreen');
        }
    }
});