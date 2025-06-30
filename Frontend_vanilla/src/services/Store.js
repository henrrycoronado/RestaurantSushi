import { observerMixim } from "./ObserverMixim.js";

const storeData = {
    user: null,
    token: null,
    products: [],
    categories: [],
    cart: [],
    publications: [], 
    likedPublicationIds: new Set(),

    init() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
            this.token = token;
            this.user = JSON.parse(userData);
        }
    },
    login(userData, token) {
        this.user = userData;
        this.token = token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        this.notify();
    },
    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.notify();
    },

    addToCart(productId) {
        const productToAdd = this.products.find(p => p.id === productId);
        if (!productToAdd) return;
        const cartItem = this.cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({ product: productToAdd, quantity: 1 });
        }
        this.notify();
    },

    getCart() { return this.cart; },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.product.id !== productId);
        this.notify();
    },
    
    clearCart() {
        this.cart = [];
        this.notify();
    },

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    },

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    setPublications(publications) {
        this.publications = publications;
        this.notify();
    },

    async toggleLike(publicationId) {
        if (!this.user) {
            alert("Debes iniciar sesión para dar like.");
            return;
        }
        try {
            if (this.likedPublicationIds.has(publicationId)) {
                await APIService.unlikePublication(publicationId);
                this.likedPublicationIds.delete(publicationId);
            } else {
                await APIService.likePublication(publicationId);
                this.likedPublicationIds.add(publicationId);
            }
            this.notify();
        } catch (error) {
            console.error("Error al dar/quitar like:", error);
        }
    }
};
Object.assign(storeData, observerMixim);
export const Store = storeData;