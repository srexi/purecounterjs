// This function creates the configuration with default values and merges provided configuration.
function setOptions(config, baseConfig = {}) {
    // Create a new configuration object.
    var newConfig = {};

    // Loop config items to set it value into the configuration.
    for (var key in config) {
        // If base config is set, only accept the base config property.
        if (baseConfig != {} && !baseConfig.hasOwnProperty(key)) continue;
        // Parse the config value.
        var val = parseValue(config[key]);
        // Set the new configuration property value.
        newConfig[key] = val;
        // Exclusive for 'duration' or 'pulse' property, recheck the value.
        // If it's not a boolean, just set it to milisecond unit.
        if (key.match(/duration|pulse/)) {
            newConfig[key] = typeof val != "boolean" ? val * 1000 : val;
        }
    }

    // Finally, we can just merge the base config (if any), with the new config.
    return Object.assign({}, baseConfig, newConfig);
}

// This is the counter method to do its job.
function startCounter(element, config) {
    // First, get the increments step.
    var incrementsPerStep =
        (config.end - config.start) / (config.duration / config.delay);
    // Next, set the counter mode (Increment or Decrement).
    var countMode = "inc";

    // Set mode to 'decrement' and 'increment step' to minus if start is larger than end.
    if (config.start > config.end) {
        countMode = "dec";
        incrementsPerStep *= -1;
    }

    // Next, determine the starting value.
    var currentCount = parseValue(config.start);
    // And then print its value to the page.
    element.innerHTML = formatNumber(currentCount, config);

    // If the config 'once' is true, then set the 'duration' to 0.
    if (config.once === true) {
        element.setAttribute("data-purecounter-duration", 0);
    }

    // Now start counting with counterWorker using the interval method based on delay.
    var counterWorker = setInterval(() => {
        // First determine the next value base on current value, increment value, and count mode.
        var nextNum = nextNumber(currentCount, incrementsPerStep, countMode);
        // Next, print that value to the page.
        element.innerHTML = formatNumber(nextNum, config);
        // Now set that value to the current value, because it's already printed.
        currentCount = nextNum;

        // If the value is larger or less than the 'end' (based on mode), then print the end value and stop the interval.
        if (
            (currentCount >= config.end && countMode == "inc") ||
            (currentCount <= config.end && countMode == "dec")
        ) {
            element.innerHTML = formatNumber(config.end, config);
            // If 'pulse' is set ignore the 'once' config.
            if (config.pulse) {
                // First set the 'duration' to zero.
                element.setAttribute("data-purecounter-duration", 0);
                // Next use timeout to reset it duration back based on 'pulse' config.
                setTimeout(() => {
                    element.setAttribute(
                        "data-purecounter-duration",
                        config.duration / 1000
                    );
                }, config.pulse);
            }
            clearInterval(counterWorker);
        }
    }, config.delay);
}

// This function is to get the next number in the counting order.
function nextNumber(number, steps, mode = "inc") {
    // First get the exact value from the number and step (int or float).
    number = parseValue(number);
    steps = parseValue(steps);

    // Last get the next number based on current number, increment step, and count mode.
    return parseFloat(mode === "inc" ? number + steps : number - steps);
}

// This function is to convert number into currency format.
function convertNumber(number, config) {
    // Use the converter if 'filesizing' or 'currency' is on.
    if (config.filesizing || config.currency) {
        number = Math.abs(Number(number)); // Get the absolute value of number.

        var baseNumber = 1000, // Base multiplying threshold.
            symbol =
                config.currency && typeof config.currency === "string"
                    ? config.currency
                    : "", // Set the currency symbol (if any).
            limit = config.decimals || 1, // Set the decimal limit (default is 1).
            unit = ["", "K", "M", "B", "T"], // Number unit based exponent threshold.
            value = ""; 

        // Changes base number and its unit for filesizing.
        if (config.filesizing) {
            baseNumber = 1024; // Use 1024 instead of 1000.
            unit = ["bytes", "KB", "MB", "GB", "TB"]; // Change to 'bytes' unit.
        }

        // Set the value based on the threshold.
        for (var i = 4; i >= 0; i--) {
            // If the exponent is 0.
            if (i === 0) value = `${number.toFixed(limit)} ${unit[i]}`;
            // If the exponent is above zero.
            if (number >= getFilesizeThreshold(baseNumber, i)) {
                value = `${(number / getFilesizeThreshold(baseNumber, i)).toFixed(
                    limit
                )} ${unit[i]}`;
                break;
            }
        }

        // Apply the symbol before the value and return it as string.
        return symbol + value;
    } else {
        // Return its value as float if not using filesizing or currency.
        return parseFloat(number);
    }
}

// This function will get the given filesize base.
function getFilesizeThreshold(baseNumber, index) {
    return Math.pow(baseNumber, index);
}

// This function is to get the last formated number.
function applySeparator(value, config) {
    // Get replaced value based on it's separator/symbol.
    function replacedValue(val, separator) {
        // Regex to determine the seperator configuration of the number.
        var separatorRegExp =
            /^(?:(\d{1,3},(?:\d{1,3},?)*)|(\d{1,3}\.(?:\d{1,3}\.?)*)|(\d{1,3}(?:\s\d{1,3})*))([\.,]?\d{0,2}?)$/gi;

        return val.replace(separatorRegExp, function (match, g1, g2, g3, g4) {
            var result = "",
                sep = "";
            if (g1 !== undefined) {
                // The number's format is using a comma as the thousand separator, and a period as the decimal separator.
                result = g1.replace(new RegExp(/,/gi, "gi"), separator);
                sep = ",";
            } else if (g2 !== undefined) {
                // The number's format is using a period as the thousand separator, and a comma as the decimal separator.
                result = g2.replace(new RegExp(/\./gi, "gi"), separator);
            } else if (g3 !== undefined) {
                // The number's format is using a space as the thousand separator, and a comma as the decimal separator.
                result = g3.replace(new RegExp(/ /gi, "gi"), separator);
            }
            if (g4 !== undefined) {
                var decimal = sep !== "," ? (separator !== "," ? "," : ".") : ".";
                result +=
                    g4 !== undefined
                        ? g4.replace(new RegExp(/\.|,/gi, "gi"), decimal)
                        : "";
            }
            
            return result;
        });
    }
    
    // If the config formater is not false, then apply the separator.
    if (config.formater) {
        // Now get the separator symbol.
        var symbol = config.separator // If config separator is set.
            ? typeof config.separator === "string"
                ? config.separator // If its type is a string, then apply its value.
                : "," // If it's not string (boolean), then apply comma (as a default separator).
            : "";
        // Special exception when locale is not 'en-US' but separator value is 'true' (use it's default locale thausands separator).
        if (config.formater !== "en-US" && config.separator === true) {
            return value;
        }
        // Return the replaced value based on its symbol.
        return replacedValue(value, symbol);
    }
    // If config formater is false, then return its default value.
    return value;
}

// This function is to get formated number to be printed in the page.
function formatNumber(number, config) {
    // This is the configuration for the 'toLocaleString' method.
    var strConfig = {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
    };
    // Get the locale from config formater.
    var locale = typeof config.formater === "string" ? config.formater : undefined;

    // Set and convert the number based on its config.
    number = convertNumber(number, config);

    // Now format the number to string based on its locale.
    number = config.formater
        ? number.toLocaleString(locale, strConfig)
        : parseInt(number).toString();

    // Apply the number separator using the number as a string.
    return applySeparator(number, config);
}

// Parse the value with the correct data type.
function parseValue(data) {
    // If the value is a number with dot (.) -> it will be parsed as a float.
    if (/^[0-9]+\.[0-9]+$/.test(data)) {
        return parseFloat(data);
    }
    // If it's just a plain number, it will be parsed as integer.
    if (/^[0-9]+$/.test(data)) {
        return parseInt(data);
    }
    // If it's a boolean or a string, it will be parsed as boolean.
    if (/^true|false/i.test(data)) {
        return /^true/i.test(data);
    }
    // Just return the data, no need for ensuring the data type.
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
        top + height <= window.pageYOffset + window.innerHeight &&
        left + width <= window.pageXOffset + window.innerWidth
    );
}

// Check if the browser supports the Intersection Observer.
function intersectionListenerSupported() {
    return (
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype
    );
}

// Initialize PureCounter.
function PureCounter(options = {}) {
    var configs = {
        start: 0, // Starting number [uint]
        end: 100, // End number [uint]
        duration: 2000, // Count duration [milisecond]
        delay: 10, // Count delay [milisecond]
        once: true, // Counting at once or recount when scroll [boolean]
        pulse: false, // Pulse count for certain time [boolean|milisecond]
        decimals: 0, // Decimal places [uint]
        legacy: true, // If this is true it will use the scroll event listener on browsers
        filesizing: false, // Enable filesizing counting [boolean]
        currency: false, // Is it for currency? Use it for set the symbol too [boolean|char|string]
        separator: false, // Do you want to use thausands separator? use it for set the symbol too [boolean|char|string]
        formater: "us-US", // Number toLocaleString locale/formater, by default is "en-US" [string|boolean:false]
        selector: ".purecounter", // HTML query selector for spesific element
    };
    var configOptions = setOptions(options, configs);

    function registerEventListeners() {
        // Get all elements with the selector class (default: 'purecounter') 
        var elements = document.querySelectorAll(configOptions.selector);
        // Abort if there is no found elements.
        if (elements.length === 0) {
            return;
        }

        // Run animate elements based on Intersection Support 
        if (intersectionListenerSupported()) {
            var intersectObserver = new IntersectionObserver(animateElements.bind(this), {
                root: null,
                rootMargin: "20px",
                threshold: 0.5,
            });

            elements.forEach((element) => {
                intersectObserver.observe(element);
            });
        } else {
            if (window.addEventListener) {
                animateLegacy(elements);
                window.addEventListener(
                    "scroll",
                    function (e) {
                        animateLegacy(elements);
                    },
                    { passive: true }
                );
            }
        }
    }

    // Run animations for legacy browsers.
    function animateLegacy(elements) {
        elements.forEach((element) => {
            var config = parseConfig(element);
            if (config.legacy === true && elementIsInView(element)) {
                animateElements([element]);
            }
        });
    }

    // Run animations for modern browsers.
    function animateElements(elements, observer) {
        elements.forEach((element) => {
            var elm = element.target || element; // Just make sure which element will be used
            var elementConfig = parseConfig(elm); // Get config value on that element

            // If duration is less than or equal zero, just format the 'end' value
            if (elementConfig.duration <= 0) {
                return (elm.innerHTML = formatNumber(elementConfig.end, elementConfig));
            }

            if (
                (!observer && !elementIsInView(element)) ||
                (observer && element.intersectionRatio < 0.5)
            ) {
                var value =
                    elementConfig.start > elementConfig.end
                        ? elementConfig.end
                        : elementConfig.start;
                return (elm.innerHTML = formatNumber(value, elementConfig));
            }

            // If duration is more than 0, then start the counter
            setTimeout(() => {
                return startCounter(elm, elementConfig);
            }, elementConfig.delay);
        });
    }

    // This function is to generate the element config.
    function parseConfig(element) {
        // First, we need to declare the base Config
        // This config will be used if the element doesn't have config
        var baseConfig = configOptions;

        // Next, get all 'data-precounter-*' attributes value. Store to array
        var configValues = [].filter.call(element.attributes, function (attr) {
            return /^data-purecounter-/.test(attr.name);
        });

        // Now, we create element config as an object
        var elementConfig =
            configValues.length != 0
                ? Object.assign(
                      {},
                      ...configValues.map(({ name, value }) => {
                          var key = name.replace("data-purecounter-", "").toLowerCase(),
                              val = parseValue(value);

                          return { [key]: val };
                      })
                  )
                : {};

        // Last setOptions and return
        return setOptions(elementConfig, baseConfig);
    }

    // Run the initial function.
    registerEventListeners();
}

module.exports = PureCounter;
