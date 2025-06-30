const template = document.getElementById("home-page_template");
export class Home extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));


        this.shadowRoot.addEventListener('click', async event => {
            const link = event.target.closest('a');
            if (link) {
                const href = link.getAttribute("href");
                if (href && href.startsWith('/')) {
                    event.preventDefault();
                    await app.router.go(href); 
                }
            }
        });
    }
}
customElements.define("home-page", Home);
