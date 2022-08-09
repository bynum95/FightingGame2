function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
			rectangle2.attackBox.position.x && 
		rectangle1.attackBox.position.x <= 
			rectangle2.attackBox.position.x + rectangle2.attackBox.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
			rectangle2.attackBox.position.y && 
		rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.attackBox.height 
		)
}

function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex';
	if (player.health === enemy.health) {
			document.querySelector('#displayText').innerHTML = 'TIE';
		} else if (player.health > enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
		} else if (player.health < enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
		}
}

let timer = 60;
let timerId
function decreaseTimer() {
	
	if (timer > 0){
		timerId = setTimeout(decreaseTimer, 1000);
		timer --;
		document.querySelector('#timer').innerHTML = timer; //grabs the inner HTML text for the timer id
	}
	if (timer === 0) {
		determineWinner({ player, enemy, timerId })
	}
}