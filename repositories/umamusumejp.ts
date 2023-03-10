import { req2json } from "../utils";

interface Data {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    acf: {
        sns_header: string;
    };
};

export const getData = async () => {
    const result: {
        name: string;
        img: string;
        url: string;
    }[] = [];

    let page = 1;
    while (true) {
        const data: Data[] = await req2json("https://umamusume.jp/app/wp-json/wp/v2/character?per_page=100&page=" + page);
        for (const item of data) {
            result.push({
                name: item.title.rendered,
                img: item.acf.sns_header,
                url: "https://umamusume.jp/character/detail/?name=" + item.slug
            });
        }
       
        if (data.length < 100) break;
        page++;
    }

    return result;
};