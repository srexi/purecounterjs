/** This function is for create and merge configuration */
function setOptions(config, baseConfig = {}){
    // Create new Config object;
    let newConfig = {};
    // Loop config items to set it value into newConfig
    for(let key in config){
        // if baseConfig is set, only accept the baseconfig property
        if(baseConfig != {} && !baseConfig.hasOwnProperty(key)) continue;
        // let parse the config value
        let val = parseValue(config[key]);
        // set the newConfig property value
        newConfig[key] = val;
        // Exclusive for 'duration' or 'repeat' property, recheck the value
        // If it's not a boolean, just set it to milisecond unit
        if (key.match(/duration|repeat/)){
            newConfig[key] = typeof val != 'boolean' ? val * 1000 : val;
        }
    }
    if(baseConfig == {}) console.log(newConfig);
    // Finally, we can just merge the baseConfig (if any), with newConfig.
    return Object.assign({}, baseConfig, newConfig);
}

/** This is the the counter method */
function startCounter(element, config) {
    // Deconstruct config value and create it variable
    let {start, end, duration, delay, once, repeat} = config;
    // First, get the increments step
    var incrementsPerStep = (end - start) / (duration / delay);
    // Next, set the counter mode (Increment or Decrement)
    var countMode = 'inc';

    // Set mode to 'decrement' and 'increment step' to minus if start is larger than end
    if (start > end) {
        countMode = 'dec';
        incrementsPerStep *= -1;
    }

    // Next, determine the starting value
    var currentCount = parseValue(start);
    // And then print it's value to the page
    element.innerHTML = formatNumber(currentCount, config);

    // If the config 'once' is true, then set the 'duration' to 0
    if(once === true){
        element.setAttribute('data-purecounter-duration', 0);
    }

    // Now, start counting with counterWorker using Interval method based on delay
    var counterWorker = setInterval(() => {
        // First, determine the next value base on current value, increment value, and count mode
        var nextNum = nextNumber(currentCount, incrementsPerStep, countMode);
        // Next, print that value to the page
        element.innerHTML = formatNumber(nextNum, config);
        // Now set that value to the current value, because it's already printed
        currentCount = nextNum;

        // If the value is larger or less than the 'end' (base on mode), then  print the end value and stop the Interval
        if ((currentCount >= end && countMode == 'inc') || (currentCount <= end && countMode == 'dec')) {
            element.innerHTML = formatNumber(end, config);
            // If 'once' is false and 'repeat' is set
            if(!once && repeat){
                // First set the 'duration' to zero
                element.setAttribute('data-purecounter-duration', 0);
                // Next, use timeout to reset it duration back based on 'repeat' config
                setTimeout(() => {
                    element.setAttribute('data-purecounter-duration', (duration / 1000));
                }, repeat);
            }
            clearInterval(counterWorker);
        }
    }, delay);
}

/** This function is to get the next number */
function nextNumber(number, steps, mode = 'inc') {
    // First, get the exact value from the number and step (int or float)
    number = parseValue(number);
    steps = parseValue(steps);

    // Last, get the next number based on current number, increment step, and count mode
    // Always return it as float
    return parseFloat(mode === 'inc' ? (number + steps) : (number - steps));
}

/** This function is to convert number into currency format */
function convertNumber (number, config) {
    // Deconstruct config value and create it variable
    var {currency, filesizing} = config;
    /** Use converter if filesizing or currency is on */
    if (filesizing || currency) {
        number = Math.abs(Number(number)); // Get the absolute value of number

        var baseNumber = 1000, // Base multiplying treshold
            symbol = currency && typeof currency === 'string' ? currency : "", // Set the Currency Symbol (if any)
            limit = config.decimals || 1, // Set the decimal limit (default is 1)
            unit = ['', 'K', 'M', 'B', 'T'], // Number unit based exponent threshold
            value = ''; // Define value variable

        /** Changes base number and its unit for filesizing */
        if (filesizing) {
            baseNumber = 1024; // Use 1024 instead of 1000
            unit = ['bytes', 'KB', 'MB', 'GB', 'TB']; // Change to 'bytes' unit
        }		

        /** Get threshold value using exponent from basenumber */
        var threshold = e => Math.pow(baseNumber, e);

        /** Set value based on the threshold */
        for(var i = 4; i >= 0; i--){
            // If the exponent is 0
            if(i === 0) value = `${number.toFixed(limit)} ${unit[i]}`;
            // If the exponent is above zero
            if(number >= threshold(i)) {
                value = `${(number / threshold(i)).toFixed(limit)} ${unit[i]}`;
                break;
            }
        }

        // Apply symbol before the value and return it as string
        return symbol + value;
    } else {
        /** Return its value as float if not using filesizing or currency*/
        return parseFloat(number);
    }
}

/** This function is to get the last formated number */
function applySeparator(value, config){
    // Deconstruct config value
    var {separator} = config;
    // If config separator is false, delete all separator
    if (!separator) {
        return value.replace(new RegExp(/,/gi, 'gi'), '')
    }
    // Set the separator symbol.
    // If 'separator' is string, than use the separator.
    // If 'separator' is boolean value for 'true', just set it default to comma (,)
    var symbol = typeof separator === 'string' ? separator : ',';
    // If config separator is true, then create separator
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        .replace(new RegExp(/,/gi, 'gi'), symbol);
}

/** This function is to get formated number to be printed in the page */
function formatNumber(number, config) {
    var {decimals} = config;
    // This is the configuration for 'toLocaleString' method
    var strConfig = {minimumFractionDigits: decimals, maximumFractionDigits: decimals};
    // Set and convert the number base on its config.
    number = convertNumber(number, config);

    // Last, apply the number separator using number as string
    return applySeparator(number.toLocaleString(undefined, strConfig), config);
}

/** This function is to get the parsed value */
function parseValue(data) {
    // If number with dot (.), will be parsed as float
    if (/^[0-9]+\.[0-9]+$/.test(data)) {
        return parseFloat(data);
    }
    // If just number, will be parsed as integer
    if (/^[0-9]+$/.test(data)) {
        return parseInt(data);
    }
    // If it's boolean string, will be parsed as boolean
    if (/^true|false/i.test(data)) {
        return /^true/i.test(data);
    }
    // Return it's value as default
    return data;
}

// This function is to detect the element is in view or not.
function elementIsInView(element) {
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

/** Just some condition to check browser Intersection Support */
function intersectionListenerSupported() {
    return ('IntersectionObserver' in window) &&
        ('IntersectionObserverEntry' in window) &&
        ('intersectionRatio' in window.IntersectionObserverEntry.prototype);
}

function PureCounter(options = {}){
    var configs = {
        start: 0, 			// Starting number [unit]
        end: 100, 			// End number [unit]
        duration: 2000, 	// Count duration [milisecond]
        delay: 10, 			// Count delay [milisecond]
        once: true, 		// Counting at once or recount when scroll [boolean]
        repeat: false, 		// Repeat count for certain time [boolean|milisecond]
        decimals: 0, 		// Decimal places [unit]
        legacy: true,
        filesizing: false, 	// Is it for filesize?
        currency: false, 	// Is it for currency? Use it for set the symbol too [boolean|char|string]
        separator: false, 	// Do you want to use thausands separator? use it for set the symbol too [boolean|char|string]
        selector: '.purecounter',       // HTML query selector for spesific element
    };
    var configOptions = setOptions(options, configs);

    function registerEventListeners() {
		/** Get all elements with class 'purecounter' */
		var elements = document.querySelectorAll(configOptions.selector);
		/** Return if no elements */
		if (elements.length === 0) return;

		/** Run animateElements base on Intersection Support */
		if (intersectionListenerSupported()) {
			var intersectObserver = new IntersectionObserver(animateElements.bind(this), {
				"root": null,
				"rootMargin": '20px',
				"threshold": 0.5
			});

			elements.forEach(element => {intersectObserver.observe(element);})
		} else {
			if (window.addEventListener) {
				animateLegacy(elements);
				window.addEventListener('scroll', function (e) {
					animateLegacy(elements);
				}, { "passive": true });
			}
		}
    }

    /** This legacy to make Purecounter use very lightweight & fast */
    function animateLegacy(elements) {
        elements.forEach(element => {
            var {legacy} = parseConfig(element);
            if(legacy === true && elementIsInView(element)) {
                animateElements([element]);
            }
        })
    }

    /** Main Element Count Animation */
    function animateElements(elements, observer) {
        elements.forEach(element => {
            var elm = element.target || element; // Just make sure which element will be used
            var elementConfig = parseConfig(elm); // Get config value on that element
            // Deconstruct config value and create it variable
            let {start, end, duration, delay} = elementConfig;
            // If duration is less than or equal zero, just format the 'end' value
            if (duration <= 0) {
                return elm.innerHTML = formatNumber(end, elementConfig);
            }

            if ((!observer && !elementIsInView(element)) || (observer && element.intersectionRatio < 0.5)) {
                var value = start > end ? end : start;
                return elm.innerHTML = formatNumber(value, elementConfig);
            }

            // If duration is more than 0, then start the counter
            setTimeout(() => {
                return startCounter(elm, elementConfig);
            }, delay);
        });
    }

    /** This function is to generate the element Config */
    function parseConfig(element) {
		// First, we need to declare the base Config
		// This config will be used if the element doesn't have config
		let baseConfig = configOptions;

		// Next, get all 'data-precounter-*' attributes value. Store to array
		let configValues = [].filter.call(element.attributes, function(attr) {
			return /^data-purecounter-/.test(attr.name);
		});

		// Now, we create element config as an object
		let elementConfig = configValues.length != 0 ? Object.assign({}, ...configValues.map(({name, value}) => {
			let key = name.replace('data-purecounter-', '').toLowerCase(),
				val = parseValue(value);

			return {[key] : val};
		})) : {};

		// Last setOptions and return
		return setOptions(elementConfig, baseConfig);
    }
    
    /** Run the initial function */
    registerEventListeners();
}

module.exports = PureCounter;