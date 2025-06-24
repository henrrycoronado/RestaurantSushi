export const Router = {
    navigate: false, 
    init: () => {
        document.addEventListener("click", event => {
        const link = event.target.closest('a');
        if (link && !Router.navigate) {
            const href = link.getAttribute("href");
            if (href && href.startsWith("/")) {
                event.preventDefault();
                Router.go(href);
            }
        }
    });
        window.addEventListener("popstate", () => {
            Router.go(location.pathname, false);
        });
        Router.go(location.pathname, false);
    },
    go: async (route, addToHistory = true) => {
        Router.navigate = true;
        if (addToHistory) {
            history.pushState({ route }, '', route);
        }
        const main = document.getElementById("main");
        const currentPage = main.firstElementChild;
        const animationDuration = 400;
        if (currentPage) {
            currentPage.classList.remove('page-visible');
            currentPage.classList.add('page-fade-out');
        }
        await new Promise(resolve => setTimeout(resolve, animationDuration));
        if (currentPage) {
            currentPage.remove();
        }
        let pageElement = null;
        let targetNavbarWidth = "50%";
        switch (route) {
            case "/":
                pageElement = document.createElement("home-page");
                targetNavbarWidth = "80%";
                break;
            case "/menu":
                pageElement = document.createElement("menu-page");
                break;
            case "/reservation":
                pageElement = document.createElement("reservation-page");
                break;
            case "/about":
                pageElement = document.createElement("about-page");
                break;
            case "/contact":
                pageElement = document.createElement("contact-page");
                break;
            case "/blog":
                pageElement = document.createElement("blog-page");
                break;
            case "/article":
                pageElement = document.createElement("article-page");
                break;
            case "/cart":
                pageElement = document.createElement("cart-page");
                break;
            case "/signup":
                pageElement = document.createElement("registration-page");
                break;
            case "/signin":
                pageElement = document.createElement("login-page");
                break;
            default:
                pageElement = document.createElement("notfound-page");
                break;
        }
        const navbar = document.getElementsByTagName("navbar-comp")[0];
        if (navbar && navbar.style.width !== targetNavbarWidth) {
            navbar.style.width = targetNavbarWidth;
        }
        if (pageElement) {
            main.appendChild(pageElement);
            setTimeout(() => {
                pageElement.classList.add('page-visible');
            }, 10);
            const modal = document.querySelector("modal-comp");
            if (modal) {
                modal.hide();
            }
        }
        window.scrollTo(0, 0);
        Router.navigate = false;
    }
};
