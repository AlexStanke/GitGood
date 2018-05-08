var game = new Phaser.Game(1000,700,Phaser.AUTO);
var guardVel=90;
var coinsCollected=0;
var coinText;
var Mainmenu = function(game){};
Mainmenu.prototype ={
	preload:function(){
		console.log('Mainmenu: preload');
		game.load.image('Menu', 'assets/img/Menu.png');
	},
	create:function(){
		console.log('Mainmenu: create');
		game.add.image(0,0, 'Menu');
	},
	update:function(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('PlayGround');
		}
	}
}
var PlayGround = function(game){};
PlayGround.prototype={
	preload:function(){
		console.log('PlayGround: preload');
		game.load.image('BackGround', 'assets/img/GameBack.png');
		//loading walls
		game.load.image('Wall', 'assets/img/Wall.png');
		game.load.image('GWall', 'assets/img/GreenWall.png');
		game.load.image('PWall', 'assets/img/PinkWall.png');
		//loading player
		game.load.image('Player', 'assets/img/Player.png');
		//loading Coins
		game.load.image('Coin', 'assets/img/Coin.png');
		//loading Guards
		game.load.image('Guard', 'assets/img/Enemy.png');
	},
	create:function(){
		console.log('PlayGround: create');
		//Start arcade physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//adding background and immovable black walls
		game.add.image(0,0, 'BackGround');
		
		walls = game.add.group();
		walls.enableBody = true;
		BlackWall = walls.create(0, 180, 'Wall');
		BlackWall.scale.setTo(45,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(0, game.height-188, 'Wall');
		BlackWall.scale.setTo(45,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(440, 180, 'Wall');
		BlackWall.scale.setTo(45,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(440, game.height-188, 'Wall');
		BlackWall.scale.setTo(45,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(64, 240, 'Wall');
		BlackWall.scale.setTo(1,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(64, 360, 'Wall');
		BlackWall.scale.setTo(1,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(625, 240, 'Wall');
		BlackWall.scale.setTo(1,1);
		BlackWall.body.immovable = true;
		BlackWall = walls.create(625, 360, 'Wall');
		BlackWall.scale.setTo(1,1);
		BlackWall.body.immovable = true;
		//adding moveable walls
		//adding green walls
		Gwalls = game.add.group();
		Gwalls.enableBody = true;
		GreenWall = Gwalls.create(360, 180, 'GWall');
		GreenWall.scale.setTo(10,1);
		GreenWall.body.collideWorldBounds = true;
		GreenWall.body.drag.set(175);
		GreenWall = Gwalls.create(360, game.height-188, 'GWall');
		GreenWall.scale.setTo(10,1);
		GreenWall.body.collideWorldBounds = true;
		GreenWall.body.drag.set(175);
		//adding pink walls
		Pwalls = game.add.group();
		Pwalls.enableBody = true;
		PinkWall = Pwalls.create(300, 240, 'PWall');
		PinkWall.scale.setTo(1,16);
		PinkWall.body.collideWorldBounds=true;
		
		//adding coins
		Coins = game.add.group();
		Coins.enableBody=true;
		coinsCollected=0;
		for(var i =0; i<5; i++){
			var Coin = Coins.create(Math.random()*800,Math.random()*600, 'Coin');
		}
		
		//adding player character
		player = game.add.sprite(32, 300, 'Player');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5,0.5);
		
		//adding guards
		Guards = game.add.group();
		Guards.enableBody = true;
		guard = Guards.create(100, 75, 'Guard');
		game.physics.arcade.enable(guard);
		guard.body.collideWorldBounds = true;

		coinText=game.add.text(16,16,'', {fontSize: '16px', fill:'#000'});

		
		
	},
	update:function(){
		//collision
		//player collision
		var hitBlackWalls=game.physics.arcade.collide(player, walls);
		var hitGwalls=game.physics.arcade.collide(player, Gwalls);
		var hitPwalls=game.physics.arcade.collide(player, Pwalls);
		var hitCoins=game.physics.arcade.overlap(player, Coins, collectCoin, null, this);
		//guard collision
		var GhitWalls=game.physics.arcade.collide(guard, walls);
		var GhitPlayer=game.physics.arcade.collide(guard, player);
		var GhitGwalls=game.physics.arcade.collide(guard, Gwalls);
		var GhitPwalls=game.physics.arcade.collide(guard, Pwalls);
		//green wall collision
		var GwallHitWalls=game.physics.arcade.collide(Gwalls, walls);
		var GwallHitGwall=game.physics.arcade.collide(Gwalls, Gwalls);
		//pink wall collision
		var PwallHitWalls=game.physics.arcade.collide(Pwalls, walls);
		var PwallhitPwall=game.physics.arcade.collide(Pwalls, Pwalls);
		//color wall collisions
		var PwallHitGwall=game.physics.arcade.collide(Pwalls, Gwalls);
		//coin collisions
		
		
		// guard "AI"
		guard.body.velocity.x=guardVel;
		guard.body.velocity.y=0;
		if(guard.x>700-guard.width){
			guardVel= -90;
		}
		if(guard.x<100){
			guardVel= 90;
		}
		
		//player controls
		cursors = game.input.keyboard.createCursorKeys();
		player.body.velocity.x=0;
		player.body.velocity.y=0;
		if(cursors.left.isDown){
			player.body.velocity.x= -125;
		}
		if(cursors.right.isDown){
			player.body.velocity.x= 125;
		}
		if(cursors.up.isDown){
			player.body.velocity.y= -125;
		}
		if(cursors.down.isDown){
			player.body.velocity.y= 125;
		}

		//debug info
		if(game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
		}
		game.debug.text();
		coinText.text="coins: "+coinsCollected;
		//game over condition
		if(player.body.touching && GhitPlayer){
			game.state.start('GameOver');
		}
		//collecting coins
		function collectCoin(player, Coin){
			Coin.kill();
			coinsCollected+=1;
		}
	}
}
var GameOver = function(game){};
GameOver.prototype={
	preload:function(){
		console.log('GameOver: preload');
		game.load.image('GameOver', 'assets/img/GameOver.png');
	},
	create:function(){
		console.log('GameOver: create');
		game.add.image(0,0, 'GameOver');

	},
	update:function(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Mainmenu');
		}
	}
}
game.state.add('Mainmenu', Mainmenu);
game.state.add('PlayGround', PlayGround);
game.state.add('GameOver', GameOver);
game.state.start('Mainmenu');