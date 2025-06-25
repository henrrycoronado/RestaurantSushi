import { Store } from '../../services/Store.js';

export class Navbar extends HTMLElement {
    constructor() {
        super();
        this.render = this.render.bind(this);
    }

    connectedCallback() {
        Store.addObserver(this.render);
        this.render();
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }

    setupEvents() {
        const optionsButton = this.querySelector("#options");
        if (optionsButton) {
            optionsButton.addEventListener("click", () => {
                const modal = document.querySelector("modal-comp");
                if (modal) modal.show();
            });
        }
        
        const logoutButton = this.querySelector("#logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", (event) => {
                event.preventDefault();
                Store.logout();
                app.router.go("/");
            });
        }
    }

    render() {
        const cartItemCount = Store.getCartItemCount();
        const isLoggedIn = Store.token !== null;

        let authButton;
        if (isLoggedIn) {
            authButton = `
                <a href="#" id="logout-button" class="navbar__seccion__button" title="Logout">
                    <img src="/src/assets/icon-profile.svg" class="navbar__seccion__buttonImg"/>
                </a>
            `;
        } else {
            authButton = `
                <a href="/signup" class="navbar__seccion__button">
                    REGISTRATION
                </a>
            `;
        }
        
        this.innerHTML = `
            <nav id="nav" class="navbar">
                <div class="navbar__seccion__left">
                    <div class="navbar__seccion__list">
                        <a id="options" class="navbar__seccion__buttonSpecial">
                            <img src="/src/assets/menu.svg" class="navbar__seccion__buttonImg"/>
                        </a>
                        <a href="/" class="navbar__seccion__button">
                            <img src="/src/assets/logo.svg" class="navbar__seccion__buttonImg"/>
                        </a>
                        <a href="/menu" class="navbar__seccion__button">MENU</a>
                        <a href="/about" class="navbar__seccion__button">ABOUT</a>
                        <a href="/reservation" class="navbar__seccion__buttonSpecial">BOOK A TABLE</a>
                    </div>
                </div> 
                <div class="navbar__seccion__right">
                    <div class="navbar__seccion__list">
                        ${authButton}
                    </div>
                    <div class="navbar__seccion__list">
                        <a href="/cart" class="navbar__seccion__button cart-button-container">
                            <img src="/src/assets/carrito.svg" class="navbar__seccion__buttonImg"/>
                            ${cartItemCount > 0 ? `<span class="cart-badge">${cartItemCount}</span>` : ''}
                        </a>
                    </div>
                </div>  
            </nav>
        `;

        this.setupEvents();
    }
}

customElements.define("navbar-comp", Navbar);