let registerEventListeners = () => {
	let elements = document.querySelectorAll('.purecounter');
	let intersectionSupported = intersectionListenerSupported;

	if (intersectionSupported) {
		var intersectionObserver = new IntersectionObserver(animateElements, {
			"root": document.querySelector('#sumtimg'),
			"rootMargin": '20px',
			"threshold": 0.5
		});
	}

	for (let i = 0; i < elements.length; i++) {
		if (!intersectionSupported && config.browsers == 'all') {
			if (isSafariBrowser()) {
				window.onscroll(e => {
					if (elementIsInView(elements[i])) {
						animateElements([elements[i]]);
					}
				});
			} else {
				window.addEventListener('scroll', e => {
					if (elementIsInView(elements[i])) {
						animateElements([elements[i]]);
					}
				}, { passive: true });
			}
		} else if (intersectionSupported) {
			intersectionObserver.observe(elements[i]);
		}
	}
}

let animateElements = (elements, observer = null) => {
	elements.forEach(element => {
		if (typeof element.target !== "undefined") {
			var elementConfig = parseConfig(element.target);
		} else {
			var elementConfig = parseConfig(element);
		}

		if (elementConfig.duration <= 0) {
			return;
		}

		if (observer === null) {
			if (!elementIsInView(element) && elementConfig.once != true) {
				element.target.innerHTML = elementConfig.start > elementConfig.end
					? elementConfig.end
					: elementConfig.start;
			}

			return;
		} else if (element.intersectionRatio < 0.5) {
			if (elementConfig.once != true) {
				element.target.innerHTML = elementConfig.start > elementConfig.end
					? elementConfig.end
					: elementConfig.start;
			}

			return;
		}

		setTimeout(() => {
			if (typeof element.target !== "undefined") {
				return startCounter(element.target, elementConfig);
			}
			return startCounter(element, elementConfig);
		}, elementConfig.delay);
	});
}

let startCounter = (element, config) => {
	let incrementsPerStep = (config.end - config.start) / (config.duration / config.delay);
	let countMode = 'inc';
	if (config.start > config.end) {
		countMode = 'dec';
		incrementsPerStep *= -1;
	}

	if (incrementsPerStep < 1 && config.decimals <= 0) {
		incrementsPerStep = 1;
	}

	let currentCount = config.decimals <= 0
		? parseInt(config.start)
		: parseFloat(config.start).toFixed(config.decimals);

	element.innerHTML = currentCount;
	if (config.once === true) {
		element.setAttribute('data-purecounter-duration', 0);
	}

	let counterWorker = setInterval(() => {
		let nextNum = nextNumber(currentCount, incrementsPerStep, config, countMode);
		element.innerHTML = formatNumber(nextNum, config);
		currentCount = nextNum;

		if ((currentCount >= config.end && countMode == 'inc')
			|| (currentCount <= config.end && countMode == 'dec')) {
			clearInterval(counterWorker);

			if (currentCount != config.end) {
				element.innerHTML = config.decimals <= 0
					? parseInt(config.end)
					: parseFloat(config.end).toFixed(config.decimals);
			}
		}
	}, config.delay);
}

let parseConfig = element => {
	let configValues = [].filter.call(element.attributes, attribute => {
		return /^data-purecounter-/.test(attribute.name);
	});

	let newConfig = {
		start: 0,
		end: 9001,
		duration: 300,
		delay: 10,
		once: true,
		decimals: 0,
		browsers: 'all',
	};

	for (let i = 0; i < configValues.length; i++) {
		let valueInd = configValues[i].name.replace('data-purecounter-', '');
		newConfig[valueInd] = castDataType(configValues[i].value);
	}

	return newConfig;
}

let nextNumber = (number, steps, config, mode = 'inc') => {
	if (mode === 'inc') {
		return config.decimals <= 0
			? parseInt(number) + parseInt(steps)
			: parseFloat(number) + parseFloat(steps);
	}

	return config.decimals <= 0
		? parseInt(number) - parseInt(steps)
		: parseFloat(number) - parseFloat(steps);
}

let formatNumber = (number, config) => {
	return config.decimals <= 0
		? parseInt(number)
		: number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let castDataType = data => {
	if (/^[0-9]+\.[0-9]+$/.test(data)) {
		return parseFloat(data);
	}
	if (/^[0-9]+$/.test(data)) {
		return parseInt(data);
	}
	return data;
}

let elementIsInView = element => {
	let top = element.offsetTop;
	let left = element.offsetLeft;
	let width = element.offsetWidth;
	let height = element.offsetHeight;

	while (element.offsetParent) {
		element = element.offsetParent;
		top += element.offsetTop;
		left += element.offsetLeft;
	}

	return (
		top >= window.pageYOffset &&
		left >= window.pageXOffset &&
		(top + height) <= (window.pageYOffset + window.innerHeight) &&
		(left + width) <= (window.pageXOffset + window.innerWidth)
	);
}

let intersectionListenerSupported = () => {
	return ('IntersectionObserver' in window) &&
		('IntersectionObserverEntry' in window) &&
		('intersectionRatio' in window.IntersectionObserverEntry.prototype);
}

let isSafariBrowser = () => {
	return /constructor/i.test(window.HTMLElement);
}

(function () {
	registerEventListeners();
})();