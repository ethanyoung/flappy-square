var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game-window');

var bird;
var pipes;

var mainState = {
	preload: function() {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('bird', 'assets/bird.png');
		game.load.image('pipe', 'assets/pipe.png')
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		bird = game.add.sprite(100, 245, 'bird');

		game.physics.enable(bird, Phaser.Physics.ARCADE)

		bird.body.gravity.y = 1000;

		pipes = game.add.group();
		pipes.enableBody = true;
		
		pipes.createMultiple(20, 'pipe');

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.timer = game.time.events.loop(1500, this.addPipes, this);
	},

	update: function() {
		if (bird.inWorld == false)
			this.restartGame();

		game.physics.arcade.overlap(bird, pipes, this.restartGame, null, this);
	},

	jump: function() {
		bird.body.velocity.y = -350;
	},

	restartGame: function () {
		game.time.events.remove(this.timer);
		game.state.start('main');
	},

	addPipe: function(x, y) {
		var pipe = pipes.getFirstDead();

		pipe.reset(x, y);

		pipe.body.velocity.x = -200;

		pipe.outOfBoundsKill = true;
	},

	addPipes: function(x, y) {
		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole + 1)
				this.addPipe(400, i * 60 + 10);
	}
};

game.state.add('main', mainState);
game.state.start('main')