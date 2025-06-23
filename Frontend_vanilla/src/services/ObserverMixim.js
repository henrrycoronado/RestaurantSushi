export const observerMixim = {
    observers: new Set(),
    addObserver(obs) {
        this.observers.add(obs);
    },
    removeObserver(obs) {
        this.observers.delete(obs);
    },
    notify(obs) {
        this.observers.forEach((obs) => obs());
    },
};