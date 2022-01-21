const isIntersecting = ({isIntersecting}) => isIntersecting;

const tagName = 'lazy-image';
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: relative;
    }

    #image,
    #placeholder ::slotted(*) {
      position: absolute;
      top: 0;
      left: 0;
      transition:
        opacity
        var(--lazy-image-fade-duration, 0.3s)
        var(--lazy-image-fade-easing, ease);
      object-fit: var(--lazy-image-fit, contain);
      width: var(--lazy-image-width, 100%);
      height: var(--lazy-image-height, 100%);
    }

    #placeholder ::slotted(*),
    :host([intersecting]) #image {
      opacity: 1;
    }

    #image,
    :host([intersecting]) #placeholder ::slotted(*) {
      opacity: 0;
    }
  </style>
  <div id="placeholder" aria-hidden="false">
    <slot name="placeholder"></slot>
  </div>
  <img id="image" aria-hidden="true"/>
`;

window.ShadyCSS && window.ShadyCSS.prepareTemplate(template, tagName);

class LazyImage extends HTMLElement {
  /**
   * Guards against loops when reflecting observed attributes.
   * @param  {String} name Attribute name
   * @param  {any} value
   * @protected
   */
  safeSetAttribute(name, value) {
    if (this.getAttribute(name) !== value) this.setAttribute(name, value);   
  }

  static get observedAttributes() {
    return ['src', 'alt'];
  }

  /**
   * Image URI.
   * @type {String}
   */
  set src(value) {
    this.safeSetAttribute('src', value);
    if (this.shadowImage && this.intersecting) this.shadowImage.src = value;
  }

  get src() {
    return this.getAttribute('src');
  }

  /**
   * Image alt-text.
   * @type {String}
   */
  set alt(value) {
    this.safeSetAttribute('alt', value);
    if (this.shadowImage) this.shadowImage.alt = value;
  }

  get alt() {
    return this.getAttribute('alt');
  }

  set intersecting(value) {
    if (value) {
      this.shadowImage.onload = this.setIntersecting;
      this.shadowImage.src = this.src;
      this.disconnectObserver();
    } else {
      this.removeAttribute('intersecting');
    }
  }

  /**
   * Whether the element is on screen.
   * @type {Boolean}
   */
  get intersecting() {
    return this.hasAttribute('intersecting');
  }

  constructor() {
    super();
    this.observerCallback = this.observerCallback.bind(this);
    this.setIntersecting = this.setIntersecting.bind(this);
  }

  connectedCallback() {
    this.setAttribute('role', 'presentation');
    this.updateShadyStyles();
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowImage = this.shadowRoot.getElementById('image');
      this.shadowPlaceholder = this.shadowRoot.getElementById('placeholder');
      this.src = this.getAttribute('src');
      this.alt = this.getAttribute('alt');
      this.placeholder = this.getAttribute('placeholder');
    }
    if ('IntersectionObserver' in window) this.initIntersectionObserver();
    else this.intersecting = true;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[name] = newVal;
  }

  disconnectedCallback() {
    this.disconnectObserver();
  }

  /**
   * When the polyfill is at play, ensure that styles are updated.
   * @protected
   */
  updateShadyStyles() {
    window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }

  /**
   * Sets the intersecting attribute and reload styles if the polyfill is at play.
   * @protected
   */
  setIntersecting(event) {
    this.shadowImage.removeAttribute('aria-hidden');
    this.shadowPlaceholder.setAttribute('aria-hidden', 'true');
    this.setAttribute('intersecting', '');
    this.updateShadyStyles();
  }

  /**
   * Sets the `intersecting` property when the element is on screen.
   * @param  {[IntersectionObserverEntry]} entries
   * @protected
   */
  observerCallback(entries) {
    if (entries.some(isIntersecting)) this.intersecting = true;
  }

  /**
   * Initializes the IntersectionObserver when the element instantiates.
   * @protected
   */
  initIntersectionObserver() {
    if (this.observer) return;
    // Start loading the image 10px before it appears on screen
    const rootMargin = '10px';
    this.observer = new IntersectionObserver(this.observerCallback, { rootMargin });
    this.observer.observe(this);
  }


  /**
   * Disconnects and unloads the IntersectionObserver.
   * @protected
   */
  disconnectObserver() {
    this.observer.disconnect();
    this.observer = null;
    delete this.observer;
  }
}

const register = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(register) : register();

/* 
<lazy-image alt="Picture of a cat" src="https://placekitten.com/400/200">
   <svg slot="placeholder"><use xlink:href="#placeholder-svg"></use></svg>
</lazy-image>
*/