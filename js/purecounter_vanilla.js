/** Initial function */
function registerEventListeners() {
    /** Get all elements with class 'purecounter' */
    var elements = document.querySelectorAll('.purecounter');
    /** Get browser Intersection Listener Support */
    var intersectionSupported = intersectionListenerSupported();

    /** Run animateElements base on Intersection Support */
    if (intersectionSupported) {
        var intersectObserver = new IntersectionObserver(animateElements, {
            "root": null,
            "rootMargin": '20px',
            "threshold": 0.5
        });

        elements.forEach(element => {intersectObserver.observe(element);})
    } else {
        if (window.addEventListener) {
            animateLegacy(elements);

            window.addEventListener('scroll', function(e) {
                animateLegacy(elements);
            }, { "passive": true });
        }
    }
}

/** This legacy to make Purecounter use very lightweight & fast */
function animateLegacy(elements) {
    elements.forEach(element => {
        var config = parseConfig(element);
        if(config.legacy === true && elementIsInView(element)) {
            animateElements([element]);
        }
    })
}

/** Main Element Count Animation */
function animateElements(elements, observer) {
    elements.forEach(element => {
        var elm = element.target || element; // Just make sure which element will be used
        var elementConfig = parseConfig(elm); // Get config value on that element

        // If duration is less than or equal zero, just format the 'end' value
        if (elementConfig.duration <= 0) {
            return elm.innerHTML = formatNumber(elementConfig.end, elementConfig);
        }

        if ((!observer && !elementIsInView(element)) || (observer && element.intersectionRatio < 0.5)) {
            var value = elementConfig.start > elementConfig.end ? elementConfig.end : elementConfig.start;
            return elm.innerHTML = formatNumber(value, elementConfig);
        }

        // If duration is more than 0, then start the counter
        setTimeout(() => {
            return startCounter(elm, elementConfig);
        }, elementConfig.delay);
    });
}

/** This is the the counter method */
function startCounter(element, config) {
    // First, get the increments step
    var incrementsPerStep = (config.end - config.start) / (config.duration / config.delay);
    // Next, set the counter mode (Increment or Decrement)
    var countMode = 'inc';

    // Set mode to 'decrement' and 'increment step' to minus if start is larger than end
    if (config.start > config.end) {
        countMode = 'dec';
        incrementsPerStep *= -1;
    }

    // Next, determine the starting value
    var currentCount = parseValue(config.start);
    // And then print it's value to the page
    element.innerHTML = formatNumber(currentCount, config);

    // If the config 'once' is true, then set the 'duration' to 0
    if(config.once === true){
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
        if ((currentCount >= config.end && countMode == 'inc') || (currentCount <= config.end && countMode == 'dec')) {
            element.innerHTML = formatNumber(config.end, config);
            clearInterval(counterWorker);
        }
    }, config.delay);
}

/** This function is to generate the element Config */
function parseConfig(element) {
    // First, we need to declare the base Config
    // This config will be used if the element doesn't have config
    var baseConfig = {
        start: 0,
        end: 9001,
        duration: 2000,
        delay: 10,
        once: true,
        decimals: 0,
        legacy: true,
        currency: false,
        currencysymbol: false,
        separator: false,
        separatorsymbol: ','
    };

    // Next, get all 'data-precounter' attributes value. Store to array
    var configValues = [].filter.call(element.attributes, function(attr) {
        return /^data-purecounter-/.test(attr.name);
    });

    // Now, we create element config as an empty object
    var elementConfig = {};

    // And then, fill the element config based on config values
    configValues.forEach(e => {
        var name = e.name.replace('data-purecounter-', '').toLowerCase();
        var value = name == 'duration' ? parseInt(parseValue(e.value) * 1000) : parseValue(e.value);
        elementConfig[name] = value; // We will get an object
    })

    // Last marge base config with element config and return it as an object
    return Object.assign(baseConfig, elementConfig);
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
function convertToCurrencySystem (number, config) {
    var symbol = config.currencysymbol || "", // Set the Currency Symbol (if any)
        limit = config.decimals || 1,  // Set the decimal limit (default is 1)
        number = Math.abs(Number(number)); // Get the absolute value of number

    // Set the value
    var value = number >= 1.0e+12 ? `${(number / 1.0e+12).toFixed(limit)} T` // Twelve zeros for Trillions
        : number >= 1.0e+9 ? `${(number / 1.0e+9).toFixed(limit)} B` // Nine zeros for Billions
        : number >= 1.0e+6 ? `${(number / 1.0e+6).toFixed(limit)} M`  // Six zeros for Millions
        : number >= 1.0e+3 ? `${(number / 1.0e+12).toFixed(limit)} K` // Three zeros for Thousands
        : number.toFixed(limit); // If less than 1000, print it's value

    // Apply symbol before the value and return it as string
    return symbol + value;
}

/** This function is to get the last formated number */
function applySeparator(value, config){
    // If config separator is false, delete all separator
    if (!config.separator) {
        return value.replace(new RegExp(/,/gi, 'gi'), '')
    }

    // If config separator is true, then create separator
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        .replace(new RegExp(/,/gi, 'gi'), config.separatorsymbol)
}

/** This function is to get formated number to be printed in the page */
function formatNumber(number, config) {
    // This is the configuration for 'toLocaleString' method
    var strConfig = {minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals};
    // Set the number if it using currency, then convert. If doesn't, just parse it as float
    number = config.currency ? convertToCurrencySystem(number, config) : parseFloat(number);

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

/** Run the initial function */
(function () {
    registerEventListeners();
})();