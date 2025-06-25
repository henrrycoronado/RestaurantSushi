import { APIService } from '../../services/APIService.js';
import { Store } from '../../services/Store.js';

const template = document.getElementById("reservation-page-template");

export class Reservation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.render = this.render.bind(this);
    }

    async connectedCallback() {
        Store.addObserver(this.render);
        if (Store.token) {
            try {
                const reservations = await APIService.getReservationHistory();
                Store.myReservations = reservations;
            } catch (error) {
                console.error("Could not fetch user reservations", error);
                Store.myReservations = [];
            }
        }
        this.render();
    }

    disconnectedCallback() {
        Store.removeObserver(this.render);
    }

    setupFormEvents() {
        const form = this.shadowRoot.querySelector("form");
        if (form) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                const feedbackElement = this.shadowRoot.querySelector(".form-feedback");
                feedbackElement.textContent = '';
                feedbackElement.classList.remove('visible');
                
                const isLoggedIn = Store.token && Store.user;
                let reservationData = {};

                if (isLoggedIn) {
                    reservationData = {
                        user_name: Store.user.name,
                        email: Store.user.email,
                        phone_number: Store.user.phone_number || '',
                        diners: parseInt(this.shadowRoot.querySelector("#res-diners").value, 10),
                        date: this.shadowRoot.querySelector("#res-date").value,
                        time: this.shadowRoot.querySelector("#res-time").value,
                    };
                } else {
                    reservationData = {
                        user_name: this.shadowRoot.querySelector("#guest-name").value,
                        phone_number: this.shadowRoot.querySelector("#guest-phone").value,
                        email: this.shadowRoot.querySelector("#guest-email").value,
                        diners: parseInt(this.shadowRoot.querySelector("#guest-diners").value, 10),
                        date: this.shadowRoot.querySelector("#guest-date").value,
                        time: this.shadowRoot.querySelector("#guest-time").value,
                    };
                }
                
                try {
                    await APIService.createReservation(reservationData);
                    feedbackElement.textContent = "Reservation successful! It is now pending review.";
                    feedbackElement.style.color = "lightgreen";
                    feedbackElement.classList.add('visible');
                    form.reset();

                    if (Store.token) {
                        const updatedReservations = await APIService.getReservationHistory();
                        Store.myReservations = updatedReservations;
                        Store.notify();
                    }
                } catch (error) {
                    feedbackElement.textContent = `Error: ${error.message}`;
                    feedbackElement.style.color = "#ff8a8a";
                    feedbackElement.classList.add('visible');
                }
            });
        }
    }

    render() {
        const isLoggedIn = Store.token && Store.user;
        const formContainer = this.shadowRoot.querySelector("#form-container");
        const historyContainer = this.shadowRoot.querySelector(".reservation__pending");

        let formHTML;
        if (isLoggedIn) {
            formHTML = `
                <form class="reservation__form">
                    <input type="hidden" name="user_name" value="${Store.user.name}">
                    <input type="hidden" name="email" value="${Store.user.email}">
                    <input type="hidden" name="phone_number" value="${Store.user.phone_number || ''}">
                    <div class="reservation-greeting">Reserving as <strong>${Store.user.name}</strong></div>
                    <div class="reservation__form__inputs">
                        <input id="res-diners" class="reservation__form__input" type="number" min="1" name="diners" placeholder="Guests" required>
                        <input id="res-date" class="reservation__form__input" type="date" name="date" required>
                        <input id="res-time" class="reservation__form__input" type="time" name="time" required>
                    </div>
                    <button type="submit" class="reservation__form__button">BOOK MY TABLE</button>
                </form>
            `;
        } else {
            formHTML = `
                <form class="reservation__form">
                    <div class="reservation__form__inputs">
                        <input id="guest-name" class="reservation__form__input" type="text" name="user_name" placeholder="Name" required>
                        <input id="guest-phone" class="reservation__form__input" type="tel" name="phone_number" placeholder="Phone" required>
                        <input id="guest-email" class="reservation__form__input" type="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="reservation__form__inputs">
                        <input id="guest-diners" class="reservation__form__input" type="number" min="1" name="diners" placeholder="Guests" required>
                        <input id="guest-date" class="reservation__form__input" type="date" name="date" required>
                        <input id="guest-time" class="reservation__form__input" type="time" name="time" required>
                    </div>
                    <button type="submit" class="reservation__form__button">RESERVE</button>
                </form>
            `;
        }
        formContainer.innerHTML = formHTML;

        if (isLoggedIn && historyContainer) {
            historyContainer.style.display = 'block';
            const listElement = historyContainer.querySelector(".reservation__pending__list");
            listElement.innerHTML = '';
            
            if (Store.myReservations && Store.myReservations.length > 0) {
                Store.myReservations.forEach(res => {
                    const item = document.createElement('div');
                    item.className = 'reservation-item';
                    const formattedDate = new Date(res.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    item.innerHTML = `
                        <div class="reservation-item__left">
                            <span class="reservation-item__name">${res.diners} Guests for ${res.user_name}</span>
                            <span class="reservation-item__status status-${res.state}">${res.state}</span>
                        </div>
                        <div class="reservation-item__right">
                            <span class="reservation-item__date">${formattedDate}</span>
                        </div>
                    `;
                    listElement.appendChild(item);
                });
            } else {
                listElement.innerHTML = `<p class="no-reservations">You have no reservations linked to this email.</p>`;
            }
        } else if(historyContainer) {
            historyContainer.style.display = 'none';
        }

        this.setupFormEvents();
    }
}

customElements.define("reservation-page", Reservation);