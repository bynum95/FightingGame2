const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './PNG/game_background_2.png'
})


const player = new Fighter({
	position: {
		x: 400, 
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './PNG/Knight/Idle2.png',
	framesMax: 12,
	scale: 1.5,      //may have to change
	offset: {         //may have to change
		x: 256,
		y: 200
	},
	sprites: {
		idle: {
			imageSrc: './PNG/Knight/Idle2.png',
			framesMax: 12
		},
		run: {
			imageSrc: './PNG/Knight/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './PNG/Knight/Jump.png',
			framesMax: 7
		},
		attack: {
			imageSrc: './PNG/Knight/AttackExtra.png',
			framesMax: 8
		},
		hurt: {
			imageSrc: './PNG/Knight/Hurt.png',
			framesMax: 4
		},
		death: {
			imageSrc: './PNG/Knight/Death.png',
			framesMax: 10
		}
	},
	attackBox: {
		offset: {
			x: -170,
			y: -120
		},
		width: 60,
		height: 80
	}
})



const enemy = new Fighter({
	position: {
		x: 860,     //may have to change
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset: {
		x: 50,			//may have to change
		y: 0
	},
	imageSrc: './PNG/Rogue/Idle.png',
	framesMax: 10,
	scale: 1.5,      //may have to change
	offset: {         //may have to change
		x: 256,
		y: 200
	},
	sprites: {
		idle: {
			imageSrc: './PNG/Rogue/Idle.png',
			framesMax: 10
		},
		run: {
			imageSrc: './PNG/Rogue/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './PNG/Rogue/Jump.png',
			framesMax: 7
		},
		attack: {
			imageSrc: './PNG/Rogue/Attack.png',
			framesMax: 7
		},
		hurt: {
			imageSrc: './PNG/Rogue/Hurt.png',
			framesMax: 4
		},
		death: {
			imageSrc: './PNG/Rogue/Death.png',
			framesMax: 10
		}
	},
	attackBox: {
		offset: {			//may have to change
			x: -180,
			y: -120
		},
		width: 20,
		height: 80
	}
})


//draw players
enemy.draw();

console.log(player);

//game keys
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}

}

decreaseTimer();

//animate frames and background
function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.10)' //white overlay with opacity of 0.1 --> contrast players from background
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	//player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	//jumping
	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	}

	//enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}
	//enemy jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump'); //when sprite is jumping
	} 
		//detect for collision & enemy gets hit
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking && player.framesCurrent === 5) //health subtracted at frame for sword attack
		{
		enemy.hurt();
		player.isAttacking = false; //so player only attacks once 
		// document.querySelector('#enemyHealth').style.width = enemy.health + '%'; //selected enemyHealth id from .html file and decrease health bar when hit
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
		}

	//if player misses
	if (player.isAttacking && player.framesCurrent === 5) {
		player.isAttacking = false;
	}

	//if player gets hit
	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) &&
		enemy.isAttacking && (enemy.framesCurrent === 2 || enemy.framesCurrent === 5)) 
		{
		player.hurt();
		enemy.isAttacking = false; //so player only attacks once 
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
		}

	//if enemy misses
	if (enemy.isAttacking && (enemy.framesCurrent === 2 || enemy.framesCurrent === 5)) {
		enemy.isAttacking = false;
	}

		//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
	}

}

animate();


//event listener for keys and movement

window.addEventListener('keydown', (event) => {
	if (!player.dead) {
	switch (event.key) {
		case 'd':
			keys.d.pressed = true; //when hold down the key, the play moves in the x axis to the right
			player.lastKey = 'd';
			break;
		case 'a':
			keys.a.pressed = true; //when hold down the key, the play moves in the x axis to the left
			player.lastKey = 'a';
			break;
		case 'w':
			player.velocity.y = -20;
			break; 
		case ' ':
			player.attack(); //only attack when player hits spacebar
			break;
		}
	}
	if (!enemy.dead) {
	switch (event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = true; //when hold down the key, the play moves in the x axis to the right
			enemy.lastKey = 'ArrowRight';
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true; //when hold down the key, the play moves in the x axis to the left
			enemy.lastKey = 'ArrowLeft';
			break;
		case 'ArrowUp':
			enemy.velocity.y = -20;
			break; 
		case 'ArrowDown':
			enemy.attack();
			break; 
		}
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'a':
			keys.a.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'w':
			keys.w.pressed = false; //when you stop holding down key, player stops moving
			break;
	}	
	//enemy keys
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'w':
			keys.w.pressed = false; //when you stop holding down key, player stops moving
			break;
	}	
})