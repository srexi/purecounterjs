export default class PureCounter {
	constructor() {
		this.registerEventListeners();
	}

	registerEventListeners() {
		var elements = document.querySelectorAll('.purecounter');
		var intersectionSupported = this.intersectionListenerSupported();

		if (intersectionSupported) {
			var intersectionObserver = new IntersectionObserver(this.animateElements.bind(this), {
				"root": null,
				"rootMargin": '20px',
				"threshold": 0.5
			});

			for (var i = 0; i < elements.length; i++) {
				intersectionObserver.observe(elements[i]);
			}
		} else {
			if (window.addEventListener) {
				this.animateLegacy(elements);

				window.addEventListener('scroll', e => {
					this.animateLegacy(elements);
				}, { "passive": true });
			}
		}
	}

	animateLegacy(elements) {
		for (var i = 0; i < elements.length; i++) {
			var config = this.parseConfig(elements[i]);
			if (config.legacy === true && this.elementIsInView(elements[i])) {
				this.animateElements([elements[i]]);
			}
		}
	}

	animateElements(elements, observer) {
		elements.forEach((element) => {
			var elementConfig = typeof element.target !== "undefined" ? this.parseConfig(element.target) : this.parseConfig(element);

			if (elementConfig.duration <= 0) {
				return element.innerHTML = elementConfig.end.toFixed(elementConfig.decimals);
			}
			if ((!observer && !this.elementIsInView(element)) || (observer && element.intersectionRatio < 0.5)) {
				return element.target.innerHTML = elementConfig.start > elementConfig.end ? elementConfig.end : elementConfig.start;
			}

			setTimeout(() => {
				if (typeof element.target !== "undefined") {
					return this.startCounter(element.target, elementConfig);
				}

				return this.startCounter(element, elementConfig);
			}, elementConfig.delay);
		});
	}

	startCounter(element, config) {
		var incrementsPerStep = (config.end - config.start) / (config.duration / config.delay);
		var countMode = 'inc';
		if (config.start > config.end) {
			countMode = 'dec';
			incrementsPerStep *= -1;
		}
		if (incrementsPerStep < 1 && config.decimals <= 0) {
			incrementsPerStep = 1;
		}

		var currentCount = config.decimals <= 0 ? parseInt(config.start) : parseFloat(config.start).toFixed(config.decimals);
		element.innerHTML = currentCount;

		if (config.once === true) {
			element.setAttribute('data-purecounter-duration', 0);
		}

		var counterWorker = setInterval(() => {
			var nextNum = this.nextNumber(currentCount, incrementsPerStep, config, countMode);
			element.innerHTML = this.formatNumber(nextNum, config);
			currentCount = nextNum;

			if ((currentCount >= config.end && countMode == 'inc') || (currentCount <= config.end && countMode == 'dec')) {
				clearInterval(counterWorker);

				if (currentCount != config.end) {
					element.innerHTML = config.decimals <= 0 ? parseInt(config.end) : parseFloat(config.end).toFixed(config.decimals);
				}
			}
		}, config.delay);
	}

	parseConfig(element) {
		var configValues = [].filter.call(element.attributes, attribute => {
			return /^data-purecounter-/.test(attribute.name);
		});

		var newConfig = {
			start: 0,
			end: 9001,
			duration: 2000,
			delay: 10,
			once: true,
			decimals: 0,
			legacy: true,
		};

		for (var i = 0; i < configValues.length; i++) {
			var valueInd = configValues[i].name.replace('data-purecounter-', '');
			newConfig[valueInd.toLowerCase()] = valueInd.toLowerCase() == 'duration' ? parseInt(this.castDataType(configValues[i].value) * 1000) : this.castDataType(configValues[i].value);
		}

		return newConfig;
	}

	nextNumber(number, steps, config, mode) {
		if (!mode) mode = 'inc';
		if (mode === 'inc') {
			return config.decimals <= 0 ? parseInt(number) + parseInt(steps) : parseFloat(number) + parseFloat(steps);
		}

		return config.decimals <= 0 ? parseInt(number) - parseInt(steps) : parseFloat(number) - parseFloat(steps);
	}

	formatNumber(number, config) {
		return config.decimals <= 0 ? parseInt(number) : number.toLocaleString(undefined, { minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals });
	}

	castDataType(data) {
		if (/^[0-9]+\.[0-9]+$/.test(data)) {
			return parseFloat(data);
		}
		if (/^[0-9]+$/.test(data)) {
			return parseInt(data);
		}
		return data;
	}

	elementIsInView(element) {
		var top = element.offsetTop;
		var left = element.offsetLeft;
		var width = element.offsetWidth;
		var height = element.offsetHeight;

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

	intersectionListenerSupported() {
		return ('IntersectionObserver' in window) &&
			('IntersectionObserverEntry' in window) &&
			('intersectionRatio' in window.IntersectionObserverEntry.prototype);
	}
}