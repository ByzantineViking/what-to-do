export const exploreWikipedia = async (searchTerm: string): Promise<Result[]> => {
    const width = window.innerWidth || document.body.clientWidth;
    let maxChars;
    if(width < 414) maxChars = 65;
    if(width >= 414 && width < 1400) maxChars = 100;
    if(width >= 1400) maxChars = 130;

    const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=3&prop=pageimages|extracts|info&inprop=url&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;
    const searchString = encodeURI(rawSearchString);
    const rawWikiData = await requestData(searchString);
    const wikiData = processWikiResults(rawWikiData);


    return wikiData;
};




const requestData = async (searchString: string) => {
    try {
        const response = await fetch(searchString);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
};

type Page = {
    pageid: number
    ns: number
    title: string
    index: number
    thumbnail?: {
        source: URL
        width: number
        height: number
    }
    pageimage?: string
    extract: string
    fullurl: string
}
type WikiData = {
    query: Record<string, Record<string, Page>>
}
type Result = {
    id: string
    title: string
    text: string
    img?: {
        source: URL
        width: number
        height: number
    }
    url: string

}
const processWikiResults = (res: WikiData) => {
    const resultArray: Result[] = [];

    const pages = res.query['pages'];
    Object.keys(res.query['pages']).forEach(key => {
        const id = key;
        const title = pages[key].title;
        const text = pages[key].extract;
        const img = pages[key]?.thumbnail;
        const url = pages[key].fullurl;
        const item: Result = {
            id,
            title,
            text,
            img,
            url
        };
        resultArray.push(item);
    });
    return resultArray;
};