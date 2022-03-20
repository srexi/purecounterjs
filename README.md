# A simple yet configurable native javascript counter you can **count** on.

**1.4kb GZIPPED Lightweight Javascript Counter**

<p align="center">
    <a href="https://www.npmjs.com/package/@srexi/purecounterjs"><img src="https://img.shields.io/npm/v/@srexi/purecounterjs.svg" alt="NPM"></a>
    <a href="https://npmcharts.com/compare/@srexi/purecounterjs?minimal=true"><img src="https://img.shields.io/npm/dt/@srexi/purecounterjs.svg" alt="NPM"></a>
    <a href="https://www.npmjs.com/package/@srexi/purecounterjs"><img src="https://img.shields.io/npm/l/@srexi/purecounterjs.svg" alt="NPM"></a>
    <a href="https://www.jsdelivr.com/package/npm/@srexi/purecounterjs"><img src="https://data.jsdelivr.com/v1/package/npm/@srexi/purecounterjs/badge" alt="jsdeliver traffic stats"></a>  
</p>

## Demo

[Proudly Hosted On Github Pages](https://srexi.github.io/purecounterjs/)

## Install

### NPM

```
npm i --save @srexi/purecounterjs
```

In your app.js import and initialized the module like normal.

```js
import PureCounter from "@srexi/purecounterjs";
const pure = new PureCounter();
```

### Vanilla

If you wish to skip the modular build and NOT use npm you can use the vanilla build like so:

### CDN

```html
<html>
    <head>
        ...
    </head>
    <body>
        ...

        <script src="https://cdn.jsdelivr.net/npm/@srexi/purecounterjs/dist/purecounter_vanilla.js"></script>
        <script>
            new PureCounter();
        </script>
    </body>
</html>
```

### Self hosted

Download the [dist/purecounter_vanilla.js]() file(for the minified version) or the [js/purecounter.js]() file (for the prettified) version and include it right before your closing body tag:

```html
<html>
    <head>
        ...
    </head>
    <body>
        ...

        <script src="dist/purecounter_vanilla.js"></script>
        <script>
            new PureCounter();
        </script>
    </body>
</html>
```

Or you can take the contents of the file and paste it into your bundle.js file.

## How to use it:

### 1. Initialize PureCounter:

```js
new PureCounter();

// Or you can customize it for override the default config.
// Here is the default configuration for all element with class 'filesizecount'
new PureCounter({
    // Setting that can't' be overriden on pre-element
    selector: ".purecounter", // HTML query selector for spesific element

    // Settings that can be overridden on per-element basis, by `data-purecounter-*` attributes:
    start: 0, // Starting number [uint]
    end: 100, // End number [uint]
    duration: 2, // The time in seconds for the animation to complete [seconds]
    delay: 10, // The delay between each iteration (the default of 10 will produce 100 fps) [miliseconds]
    once: true, // Counting at once or recount when the element in view [boolean]
    pulse: false, // Repeat count for certain time [boolean:false|seconds]
    decimals: 0, // How many decimal places to show. [uint]
    legacy: true, // If this is true it will use the scroll event listener on browsers
    filesizing: false, // This will enable/disable File Size format [boolean]
    currency: false, // This will enable/disable Currency format. Use it for set the symbol too [boolean|char|string]
    formater: "us-US", // Number toLocaleString locale/formater, by default is "en-US" [string|boolean:false]
    separator: false, // This will enable/disable comma separator for thousands. Use it for set the symbol too [boolean|char|string]
});
```

### 2. Set the element:

**To use it simply add the class: 'purecounter' to an element.**

```html
<p>I can count: <span class="purecounter">0</span></p>
```

**Lazy Loading Is Applied Out Of The Box**

**You can configure it per element by adding a `data-purecounter-*` attribute, here's an example:**

```html
<p>
    It's over (wait for it):
    <span
        data-purecounter-start="0"
        data-purecounter-end="9001"
        data-purecounter-currency="$"
        class="purecounter"
        >0</span
    >!!!
</p>
```

-   The end of this count will be showing `$9.0 K`.
-   Most settings can be overriden on the pre-element basis. The element configuration will only be used on that element.

## Default Values:

**If you do not override the methods default to these values:**

```
start: 0 [uint]
end: 100 [uint]
duration: 2 [seconds|uint]
delay: 10 [milliseconds|uint]
once: true [boolean]
pulse: false [boolean:false|seconds|uint]
decimals: 0 [uint]
legacy: true [boolean]
filesizing: false [boolean]
currency: false [boolean|char|string]
separator: false [boolean|char|string]
selector: '.purecounter' [query selector]
```

![Browser Tests By Browserstack](https://github.com/srexi/purecounterjs/blob/main/asset/browserstack-logo-600x315.png)

## Browser Support

-   Chrome/Edge/Opera: Yes
-   Firefox: Yes
-   IE: 9+
-   Safari: 7+
-   **MISSING A BROWSER?** _Make A Pull Request_
