let cardsSymbols = ['bell', 'bell', 'lemon', 'lemon', 'life-ring', 'life-ring', 'moon', 'moon', 'sun', 'sun', 'user', 'user', 'save', 'save', 'gem', 'gem'],
	opened = [],
	match = 0,
	moves = 0,
	$deck = $('.deck'),
	$scorePanel = $('.score-panel'),
	$moveNum = $('.moves'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	delay = 400,
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	totalCard = cardsSymbols.length / 2,
	rank3stars = 10,
	rank2stars = 16,
	rank1stars = 20;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Initial Game
function startGame() {
	var cards = shuffle(cardsSymbols);
	$deck.empty();
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="far fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();

	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	initTime();
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Set Rating and final Score
function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// SweetAlert2 (https://github.com/sweetalert2/sweetalert2)

// Timer

var simpleTimer = 5;

var interval = setInterval(function() {
    simpleTimer--;
    $('.timer').text(simpleTimer);
    if (simpleTimer === 0) clearInterval(interval);
}, 1000);

// End Game
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		html: '<span>With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.<br>Woooooo!</span>',
		type: 'success',
		position: 'center',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then((result) => {
		if (result.value) {
			swal({
				title: 'New Game',
				type: 'success',
				text: 'Your game will start in 3 seconds.',
				showConfirmButton: false,
				timer: 3000
			})
			setTimeout(startGame, 3000);
		}
	})
}

// Restart Game
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure?',
		text: "Your progress will be Lost!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Restart Game!'
	}).then((result) => {
		if (result.value) {
			swal({
				title: 'Restarted',
				type: 'success',
				text: 'Your game will start in 3 seconds.',
				showConfirmButton: false,
				timer: 3000
			})
			setTimeout(startGame, 3000);
		}
	})
});

// Thanks Benjamin Cunningham for the great explanation at Medium (https://medium.com/letsboot/memory-game-built-with-jquery-ec6099618d67)
var addCardListener = function () {

	// Card flip
	$deck.find('.card').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

		// Compare with opened card
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
		}

		// End Game if match all cards
		if (totalCard === match) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};


function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

startGame();