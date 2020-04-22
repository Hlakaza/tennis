      
   var game_width = 450;  // 500		
   var game_height = 536;	 //600	
    
    var game = new Phaser.Game(game_width, game_height, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update }),
				playerBet,
				playerBetInitPosY = game_height - 85, 
				computerBet,
				computerBetInitPosY = 40,
				computerBetSpeed = 250,
				ball,
				ballSpeed = 300,
				ballReleased = false;

			function releaseBall() {
				if (!ballReleased) {
					ball.body.velocity.x = ballSpeed;
					ball.body.velocity.y = ballSpeed;

					ballReleased = true;
				}
			}

			function createBet(x, y, bet) {
				var bet = game.add.sprite(x, y, bet);
				bet.anchor.setTo(0.5, 0.5);
				bet.body.collideWorldBounds = true;
				bet.body.bounce.setTo(0, 0);
				bet.body.immovable = true;

				return bet;
			}

			function ballHitsBet(_ball, _bet) {
				var diff = 0;

				if (_ball.x < _bet.x) {
					//  ball on the left side of bet
					diff = _bet.x - _ball.x;
					_ball.body.velocity.x = -10 * diff;
				} else if (_ball.x > _bet.x) {
					//  ball on the right side of bet
					diff = _ball.x - _bet.x;
					_ball.body.velocity.x = 10 * diff;
				} else {
					//  ball on the center of bet. Adding some random velocity
					_ball.body.velocity.x = 2 + Math.random() * 8;
				}
			}

			function checkGoal() {
				if (ball.y < computerBetInitPosY - 15) {
					setBall();
				} else if (ball.y > playerBetInitPosY + 15) {
					setBall();
				}
			}

			function setBall() {
				if (ballReleased) {
					ball.x = game.world.centerX;
					ball.y = game.world.centerY;
					ball.body.velocity.x = 0;
					ball.body.velocity.y = 0;

					ballReleased = false;
				}
			}

			function preload() {
				game.load.image('background', 'assets/bg.png');
				game.load.image('bet', 'assets/player_racket.png');
				game.load.image('compbet', 'assets/racket.png');
				game.load.image('ball', 'assets/ball.png');
			}

			function create() {
        game.bg = game.add.sprite(0, 0, 'background')
				playerBet = createBet(game.world.centerX, playerBetInitPosY, 'bet');
				computerBet = createBet(game.world.centerX, computerBetInitPosY, 'compbet');

				ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
				ball.anchor.setTo(0.5, 0.5);
				ball.body.collideWorldBounds = true;
				ball.body.bounce.setTo(1, 1);

				game.input.onDown.add(releaseBall, this);
			}

			function update() {
				//Manage player bet
				playerBet.x = game.input.x;

				var playerBetHalfWidth = playerBet.width / 2;

				if (playerBet.x < playerBetHalfWidth) {
					playerBet.x = playerBetHalfWidth;
				} else if (playerBet.x > game.width - playerBetHalfWidth) {
					playerBet.x = game.width - playerBetHalfWidth;
				}

				//Manahe computer bet
				if (computerBet.x - ball.x < -15) {
					computerBet.body.velocity.x = computerBetSpeed;
				} else if (computerBet.x - ball.x > 15) {
					computerBet.body.velocity.x = -computerBetSpeed;
				} else {
					computerBet.body.velocity.x = 0;
				}

				//Check collide ball and bets
				game.physics.collide(ball, playerBet, ballHitsBet, null, this);
				game.physics.collide(ball, computerBet, ballHitsBet, null, this);

				checkGoal();
			}