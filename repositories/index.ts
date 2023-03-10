import { getData as getData_uma } from './umamusumejp';
import { getData as getData_trecen } from './tracenacademy';
import { getData as getData_tlg } from './tlg';
import { Result } from '../types/Result';

export const getData = async () => {
    const uma = await getData_uma();
    const trecen = await getData_trecen();
    const tlg = await getData_tlg();

    const result: Result[] = [];
    for (const id in trecen) {
        const name = trecen[id].name;
        const zh_name = tlg[id] ?? "None";
        const { img, url } = uma.find(x => x.name === name) ?? { img: "None", url: "None" };
        const birthday = trecen[id].birthday;
        result.push({
            name,
            zh_name,
            img,
            url,
            birthday
        });
    }

    return result;
};