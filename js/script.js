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
	const _scores = {
		[_players[0].name]: 0,
		[_players[1].name]: 0,
		tie: 0,
	};

	const getActivePlayer = () => _activePlayer;
	const getScores = () => _scores;

	function _render() {
		console.table(getBoard());
	}

	function _checkGameStatus() {
		const _board = getBoard();

		// Win condition
		let diagR = 0;
		for (let i = 0; i < _rows; i++) {
			let vert = 0,
				horz = 0,
				diagL = 0;

			for (let j = 0; j < _columns; j++) {
				if (_board[i][j] === _activePlayer.mark) horz++;
				if (_board[j][i] === _activePlayer.mark) vert++;
				if (_board[j][j] === _activePlayer.mark) diagL++;
			}

			if (_board[i][_columns - 1 - i] === _activePlayer.mark) diagR++;
			if (
				diagR === _rows ||
				vert === _columns ||
				horz === _rows ||
				diagL === _rows
			) {
				_winner = _activePlayer.name;
				return 1;
			}
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

	return { playRound, getActivePlayer, getScores };
})();

const ScreenController = (function () {
	const { getBoardSpec, getBoard } = Gameboard;
	const { playRound, getActivePlayer, getScores } = GameController;
	const { _rows, _columns, _emptyCell } = getBoardSpec();

	const _boardContainer = document.querySelector("#board-container");
	const _scoreBoard = document.querySelectorAll(
		"#score-board > :not(#mode) > span:nth-child(2)",
	);

	const _animationDelay = 150;
	const _animationCount = 9;
	const _gameState = {
		active: true,
		ended: false,
	};

	const _soundEffects = {
		placeMark: new Audio("sound-effects/place-mark.mp3"),
		draw: new Audio("sound-effects/game-start.mp3"),
		playSound: function (sound) {
			this[sound].currentTime = 0;
			this[sound].play();
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
	};

	const _changeGameState = (state) => {
		_gameState.active = state === "active";
		_gameState.ended = state === "ended";
	};

	//Create board
	for (let i = 0; i < _rows; i++) {
		for (let j = 0; j < _columns; j++) {
			const btn = document.createElement("button");
			btn.setAttribute("data-pos", `${i}-${j}`);
			_boardContainer.appendChild(btn);
		}
	}

	const _btns = _boardContainer.querySelectorAll("button");

	const _clearScreen = () => {
		_btns.forEach((btn) => (btn.textContent = ""));
	};

	const _updateScreen = (e) => {
		e.target.textContent = getActivePlayer().mark;
	};

	const _updateScores = () => {
		const scores = getScores();
		_scoreBoard[0].textContent = scores.vatsal;
		_scoreBoard[1].textContent = scores.tie;
		_scoreBoard[2].textContent = scores.thanos;
	};

	const _triggerDrawActions = () => {
		_btns.forEach((btn) => (btn.style.color = "rgba(255, 255, 255, 0.4)"));
		_animationEffects.blinkBoard(_animationCount);
		_soundEffects.playSound("draw");
	};

	const _clickHandlerBoard = (e) => {
		if (e.target.tagName !== "BUTTON") return;
		if (_gameState.ended) {
			_clearScreen();
			_btns.forEach((btn) => (btn.style.color = "white"));
			_changeGameState("active");
			return;
		}
		if (e.target.textContent !== _emptyCell) return;

		_soundEffects.playSound("placeMark");
		const [x, y] = e.target.getAttribute("data-pos").split("-");
		_updateScreen(e);
		const result = playRound(x, y);

		//If game has ended
		if (result) {
			_changeGameState("ended");
			if (result === 2) _triggerDrawActions();
			_updateScores();
		}
	};

	_boardContainer.addEventListener("click", _clickHandlerBoard);
})();
