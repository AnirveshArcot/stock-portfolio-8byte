import type {Asset} from "@/app/data";

export type presentAsset = Asset & {
    price : number | null;
    pe : number | null;
    earnings : number | null;
    live : boolean;
    error : string | null;

}

export const money = new Intl.NumberFormat("en-In",{
    style: "currency",
    currency: "INR"
})


export const price = new Intl.NumberFormat("en-In",{
    style: "currency",
    currency: "INR",
    minimumFractionDigits:2,
    maximumFractionDigits: 2
})

export function calcPortVal(items:presentAsset[]){
    const investment = items.reduce(
        (sum,item) => sum + item.buy * item.quantity,
        0,
    );


    const presentVal = items.reduce(
        (sum,item) => sum + (item.price ?? 0) * item.quantity,
        0,
    );
    
    const gain = presentVal - investment;

    return { investment , presentVal , gain}
}

export function gainCol(gain:number){
    return gain >=0 ? "text-emerald-400" : "text-rose-400";
}
