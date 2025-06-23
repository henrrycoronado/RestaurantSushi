import { ItemList } from "./ItemList.js";
import { LocalStorage } from "./Storage.js";

export class Command {
    name;
    args;
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

export const Commands = {
    ADD: "add",
    DELETE: "delete",
    CLEAR: "clear",
    FOCUS: "focus",
    SEARCH: "search",
    FAVORITE: "favorite",
    SAVE_PRJ: "save_prj",
    LOAD_PRJ: "load_prj",
    DELETE_PRJ: "delete_prj"
};

export const CommandExecutor = {
    execute(command) {
        const List = ItemList.getInstance();
        const containerSearch = document.querySelector("search-bar");
        const shadow = containerSearch.shadowRoot;
        const search = shadow.querySelector("#search");
        switch (command.name) {
            case Commands.ADD:
                List.add(command.args);
                break;
            case Commands.DELETE:
                List.delete(command.args);
                break;
            case Commands.CLEAR:
                List.clear();
                break;
            case Commands.FOCUS:
                search.focus();
                break;
            case Commands.SEARCH:
                List.find(search.value.trim());
                break;
            case Commands.FAVORITE:
                List.preference(command.args);
                break;
            case Commands.SAVE_PRJ:
                LocalStorage.save();
                break;
            case Commands.DELETE_PRJ:
                LocalStorage.delete(command.args);
                break;
            case Commands.LOAD_PRJ:
                LocalStorage.load(command.args);
                break;
        }
    },
};