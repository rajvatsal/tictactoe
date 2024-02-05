const game = (function () {
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

		let _winner = "";

		const getWinner = () => _winner;

		function render() {
			for (let i of _board) {
				console.log(i.join(" "));
			}
		}

		function placeMark(x, y) {
			if (x > _columns - 1 || y > _rows - 1 || _board[x][y] !== _emptyCell) {
				[x, y] = prompt(
					"Invalid Input. Enter your x and y value again with a space.",
				).split(" ");
			}
			_board[x][y] = this.mark;
		}

		function isDraw() {
			for (let i of _board) {
				for (let j of i) {
					if (j === _emptyCell) return false;
				}
			}
			return true;
		}

		function isWinner() {
			let diagR = 0;
			for (let i = 0; i < _rows; i++) {
				let vert = 0,
					horz = 0,
					diagL = 0;

				for (let j = 0; j < _columns; j++) {
					if (_board[i][j] === this.mark) horz++;
					if (_board[j][i] === this.mark) vert++;
					if (_board[j][j] === this.mark) diagL++;
				}

				if (_board[i][_columns - 1 - i] === this.mark) diagR++;
				if (
					diagR === _rows ||
					vert === _columns ||
					horz === _rows ||
					diagL === _rows
				) {
					_winner = this.name;
					return true;
				}
			}
			return false;
		}

		return { render, placeMark, isWinner, isDraw, getWinner };
	})();

	const Players = (function () {
		function _createPlayers(name, mark) {
			const { placeMark, isWinner } = Gameboard;
			return { name, mark, placeMark, isWinner };
		}

		const ppl = [];
		ppl.push(_createPlayers("vatsal", "X"));
		ppl.push(_createPlayers("thanos", "O"));

		return ppl;
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
·▄▄▄▄  ▄▄▄   ▄▄▄· ▄▄▌ ▐ ▄▌
██▪ ██ ▀▄ █·▐█ ▀█ ██· █▌▐█
▐█· ▐█▌▐▀▀▄ ▄█▀▀█ ██▪▐█▐▐▌
██. ██ ▐█•█▌▐█ ▪▐▌▐█▌██▐█▌
▀▀▀▀▀• .▀  ▀ ▀  ▀  ▀▀▀▀ ▀▪
		`,
		};
		console.log(_arts.header);

		const gameOver = (val) => {
			if (val) console.log(_arts.winner, val);
			else console.log(_arts.draw);
		};

		return { gameOver };
	})();

	function init() {
		const { render, isDraw, getWinner } = Gameboard;
		while (true) {
			Players[0].placeMark(
				prompt("Player one X-coordinate:"),
				prompt("Player one Y-coordinate:"),
			);
			render();
			if (Players[0].isWinner() || isDraw()) break;
			Players[1].placeMark(
				prompt("Player two X-coordinate:"),
				prompt("Player two Y-coordinate:"),
			);
			render();
			if (Players[1].isWinner() || isDraw()) break;
		}

		renderArt.gameOver(getWinner());
	}
	return {
		init,
		playerOne: Players[0],
		playerTwo: Players[1],
		render: Gameboard.render,
	};
})();
