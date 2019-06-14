# A simple yet configurable native javascript counter which you can count on.

<p align="center">
    <a href="https://www.npmjs.com/package/@srexi/purecounter.js"><img src="https://img.shields.io/npm/v/@srexi/purecounter.js.svg" alt="NPM"></a>
    <a href="https://npmcharts.com/compare/@srexi/purecounter.js?minimal=true"><img src="https://img.shields.io/npm/dt/@srexi/purecounter.js.svg" alt="NPM"></a>
    <a href="https://www.npmjs.com/package/@srexi/purecounter.js"><img src="https://img.shields.io/npm/l/@srexi/purecounter.js.svg" alt="NPM"></a>
</p>


```
npm i --save-dev @srexi/purecounter.js
```

## Demo:
[Demo Hosted On Github](https://srexi.github.io/purecounter.js/)

## How to use it:
To use it simple add the class: 'purecounter' to an element.
```html
<p>I can count: <span class="purecounter"></span></p>
```
**Lazy Loading Is Applied Automatically**

You can configure it by adding a data-purecounter-* attribute, here's an example:
```html
<p>It's over (wait for it): <span data-purecounter-start="0" data-purecounter-end="9001" class="purecounter"></span>!!!</p>
```

Simply replace the * in "data-purecounter-*" with any of the api methods:
```
start - The number to start from (if this is more than the end method it will automatically count down).
end - The number to end at.
duration - The time in seconds for the animation to complete, you can use decimals like: 0.5 for half a second.
delay - The delay between each iteration (the default of 10 will produce 100 fps)
once - If it should only do the animation once. If this is off the number will do the animation every time the element comes into view, otherwise it will only do it the first time.
decimals - how many decimal places to show. It will automatically format the number according to the individual users browser standards.
legacy - Purecounter will use the very leightweight & fast intersectionListener available in most modern browsers. If this is true it will use the scroll event listener on browsers which does not support the intersection listener (RECOMMENDED: true).
```

If you do not override the methods default to these values
```
start: 0 [uint]
end: 9001 [uint]
duration: 2 [seconds|uint]
delay: 10 [miliseconds|uint]
once: true [boolean]
decimals: 0 [uint]
legacy: true [boolean]
```

## Browser Support
- Chrome/Edge/Opera: Yes
- Firefox: Yes
- IE: 9+
- Safari: 9.1.3+ - I still need to test, this is the oldest browser version I've got my hands on so far (I have not seen the point where it doesn't work yet on this browser)
- **MISSING A BROWSER?** *Make A Pull Request*