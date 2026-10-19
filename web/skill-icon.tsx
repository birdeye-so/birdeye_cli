import React from "react";

// Match the pictograms in the user-selected birdeye-data-skills/deploy console.
// GMGN's wallet-score reports also use target purpose markers.
const icons: Record<string, string> = {
  "skill-trending-list": "🔥", "skill-smart-wallets": "💰",
  "skill-token-dd": "🔍", "skill-contract-dd": "🛡️", "skill-rugcheck-audit": "🧪",
  "skill-kline-pattern": "🕯️", "skill-wallet-score": "📊", "skill-wallet-style": "🎭",
  "skill-wallet-analysis": "📈", "skill-smart-money-profile": "🎯", "skill-smart-money-leaderboard": "🏆",
  "token-research": "🔍", "token-due-diligence": "🛡️", "project-deep-report": "📋",
  "wallet-analysis": "📈", "smart-money-profile": "🎯", "risk-warning": "⚠️",
  "early-project-screening": "🌱", "daily-brief": "📰", "market-opportunities": "🔥",
  "market-shortlist": "📑", "wallet-exposure": "💼",
};

export function SkillIcon({kind,size=20}:{kind:string;size?:number}) {
  return <span className="skill-icon" style={{fontSize:size,width:size,height:size}} aria-hidden="true">{Object.hasOwn(icons,kind)?icons[kind]:"📋"}</span>;
}
