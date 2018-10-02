//const DevsiteCustomElement = goog.require('devsite.app.CustomElement');
//const lit = goog.require('lit-html');
//const {html, render} = lit;

import {html, render} from './node_modules/lit-html/lit-html.js';
// import {repeat} from './lit-html/directives/repeat.js';

/**
 * Example element.
 */
class SparklineElement extends HTMLElement {
  constructor() {
    super();

    /** @private {!Array<number>} */
    this.values_ = JSON.parse(this.getAttribute('values')) || [];
    /** @private {number} */
    this.fill_ = false;
    /** @private {number} */
    this.stroke_ = 2;
     /** @private {number} */
    this.circleRadius_ = 4;
    /** @private {number} */
    this.padding_ = 10;
    /** @private {number} */
    this.scoreHeight_ = 15;
    /** @private {boolean} */
    this.showlast_ = false;

    /** @private {number} */
    this.width_ = null;
    /** @private {number} */
    this.height_ = null

    /** @export {!Array<Object>} */
    this.datapoints = [];
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return ['fill', 'showlast'];
  }

  /**
   * @return {string}
   * @export
   */
  static getTagName() {
    return 'spark-line';
  }

  /**
   * @return {!Array<number>}
   * @export
   */
  get values() {
    return this.values_;
  }

  /**
   * @param {!Array<number>} val
   * @export
   */
  set values(val) {
    this.values_ = val;
  }

  /**
   * @return {boolean}
   * @export
   */
  get fill() {
    return this.fill_;
  }

  /**
   * @param {boolean} val
   * @export
   */
  set fill(val) {
    this.fill_ = Boolean(val);
    if (this.fill_) {
      this.setAttribute('fill', '');
    } else {
      this.removeAttribute('fill');
    }
  }

   /**
   * @return {boolean}
   * @export
   */
  get showlast() {
    return this.showlast_;
  }

  /**
   * @param {boolean} val
   * @export
   */
  set showlast(val) {
    this.showlast_ = Boolean(val);
    if (this.showlast_) {
      this.setAttribute('showlast', '');
    } else {
      this.removeAttribute('showlast');
    }
  }

  /**
   * @param {string} attr
   * @param {?string} oldValue
   * @param {?string} newValue
   * @param {?string} namespace
   * @export
   * @override
   */
  attributeChangedCallback(attr, oldValue, newValue, namespace) {
    if (oldValue === newValue) {
      return;
    }
    if (attr === 'fill') {
      this.fill = newValue !== null;
    } else if (attr === 'showlast') {
      this.showlast = newValue !== null;
    }
    this.update_();
  }

  /**
   * @export
   * @override
   */
  connectedCallback() {
    const rect = this.getBoundingClientRect();
    this.width_ = parseInt(this.getAttribute('width') || rect.width);
    this.height_ = parseInt(this.getAttribute('height')) || rect.height;

    // Account for padding and diameter of data point circle.
    const circleDiameter = this.circleRadius_ * 2;
    this.width_ = this.width_ - this.padding_ - circleDiameter;
    this.height_ = this.height_ - this.padding_ - circleDiameter - this.scoreHeight_;

    this.update_();

    this.addEventListener('mousemove', e => {
      const mouseX = event.offsetX;

      const nextDataPointIdx = this.datapoints.findIndex(entry => entry.x >= mouseX);
      const prevPoint = this.datapoints[nextDataPointIdx - 1];
      const nextPoint = this.datapoints[nextDataPointIdx];

      let point;
      if (!nextPoint) {
        point = this.datapoints[this.datapoints.length - 1];
      } else if (!prevPoint) {
        point = this.datapoints[0];
      } else if (Math.abs(mouseX - prevPoint.x) <= Math.abs(mouseX - nextPoint.x)) {
        point = prevPoint;
      }

      if (point) {
        const colorClass = this.computeColorClass_(point.score);

        this.cursor_.setAttribute('x1', point.x);
        this.cursor_.setAttribute('x2', point.x);
        this.cursor_.setAttribute('y1', point.y);
        this.cursor_.setAttribute('y2', this.height_);
        this.cursor_.style.stroke = colorClass;
        this.score_.textContent = point.score; // set text first, then measure.
        this.score_.setAttribute('x',
            point.x - this.score_.getBoundingClientRect().width / 2);
        this.score_.setAttribute('y', point.y + 6);
        this.score_.style.fill = colorClass;
      }
    });

    this.addEventListener('mouseout', e => {
      this.cursor_.setAttribute('x1', -1000);
      this.cursor_.setAttribute('x2', -1000);
      this.score_.setAttribute('x', -1000);
      this.score_.setAttribute('y', -100);
    });
  }

  /**
   * Generates the line path from values.
   * @return {!{path: string, lastPoint: {x: number, y: number}}}
   * @private
   */
  generatePath_() {
    const min = Math.min(...this.values);
    const max = Math.max(...this.values);

    const c = (x) => {
      const s = this.height_ / (max - min);
      return this.height_ - (s * (x - min));
    };

    const offset = Math.floor(this.width_ / (this.values.length - 1));
    let path = `M0 ${c(this.values[0]).toFixed(2)}`;
    const firstPoint = {};
    const lastPoint = {};

    this.datapoints = [];

    this.values.forEach((val, i) => {
      const x = i * offset;
      const y = parseFloat(c(val).toFixed(2));
      path += ` L ${x} ${y}`;
      if (i === 0) {
        firstPoint.x = x;
        firstPoint.y = y;
      }
      if (i === this.values.length - 1) {
        lastPoint.x = x;
        lastPoint.y = y;
      }
      this.datapoints.push({x, y, score: val});
    });

    return {path, firstPoint, lastPoint};
  }

  generateTemplate_() {
    // Determine color of chart based on last value.
    const colorClass = this.computeColorClass_(this.values_.slice(-1))
    const {path, firstPoint, lastPoint} = this.generatePath_();

    /** @private {!TemplateResul?t} */
    const template = html`
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
           style="padding:${this.padding_}px;">
        <linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" class="green" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0.4"/>
        </linearGradient>
        <linearGradient id="gradient-orange" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" class="orange" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0.4"/>
        </linearGradient>
        <linearGradient id="gradient-red" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" class="red" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0.4"/>
        </linearGradient>
        <g transform="translate(0,${this.scoreHeight_})" class="${colorClass}">
          <path id="gradient" d="${path} V ${this.height_ + this.scoreHeight_ / 2} H 0 Z"
            stroke="none" fill="${this.fill ? `url(#gradient-${colorClass})` : 'none'}"/>
          <line id="cursor" stroke-opacity="1"
            x1="-1000" x2="-1000" y1="0" y2="${this.height_}"
            stroke-width="1"/>
          <path d="${path}" fill="none" stroke-width="${this.stroke_}" class="path"/>
          <circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="${this.circleRadius_}"
            fill="${this.showlast ? '#fff' : 'none'}"
            stroke-width="${this.showlast ? this.stroke_ : 0}"/>
        </g>
        <text id="score" x="-1000" y="-1000"></text>
      </svg>`;

      return template;
  }

  // <!-- <circle cx="${firstPoint.x}" cy="${firstPoint.y}" r="${this.circleRadius_}"
  // fill="#fff" stroke-width="${this.stroke_}"/> -->

  /**
   * Determines Lighthouse pass/average/fail coloring based on value.
   * @param {number} val
   * @return {string}
   * @private
   */
  computeColorClass_(val) {
    // Match to Lighthhouse rating.
    // https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/report/html/renderer/util.js
    let colorClass = 'red';
    if (val > 90) {
      colorClass = 'green';
    } else if (val > 50) {
      colorClass = 'orange';
    }
    return colorClass;
  }

  /**
   * @private
   */
  update_() {
    render(this.generateTemplate_(), this);
    this.cursor_ = this.querySelector('#cursor');
    this.score_ = this.querySelector('#score');

    const path = this.querySelector('.path');
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    requestAnimationFrame(() => {
      this.querySelector('#gradient').classList.add('fadein');
    });
  }
}

customElements.define(SparklineElement.getTagName(), SparklineElement);

export {SparklineElement};
