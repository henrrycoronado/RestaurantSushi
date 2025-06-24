const template = document.getElementById("reservation-page-template");

export class Reservation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define("reservation-page", Reservation);