import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
await build({entryPoints:["web/address-text.tsx"],outdir:".test-dist/address-ui",bundle:true,packages:"external",platform:"node",format:"esm",jsx:"automatic",outExtension:{".js":".mjs"}});
const {AddressText,AddressChainProvider}=await import("../.test-dist/address-ui/address-text.mjs");
const address="So11111111111111111111111111111111111111112";
const render=props=>renderToStaticMarkup(React.createElement(AddressText,{text:address,...props}));
test("address copy and Birdeye navigation are separate accessible controls",()=>{
  for(const kind of ["token","wallet"]){
    const html=render({kind,compact:true});
    assert.match(html,new RegExp(`href="https://birdeye.so/solana/${kind==="wallet"?"wallet-analyzer":"token"}/${address}"`));
    assert.match(html,/target="_blank" rel="noopener noreferrer"/);
    assert.match(html,new RegExp(`aria-label="Open ${kind} ${address} on Birdeye \\(new tab\\)"`));
    assert.match(html,new RegExp(`data-address="${address}"`));
    assert.match(html,/<\/button><a /);
  }
  assert.doesNotMatch(render({}),/<a /,"Unknown address kinds remain copy-only");
  assert.doesNotMatch(render({text:"missing",kind:"token"}),/<a |<button/);
});
test("chain context follows the saved report and explicit row chain takes precedence",()=>{
  const html=renderToStaticMarkup(React.createElement(AddressChainProvider,{chain:"chain-from-report"},[
    React.createElement(AddressText,{key:1,text:address,kind:"wallet"}),
    React.createElement(AddressText,{key:2,text:address,kind:"token",chain:"chain-from-row"}),
  ]));
  assert.match(html,/birdeye.so\/chain-from-report\/wallet-analyzer\//);
  assert.match(html,/birdeye.so\/chain-from-row\/token\//);
});
