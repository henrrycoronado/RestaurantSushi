const template = document.getElementById("login-page_template");

export class Login extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.addEventListener('click', event => {
            const link = event.target.closest('a');
            if (link) {
                const href = link.getAttribute("href");
                if (href && href.startsWith('/')) {
                    event.preventDefault();
                    app.router.go(href); 
                }
            }
        });
    }
}

customElements.define("login-page", Login);