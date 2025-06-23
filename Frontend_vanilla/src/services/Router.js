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
        const navbar = document.getElementsByTagName("navbar-comp")[0];
        switch (route) {
            case "/":
                pageElement = document.createElement("home-page");
                navbar.style.width = "80%";
                break;
            case "/menu":
                pageElement = document.createElement("menu-page");
                navbar.style.width = "50%";
                break;
            default:
                pageElement = document.createElement("notfound-page");
                navbar.style.width = "50%";
                break;
        }
        if (pageElement) {
            main.appendChild(pageElement);
            setTimeout(() => {
                pageElement.classList.add('page-visible');
            }, 10);
        }
        window.scrollTo(0, 0);
        Router.navigate = false;
    }
};
