var game = new Phaser.Game(1200,600,Phaser.AUTO);
var score = 0;
var scoreText;
var highScore = 0;
var Mainmenu = function(game){};
Mainmenu.prototype ={
	preload:function(){
		//loads images and audio
		console.log('Mainmenu: preload');
		game.load.atlas('key', 'assets/img/atlas.png', 'assets/img/atlas.json');
		game.load.audio('song', 'assets/audio/music.mp3');
		game.load.audio('bork', 'assets/audio/bork.mp3');
		game.load.audio('ded', 'assets/audio/ded.mp3');
	},
	create:function(){
		//creates menu and music
		console.log('Mainmenu: create');
		game.add.tileSprite(0,0,1200,600,'key','clouds');
		scoreText=game.add.text(350,250,'Run Puggy!');
		game.add.text(275,500,'Press SpaceBar To Start');
		Song=game.add.audio('song');
		Song.play();
		Song.loop = true;
		Bork=game.add.audio('bork');
		Ded=game.add.audio('ded');
	},
	update:function(){
		//waits for game to start
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('GamePlay');
		}
	}
}
var GamePlay = function(game){};
GamePlay.prototype={
	preload:function(){
		//loads images and hitbox for points
		console.log('GamePlay: preload');
		game.load.atlas('key', 'assets/img/atlas.png', 'assets/img/atlas.json');
		game.load.image('hitB', 'assets/img/hitBox.png');
		
	},
	create:function(){
		console.log('PlayGround: create');
		//Start arcade physics
		
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//creates background
		clouds=game.add.tileSprite(0,0,1200,600,'key','clouds');
		build1=game.add.tileSprite(0,0,1200,600,'key','Buildings2');
		build2=game.add.tileSprite(0,0,1200,600,'key','Buildings1');
		sidewalk=game.add.tileSprite(0,game.height-20,1200,20,'key','sidewalk');
		
		//makes ground 
		game.physics.arcade.enable(sidewalk);
		sidewalk.body.immovable=true;
		
		//adds obsitcals and hit boxes for points
		hydrants = game.add.group();
		hydrants.enableBody=true;
		hitBs = game.add.group();
		hitBs.enableBody=true;
		
		//display score
		scoreText=game.add.text(32,32,'Score: 0');

		//adding player character and animations
		player = game.add.sprite(32, 300, 'key', 'Run2');
		player.animations.add('running', Phaser.Animation.generateFrameNames('Run',1,3),15, true);
		player.animations.add('jump', Phaser.Animation.generateFrameNames('Jump',1,2),0,false);
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.body.gravity.y=400;
		player.body.setSize(50,40,20,50);

		//i gets bigger and bigger to make world go faster
		i =0.00;
		score=0;
	},
	update:function(){
		//collision checks for creation and player points/death
	var hitGround=game.physics.arcade.collide(player, sidewalk);
	game.physics.arcade.overlap(hydrants, hydrants, killHydrant, null, this);
	game.physics.arcade.overlap(hitBs, hitBs, killBs, null, this);
	game.physics.arcade.overlap(player, hydrants, ded, null, this);
	game.physics.arcade.overlap(player, hitBs, point, null, this);
	
		i+=0.0005;
		//j is the negative x coord speed for player and hydrants
		j= -175-(i*60);
		//background scrolling
		clouds.tilePosition.x-=.5+i;
		build1.tilePosition.x-=1+i;
		build2.tilePosition.x-=2+i;
		sidewalk.tilePosition.x-=3+i;
		//player controls
		cursors = game.input.keyboard.createCursorKeys();

		player.body.velocity.x=0;
		if(cursors.right.isDown){
			player.body.velocity.x= 175;
			player.animations.play('running');
		}else{
			player.body.velocity.x= j;
			player.animations.stop();
			player.frame=1;
		}
		if(cursors.up.isDown && player.body.touching.down && hitGround){
			player.body.velocity.y = -350;
		}
		if(player.body.velocity.y<0){
			player.frame=3;
		}
		if(player.body.velocity.y>0){
			player.frame=10;
		}
		//spawn in hydrants
		if((Math.random()*1000)>990){
			hydrant=hydrants.create(1300,game.height-20-96,'key','Hydrant');
			hydrant.body.velocity.x=j;
			hydrant.body.setSize(40,70,40,26);
			hitB=hitBs.create(1300,0,'hitB');
			hitB.body.velocity.x=j;
			hitB.body.setSize(40,game.height,50,0);
		}
		//give player a point for jumping over hydrant
		function point(player, HitB){
			HitB.kill();
			score+=1;
			console.log('point');
			scoreText.text = 'Score: '+score;
			Bork.play();
		}
		//kill player change state
		function ded(player, hydrant){
			Ded.play();
			game.state.start('GameOver');
		}
		//if hydrants are too close kill them
		function killHydrant(one, two){
			two.kill();
		}
		//same with point hitboxes
		function killBs(one, two){
			two.kill();
		}
	}
}
var GameOver = function(game){};
GameOver.prototype={
	preload:function(){
		console.log('GameOver: preload');
		//load imgs
		game.load.atlas('key', 'assets/img/atlas.png', 'assets/img/atlas.json');
	},
	create:function(){
		//create game over score with scores
		console.log('GameOver: create');
		game.add.tileSprite(0,0,1200,600,'key','clouds');
		scoreText=game.add.text(350,250,'Score: ');
		if(score>highScore){
			highScore=score;
		}
		game.add.text(275,500,'Press SpaceBar To Try Again');

	},
	update:function(){
		//start game over again
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('GamePlay');
		}
		scoreText.text='Final Score: '+(score-1)+' \nHighScore: '+(highScore-1);
	}
}
game.state.add('Mainmenu', Mainmenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('Mainmenu');