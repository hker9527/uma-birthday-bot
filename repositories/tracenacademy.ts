import { req2json } from "../utils";

interface Data {
    index: number;
    text: string;
};

export const getData = async () => {
    const id_name: { [key: string]: string } = {};
    for (const item of await req2json("https://www.tracenacademy.com/api/TextData/6") as Data[]) {
        id_name[item.index] = item.text;
    }

    const id_birthday: { [key: string]: string } = {
        "1054": "2月8日", // ビコーペガサス
        "1055": "5月31日", // マーベラスサンデー
        "1063": "4月16日", // イクノディクタス
        "1070": "5月31日", // シリウスシンボリ
        "1073": "3月26日", // ツルマルツヨシ
        "1076": "5月8日", // サクラローレル
        "1077": "4月4日", // ナリタトップロード
        "1083": "1月21日", // シンボリクリスエス
        "1084": "5月4日", // タニノギムレット
        "1086": "4月9日", // メジロラモーヌ
        "1088": "3月10日", // サトノクラウン
        "1089": "3月14日", // シュヴァルグラン
        "1093": "3月16日", // ケイエスミラクル
        "1094": "5月7日", // ジャングルポケット
        "1104": "4月24日" // カツラギエース
        // "2001": "x月y日", // ハッピーミーク
        // "2002": "x月y日", // ビターグラッセ
        // "2003": "x月y日", // リトルココン
        // "2004": "x月y日", // モンジュー
        // "9002": "x月y日", // 秋川理事長
        // "9003": "x月y日", // 乙名史記者
        // "9004": "x月y日", // 桐生院トレーナー
        // "9006": "x月y日", // 樫本理子
        // "9040": "x月y日", // ダーレーアラビアン
        // "9041": "x月y日", // ゴドルフィンバルブ
        // "9042": "x月y日", // バイアリーターク
    };
    for (const item of await req2json("https://www.tracenacademy.com/api/TextData/157") as Data[]) {
        id_birthday[item.index] = item.text;
    }

    const result: { [key: string]: {
        name: string;
        birthday: Date
    }} = {};

    for (const id in id_name) {
        const name = id_name[id];
        // Convert from 5月2日 to [5,2]
        if (id_birthday[id]) {
            const _birthday: [number, number] = id_birthday[id].split("月").map(x => parseInt(x.replace("日", ""))) as [number, number];
            const birthday = new Date(new Date().getFullYear(), _birthday[0] - 1, _birthday[1]);
            result[id] = {
                name,
                birthday
            };
        } else {
            console.log(`Not found in birthday: ${name} ${id}`);
        }
    }
    
    return result;
};