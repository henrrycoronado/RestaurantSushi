import { APIService } from '../../services/APIService.js';

const template = document.getElementById("registration-page_template");

export class Registration extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const form = this.shadowRoot.querySelector(".registration__form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const name = this.shadowRoot.querySelector("#reg-name").value;
            const email = this.shadowRoot.querySelector("#reg-email").value;
            const phone_number = this.shadowRoot.querySelector("#reg-phone").value;
            const address = this.shadowRoot.querySelector("#reg-address").value;
            const password = this.shadowRoot.querySelector("#reg-password").value;
            const confirmPassword = this.shadowRoot.querySelector("#reg-confirm-password").value;
            const errorElement = this.shadowRoot.querySelector(".form-error-message");

            errorElement.classList.remove('visible');
            
            if (password !== confirmPassword) {
                errorElement.textContent = "Passwords do not match.";
                errorElement.classList.add('visible');
                return;
            }

            const userData = {
                name,
                email,
                phone_number,
                address,
                password
            };

            try {
                await APIService.register(userData);
                alert('Registration successful! Please log in.');
                app.router.go("/signin");
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.classList.add('visible');
            }
        });
    }
}

customElements.define("registration-page", Registration);