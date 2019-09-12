/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_purecounter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/purecounter */ "./js/purecounter.js");

var pure = new _js_purecounter__WEBPACK_IMPORTED_MODULE_0__["default"]();

/***/ }),

/***/ "./js/purecounter.js":
/*!***************************!*\
  !*** ./js/purecounter.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PureCounter; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PureCounter =
/*#__PURE__*/
function () {
  function PureCounter() {
    _classCallCheck(this, PureCounter);

    this.registerEventListeners();
  }

  _createClass(PureCounter, [{
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this = this;

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
          window.addEventListener('scroll', function (e) {
            _this.animateLegacy(elements);
          }, {
            "passive": true
          });
        }
      }
    }
  }, {
    key: "animateLegacy",
    value: function animateLegacy(elements) {
      console.log("calling animateLegacy");

      for (var i = 0; i < elements.length; i++) {
        var config = this.parseConfig(elements[i]);

        if (config.legacy === true && this.elementIsInView(elements[i])) {
          this.animateElements([elements[i]]);
        }
      }
    }
  }, {
    key: "animateElements",
    value: function animateElements(elements, observer) {
      var _this2 = this;

      elements.forEach(function (element) {
        var elementConfig = typeof element.target !== "undefined" ? _this2.parseConfig(element.target) : _this2.parseConfig(element);

        if (elementConfig.duration <= 0) {
          return element.innerHTML = elementConfig.end.toFixed(elementConfig.decimals);
        }

        if (!observer && !_this2.elementIsInView(element) || observer && element.intersectionRatio < 0.5) {
          return element.target.innerHTML = elementConfig.start > elementConfig.end ? elementConfig.end : elementConfig.start;
        }

        setTimeout(function () {
          if (typeof element.target !== "undefined") {
            return _this2.startCounter(element.target, elementConfig);
          }

          return _this2.startCounter(element, elementConfig);
        }, elementConfig.delay);
      });
    }
  }, {
    key: "startCounter",
    value: function startCounter(element, config) {
      var _this3 = this;

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

      var counterWorker = setInterval(function () {
        var nextNum = _this3.nextNumber(currentCount, incrementsPerStep, config, countMode);

        element.innerHTML = _this3.formatNumber(nextNum, config);
        currentCount = nextNum;

        if (currentCount >= config.end && countMode == 'inc' || currentCount <= config.end && countMode == 'dec') {
          clearInterval(counterWorker);

          if (currentCount != config.end) {
            element.innerHTML = config.decimals <= 0 ? parseInt(config.end) : parseFloat(config.end).toFixed(config.decimals);
          }
        }
      }, config.delay);
    }
  }, {
    key: "parseConfig",
    value: function parseConfig(element) {
      var configValues = [].filter.call(element.attributes, function (attribute) {
        return /^data-purecounter-/.test(attribute.name);
      });
      var newConfig = {
        start: 0,
        end: 9001,
        duration: 2000,
        delay: 10,
        once: true,
        decimals: 0,
        legacy: true
      };

      for (var i = 0; i < configValues.length; i++) {
        var valueInd = configValues[i].name.replace('data-purecounter-', '');
        newConfig[valueInd.toLowerCase()] = valueInd.toLowerCase() == 'duration' ? parseInt(this.castDataType(configValues[i].value) * 1000) : this.castDataType(configValues[i].value);
      }

      return newConfig;
    }
  }, {
    key: "nextNumber",
    value: function nextNumber(number, steps, config, mode) {
      if (!mode) mode = 'inc';

      if (mode === 'inc') {
        return config.decimals <= 0 ? parseInt(number) + parseInt(steps) : parseFloat(number) + parseFloat(steps);
      }

      return config.decimals <= 0 ? parseInt(number) - parseInt(steps) : parseFloat(number) - parseFloat(steps);
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(number, config) {
      return config.decimals <= 0 ? parseInt(number) : number.toLocaleString(undefined, {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals
      });
    }
  }, {
    key: "castDataType",
    value: function castDataType(data) {
      if (/^[0-9]+\.[0-9]+$/.test(data)) {
        return parseFloat(data);
      }

      if (/^[0-9]+$/.test(data)) {
        return parseInt(data);
      }

      return data;
    }
  }, {
    key: "elementIsInView",
    value: function elementIsInView(element) {
      var top = element.offsetTop;
      var left = element.offsetLeft;
      var width = element.offsetWidth;
      var height = element.offsetHeight;

      while (element.offsetParent) {
        element = element.offsetParent;
        top += element.offsetTop;
        left += element.offsetLeft;
      }

      return top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth;
    }
  }, {
    key: "intersectionListenerSupported",
    value: function intersectionListenerSupported() {
      return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
    }
  }]);

  return PureCounter;
}();



/***/ }),

/***/ 1:
/*!**********************!*\
  !*** multi ./app.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\xampp\htdocs\pureCounter\app.js */"./app.js");


/***/ })

/******/ });