import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("menu-page_template");

export class Menu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.activeFilter = 'ALL';
        this.isLoading = false;
        this.maxVisibleProducts = 30;
        this.render = this.render.bind(this);
        Store.addObserver(this.render);
    }

    capitalize(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();  
    }

    addMoreProducts() {
        this.isLoading = true;

        const itemsContainer = this.shadowRoot.querySelector(".menu__content__items-container");
        const productosNuevos = Store.products.slice(0, 10);        
        const observadoActual = this.shadowRoot.querySelector("#observado");
        if (observadoActual) {
            observadoActual.id = "";
        }
        productosNuevos.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu__item';
            itemDiv.innerHTML = `
                <img class="menu__item__img" src="${product.url_image}" alt="${product.name}">
                <div class="menu__item__details">
                    <h3 class="menu__item__title">${this.capitalize(product.name)}</h3>
                    <p class="menu__item__description">${product.description}</p>
                </div>
                <span class="menu__item__price">$${product.price}</span>
                <button class="add-to-cart-btn" data-product-id="${product.id}" title="Añadir al carrito">+</button>
            `;
            itemsContainer.appendChild(itemDiv);
        });
        let currentItems = itemsContainer.querySelectorAll(".menu__item");
        if (currentItems.length > this.maxVisibleProducts) {
            const itemsToRemove = currentItems.length - this.maxVisibleProducts;
            for (let i = 0; i < itemsToRemove; i++) {
                itemsContainer.removeChild(currentItems[i]);
            }
        }
        const todosLosItems = itemsContainer.querySelectorAll(".menu__item");
        if (todosLosItems.length > 1) {
            const nuevoPenultimo = todosLosItems[todosLosItems.length - 2];
            nuevoPenultimo.id = "observado";
        }

        setTimeout(() => {
            this.isLoading = false;
        }, 500);
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
        
        const container = this.shadowRoot.querySelector(".menu__content__items-container");
        container.addEventListener('scroll', (event) =>{
            const penultimo = container.querySelector("#observado");
            if (!penultimo) return;
            
            const containerRect = container.getBoundingClientRect();
            const penultimoRect = penultimo.getBoundingClientRect();
            const esVisible = penultimoRect.top < containerRect.bottom + 100;

            if (esVisible && !this.isLoading) {
                this.addMoreProducts();
            }
        });

        const navList = this.shadowRoot.querySelector(".menu__content__nav__list");
        navList.addEventListener("click", (event) => {
            const link = event.target.closest('a');
            if (link) {
                const container = this.shadowRoot.querySelector(".menu__content__items-container");
                const newFilter = link.textContent.trim().toUpperCase();
                this.activeFilter = newFilter;
                container.scrollTop = 0;
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
        if (this.activeFilter === 'ALL') {
            allLi.classList.add('menu__content__nav__item--active');
        }
        allLi.innerHTML = `<a>All</a>`;
        navList.appendChild(allLi);

        Store.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'menu__content__nav__item';
            const categoryName = this.capitalize(category.name);
            if (this.activeFilter === categoryName.toUpperCase()) {
                li.classList.add('menu__content__nav__item--active');
            }
            li.innerHTML = `<a>${categoryName}</a>`;
            navList.appendChild(li);
        });
        
        let productsToRender = [];
        if (this.activeFilter === 'ALL') {
            productsToRender = [...Store.products];
        } else {
            productsToRender = Store.products.filter(p => this.capitalize(p.categories.name).toUpperCase() === this.activeFilter);
        }

        let finalProducts = [...productsToRender];
        const initialCount = finalProducts.length;
        if (initialCount > 0 && initialCount < 20) {
            let i = 0;
            while (finalProducts.length < 20) {
                finalProducts.push(productsToRender[i % initialCount]);
                i++;
            }
        }
        
        const productsByCategory = {};
        for (const product of finalProducts) {
            const categoryName = this.capitalize(product.categories.name);
            if (!productsByCategory[categoryName]) {
                productsByCategory[categoryName] = [];
            }
            productsByCategory[categoryName].push(product);
        }

        let contador = 0;
        for (const categoryName in productsByCategory) {
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
                itemsContainer.appendChild(itemDiv);
                contador ++;
            });
        }
        
        const todosLosItems = itemsContainer.querySelectorAll(".menu__item");
        if (todosLosItems.length > 1) {
            const penultimo = todosLosItems[todosLosItems.length - 2];
            penultimo.id = "observado";
        }
    }
}

customElements.define("menu-page", Menu);