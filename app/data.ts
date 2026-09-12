export type Asset = {
  name: string; symbol: string; sector: string; buy: number; quantity: number;
  code: string;
  exchange: "NSE" | "BOM";
};

const raw: Array<[string, string, string, string, number, number, "NSE" | "BOM"]> = [
  ["HDFC Bank","HDFCBANK","HDFCBANK","Financial",1490,50,"NSE"], ["Bajaj Finance","BAJFINANCE","BAJFINANCE","Financial",6466,15,"NSE"], ["ICICI Bank","ICICIBANK","532174","Financial",780,84,"NSE"], ["Bajaj Housing","BAJAJHFL","544252","Financial",130,504,"NSE"], ["Savani Financials","511577","511577","Financial",24,1080,"BOM"],
  ["Affle India","AFFLE","AFFLE","Technology",1151,50,"NSE"], ["LTIMindtree","LTM","LTM","Technology",4775,16,"NSE"], ["KPIT Technologies","KPITTECH","542651","Technology",672,61,"NSE"], ["Tata Technologies","TATATECH","544028","Technology",1072,63,"NSE"], ["BLS E-Services","BLSE","544107","Technology",232,191,"NSE"], ["Tanla Platforms","TANLA","532790","Technology",1134,45,"NSE"],
  ["Avenue Supermarts","DMART","DMART","Consumer",3777,27,"NSE"], ["Tata Consumer","TATACONSUM","532540","Consumer",845,90,"NSE"], ["Pidilite Industries","PIDILITIND","500331","Consumer",2376,36,"NSE"],
  ["Tata Power","TATAPOWER","500400","Power",224,225,"NSE"], ["KPI Green Energy","KPIGREEN","542323","Power",875,50,"NSE"], ["Suzlon Energy","SUZLON","532667","Power",44,450,"NSE"], ["Gensol Engineering","GENSOL","542851","Power",998,45,"NSE"],
  ["Hariom Pipe Industries","HARIOMPIPE","543517","Pipes",580,60,"NSE"], ["Astral","ASTRAL","ASTRAL","Pipes",1517,56,"NSE"], ["Polycab India","POLYCAB","542652","Pipes",2818,28,"NSE"],
  ["Clean Science","CLEAN","543318","Other",1610,32,"NSE"], ["Deepak Nitrite","DEEPAKNTR","506401","Other",2248,27,"NSE"], ["Fine Organic","FINEORG","541557","Other",4284,16,"NSE"], ["Gravita India","GRAVITA","533282","Other",2037,8,"NSE"], ["SBI Life","SBILIFE","540719","Other",1197,49,"NSE"]
];

export const assets: Asset[] = raw.map(([name, symbol, code, sector, buy, quantity, exchange]) => ({ name, symbol, code, sector, buy, quantity, exchange }));
