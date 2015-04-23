# plainOverlay

The simple jQuery Plugin for customizable overlay which covers a page, elements or iframe-windows that is specified. plainOverlay has basic functions only, and it has no image files and no CSS files. Just one small file.

**See <a href="http://anseki.github.io/jquery-plainoverlay">DEMO</a>**

This is used for making users wait until the your application is ready.  
The elements under the overlay don't accept access via mouse or keyboard. And scrollable element (e.g. `<body>`, `<div style="overflow:scroll">` or `<iframe>`) which is specified can't scroll.

Your progress-element (messages or images that means "Please wait...") can be shown to users on the overlay. You can free style it to perfect match for your web site. Or plainOverlay has a simple builtin progress-element.

plainOverlay does:

- Covering a page, elements or iframe-windows that is specified with the overlay.
- Avoiding focusing elements under the overlay. (by pressing Tab key)
- Avoiding scrolling a page, elements or iframe-windows that is specified.

```js
// Cover an element with overlay.
$('#post-form').plainOverlay('show');
// Hide overlay.
$('#post-form').plainOverlay('hide');

// Cover all of a page.
$('body').plainOverlay('show'); // Or, $(document), $(window)
```

## Getting Started
Load after jQuery.

```html
<script src="jquery-1.11.0.min.js"></script>
<script src="jquery.plainoverlay.min.js"></script>
```

## Methods

### `show`

```js
element.plainOverlay('show'[, options])
```

Cover specified element with the overlay. This element may be `<body>`, `<iframe>` or box-element like `<div>`. `$(document)` and `$(window)` are same as `$('body')`.  
If `options` (see [Options](#options)) is specified, element is initialized with specified `options` before the overlay is shown. If element is not initialized yet, element is initialized even if `options` is not specified.  
An element can be initialized by new `options` any number of times.

### `hide`

```js
element.plainOverlay('hide')
```

Hide the overlay.

### Initialize

```js
element.plainOverlay([options])
```

Initialize specified element. (preparation the overlay)  
The [`show`](#show) method too, can initialize. This is used to initialize without showing the overlay at voluntary time.  
You can specify `options` to every [`show`](#show) method. But, if `options` of an element isn't changed, re-initializing it isn't needed. Then, you specify `options` to only first [`show`](#show) method, or use this method for initializing it only once.  
If you don't customize [Options](#options) (using default all), this method isn't needed because `options` isn't specified to [`show`](#show) method, and element is initialized at only first time.

In this code, unneeded initializing is done again, again, and again.

```js
$('#show-button').click(function() {
  // Same initializing per every showing
  $('#list').plainOverlay('show', {duration: 500});
});
```

In this code, initializing is done at once.

```js
// Initialize without showing
var list = $('#list').plainOverlay({duration: 500});
$('#show-button').click(function() {
  // Show without initializing
  list.plainOverlay('show');
});
```

In this code, initializing is done at once.

```js
$('#show-button').click(function() {
  // Initializing is done at only first time
  list.plainOverlay('show');
});
```

### `option`

```js
currentValue = element.plainOverlay('option', optionName[, newValue])
```

Return the current option value (see [Options](#options)) as `optionName`. If `newValue` is specified, it is set before returning.

*NOTE:* The current version of the plainOverlay can change option value of [`duration`](#duration) and [`opacity`](#opacity) options. Use [Initialize](#initialize) method to update option value of others.

## Options

An `options` Object can be specified to [`show`](#show) method or [Initialize](#initialize) method. This Object can have following properties.

### `duration`

Type: Number  
Default: `200`

A number determining how long (milliseconds) the effect animation for showing and hiding the overlay will run.

### `fillColor`

Type: String  
Default: `'#888'`

A fill-color of the overlay.

```js
$('#list').plainOverlay({fillColor: 'red'});
```

`color` is an alias for `fillColor`.

### `opacity`

Type: Number  
Default: `0.6`

A number in the range `0.0` (invisible) to `1.0` (solid).

```js
$('#list').plainOverlay({opacity: 0.3});
```

If you want to style the overlay more, add style to `plainoverlay` class.

```css
.plainoverlay {
  background-image: url('bg.png');
}
```

### `progress`

Type: Function or Boolean  
Default: Builtin Element

The jQuery-Element that is returned by specified Function is shown to user as progress-element on the overlay. This is usually messages or images that means "Please wait...".  
If `false` is specified, nothing is shown on the overlay.  
The builtin element (default) is shown via CSS Animations in modern browsers (e.g. Firefox, Chrome, etc.), and it is shown via simple effect in legacy browsers (IE9, IE8, etc.). This choice is automatic.

```js
$('#list').plainOverlay({
  progress: function() { return $('<div>I am busy...</div>'); }
});
```

Of course your image files, some CSS codes which are distributed free in the internet, or any elements can be used. (e.g. SVG Animations [jxnblk/loading](https://github.com/jxnblk/loading))

If you want to change the color of shapes in builtin progress-element, use CSS below.

```css
/* Change to red */
.jQuery-plainOverlay-progress {
  border-color: red !important;
}
.jQuery-plainOverlay-progress-legacy div {
  background-color: red !important;
}
```

### `zIndex`

Type: Number  
Default: `9000`

A `z-index` CSS property of the overlay.

### `show`, `hide`

Type: Function  
Default: `undefined`

The [`plainoverlayshow`](#plainoverlayshow) and [`plainoverlayhide`](#plainoverlayhide) event handlers. This is convenient way to do `on(type, handler)` method. (see [Events](#events))

```js
$('#form1').plainOverlay({show: function(event) { console.log(event); } });
```

*NOTE:* If this option is specified in the [`show`](#show) method, declared Function or the variable the Function is assigned should be specified (Don't specify the function expression). Because the [`show`](#show) method may be called again, and the *function expression* generates the new Function every time.  
The *"function statement"* and the *"function operator"* are different.  
See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#Defining_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#Defining_functions)  
For example: this code is OK.

```js
function handler(event) { console.log(event); }
$('#show-button').click(function() {
  $('#form1').plainOverlay('show', {show: handler});
});
```

This code registers event handler repeatedly when the [`show`](#show) method is called.

```js
$('#show-button').click(function() {
  $('#form1').plainOverlay('show', {show: function(event) { console.log(event); } });
});
```

## Events

### `plainoverlayshow`

Triggered when the overlay is shown. (after the fading effect took [`options.duration`](#duration) to complete.)  
An event handler can be attached when initializing via [`options.show`](#show-hide) as well.

```js
$('#form1').on('plainoverlayshow', function(event) {
  $('#loading', event.target).text(size + ' Bytes Downloading');
});
```

### `plainoverlayhide`

Triggered when the overlay is hidden. (after the fading effect took [`options.duration`](#duration) to complete.)  
An event handler can be attached when initializing via [`options.hide`](#show-hide) as well.

```js
$('#form1').on('plainoverlayhide', function(event) {
  $('#complete-message').show();
});
```

## Note

- If target is `<iframe>` element, jQuery 1.10.3+ or 2.0.4+ must be used. (see [#14180: focusin/out special events don't work cross-window](http://bugs.jquery.com/ticket/14180))
- As everyone knows, IE8- has many problems. CSS `position:fixed` in HTML without `<!DOCTYPE>` is ignored.  
If your web site supports IE8- and it use `position:fixed`, HTML must include `<!DOCTYPE>` even if plainOverlay is not used. And plainOverlay uses `position:fixed`.
- [`plainoverlayshow`](#plainoverlayshow) and [`plainoverlayhide`](#plainoverlayhide) events bubble up the DOM hierarchy.

## See Also

[plainModal](http://anseki.github.io/jquery-plainmodal) may be better, if you want the overlay and dialog box (i.e. modal windows).
