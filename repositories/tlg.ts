import { req2json } from "../utils";

interface Data {
    "6": { [key: string]: string };
};

export const getData = async () => {
    const result: { [key: string]: string } = {};
    const json = await req2json("https://raw.githubusercontent.com/yotv2000tw/Trainers-Legend-G-TRANS-zh-tw/master/localized_data/text_data.json") as Data;
    return json["6"];
};