#### JS_CustomWebComponents
When i came to know about possiblities of making my own javaScript based custom web components.
first thing i did was go to [Google Developers](https://developers.google.com/web/fundamentals/web-components/) and [Mozilla](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and gone 
through the documentation and finally developing my own web components

Each component are going to have their own attributes defined and can perform various operations whatever i can think of.

##### Developed untill now:
   1. Tootltip 
   `<my-tooltip displaytext='Web Component' backgroundColor='red'  textcolor='#ec4100' position='top'></my-tooltip>`
   **Description**
   * Component name: my-tooltip
   * Attributes: 
      1. displaytext - can display text about an element.
      2. backgroundColor - color name/hexcode and all other ways css provides can be used here.
      3. textColor - color name/hexcode and all other ways css provides can be used here.
      4. position - the location where we want to show the tooltip top/bottom/right/left.
   
   2. LazyImage
      `<lazy-image alt="Picture Caption" src="<path_of_image>">`
         `<----Additional Component/Element if any we want to show on image----->`
      `</lazy-image>`
      **Description**
      * Component name: lazy-image
      * Attributes:
       1. alt - use to display image alternate text if image is not loading.
       2. src - path of image, we can add url,local path.

   3. Modal
      `<modal-element modal-title='My Modal' open='true'>`
   		`<h2 slot='modaltitleSlot'>My</h2>`
   	`</modal-element>`
   **Description**
   * Component name: modal-element
   * Attributes: 
      1. modal-title - can display text about an element.
      2. open - color name/hexcode and all other ways css provides can be used here.
      3. Slots - Used to replace element and make them appear as an html element
         a. modaltitleSlot: Slot for title to display on as modal heading 
