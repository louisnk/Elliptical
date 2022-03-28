
import '/assets/js/modules/dom.js';
import '/assets/js/modules/did.js';


var DIDViewer = globalThis.DIDViewer = class DIDViewer extends HTMLElement {
  static get observedAttributes() {
    return ['did', 'open'];
  }
  constructor(options = {}) {
    super();
    this.options = options
    console.log('constructed a did-viewer', options)

    const selListener = this.addEventListener('tabselected', (e) => {
      console.log('tabselected: ', e)
    })

    this.addEventListener('beforeunload', selListener)

    this.innerHTML = `
      <tab-panels>
        <nav>
          <button type="button" selected>Identifiers</button>
          <button type="button">Keys</button>
          <button type="button">Service Endpoints</button>
        </nav>
        <section>Identifiers</section>
        <section>Keys</section>
        <section>Service Endpoints</section>
      </tab-panels>
    `
  }
  load (){
    console.log('im a did viewer: ', this)
  }
  open (options = {}){
    this.setAttribute('open', '')
    for (let [attrib, val] of Object.entries(options)) {
      this.setAttribute(attrib, val)
    }
  }
  render (options = {}) {
    console.log('party time')
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        DOM.ready.then(e => {
          console.log('im an open did viewer: ', this)
          DOM.fireEvent(this, current !== null ? 'vieweropen' : 'viewerclose')
        })
        break

      case 'did':
        console.log('new did:', attr, last, current)
        break
    }
  }
};

customElements.define('did-viewer', DIDViewer)

export { DIDViewer };