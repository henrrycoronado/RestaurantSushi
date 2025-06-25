import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("login-page_template");

export class Login extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector(".login__form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = this.shadowRoot.querySelector("#login-email").value;
            const password = this.shadowRoot.querySelector("#login-password").value;
            const errorElement = this.shadowRoot.querySelector(".form-error-message");

            errorElement.classList.remove('visible');
            
            if (!email || !password) {
                errorElement.textContent = "Both fields are required.";
                errorElement.classList.add('visible');
                return;
            }

            try {
                const result = await APIService.login({ email, password });
                Store.login(result.user, result.token);
                app.router.go("/");
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.classList.add('visible');
            }
        });
    }
}

customElements.define("login-page", Login);