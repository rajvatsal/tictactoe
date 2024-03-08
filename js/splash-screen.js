const startGame = (() => {
	const startBtn = document.querySelector("fieldset>button");
	const head = document.querySelector("head");
	const body = document.querySelector("body");
	const player_one = document.getElementById("player_one");
	const player_two = document.getElementById("player_two");

	const purgeSplashScreen = () => {
		head.querySelector('link[src="css/splash-screen.css"]').remove();
		body.querySelector("header").remove();
		body.querySelector("main").remove();
		body.prepend(document.createElement("main"));
	};

	startBtn.addEventListener("click", function (e) {
		if (
			!player_one.checkValidity() ||
			!player_two.checkValidity() ||
			player_one.value === player_two.value ||
			player_one.value === "AI BOT" ||
			player_two.value === "AI BOT"
		)
			return;

		e.preventDefault();
		const styleSheet = document.createElement("link");
		styleSheet.rel = "stylesheet";
		styleSheet.href = "css/styles.css";
		head.appendChild(styleSheet);

		const script = document.createElement("script");
		script.src = "js/script.js";
		body.appendChild(script);
	});

	return { purgeSplashScreen };
})();
