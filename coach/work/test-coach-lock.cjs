const fs=require('fs'),vm=require('vm'),assert=require('assert');
class E{constructor(tag='div'){this.tag=tag;this.children=[];this.attrs={};this.style={};this.classList={toggle(){},remove(){},add(){}};this.value='';this.hidden=false}append(...n){this.children.push(...n)}prepend(n){this.children.unshift(n)}replaceChildren(...n){this.children=n}setAttribute(k,v){this.attrs[k]=String(v)}querySelectorAll(t){return this.children.flatMap(n=>[...(n.tag===t?[n]:[]),...n.querySelectorAll(t)])}querySelector(t){return this.querySelectorAll(t)[0]}cloneNode(){return new E('svg')}}
const ids={};const ctx={Date,structuredClone,URLSearchParams,location:{search:''},setInterval(){},localStorage:{getItem(){return null},setItem(){}},window:{addEventListener(){},print(){}},document:{body:new E(),getElementById(id){return ids[id]??=new E()},createElement(t){return new E(t)},querySelector(){return new E('svg')}}};vm.createContext(ctx);for(const f of ['app.js','scoresheet.js'])vm.runInContext(fs.readFileSync(__dirname+'/../'+f,'utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../classroom.js','utf8'),ctx);
vm.runInContext('approveCertificate();showCertificate();printCertificate();view("certificate")',ctx);
assert.equal(ids.coachAccess.hidden,false);assert.equal(ids.certificate.hidden,true);assert.equal(ids.certificatePaper.children.length,0);
assert(!fs.readFileSync(__dirname+'/../classroom.js','utf8').includes("el('button','Print certificate"));
console.log('PASS: certificate calls blocked, protected view redirected, no certificate rendered.');
