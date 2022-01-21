'use strict'
const modalElementHTML = document.createElement('template')
modalElementHTML.innerHTML = `
   <div class='modal-backdrop'></div>
   <div class='modal'>
      <div class='modal-dialog'>
         <div class='modal-content'>
            <div class='modal-header'>
               <!-- <slot name='modaltitleSlot'></slot> -->
               <h2 class='modal-title'></h2>
               <button class='btn btn-hidden text-theme closeModal'>&times;</button>
            </div>
            <div class='modal-body'>
               <slot class='modalbodySlot'></slot>
            </div>
            <div class='modal-footer'>
               <slot name='modalfooterSlot'></slot>
               <button class='btn btn-danger text-theme bg-danger closeModal'>Close</button>
            </div>
         </div>
      </div>
   </div>
`;
customElements.define('modal-element',
   class ModalData extends HTMLElement{
      static get observedAttributes(){
         return ['open','modal-title','modal-body','modal-footer']
      }
      /* Open attribute is used to open the modal  */
      get open(){
         return this.hasAttribute('open')
      }
      set open(val){
         /* if open receives value as true then the element will be visible on the front end */
         if(val)
            this.setAttribute('open',val)
         else
            this.removeAttribute('open')
      }
      /* ModalTitle provides the title on the element Header */
      get modalTitle(){
         return this.hasAttribute('modal-title');
      }
      set modalTitle(val){
         if(val){
            this.setAttribute('modal-title', val);
         }
         else{
            this.removeAttribute('modal-title');
         }
      }
      /* Modal Body adds the required body to the Modal Dialog Container ~ added as a slot to the element */
      get modalBody(){
         return this.hasAttribute('modal-body');
      }
      set modalBody(val){
         if(val){
            this.setAttribute('modal-body', val);
         }
         else{
            this.removeAttribute('modal-body');
         }
      }
      /* Modal Footer adds the footer body mostly receives user reaquested action ~ added as a slot */
      get modalFooter(){
         return this.hasAttribute('modal-footer');
      }
      set modalFooter(val){
         if(val){
            this.setAttribute('modal-footer', val);
         }
         else{
            this.removeAttribute('modal-footer');
         }
      }
      // Element initialized during run time and constructor gets called immediately;
      constructor(){
         super();
         this.attachShadow({mode:'open'});
         this.shadowRoot.appendChild(modalElementHTML.content.cloneNode(true));
         this.modaltitle = 'Please add text here';
         this.modalbody = `<h1>Modal title will appear here</h1>`;
         this.modalfooter = `Action Performing Location`;
         this.isOpen = false;
         this.handleClose = this.handleClose.bind(this); // Function will close the modal;
         this.pressedKeyAction = this.pressedKeyAction.bind(this); // Function to trace pressed key
      }

      // makes the element active whenever necessary and executes every statement
      connectedCallback(){
         const shadowListener = this.shadowRoot;
         this.isOpen = this.getAttribute('open');
         this.modaltitle = this.getAttribute('modal-title') || 'Please Add title here';
         this.modalbody = this.getAttribute('modal-body');
         this.modalFooter = this.getAttribute('modal-footer');
         if(this.isOpen){
            this.openModalFun(this.isOpen);
         }
         shadowListener.querySelector('.modal-backdrop').addEventListener('click',this.handleClose);
         shadowListener.querySelector('.closeModal').addEventListener('click',this.handleClose);
      }

      // diconnects the element from the front end and removes itself 
      disconnectedCallback(){
         const shadowListener = this.shadowRoot;
         shadowListener.querySelector('.modal-backdrop').style.display = 'block';
         shadowListener.querySelector('.modal-backdrop').style.opacity = 1;
         shadowListener.querySelector('.modal-backdrop').removeEventListener('click',this.handleClose);
         shadowListener.querySelector('.closeModal').removeEventListener('click',this.handleClose);
      }
      
      // This function will run whenever the attribute value is changed on the front end 
      attributeChangedCallback(attr, oldValue, newValue) {
         if(oldValue !== newValue){
            this[attr] = newValue;
         }
      }
      openModalFun = (val) => {
         const shadowListener = this.shadowRoot;
         if(val === true || val === 'true'){
            shadowListener.querySelector('.modal-title').innerHTML = this.modaltitle ;
            shadowListener.querySelector('.modal-backdrop').style.display = 'block';
            shadowListener.querySelector('.modal-backdrop').style.opacity = 1;
            shadowListener.querySelector('.modal').style.display = 'block';
            shadowListener.querySelector('.modal').style.opacity = 1;
            const dispatchObtainedEvent = new CustomEvent('closeModal');
            this.dispatchEvent(dispatchObtainedEvent);
         }
      }
      // handleClose function will close the modal if isOpen variable is set to true
      handleClose = () => this.isOpen !== false ? this.isOpen === false : this.isOpen === true;

      // trace the key pressed when the element is active
      pressedKeyAction = (e) => e.key === 'Escape' ? this.handleClose() : null;

   }
)



const modalElementCSS = `
   <style>
      .modal-backdrop{
         position:fixed;
         top:0;
         left:0;
         right:0;
         bottom:0;
         min-width:100%;
         min-height:100vh;
         z-index:10;
      }
      .modal{
         position:fixed;
         top:20%;
         left:40%;
         right:auto;
         bottom:auto;
         transform:translate(-30%,-20%);
         width:fit-content;
         height:fit-content;
         padding:14px;
         border-radius:8px;
         z-index:12;
         background:#ffffff;
         color:#000000;
      }
   </style>
`;
(function(){
   const customModalElement = document.querySelector('modal-element');
   setTimeout(() => {
      // if()

   }, 1000);
})()