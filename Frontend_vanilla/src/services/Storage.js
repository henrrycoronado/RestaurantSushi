import { ItemList } from "./ItemList.js";

const List = ItemList.getInstance();
export const LocalStorage = {
    getProjects() {
        return JSON.parse(localStorage.getItem("projects") || "[]");
    },
    load(id) {
        if (localStorage.getItem("projects")) {
            const projects = JSON.parse(localStorage.getItem("projects"));
            if(id >= 0 && id < projects.length){
                for (let t of projects[id]) {
                    ItemList.add(t);
                }
            }
        }
    },
    delete(id) {
        if (localStorage.getItem("projects")) {
            const projects = JSON.parse(localStorage.getItem("projects"));
            if(id >= 0 && id < projects.length){
                projects.splice(i, i);
                localStorage.setItem("projects", JSON.stringify(projects));
            }
        }
    },
    save() {
        const array = Array.from(List.getData());
        if(!array || array.length == 0){
            window.alert("no se puede guardar un proyecto vacio");
            return;
        }
        let projects = JSON.parse(localStorage.getItem("projects") || "[]");
        projects.push(array);
        localStorage.setItem("projects", JSON.stringify(projects));
        List.clear();
    },
};