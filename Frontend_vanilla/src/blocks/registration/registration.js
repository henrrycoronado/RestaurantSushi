const template = document.getElementById("registration-page_template");

export class Registration extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("registration-page", Registration);