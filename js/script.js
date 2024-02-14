const Gameboard = (function () {
	const _emptyCell = "";
	const _rows = 3;
	const _columns = 3;
	const _board = [];

	//Create a 3X3 board
	for (let i = 0; i < _rows; i++) {
		_board[i] = [];
		for (let j = 0; j < _columns; j++) {
			_board[i].push(_emptyCell);
		}
	}

	const getBoard = () => _board;
	const getBoardSpec = () => {
		return { _rows, _columns, _emptyCell };
	};

	function resetBoard() {
		for (let i = 0; i < _rows; i++) {
			for (let j = 0; j < _columns; j++) {
				_board[i][j] = _emptyCell;
			}
		}
	}

	function placeMark(plyr, x, y) {
		if (x > _columns - 1 || y > _rows - 1 || _board[x][y] !== _emptyCell)
			return;
		if (!plyr.validPlayer) return;
		_board[x][y] = plyr.mark;
	}

	return { placeMark, getBoardSpec, getBoard, resetBoard };
})();

// Factory function (instantiation module) that uses prototypal inheritence
const Player = (function () {
	function create(values) {
		const instance = Object.create(this);
		return Object.assign(instance, values);
	}

	return { create };
})();

const renderArt = (function () {
	let _arts = {
		header: `
 ______                ______                     ______                  
/\\__  _\\__            /\\__  _\\                   /\\__  _\\                 
\\/_/\\ \\/\\_\\    ___    \\/_/\\ \\/    __      ___    \\/_/\\ \\/   ___      __   
   \\ \\ \\/\\ \\  /\'___\\     \\ \\ \\  /\'__\'\\   /\'___\\     \\ \\ \\  / __\'\\  /\'__\'\\ 
    \\ \\ \\ \\ \\/\\ \\__/      \\ \\ \\/\\ \\L\\.\\_/\\ \\__/      \\ \\ \\/\\ \\L\\ \\/\\  __/ 
     \\ \\_\\ \\_\\ \\____\\      \\ \\_\\ \\__/.\\_\\ \\____\\      \\ \\_\\ \\____/\\ \\____\\
      \\/_/\\/_/\\/____/       \\/_/\\/__/\\/_/\\/____/       \\/_/\\/___/  \\/____/

`,
		winner: `
            __                                 
 __  __  __/\\_\\    ___     ___      __   _ __  
/\\ \\/\\ \\/\\ \\/\\ \\ /\' _ \`\\ /\' _ \`\\  /\'__\`\\/\\\`\'__\\
\\ \\ \\_/ \\_/ \\ \\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\  __/\\ \\ \\/ 
 \\ \\___x___/\'\\ \\_\\ \\_\\ \\_\\ \\_\\ \\_\\ \\____\\\\ \\_\\ 
  \\/__//__/   \\/_/\\/_/\\/_/\\/_/\\/_/\\/____/ \\/_/ 
`,
		draw: `
 ____                                 
/\\  _\`\\                               
\\ \\ \\/\\ \\  _ __    __     __  __  __  
 \\ \\ \\ \\ \\/\\\`\'__\\/\'__\`\\  /\\ \\/\\ \\/\\ \\ 
  \\ \\ \\_\\ \\ \\ \\//\\ \\L\\.\\_\\ \\ \\_/ \\_/ \\
   \\ \\____/\\ \\_\\\\ \\__/.\\_\\\\ \\___x___/\'
    \\/___/  \\/_/ \\/__/\\/_/ \\/__//__/  
`,
		scores: `
  ____    ___    ___   _ __    __    ____  
 /\',__\\  /\'___\\ / __\`\\/\\\`\'__\\/\'__\`\\ /\',__\\ 
/\\__, \`\\/\\ \\__//\\ \\L\\ \\ \\ \\//\\  __//\\__, \`\\
\\/\\____/\\ \\____\\ \\____/\\ \\_\\\\ \\____\\/\\____/
 \\/___/  \\/____/\\/___/  \\/_/ \\/____/\\/___/ 
`,
	};
	console.log(_arts.header);

	const gameOver = (val) => {
		if (val) console.log(_arts.winner, val);
		else console.log(_arts.draw);
		console.log("\n\n\n\n");
		console.log(_arts.scores);
	};

	return { gameOver };
})();

const GameController = (function () {
	const { getBoardSpec, placeMark, getBoard, resetBoard } = Gameboard;
	const { _rows, _columns, _emptyCell } = getBoardSpec();

	const _players = [
		Player.create({ name: "vatsal", mark: "X", validPlayer: true }),
		Player.create({ name: "thanos", mark: "O", validPlayer: true }),
	];

	let _activePlayer = _players[0];
	let _winner = "";
	let _winningCombinations = {
		vertical: (column) => [`0-${column}`, `1-${column}`, `2-${column}`],
		horizontal: (row) => [`${row}-0`, `${row}-1`, `${row}-2`],
		diagonalLeft: () => ["0-0", "1-1", "2-2"],
		diagonalRight: () => ["0-2", "1-1", "2-0"],
		combo: [],
	};
	const _scores = {
		[_players[0].name]: 0,
		[_players[1].name]: 0,
		tie: 0,
	};

	const getActivePlayer = () => _activePlayer;
	const getWinningCombination = () => _winningCombinations.combo;
	const getScores = () => _scores;
	const getPlayers = () => _players;

	function _render() {
		console.table(getBoard());
	}

	function _checkGameStatus() {
		const _board = getBoard();

		// Win condition
		let rightDiagonal = 0;
		for (let i = 0; i < _rows; i++) {
			let vert = 0,
				horz = 0,
				leftDiagonal = 0;

			for (let j = 0; j < _columns; j++) {
				if (_board[i][j] === _activePlayer.mark) horz++;
				if (_board[j][i] === _activePlayer.mark) vert++;
				if (_board[j][j] === _activePlayer.mark) leftDiagonal++;
			}
			if (_board[i][_columns - 1 - i] === _activePlayer.mark) rightDiagonal++;

			if (leftDiagonal === 3)
				_winningCombinations.combo = _winningCombinations.diagonalLeft();
			else if (rightDiagonal === 3)
				_winningCombinations.combo = _winningCombinations.diagonalRight();
			else if (vert === 3)
				_winningCombinations.combo = _winningCombinations.vertical(i);
			else if (horz === 3)
				_winningCombinations.combo = _winningCombinations.horizontal(i);
			else continue;

			_winner = _activePlayer.name;
			return 1;
		}
		// Draw Condition
		let _draw = true;
		outerLoop: for (let i = 0; i < _rows; i++) {
			for (let j = 0; j < _columns; j++) {
				if (_board[i][j] === _emptyCell) {
					_draw = false;
					break outerLoop;
				}
			}
		}
		if (_draw) return 2;
		return 0;
	}

	const _switchPlayer = () =>
		_activePlayer === _players[0]
			? (_activePlayer = _players[1])
			: (_activePlayer = _players[0]);

	function _gameOver(outcome) {
		outcome === 1 ? _scores[_winner]++ : _scores["tie"]++;
		outcome === 2 ? renderArt.gameOver(false) : renderArt.gameOver(true);
		renderArt.gameOver(_winner);
		console.table(_scores);
		resetBoard();
	}

	function playRound(x, y) {
		placeMark(_activePlayer, x, y);
		_render();
		const result = _checkGameStatus();
		result ? _gameOver(result) : _switchPlayer();
		return result;
	}

	return {
		playRound,
		getActivePlayer,
		getScores,
		getPlayers,
		getWinningCombination,
	};
})();

const ScreenController = (function () {
	const { getBoardSpec, getBoard } = Gameboard;
	const {
		playRound,
		getActivePlayer,
		getScores,
		getPlayers,
		getWinningCombination,
	} = GameController;
	const { _rows, _columns, _emptyCell } = getBoardSpec();
	const _players = getPlayers();

	const _boardContainer = document.querySelector("#board-container");
	const _scoreBoard = document.querySelector("#score-board");

	const _animationDelay = 150;
	const _animationCount = 5;
	const _gameState = {
		active: true,
		ended: false,
	};

	//Create board
	for (let i = 0; i < _rows; i++) {
		for (let j = 0; j < _columns; j++) {
			const btn = document.createElement("button");
			const span = document.createElement("span");
			btn.appendChild(span);
			span.setAttribute("data-pos", `${i}-${j}`);
			_boardContainer.appendChild(btn);
		}
	}

	//Create Score Board
	for (let i = 0; i < 4; i++) {
		let idVal = "",
			spanOne = "",
			spanTwo = "0";
		switch (i) {
			case 0:
				idVal = _players[0].name;
				spanOne = `${idVal}(${_players[0].mark})`;
				break;
			case 1:
				idVal = "tie";
				spanOne = "tie";
				break;
			case 2:
				idVal = _players[1].name;
				spanOne = `${idVal}(${_players[1].mark})`;
				break;
			case 3:
				idVal = "mode";
				spanTwo = "2P";
				break;
		}

		const div = document.createElement("div");
		const spanFirst = document.createElement("span");
		const spanSecond = document.createElement("span");
		div.setAttribute("id", idVal);
		spanFirst.textContent = spanOne;
		spanSecond.textContent = spanTwo;
		if (idVal === "mode") {
			const button = document.createElement("button");
			div.appendChild(button);
			div.appendChild(spanSecond);
		} else {
			div.appendChild(spanFirst);
			div.appendChild(spanSecond);
		}

		_scoreBoard.appendChild(div);
	}

	const _scoreBoardVal = document.querySelectorAll(
		"#score-board > :not(#mode) > span:nth-child(2)",
	);
	const _scoreBoardChild = document.querySelectorAll("#score-board>*");
	const _btns = _boardContainer.querySelectorAll("button>span");

	const _soundEffects = {
		placeMark: new Audio("sound-effects/place-mark.mp3"),
		draw: new Audio("sound-effects/game-start.mp3"),
		victory: new Audio("sound-effects/success-fanfare-trumpets.mp3"),
		playSound: function (sound) {
			this[sound].currentTime = 0;
			this[sound].play();
		},
		stopSound: function () {
			for (let sound in this) {
				if (typeof this[sound] === "function") return;
				if (!this.hasOwnProperty(sound)) return;

				this[sound].pause();
			}
		},
	};

	const _animationEffects = {
		blinkBoard: function (count) {
			if (count < 0 && _boardContainer.style.backgroundColor === "white")
				return;
			_boardContainer.style.backgroundColor =
				_boardContainer.style.backgroundColor === "white"
					? "transparent"
					: "white";
			setTimeout(this.blinkBoard.bind(this), _animationDelay, --count);
		},
		addAppear: function (element) {
			element.classList.add("appear");
		},
		removeAppear: function (element) {
			element.classList.remove("appear");
		},
		winElements: [],
		victory: function (count) {
			if (count < 0 && this.winElements[0].style.color === "white") return;

			this.winElements.forEach(
				(element) =>
					(element.style.color =
						element.style.color === "white" || element.style.color === ""
							? "transparent"
							: "white"),
			);
			setTimeout(this.victory.bind(this), _animationDelay, --count);
		},
	};

	const _changeGameState = (state) => {
		_gameState.active = state === "active";
		_gameState.ended = state === "ended";
	};

	const _resetGame = () => {
		_btns.forEach((btn) => {
			_animationEffects.removeAppear(btn);
			btn.textContent = "";
			btn.style.opacity = "1";
		});
		_changeGameState("active");
		_highlightActivePlayer();
		_soundEffects.stopSound();
	};

	const _updateScreen = (e) => {
		e.target.textContent = getActivePlayer().mark;
		_animationEffects.addAppear(e.target);
	};

	const _updateScores = () => {
		const scores = getScores();
		_scoreBoardVal[0].textContent = scores.vatsal;
		_scoreBoardVal[1].textContent = scores.tie;
		_scoreBoardVal[2].textContent = scores.thanos;
	};

	const _triggerDrawActions = () => {
		_btns.forEach((btn) => (btn.style.opacity = "0.5"));
		_animationEffects.blinkBoard(_animationCount);
		_soundEffects.playSound("draw");
	};

	const _highlightVictory = () => {
		const combo = getWinningCombination();
		const btns = [..._btns];
		const winButton = btns.filter((btn) => {
			if (combo.includes(btn.getAttribute("data-pos"))) return true;
			else btn.style.opacity = 0.4;
		});
		_animationEffects.winElements = winButton;
		setTimeout(
			_animationEffects.victory.bind(_animationEffects),
			280,
			_animationCount,
		);
		_soundEffects.playSound("victory");
	};

	const _highlightActivePlayer = () => {
		_scoreBoardChild.forEach((child) => {
			if (child.getAttribute("id") === "mode") return;
			if (child.getAttribute("id") === getActivePlayer().name) {
				child.style.opacity = "1";
				child.style.transform = "scale(1.1)";
			} else {
				child.style.opacity = "0.5";
				child.style.transform = "";
			}
		});
	};
	//Initial highlight
	_highlightActivePlayer();

	const _clickHandlerBoard = (e) => {
		if (e.target.tagName !== "SPAN") return;
		if (_gameState.ended) return _resetGame();
		if (e.target.textContent !== _emptyCell) return;

		_soundEffects.playSound("placeMark");
		const [x, y] = e.target.getAttribute("data-pos").split("-");
		_updateScreen(e);
		const result = playRound(x, y);
		_highlightActivePlayer();

		//If game has ended
		if (result) {
			_changeGameState("ended");
			if (result === 2) {
				_scoreBoardChild.forEach((child) => {
					child.style.opacity =
						child.getAttribute("id") === "tie" ? "1" : "0.5";
				});
				setTimeout(_triggerDrawActions, 300);
			} else _highlightVictory();
			_updateScores();
		}
	};

	_boardContainer.addEventListener("click", _clickHandlerBoard);
})();
