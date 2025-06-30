export const observerMixim = {
    observers: new Set(),
    addObserver(obs) {
        this.observers.add(obs);
    },
    removeObserver(obs) {
        this.observers.delete(obs);
    },
    notify() {
        this.observers.forEach((obs) => obs());
    },
};