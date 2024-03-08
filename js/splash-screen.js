const startGame = (() => {
	const startBtn = document.querySelector("main>button");
	const head = document.querySelector("head");
	const body = document.querySelector("body");
	startBtn.addEventListener("click", () => {
		// remove splash css and children of main
		head.querySelector('link[src="css/splash-screen.css"]').remove();
		body.querySelector("main").remove();
		body.querySelector("header").after(document.createElement("main"));

		const styleSheet = document.createElement("link");
		styleSheet.rel = "stylesheet";
		styleSheet.href = "css/styles.css";
		head.appendChild(styleSheet);

		const script = document.createElement("script");
		script.src = "js/script.js";
		body.appendChild(script);
	});
})();
