class Sprite {
	constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
		this.position = position;
		this.width = 50;
		this.height = 90;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 7; //may have to change
		this.offset = offset;
	}

	draw() {
		c.drawImage(
				this.image,
				this.framesCurrent * (this.image.width / this.framesMax),
				0,
				this.image.width / this.framesMax,
				this.image.height,
				this.position.x - this.offset.x,
				this.position.y - this.offset.y, 
				(this.image.width / this.framesMax) * this.scale,
				this.image.height * this.scale
				)
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}

	}

	update() {
		this.draw();
		this.animateFrames();
	}
}



class Fighter extends Sprite {
	constructor({
		position,
		velocity,
		color = 'red',
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = {
			offset: {},
			width: undefined,
			height: undefined
		}
	})  {
			super({
				position,
				imageSrc,
				scale,
				framesMax,
				offset
			}) 
			this.velocity = velocity;
			this.width = 50; //may change
			this.height = 90;
			this.lastKey
			this.attackBox = {
				position: {
					x: this.position.x,
					y: this.position.y
				},
				offset: attackBox.offset,
				width: attackBox.width,
				height: attackBox.height
			}
			this.color = color;
			this.isAttacking;
			this.health = 100;
			this.framesCurrent = 0;
			this.framesElapsed = 0;
			this.framesHold = 7; //may chnage
			this.sprites = sprites;
			this.dead = false;

			for (const sprite in this.sprites) {
				sprites[sprite].image = new Image();
				sprites[sprite].image.src = sprites[sprite].imageSrc;
			}

	}

	update() {
		this.draw();
		if (!this.dead) {
			this.animateFrames();
			}

		//attackBox
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

			// c.fillRect(   //uncomment after fix attackBox positions
			// this.attackBox.position.x, 
			// this.attackBox.position.y, 
			// this.attackBox.width, 
			// this.attackBox.height)

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		//gravity function - prevent falling off screen
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
			this.velocity.y = 0;
			this.position.y = 400;   //may have to change based on character size and background
		} else {
			this.velocity.y += gravity;
		}
	}

	attack() {
		this.switchSprite('attack');
		this.isAttacking = true;
	}

	hurt() {
		this.health -= 20;

		if (this.health <= 0) {
			this.switchSprite('death');
		} else {
			this.switchSprite('hurt');
		}
	}

	switchSprite(sprite) {
		//if player died
		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1)
				this.dead = true;
				return;
			}
		//override all other animations when attacking
		if (this.image === this.sprites.attack.image &&
			this.framesCurrent < this.sprites.attack.framesMax -1)
			return;

		//override all other animations when hurt
		if (this.image === this.sprites.hurt.image &&
			this.framesCurrent < this.sprites.hurt.framesMax -1)
			return;

		switch (sprite) {
			case 'idle':
			if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'run':
			if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'jump':
			if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'attack':
			if (this.image !== this.sprites.attack.image) {
					this.image = this.sprites.attack.image;
					this.framesMax = this.sprites.attack.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'hurt':
			if (this.image !== this.sprites.hurt.image) {
					this.image = this.sprites.hurt.image;
					this.framesMax = this.sprites.hurt.framesMax;
					this.framesCurrent = 0;
				}
			break;
			case 'death':
			if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0;
				}
			break;

		}

	}
}