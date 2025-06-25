import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("cart-page_template");

export class Cart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.render = this.render.bind(this);
    }

    connectedCallback() {
        Store.addObserver(this.render);
        this.render();
        this.setupEvents();
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }

    setupEvents() {
        this.shadowRoot.addEventListener('click', async (event) => {
            const feedbackElement = this.shadowRoot.querySelector(".form-feedback");
            feedbackElement.textContent = '';
        
            if (event.target.closest('.cart__item__remove')) {
                const button = event.target.closest('.cart__item__remove');
                const productId = parseInt(button.dataset.productId, 10);
                Store.removeFromCart(productId);
            }

            if (event.target.closest('.cart__order-button')) {
                if (!Store.token) {
                    alert("Please log in to place an order.");
                    app.router.go("/signin");
                    return;
                }

                const orderDetails = Store.getCart().map(item => ({
                    product_id: item.product.id,
                    amount: item.quantity,
                }));

                try {
                    await APIService.createOrder(orderDetails);
                    feedbackElement.textContent = "Order placed successfully!";
                    feedbackElement.style.color = "lightgreen";
                    Store.clearCart();
                } catch (error) {
                    feedbackElement.textContent = `Error: ${error.message}`;
                    feedbackElement.style.color = "#ff8a8a";
                }
            }
        });
    }

    render() {
        const itemsContainer = this.shadowRoot.querySelector('.cart__items-container');
        const summaryContainer = this.shadowRoot.querySelector('.cart__summary');
        
        itemsContainer.innerHTML = '';
        summaryContainer.innerHTML = '';

        if (Store.getCart().length === 0) {
            itemsContainer.innerHTML = '<p class="cart__empty-message">Your cart is empty.</p>';
        } else {
            Store.getCart().forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart__item';
                
                const subtotal = item.product.price * item.quantity;

                cartItem.innerHTML = `
                    <img class="cart__item__img" src="${item.product.url_image}" alt="${item.product.name}">
                    <div class="cart__item__details">
                        <div class="cart__item__header">
                            <h3 class="cart__item__name">${item.product.name.toUpperCase()}</h3>
                            <button class="cart__item__remove" title="Remove item" data-product-id="${item.product.id}">&#x1F5D1;</button>
                        </div>
                        <p class="cart__item__description">${item.product.description}</p>
                    </div>
                    <div class="cart__item__pricing">
                        <span>$${item.product.price} &times; ${item.quantity} = $${subtotal.toFixed(2)}</span>
                    </div>
                `;
                itemsContainer.appendChild(cartItem);
            });

            const totalAmount = Store.getCartTotal();
            summaryContainer.innerHTML = `
                <div class="cart__total">
                    <span class="cart__total__label">TOTAL</span>
                    <span class="cart__total__amount">$${totalAmount.toFixed(2)}</span>
                </div>
                <button class="cart__order-button">Place Order</button>
            `;
        }
    }
}

customElements.define("cart-page", Cart);