const Gameboard = (function () {
	const _emptyCell = "*";
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
	};

	function _render() {
		for (let row of getBoard()) {
			console.log(row.join(" "));
		}
	}

	function _checkGameStatus() {
		const _board = getBoard();

		// Draw Condition
		let _draw = false;
		for (let i = 0; i < _rows; i++) {
			for (let j = 0; j < _columns; j++) {
				if (_board[i][j] === _emptyCell) {
					_draw = false;
					break;
				} else _draw = true;
			}
		}
		if (_draw) return _draw;

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
				return true;
			}
		}
		return false;
	}

	const _switchPlayer = () =>
		_activePlayer === _players[0]
			? (_activePlayer = _players[1])
			: (_activePlayer = _players[0]);

	function _gameOver() {
		_scores[_activePlayer.name]++;
		renderArt.gameOver(_winner);
		console.table(_scores);
		resetBoard();
		_winner = "";
	}

	function playRound(x, y) {
		placeMark(_activePlayer, x, y);
		_render();
		_checkGameStatus() ? _gameOver() : _switchPlayer();
	}

	return { playRound };
})();
