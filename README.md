# &lt;spark-line>
`<spark-line>` is a web component for making...spark lines!

It includes data points on hover and adjusts the line/fill color based 
on thresholds score values from [Lighthouse](https://github.com/GoogleChrome/lighthouse).

<img width="1005" alt="screen shot 2018-10-02 at 9 00 33 am" src="https://user-images.githubusercontent.com/238208/46361086-a8063680-c621-11e8-8db7-89e57bb6c40f.png">

(Note: the Lighthhouse score gauge in the screenshot is not part of thhe component).

Future work
- Make threshold score coloring configurable.
- Make interactivity optional.
- Have option to show all data points.

### Usage

First run `npm run build` to build the sass file.

```html
<!-- Element doesn't use shadow dom, so styles are scoped in sass. -->
<link rel="stylesheet" href="demo/sparkline-element.min.css">

<!-- Import the element definition. Note: The custom element registers itself. -->
<script type="module" src="sparkline-element.js"></script>

<!-- Give it layout/size, style it up. -->
<style>
 spark-line {
  display: inline-block;
  width: 100%;
  height: 75px;
  contain: content;
}
</style>


<spark-line values="[0,30,35,45,65,100,85,100]"></spark-line>

<!-- Fills under chart with a gradient -->
<spark-line values="[95,92,85,75,75,78,75,80,65,45]" fill></spark-line>

<!-- Shows circle for last data point. -->
<spark-line values="[0,30,35,45,65,100,85,100]" fill showlast></spark-line>
```
