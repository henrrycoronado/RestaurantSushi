import { observerMixim } from "./ObserverMixim.js";

export class Item {
    constructor(text) {
        this.text = text;
        this.favorite = false;
    }
    preference(){
        this.favorite = !this.favorite;
    }
}

export class ItemList  {
    #data = new Set();
    #data_v = new Set();
    static instance = null;
    static {
        this.instance = new ItemList();
    }
    getData(){
        return this.#data;
    }
    getItems() {
        return Array.from(this.#data_v).length > 0 ? this.#data_v : this.#data;
    }
    static getInstance() {
        return this.instance;
    }
    constructor() {
        if (ItemList.instance) {
            throw new Error("use get instance");
        }
    }
    add(item) {
        const array = Array.from(this.#data);
        const itemExists = array.filter((t) => t.text === item ).length > 0;
        if (!itemExists && item !== "") {
            this.#data.add(new Item(item));
            this.notify();
        }
    }
    delete(item) {
        const array = Array.from(this.#data);
        const itemToDelete = array.filter((t) => t.text === item);
        this.#data.delete(itemToDelete[0]);
        this.notify();
    }
    find(item) {
        if(item === ""){
            this.#data_v = new Set();
            this.notify();
        }
        const array = Array.from(this.#data);
        const resp = array.find((t) => t.text === item);
        if(resp){
            this.#data_v = new Set();
            this.#data_v.add(resp);
            this.notify();
        }
    }
    clear() {
        this.#data = new Set();
        this.notify();
    }
    preference(item){
        for (let element of this.#data) {
            if(element.text === item){
                element.preference();
                this.notify();
            }
        }
        console.log(this.#data);
    }
}
Object.assign(ItemList.prototype, observerMixim);