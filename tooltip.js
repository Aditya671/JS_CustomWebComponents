'use strict'

const template =  document.createElement('template');
template.innerHTML = `
   <style>
   .tooltipContainer{
      position:relative;
   }
   .myText{
      // background:#161616;
      padding:8px 12px;
      border-radius:8px;
      border:1px solid #aaa;
      position:absolute;
   }
   .myText:host(:hover){
      background-color: #fd8fff;
   } 
   // ::host(.myText::part(div):hover) {
   //    background-color: #fd8fff;
   //  }
   </style>
   <div class='tooltipContainer'>
      <div class='showTooltip'>
         <span id='toolTipIcon'>??</span>
         <div id='myText'>
         </div>   
      </div>
   </div>
`
customElements.define('my-tooltip',
   class Tooltip extends HTMLElement{
      static get observedAttributes(){
         return ['displaytext','position','textcolor','backgroundColor']
      }
      get displaytext(){
         return this.hasAttribute('displaytext');
      }
      set displaytext(val){
         if(val){
            this.setAttribute('displaytext', val);
         }
         else{
            this.removeAttribute('displaytext');
         }
      }
      get position(){
         return this.hasAttribute('position');
      }
      set position(val){
         if(val){
            this.setAttribute('position', val);
         }
         else{
            this.removeAttribute('position');
         }
      }
      get textcolor(){
         return this.hasAttribute('textcolor');
      }
      set textcolor(val){
         if(val){
            this.setAttribute('textcolor', val);
         }
         else{
            this.removeAttribute('textcolor');
         }
      }
      get backgroundColor(){
         return this.hasAttribute('backgroundColor');
      }
      set backgroundColor(val){
         if(val){
            this.setAttribute('backgroundColor', val);
         }
         else{
            this.removeAttribute('backgroundColor');
         }
      }
      constructor(){
         super();
         this.attachShadow({mode:'open'});
         this.TextElement = '';
         this.toolTipLocation = 'bottom';
         this.displayText = 'Please Enter something';
         this.shadowRoot.appendChild(template.content.cloneNode(true));
         this.defaulttextcolor = '#ffffff';
         this.defaultBgColor = 'rgba(16,17,25)';
      }
      
      _addTextElement(){
         this.TextElement = document.createElement('p');
         this.TextElement.textContent = this.displayText;
         this.shadowRoot.querySelector('#myText').appendChild(this.TextElement);
         this.shadowRoot.querySelector('#myText').classList.add('myText')
      }
      _removeTextElement(){
         const shadowElement = this.shadowRoot.querySelector('#myText');
         shadowElement.classList.remove('myText');
         shadowElement.removeAttribute('style');
         shadowElement.removeChild(this.TextElement);
      }
      _addTextCSS(){
         let val = this.toolTipLocation || 'bottom'
         const shadowElement = this.shadowRoot.querySelector('#myText');
         if(val === 'bottom'){
            return shadowElement.style.bottom = '-100px';
         }
         else if(val === 'top'){
            return shadowElement.style.top = '-20px';
         }
         else if(val === 'left'){
            return shadowElement.style.left = '-100px';
         }
         else if(val === 'right'){
            return shadowElement.style.right = '20px';
         }
         else{
            return shadowElement.style.bottom = '-20px';
         }
      }
      _addtextcolorStyles(){
         if(this.defaultTextcolor){
            return this.shadowRoot.querySelector('#myText').style.color = this.defaultTextcolor;
         }
         else{
            return this.shadowRoot.querySelector('#myText').style.color = '#ffffff';
         }
      }
      _addBgColorStyles(){
         if(this.defaultBgColor){
            return this.shadowRoot.querySelector('#myText').style.backgroundColor = this.defaultBgColor;
         }
         else{
            return this.shadowRoot.querySelector('#myText').style.backgroundColor = 'rgba(16,17,25)';
         }
      }
      connectedCallback(){
         this.toolTipLocation= this.getAttribute('position');
         this.displayText = this.getAttribute('displaytext');
         this.defaultTextcolor = this.getAttribute('textcolor') ;
         this.defaultBgColor = this.getAttribute('backgroundColor');
         this.shadowRoot.querySelector('#toolTipIcon').addEventListener('mouseenter',this._addTextElement.bind(this));
         this.shadowRoot.querySelector('#toolTipIcon').addEventListener('mouseleave',this._removeTextElement.bind(this));
         this.shadowRoot.querySelector('#myText').addEventListener('mouseenter',this._addTextCSS.bind(this));
         this.shadowRoot.querySelector('#myText').addEventListener('mouseenter',this._addtextcolorStyles.bind(this));
         this.shadowRoot.querySelector('.tooltipContainer').addEventListener('mouseenter',this._addBgColorStyles.bind(this));

      }  
      disconnectedCallback(){
         this.shadowRoot.querySelector('#toolTipIcon').removeEventListener('mouseenter',this._addTextElement.bind(this));
         this.shadowRoot.querySelector('#toolTipIcon').removeEventListener('mouseleave',this._removeTextElement.bind(this));
         this.shadowRoot.querySelector('#myText').addEventListener('mouseenter',this._addTextCSS.bind(this));
         this.shadowRoot.querySelector('#myText').addEventListener('mouseenter',this._addtextcolorStyles.bind(this));
         this.shadowRoot.querySelector('.tooltipContainer').addEventListener('mouseenter',this._addBgColorStyles.bind(this));
      }
      attributeChangedCallback(attr, oldValue, newValue) {
         if(oldValue !== newValue){
            this[attr] = newValue;
         }
      }
   }
);
(function(){
   if(window){
      const myTooltipElement = document.querySelector('my-tooltip');
      setTimeout(() => {
         myTooltipElement.style.display = 'inline-block'
         myTooltipElement.style.padding = '8px';   
      }, 200);
   }
})();
