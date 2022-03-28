
// delegateEvent('pointerup', '[view-action="close"]', e => {
//   console.log(e.path);
//   EXT.sendMessage({
//     type: 'sidebar_close',
//     to: 'content',
//     callback: response => {
      
//     },
//     error: error => {
//       console.log(error)
//     }
//   });
// });

import { DID } from '/assets/js/modules/did.js';
import { DOM } from '/assets/js/modules/dom.js';
import { Storage } from '/assets/js/modules/storage.js';
import { Router } from '/assets/js/modules/router.js';
import { PersonaIcons } from '/assets/js/modules/persona-icons.js';
import { NoticeBar, RenderList } from '/assets/js/compiled/web-components.js';

globalThis.extensionStorage = Storage;

function clearPersonaCreateForm() {
  let selectedIcon = persona_create_icons.querySelector('input:checked');
  if (selectedIcon) selectedIcon.checked = false;
  persona_create_name.value = null;
}

function getPersonaCreateValues() {
  return {
    persona: persona_create_name.value,
    icon: persona_create_icons.querySelector('input:checked').nextElementSibling.className
  }
}
                            
DOM.delegateEvent('keypress', '.global-search', e => {
  if (e.key === 'Enter') {
    global_search_query.textContent = e.target.value;
    if(content_panels.active !== 'global_search') {
      Router.modifyState({
        event: e,
        params: { view: 'global_search' }
      });
    }
  }
});

DOM.delegateEvent('pointerup', '[modal="create-persona"]', e => {
  persona_create_modal.open();
});

persona_create_form.addEventListener('submit', async (e) => {
  e.preventDefault(e);
  let persona = getPersonaCreateValues();
  DID.create(persona).then(z => {   
    persona_did_list.add(persona);
    persona_create_modal.close();
    new NoticeBar({
      type: 'success',
      title: 'Your new Persona has been created!'
    }).notify();
  })
});

persona_create_modal.addEventListener('modalclosed', e => {
  clearPersonaCreateForm();
});

DOM.delegateEvent('pointerup', '[persona-id]', (e, node) => {
  let did = node.getAttribute('persona-id');
  if (!did) return;
  did_viewer_overlay.setAttribute('did', did);
  did_viewer_overlay.setAttribute('persona', node.getAttribute('persona-name'));
  did_viewer_overlay.open();
});


DOM.delegateEvent('vieweropen', 'did-viewer', (e, node) => {
  console.log('did viewer opened')
  e && e.stopPropagation()
})

did_viewer_overlay.addEventListener('modalopen', function(e) {
  let did = this.getAttribute('did');
  let persona = this.getAttribute('persona');
  if (!did && !persona) this.close();

  console.log('overlay modalopen')

  this.innerHTML = `
    <article>
      <header>
        <h3>${persona || did}</h3><span modal-close=""></span>
      </header>

      <section>
        <p>did viewer here</p>
        <did-viewer id="did_viewer" did=""></did-viewer>
      </section>

      <footer>
        <button type="button" modal-close="">Cancel</button>
      </footer>
    </article>
  `;

  did_viewer.open({ did, persona })
});

did_viewer_overlay.addEventListener('modalclose', function(e) {
  let did = this.setAttribute('did', '');
  //if (!did) this.close();

  this.innerHTML = `
    <article>
      <header>
        <h3></h3><span modal-close=""></span>
      </header>

      <section>
      </section>

      <footer>
        <button type="button" modal-close="">Cancel</button>
      </footer>
    </article>
  `;


});

export async function initialize(){
  const iconInput = '<input type="radio" name="icon"/>';
  persona_create_icons.innerHTML = `<label>${iconInput}<i class="${PersonaIcons.join(` fa-fw"></i></label><label>${iconInput}<i class="`)}"></label>`;  
}

export function render(){

};