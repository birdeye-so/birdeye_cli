// Synthetic UI evidence only. Never imported by the production bundle.
const address="So11111111111111111111111111111111111111112";
const second="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const provenance={sourceId:"fixture-request",asOf:"2026-10-16T08:00:00.000Z"};
const market=[{...provenance,address,symbol:"SAMPLE-A",priceUsd:"142.25",priceChange24hPct:"3.45",volume24hUsd:"5200000",liquidityUsd:"2400000"},{...provenance,address:second,symbol:"SAMPLE-B",priceUsd:"0.00000042",priceChange24hPct:"-2.16",volume24hUsd:"750000",liquidityUsd:"600000"}];
const controls=market.map(r=>({...provenance,address:r.address,freezeable:false,mutableMetadata:true,top10HolderPct:"22.5"}));
const section=(title,rows)=>({title,rows,columns:[]});
const base={version:1,coverage:"partial",retrievedAt:provenance.asOf,input:{address},limitation:"Synthetic UI test fixture."};
export const demoReports={
  terminal:{...base,id:"terminal",sections:[section("Market snapshot",market),section("Observed token controls",controls)]},
  "dex-inspector":{...base,id:"dex-inspector",sections:[section("Market snapshot",market.slice(0,1)),section("Observed token controls",controls.slice(0,1)),section("Pools · fetched page",[{...provenance,address,name:"Sample pool A",liquidity:"1600000",volume24h:"3200000"},{...provenance,address:second,name:"Sample pool B",liquidity:"800000",volume24h:"2000000"}])]},
  "wallet-intelligence":{...base,id:"wallet-intelligence",sections:[section("PnL windows · do not sum",[{...provenance,duration:"7d",realizedPnlUsd:"480.25",unrealizedPnlUsd:"-120.5",totalPnlUsd:"359.75",pnlMethod:"Provider summary"},{...provenance,duration:"30d",realizedPnlUsd:"1600",unrealizedPnlUsd:"-200",totalPnlUsd:"1400",pnlMethod:"Provider summary"}]),section("Holdings · priced page only",market.map((r,i)=>({...provenance,address:r.address,symbol:r.symbol,valueUsd:i?"2800":"7200",observedWeightPct:i?"28":"72"})))]},
  "security-signals":{...base,id:"security-signals",signalState:"attention",sections:[section("Market snapshot",market.slice(0,1)),section("Configured rule checks",[{...provenance,rule:"Liquidity below threshold",state:"within-threshold",unit:"USD",observed:"2400000",threshold:100000},{...provenance,rule:"Top-10 token-account concentration",state:"attention",unit:"% of supply",observed:"62",threshold:50},{...provenance,rule:"Freezeable control observed",state:"unknown",unit:"boolean",observed:null,threshold:true}])]},
  "telegram-brief":{...base,id:"telegram-brief",delivery:"preview-only",message:"Synthetic UI fixture — not market data.\nToken research snapshot.\nNo message sent.",sections:[section("Market snapshot",market.slice(0,1)),section("Observed token controls",controls.slice(0,1))]}
};

export const walletDiscoveryReport={...base,id:"wallet-intelligence",input:{},walletStage:"discovery",sections:[section("Smart-money tokens · fetched page",market.map(r=>({...r,smartTraders:12}))),section("Discovered wallets · provider order",[{...provenance,address,tokens:[second],observations:[{...provenance,token:second,symbol:"SAMPLE-B",window:"30d",volumeUsd:250000,tokenRealizedPnlUsd:500}]}])]};

const observation=(key,label,value,unit,basis=key)=>({...provenance,key,label,value,unit,basis});
demoReports["security-signals"].sections.push(
  section("Market depth & activity",[
    observation("marketCap","Market cap","80000000","USD"),observation("fdv","Fully diluted valuation","120000000","USD"),
    observation("holder","Holder count","24983","count"),observation("totalSupply","Total supply","843585.237","tokens"),observation("circulatingSupply","Circulating supply","562390.158","tokens"),
    observation("liquidityToMarketCap","Liquidity / market cap","3","%","liquidity ÷ marketCap × 100"),observation("volumeToLiquidity","24h volume / liquidity","2.1666666667","×"),
    observation("trade24h","Trades · 24h","18342","count"),observation("buy24h","Buys · 24h","10018","count"),observation("sell24h","Sells · 24h","8324","count"),observation("uniqueWallet24h","Active wallets · 24h","5921","count"),
    observation("vBuy24hUSD","Buy volume · 24h","2800000","USD"),observation("vSell24hUSD","Sell volume · 24h","2400000","USD"),observation("netBuy24hUSD","Net buy volume · 24h","400000","USD","Buy volume − sell volume; not capital inflow")]),
  section("Ownership concentration",[
    observation("top10HolderPercent","Top-10 token accounts","62","% of supply"),observation("top10UserPercent","Top-10 unique users","68","% of supply"),observation("creatorPercentage","Creator share","4.8","% of supply"),observation("ownerPercentage","Owner share",null,"% of supply"),observation("metaplexUpdateAuthorityPercent","Metadata authority share","0","% of supply"),
    observation("top10HolderBalance","Top-10 account balance","523023","tokens"),observation("top10UserBalance","Top-10 user balance","573638","tokens"),observation("creatorBalance","Creator balance","40492","tokens"),observation("ownerBalance","Owner balance",null,"tokens"),observation("metaplexUpdateAuthorityBalance","Metadata authority balance","0","tokens"),observation("topWalletCount","Top-holder segment wallets","10","count"),observation("topWalletHolding","Top-holder segment balance","573638","tokens"),observation("topWalletSupplyPct","Top-holder segment supply share","68","% of supply")]),
  section("Token control observations",[
    observation("freezeable","Freezeable",null,"boolean"),observation("mutableMetadata","Mutable metadata",true,"boolean"),observation("transferFeeEnable","Transfer fee enabled",false,"boolean"),observation("nonTransferable","Non-transferable",false,"boolean"),observation("isToken2022","Token-2022",true,"boolean"),observation("fakeToken","Imitation token flag",null,"boolean"),observation("isTrueToken","Canonical token flag",true,"boolean")]),
  section("Authority addresses",[
    observation("creatorAddress","Creator address",address,"address"),observation("ownerAddress","Owner address",null,"address"),observation("freezeAuthority","Freeze authority",null,"address"),observation("metaplexUpdateAuthority","Metadata update authority",second,"address")]),
  section("Holder wallets · fetched page",[
    {...provenance,position:1,address,amount:"151845.12345",supplySharePct:"18"},
    {...provenance,position:2,address:second,amount:"92794.34567",supplySharePct:"11"}])
);
