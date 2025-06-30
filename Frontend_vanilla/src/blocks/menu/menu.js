import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("menu-page_template");

export class Menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.activeFilter = 'All'; 
        this.render = this.render.bind(this);
        Store.addObserver(this.render);
    }
    capitalize(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();  
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

        const itemsContainer = this.shadowRoot.querySelector(".menu__content__items-container");
        itemsContainer.addEventListener("click", event => {
            const addButton = event.target.closest('.add-to-cart-btn');
            if (addButton) {
                const productId = parseInt(addButton.dataset.productId);
                Store.addToCart(productId);
                addButton.style.transform = 'scale(1.2)';
                setTimeout(() => addButton.style.transform = 'scale(1)', 150);
            }
        });
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }
    
    render() {
        const navList = this.shadowRoot.querySelector(".menu__content__nav__list");
        const itemsContainer = this.shadowRoot.querySelector(".menu__content__items-container");
        
        if (!navList || !itemsContainer) return;
        navList.innerHTML = "";
        itemsContainer.innerHTML = "";
        const allLi = document.createElement('li');
        allLi.className = 'menu__content__nav__item';
        if (this.activeFilter === 'All') {
            allLi.classList.add('menu__content__nav__item--active');
        }
        allLi.innerHTML = `<a>All</a>`;
        navList.appendChild(allLi);

        Store.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'menu__content__nav__item';
            const categoryName = this.capitalize(category.name);
            if (this.activeFilter === categoryName) {
                li.classList.add('menu__content__nav__item--active');
            }
            li.innerHTML = `<a>${categoryName}</a>`;
            navList.appendChild(li);
        });

        const productsByCategory = {};
        for (const product of Store.products) {
            const categoryName = this.capitalize(product.categories.name);
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
        }

        for (const categoryName in productsByCategory) {
            if (this.activeFilter === 'All' || this.activeFilter === categoryName) {
                const sectionEl = document.createElement('section');
                sectionEl.className = 'menu__content__category';
                
                const titleEl = document.createElement('h2');
                titleEl.className = 'menu__content__category__title';
                titleEl.textContent = categoryName;
                sectionEl.appendChild(titleEl);

                productsByCategory[categoryName].forEach(product => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'menu__item';
                    itemDiv.innerHTML = `
                        <img class="menu__item__img" src="${product.url_image}" alt="${product.name}">
                        <div class="menu__item__details">
                            <h3 class="menu__item__title">${this.capitalize(product.name)}</h3>
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