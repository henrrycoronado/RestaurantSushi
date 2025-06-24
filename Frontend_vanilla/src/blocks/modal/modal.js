export class Modal extends HTMLElement {
    connectedCallback() {
        this.render();
        this.setupEvents();
    }
    show() {
        this.style.visibility = "visible";
        this.style.pointerEvents = "auto";
        const links = this.querySelectorAll(".modal__nav__link");
        links.forEach(element => {
            element.style.color = "#EFE7D2";
        });
    }
    hide() {
        this.style.visibility = "hidden";
        this.style.pointerEvents = "none";
        const links = this.querySelectorAll(".modal__nav__link");
        links.forEach(element => {
            element.style.color = "#0000";
        });
    }
    setupEvents() {
        const modalBackground = this.querySelector(".modal");
        if (modalBackground) {
            modalBackground.addEventListener("click", (event) => {
                if (event.target === modalBackground) {
                    this.hide();
                }
            });
        }
    }
    render() {
      this.innerHTML = `
        <div class="modal">
            <nav class="modal__nav">
                <ul class="modal__nav__list">
                    <li class="modal__nav__item">
                        <a href="/menu" class="modal__nav__link">MENU</a>
                    </li>
                    <li class="modal__nav__item">
                        <a href="/reservation" class="modal__nav__link">RESERVATION</a>
                    </li>
                    <li class="modal__nav__item">
                        <a href="/about" class="modal__nav__link">ABOUT</a>
                    </li>
                    <li class="modal__nav__item">
                        <a href="/contact" class="modal__nav__link">CONTACT</a>
                    </li>
                    <li class="modal__nav__item">
                        <a href="/blog" class="modal__nav__link">BLOG</a>
                    </li>
                </ul>
            </nav>
        </div>
      `;
    }
}
customElements.define("modal-comp", Modal);