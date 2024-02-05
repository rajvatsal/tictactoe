const game = (function () {
	const Gameboard = (function () {
		const _emptyCell = "*";
		let _board = [
			[_emptyCell, _emptyCell, _emptyCell],
			[_emptyCell, _emptyCell, _emptyCell],
			[_emptyCell, _emptyCell, _emptyCell],
		];

		let _winner = "";

		const getWinner = () => _winner;

		function render() {
			for (let i of _board) {
				console.log(i.join(" "));
			}
		}

		function addInput(x, y) {
			if (x > 2 || y > 2 || _board[x][y] !== "*") {
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
			for (let i = 0; i < _board.length; i++) {
				let vert = 0,
					horz = 0,
					diagL = 0;

				for (let j = 0; j < _board.length; j++) {
					if (_board[i][j] === this.mark) horz++;
					if (_board[j][i] === this.mark) vert++;
					if (_board[j][j] === this.mark) diagL++;
				}

				if (_board[i][_board[i].length - 1 - i] === this.mark) diagR++;
				if (diagR === 3 || vert === 3 || horz === 3 || diagL === 3) {
					_winner = this.name;
					return true;
				}
			}
			return false;
		}

		return { render, addInput, isWinner, isDraw, getWinner };
	})();

	const Players = (function () {
		function _createPlayers(name, mark) {
			const { addInput: makeMove, isWinner } = Gameboard;
			return { name, mark, makeMove, isWinner };
		}

		const ppl = [];
		ppl.push(_createPlayers("vatsal", "X"));
		ppl.push(_createPlayers("thanos", "O"));

		return ppl;
	})();

	const renderArts = (function () {
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
			Players[0].makeMove(
				prompt("Player one X-coordinate:"),
				prompt("Player one Y-coordinate:"),
			);
			render();
			if (Players[0].isWinner() || isDraw()) break;
			Players[1].makeMove(
				prompt("Player two X-coordinate:"),
				prompt("Player two Y-coordinate:"),
			);
			render();
			if (Players[1].isWinner() || isDraw()) break;
		}

		renderArts.gameOver(getWinner());
	}
	return { init };
})();
