var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

window.onload = function () {
	var game_width = isMobile ? window.innerWidth : 450; // 500
	var game_height = isMobile ? window.innerHeight :  640; //600
  console.log('isMobile', isMobile)
	var game = new Phaser.Game(game_width, game_height, Phaser.AUTO, 'phaser-game', { preload, create, update },{transparent: true} ),
		playerBet,
		playerBetInitPosY = game_height - 45,
		computerBet,
		computerBetInitPosY = 40,
		computerBetSpeed = 250,
		ball,
		ballSpeed = isMobile ? 500 : 400,
		ballReleased = false;

	function releaseBall() {
		if (!ballReleased) {
			ball.body.velocity.x = ballSpeed;
			ball.body.velocity.y = ballSpeed;

			ballReleased = true;
		}
	}

	function createBet(x, y, betname) {
		var group = game.add.group(); //
		var bet = group.game.add.sprite(x, y, betname);
		bet.anchor.setTo(0.5, 0.5);
		group.game.physics.arcade.enable(bet);
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
		var group = game.add.group(); //
		// group.game.load.image('background', 'assets/bg.png', 0.05, 0.01);
		group.game.load.image('bet', 'assets/player_racket.png');
		group.game.load.image('compbet', 'assets/racket.png');
		group.game.load.image('ball', 'assets/ball.png');

	}

	function create() {
		var group = game.add.group(); //
		// game.bg = game.add.image(0, 0, 'background');
		playerBet = createBet(game.world.centerX, playerBetInitPosY, 'bet');
		computerBet = createBet(game.world.centerX, computerBetInitPosY, 'compbet');

		ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
		ball.anchor.setTo(0.5, 0.5);
		group.game.physics.arcade.enable(ball);
		ball.body.collideWorldBounds = true;
		ball.body.bounce.setTo(1, 1);

		game.input.onDown.add(releaseBall, this);
	}

	function update() {
		var group = game.add.group(); //
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
		game.physics.arcade.collide(ball, playerBet, ballHitsBet, null, this);
		game.physics.arcade.collide(ball, computerBet, ballHitsBet, null, this);

		checkGoal();
	}
};
