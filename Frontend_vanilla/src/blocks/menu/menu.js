import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("menu-page_template");

export class Menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.activeFilter = 'ALL'; 
        this.render = this.render.bind(this);
        Store.addObserver(this.render);
    }

    async connectedCallback() {
        if (Store.products.length === 0) {
            try {
                const products = await APIService.getProducts();
                const categories = await APIService.getCategories();
                
                Store.products = products;
                Store.categories = categories;
                Store.notify();
            } catch (error) {
                console.error("No se pudieron cargar los datos del menú", error);
            }
        } else {
            this.render();
        }

        const navList = this.shadowRoot.querySelector(".menu__content__nav__list");
        navList.addEventListener("click", (event) => {
            const link = event.target.closest('a');
            if (link) {
                const newFilter = link.textContent.trim().toUpperCase();
                this.activeFilter = newFilter;
                this.render();
            }
        });

        // AÑADIDO: Event Listener para los botones "Añadir al Carrito"
        const itemsContainer = this.shadowRoot.querySelector(".menu__content__items-container");
        itemsContainer.addEventListener("click", event => {
            // Usamos event delegation para capturar clics en los botones '+'
            const addButton = event.target.closest('.add-to-cart-btn');
            if (addButton) {
                const productId = parseInt(addButton.dataset.productId);
                Store.addToCart(productId);
                // Opcional: Mostrar una pequeña animación o feedback
                addButton.style.transform = 'scale(1.2)';
                setTimeout(() => addButton.style.transform = 'scale(1)', 150);
            }
        });
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }
    
    render() {
        // ... (la lógica de renderizado de la navegación no cambia) ...
        const navList = this.shadowRoot.querySelector(".menu__content__nav__list");
        const itemsContainer = this.shadowRoot.querySelector(".menu__content__items-container");
        
        if (!navList || !itemsContainer) return;

        navList.innerHTML = "";
        itemsContainer.innerHTML = "";

        // --- Renderizar Navegación (sin cambios) ---
        const allLi = document.createElement('li');
        allLi.className = 'menu__content__nav__item';
        if (this.activeFilter === 'ALL') {
            allLi.classList.add('menu__content__nav__item--active');
        }
        allLi.innerHTML = `<a>ALL</a>`;
        navList.appendChild(allLi);

        Store.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'menu__content__nav__item';
            const categoryNameUpper = category.name.toUpperCase();
            if (this.activeFilter === categoryNameUpper) {
                li.classList.add('menu__content__nav__item--active');
            }
            li.innerHTML = `<a>${categoryNameUpper}</a>`;
            navList.appendChild(li);
        });

        // --- Renderizar Productos ---
        const productsByCategory = {};
        for (const product of Store.products) {
            const categoryName = product.categories.name.toUpperCase();
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
        }

        for (const categoryName in productsByCategory) {
            if (this.activeFilter === 'ALL' || this.activeFilter === categoryName) {
                const sectionEl = document.createElement('section');
                sectionEl.className = 'menu__content__category';
                
                const titleEl = document.createElement('h2');
                titleEl.className = 'menu__content__category__title';
                titleEl.textContent = categoryName;
                sectionEl.appendChild(titleEl);

                productsByCategory[categoryName].forEach(product => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu__item';
                    
                    // MODIFICADO: Añadimos el botón '+' al innerHTML
                    itemDiv.innerHTML = `
                        <img class="menu__item__img" src="${product.url_image}" alt="${product.name}">
                        <div class="menu__item__details">
                            <h3 class="menu__item__title">${product.name.toUpperCase()}</h3>
                            <p class="menu__item__description">${product.description}</p>
                        </div>
                        <span class="menu__item__price">$${product.price}</span>
                        <button class="add-to-cart-btn" data-product-id="${product.id}" title="Añadir al carrito">
                            +
                        </button>
                    `;
                    sectionEl.appendChild(itemDiv);
                });

                itemsContainer.appendChild(sectionEl);
            }
        }
    }
}

customElements.define("menu-page", Menu);