// src/blocks/article/article.js (VERSIÓN FINAL CORREGIDA)

import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("article-page_template");

export class Article extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.mode = null;
        this.articleId = null;
        this.articleData = null;
    }

    connectedCallback() {
        const path = location.pathname;
        const parts = path.split('/');

        if (path === '/blogCreate') {
            this.mode = 'CREATE';
            this.render();
        } else if (path.startsWith('/blogEdit-')) {
            this.mode = 'EDIT';
            this.articleId = path.substring('/blogEdit-'.length);
            this.loadArticleData();
        } else if (path.startsWith('/article-')) {
            this.mode = 'READ';
            this.articleId = path.substring('/article-'.length);
            this.loadArticleData();
        } else {
            console.error("Ruta de artículo no reconocida:", path);
            app.router.go("/404");
        }
    }

    async loadArticleData() {
        try {
            const article = await APIService.getPublicationById(this.articleId);
            if (!article) throw new Error("Artículo no encontrado");
            this.articleData = article;
            this.render();
        } catch (error) {
            console.error("Error cargando el artículo", error);
            app.router.go("/404");
        }
    }

    render() {
        const readModeContainer = this.shadowRoot.querySelector('.article__read-mode');
        const form = this.shadowRoot.querySelector('.article__form');
        const footer = this.shadowRoot.querySelector('.article__footer');

        readModeContainer.style.display = 'none';
        form.style.display = 'none';
        footer.innerHTML = ''; 

        switch (this.mode) {
            case 'CREATE':
                this.renderForm();
                break;
            case 'EDIT':
                this.renderForm(this.articleData);
                break;
            case 'READ':
                this.renderReadView(this.articleData);
                break;
        }
    }

    renderReadView(article) {
        this.shadowRoot.querySelector('.article__read-mode').style.display = 'block';
        
        this.shadowRoot.querySelector('.article__presentation__img').src = article.url_image && article.url_image !== 'vacio' ? article.url_image : '/src/assets/article_fondo.png';
        this.shadowRoot.querySelector('.article__header__date').textContent = new Date(article.creation_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        this.shadowRoot.querySelector('.article__header__title').textContent = article.title;
        this.shadowRoot.querySelector('.article__body').innerHTML = `<p>${article.content.replace(/\n/g, '<br>')}</p>`;

        if (Store.user && Store.user.id === article.user_id) {
            const footer = this.shadowRoot.querySelector('.article__footer');
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'article__button article__button--edit';
            editButton.onclick = () => app.router.go(`/blogEdit-${this.articleId}`);
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'article__button article__button--delete';
            deleteButton.onclick = () => this.handleDelete();

            footer.append(editButton, deleteButton);
        }
    }

    renderForm(article = {}) {
        const form = this.shadowRoot.querySelector('.article__form');
        form.style.display = 'block';

        this.shadowRoot.querySelector('.article__presentation__img').src = '/src/assets/article_fondo.png';
        this.shadowRoot.querySelector('.article__form__title').textContent = this.mode === 'CREATE' ? 'Crear Nuevo Artículo' : 'Editar Artículo';
        
        this.shadowRoot.querySelector('#title').value = article.title || '';
        this.shadowRoot.querySelector('#content').value = article.content || '';

        // Limpiamos el formulario de botones viejos antes de añadir uno nuevo
        const oldButton = form.querySelector('.article__button--submit');
        if (oldButton) oldButton.remove();

        const submitButton = document.createElement('button');
        submitButton.textContent = this.mode === 'CREATE' ? 'Publicar' : 'Guardar Cambios';
        submitButton.className = 'article__button article__button--submit';
        submitButton.type = 'submit';
        
        form.onsubmit = (event) => this.handleFormSubmit(event);
        
        // ** LA CORRECCIÓN **
        // Añadimos el botón DENTRO del formulario
        form.appendChild(submitButton); 
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const title = this.shadowRoot.querySelector('#title').value.trim();
        const content = this.shadowRoot.querySelector('#content').value.trim();
        
        if (!title || !content) {
            alert("El título y el contenido no pueden estar vacíos.");
            return;
        }
        
        const publicationData = { title, content, url_image: 'vacio' };

        try {
            let savedArticle;
            if (this.mode === 'CREATE') {
                savedArticle = await APIService.createPublication(publicationData);
                alert('¡Publicación creada con éxito!');
            } else {
                savedArticle = await APIService.updatePublication(this.articleId, publicationData);
                alert('¡Publicación actualizada con éxito!');
            }

            Store.publications = [];
            app.router.go(`/article-${savedArticle.id}`);
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async handleDelete() {
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            try {
                await APIService.deletePublication(this.articleId);
                alert('Publicación eliminada.');
                Store.publications = [];
                app.router.go('/blog');
            } catch (error) {
                alert(`Error al eliminar: ${error.message}`);
            }
        }
    }
}

customElements.define("article-page", Article);