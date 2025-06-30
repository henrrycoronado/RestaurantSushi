import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("blog-page_template");

export class Blog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.activeFilter = 'ALL NEWS';
        this.render = this.render.bind(this);
    }

    async connectedCallback() {
        Store.addObserver(this.render);

        if (Store.publications.length === 0) {
            try {
                const publications = await APIService.getPublications();
                Store.setPublications(publications); 
            } catch (error) {
                console.error("No se pudieron cargar las publicaciones", error);
            }
        } else {
            this.render();
        }

        this.shadowRoot.querySelector(".blog__content__nav__list").addEventListener("click", (event) => {
            const link = event.target.closest('a');
            if (link) {
                const newFilter = link.textContent.trim().toUpperCase();
                if (this.activeFilter !== newFilter) {
                    this.activeFilter = newFilter;
                    this.render(); 
                }
            }
        });

        this.shadowRoot.querySelector(".blog__articles-container").addEventListener("click", event => {
            const articleLink = event.target.closest('.blog__article__title-link, .blog__article__img');
            if (articleLink) {
                event.preventDefault();
                const articleId = articleLink.dataset.id;
                app.router.go(`/article-${articleId}`); 
            }
        });
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }
    
    render() {
        const navList = this.shadowRoot.querySelector(".blog__content__nav__list");
        const articlesContainer = this.shadowRoot.querySelector(".blog__articles-container");
        
        if (!navList || !articlesContainer) return;

        navList.innerHTML = `
            <li class="blog__content__nav__item ${this.activeFilter === 'ALL NEWS' ? 'blog__content__nav__item--active' : ''}"><a>ALL NEWS</a></li>
        `;
        if (Store.user) {
            navList.innerHTML += `
                <li class="blog__content__nav__item ${this.activeFilter === 'FAVORITES' ? 'blog__content__nav__item--active' : ''}"><a>FAVORITES</a></li>
                <li class="blog__content__nav__item ${this.activeFilter === 'MY ARTICLES' ? 'blog__content__nav__item--active' : ''}"><a>MY ARTICLES</a></li>
            `;
            const header = this.shadowRoot.querySelector(".blog__header");
            let createButton = header.querySelector(".create-blog-btn");
            if (!createButton) {
                createButton = document.createElement("a");
                createButton.href = "/blogCreate"; 
                createButton.className = "create-blog-btn"; 
                createButton.textContent = "Crear Artículo";
                createButton.onclick = (e) => {
                    e.preventDefault();
                    app.router.go('/blogCreate');
                }
                header.appendChild(createButton);
            }
        } else {
            const createButton = this.shadowRoot.querySelector(".create-blog-btn");
            if(createButton) createButton.remove();
        }

        let filteredPublications = [];
        switch (this.activeFilter) {
            case 'FAVORITES':
                filteredPublications = Store.publications.filter(p => Store.likedPublicationIds.has(p.id));
                break;
            case 'MY ARTICLES':
                if (Store.user) {
                    filteredPublications = Store.publications.filter(p => p.user_id === Store.user.id);
                }
                break;
            case 'ALL NEWS':
            default:
                filteredPublications = Store.publications;
                break;
        }

        // --- Renderizar Artículos ---
        articlesContainer.innerHTML = ""; 

        if (filteredPublications.length === 0) {
            articlesContainer.innerHTML = `<p class="blog__no-articles">No hay artículos que mostrar en esta sección.</p>`;
            return;
        }

        for (const article of filteredPublications) {
            const articleElement = document.createElement("div");
            articleElement.className = "blog__article";
            
            const authorName = article.users ? article.users.name : 'Anónimo';

            articleElement.innerHTML = `
                <img class="blog__article__img" src="${article.url_image && article.url_image !== 'vacio' ? article.url_image : '/src/assets/article-placeholder.png'}" alt="${article.title}" data-id="${article.id}">
                <div class="blog__article__details">
                    <span class="blog__article__date">${new Date(article.creation_date).toLocaleDateString()}</span>
                    
                    <a href="/article-${article.id}" class="blog__article__title-link" data-id="${article.id}">
                        <h3 class="blog__article__title">${article.title}</h3>
                    </a>
                    <p class="blog__article__excerpt">${article.content.substring(0, 100)}...</p>
                    <span class="blog__article__author">Autor: ${authorName}</span>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        }
    }
}

customElements.define("blog-page", Blog);