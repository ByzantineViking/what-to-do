import { formatTodo} from './todo';
import { exploreWikipedia } from './calls';
document.addEventListener("readystatechange", () => {
    if(document.readyState === "complete") {
        initApp();
    }
});


const initApp = () => {
    const el = document.getElementById("todo-form");
    if (el) {
        try {
            const form = el as HTMLFormElement;
            const input = document.getElementById("add-todo") as HTMLInputElement;
            input.placeholder = 'Search for things to do';
            input?.addEventListener("keypress", e => handleKeys(e, input));
            form?.addEventListener("keypress", e => handleKeys(e, form));
            form?.addEventListener("submit", submitAddTodo);
        } catch (e) {
            console.error('Element not form', e);
        }
    }

};


export const handleKeys = (e: KeyboardEvent, form: HTMLFormElement | HTMLInputElement): void => {
    if (e.key === "Enter" || e.key === ' ') {
        e.preventDefault();
        submitAddTodo();
    }
};

const submitAddTodo = async (e?: Event) => {
    e?.preventDefault();
    const input =  document.getElementById("add-todo") as HTMLInputElement;
    if(input.value) {
        const formattedTodo = formatTodo(input.value);
        const wikipediaResults = await exploreWikipedia(formattedTodo);

        // Create new list item
        const todoElem = document.createElement("li");



        const elemHeading = document.createElement("h2");
        elemHeading.append(formattedTodo);

        todoElem.append(elemHeading);

        // Add wikipedia items
        const wikiList = document.createElement("ol");
        if (wikipediaResults.length) {
            wikipediaResults.map(wikiResult => {
                const li = document.createElement("li");
                const { title, img, text, url} = wikiResult;
                const titleHeading = document.createElement("h3");
                titleHeading.append(title);

                const titleLink = document.createElement("a");
                titleLink.href = url;
                titleLink.nodeValue = formattedTodo;
                titleLink.rel = 'noreferrer noopener';
                titleLink.target = '_blank';

                titleLink.append(titleHeading);


                li.append(titleLink, text);
                if (img?.source) {
                    const fetchedImg = new Image(img.width, img.height);
                    fetchedImg.src = img.source.toString();
                    li.append(fetchedImg);
                }
                wikiList.append(li);
            });
        }
        todoElem.append(wikiList);

        document.getElementById('todo-list')?.prepend(todoElem);


        input.value = "";
        input.focus();
    }



};
