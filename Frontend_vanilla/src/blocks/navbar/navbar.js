export class Navbar extends HTMLElement {
    connectedCallback() {
      this.render();
      this.setupEvents();
    }
    setupEvents() {
      const optionsButton = this.querySelector("#options");
      if (optionsButton) {
        optionsButton.addEventListener("click", () => {
          const modal = document.querySelector("modal-comp");
          if (modal) {
            modal.show();
          }
        });
      }
    }
    render() {
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
              <a href="/menu" class="navbar__seccion__button">
                MENU
              </a>
              <a href="/about" class="navbar__seccion__button">
                ABOUT
              </a>
              <a href="/reservation" class="navbar__seccion__buttonSpecial">
                BOOK A TABLE
              </a>
            </div>
          </div> 
          <div class="navbar__seccion__right">
            <div class="navbar__seccion__list">
              <a href="/signup" class="navbar__seccion__button">
                REGISTRATION
              </a>
            </div>
            <div class="navbar__seccion__list">
              <a href="/cart" class="navbar__seccion__button">
                <img src="/src/assets/carrito.svg" class="navbar__seccion__buttonImg"/>
              </a>
            </div>
          </div>  
        </nav>
      `;
    }
}
customElements.define("navbar-comp", Navbar);