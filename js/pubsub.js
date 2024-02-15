const events = (function () {
	const eventsDefined = {};
	const on = (eventName, fn) => {
		eventsDefined[eventName] = eventsDefined[eventName] || [];
		eventsDefined[eventName].push(fn);
	};
	const off = (eventName, fn) => {
		if (eventsDefined[eventName]) {
			for (var i = 0; i < eventsDefined[eventName].length; i++) {
				if (eventsDefined[eventName][i] === fn) {
					eventsDefined[eventName].splice(i, 1);
					break;
				}
			}
		}
	};
	const emit = (eventName, data) => {
		if (eventsDefined[eventName]) {
			eventsDefined[eventName].forEach(function (fn) {
				fn(data);
			});
		}
	};

	return { on, off, emit };
})();
