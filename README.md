# spark-line
`<spark-line>` web component for making...spark lines!


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