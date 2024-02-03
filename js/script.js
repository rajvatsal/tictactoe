const gameBoard = (function () {
	const _emptyCell = "*";
	let _board = [
		[_emptyCell, _emptyCell, _emptyCell],
		[_emptyCell, _emptyCell, _emptyCell],
		[_emptyCell, _emptyCell, _emptyCell],
	];

	function render() {
		for (let i of _board) {
			console.log(i.join(" "));
		}
	}

	function addInput(x, y) {
		_board[x][y] = this.mark;
	}

	function isGameOver(plyr) {
		for (let i = 0; i < _board.length; i++) {
			let vert = 0,
				horz = 0,
				diag = 0;
			for (let j = 0; j < _board.length; j++) {
				if (_board[i][j] === plyr.mark) horz++;
				if (_board[j][i] === plyr.mark) vert++;
				if (_board[j][j] === plyr.mark) diag++;
				else if (_board[i][_board[i].length - 1 - i] === plyr.mark) diag++;
			}
			if (diag === 3 || vert === 3 || horz === 3) return true;
		}
	}

	return { render, addInput, isGameOver };
})();

const player = (function () {
	function _createPlayer(name, mark) {
		const { addInput: makeMove } = gameBoard;
		return { name, mark, makeMove };
	}

	const ppl = [];
	ppl.push(_createPlayer("vatsal", "X"));
	ppl.push(_createPlayer("thanos", "O"));

	return ppl;
})();

const renderArts = (function () {
	let _arts = {
		header: `
▄▄▄▄▄▪   ▄▄·     ▄▄▄▄▄ ▄▄▄·  ▄▄·     ▄▄▄▄▄      ▄▄▄ .
•██  ██ ▐█ ▌▪    •██  ▐█ ▀█ ▐█ ▌▪    •██  ▪     ▀▄.▀·
 ▐█.▪▐█·██ ▄▄     ▐█.▪▄█▀▀█ ██ ▄▄     ▐█.▪ ▄█▀▄ ▐▀▀▪▄
 ▐█▌·▐█▌▐███▌     ▐█▌·▐█ ▪▐▌▐███▌     ▐█▌·▐█▌.▐▌▐█▄▄▌
 ▀▀▀ ▀▀▀·▀▀▀      ▀▀▀  ▀  ▀ ·▀▀▀      ▀▀▀  ▀█▄▀▪ ▀▀▀ 
		`,
		end: `
 ▄▄ •  ▄▄▄· • ▌ ▄ ·. ▄▄▄ .           ▌ ▐·▄▄▄ .▄▄▄  
▐█ ▀ ▪▐█ ▀█ ·██ ▐███▪▀▄.▀·    ▪     ▪█·█▌▀▄.▀·▀▄ █·
▄█ ▀█▄▄█▀▀█ ▐█ ▌▐▌▐█·▐▀▀▪▄     ▄█▀▄ ▐█▐█•▐▀▀▪▄▐▀▀▄ 
▐█▄▪▐█▐█ ▪▐▌██ ██▌▐█▌▐█▄▄▌    ▐█▌.▐▌ ███ ▐█▄▄▌▐█•█▌
·▀▀▀▀  ▀  ▀ ▀▀  █▪▀▀▀ ▀▀▀      ▀█▄▀▪. ▀   ▀▀▀ .▀  ▀
		`,
	};
	console.log(_arts.header);

	const gameOver = () => console.log(_arts.end);

	return { gameOver };
})();
gameBoard.render();
