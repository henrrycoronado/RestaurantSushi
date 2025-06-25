import { Router } from "./services/Router.js";
import { APIService } from './services/APIService.js';
import { Store } from './services/Store.js';

import { Home } from "./blocks/home/home.js";
import { Menu } from "./blocks/menu/menu.js";
import { Reservation } from "./blocks/reservation/reservation.js";
import { About } from "./blocks/about/about.js";
import { Contact } from "./blocks/contact/contact.js";
import { Blog } from "./blocks/blog/blog.js";
import { Article } from "./blocks/article/article.js";
import { Cart } from "./blocks/cart/cart.js";
import { Registration } from "./blocks/registration/registration.js";
import { Login } from "./blocks/login/login.js";
import { NotFound } from "./blocks/notFound/notFound.js";
import { Navbar } from "./blocks/navbar/navbar.js";
import { Modal } from "./blocks/modal/modal.js";

globalThis.app = {};
app.router = Router;
app.store = Store;

window.addEventListener("DOMContentLoaded", () => {
    app.store.init();
    app.router.init();
});



