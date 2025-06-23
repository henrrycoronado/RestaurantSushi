const template = document.getElementById('not-found_template');
export class NotFound extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("notfound-page", NotFound);