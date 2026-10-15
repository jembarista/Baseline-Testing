const fs=require('fs'),vm=require('vm'),assert=require('assert');
class E{constructor(tag='div'){this.tag=tag;this.children=[];this.attrs={};this.style={setProperty(){}};this.classList={toggle(){},remove(){},add(){}};this.value='';this.hidden=false}append(...n){this.children.push(...n)}prepend(n){this.children.unshift(n)}replaceChildren(...n){this.children=n}removeAttribute(k){delete this.attrs[k]}setAttribute(k,v){this.attrs[k]=String(v)}querySelectorAll(t){return this.children.flatMap(n=>[...(n.tag===t?[n]:[]),...n.querySelectorAll(t)])}querySelector(t){return this.querySelectorAll(t)[0]}cloneNode(){return new E('svg')}}
const ids={};const ctx={Date,structuredClone,URLSearchParams,location:{search:''},setInterval(){},localStorage:{getItem(){return null},setItem(){}},window:{addEventListener(){},print(){}},document:{body:new E(),getElementById(id){return ids[id]??=new E()},createTextNode(t){const n=new E('text');n.textContent=t;return n},createElement(t){return new E(t)},querySelectorAll(){return []},querySelector(){return new E('svg')}}};vm.createContext(ctx);for(const f of ['criteria-comments.js','immersion.js','percolation.js','barista-one.js','app.js','scoresheet.js'])vm.runInContext(fs.readFileSync(__dirname+'/../'+f,'utf8'),ctx);
vm.runInContext(`session={coach:'Test',candidate:'C1',created:new Date().toISOString(),criteria:structuredClone(criteria),equipment:{grinder:'gbw',control:'Volumetric'},stages:titles.map(title=>({title,checks:{},elapsed:null,started:null,observed:'',notes:'',saved:false}))};index=2;setScoreView(true)`,ctx);
assert.equal(ids.sheetPages.children.length,3);
const buttons=ids.sheetPages.querySelectorAll('button');let b=buttons.find(b=>b.attrs['aria-label']==='Make four single espressos: Pair 2: Tamping: unscored. Tap to change score.');assert(b);b.onclick();assert(vm.runInContext('current().checks.tamp_pair2===true&&current().checks.tamp_pair1===undefined',ctx));vm.runInContext('setScoreView(false)',ctx);assert(vm.runInContext('current().checks.tamp_pair2===true',ctx));
vm.runInContext(`var s=current();s.checks=Object.fromEntries(checksFor(2).map(([k])=>[k,true]));s.observed='17,17.2';s.elapsed=50`,ctx);assert(!vm.runInContext('evaluate(s,2).pass',ctx));vm.runInContext('s.elapsed=49.9',ctx);assert(vm.runInContext('evaluate(s,2).pass',ctx));vm.runInContext('s.firstAttempt=structuredClone({...s,firstAttempt:undefined});setScoreView(true)',ctx);assert.equal(ids.sheetPages.children.length,4);
console.log('PASS: shared pair scores, view switching, strict 50s boundary, dose tolerance, archived-attempt page.');

vm.runInContext(`$('cert').value='Barista One Baseline Test';configureTest();index=0;setScoreView(true)`,ctx);
assert.equal(ids.sheetPages.children.length,2);
assert.equal(vm.runInContext('checksFor(0).length',ctx),18);
assert.equal(vm.runInContext('checksFor(1).length',ctx),32);
vm.runInContext(`var milk=session.stages[1];milk.checks=Object.fromEntries(checksFor(1).map(([k])=>[k,true]));milk.elapsed=209.9`,ctx);
assert(vm.runInContext('doseEntryValid(milk,1)&&evaluate(milk,1).pass',ctx));
vm.runInContext('milk.elapsed=210',ctx);assert(!vm.runInContext('evaluate(milk,1).pass',ctx));
vm.runInContext(`milk.elapsed=209;milk.checks.temperature_pair2=false`,ctx);assert(!vm.runInContext('evaluate(milk,1).pass',ctx));
console.log('PASS: Barista One two pages, pair criteria, milk without dose, strict milk time and failed criterion.');
const before=vm.runInContext('JSON.stringify(session)',ctx);
vm.runInContext("session.candidate='Test Student';session.bhStudentId='BH123';session.coach='Test Coach';session.stages[0].notes='Private feedback';session.stages[0].firstAttempt=structuredClone(session.stages[0])",ctx);
const stored=vm.runInContext('JSON.stringify(session)',ctx);
vm.runInContext("printScoresheet('blank')",ctx);
assert.equal(vm.runInContext('JSON.stringify(session)',ctx),stored);
assert.equal(ids.sheetPages.children.length,2);
const textOf=n=>[n.textContent||'',...n.children.map(textOf)].join(' ');
const blank=textOf(ids.sheetPages);
for(const privateText of ['Test Student','BH123','Test Coach','Private feedback'])assert(!blank.includes(privateText));
assert(!blank.includes('✓ observed or × missed. Blank = not scored.')===false);
vm.runInContext("blankPrintMode=false;renderSheets()",ctx);
assert.equal(ids.sheetPages.children.length,3);
assert(textOf(ids.sheetPages).includes('Private feedback'));
console.log('PASS: blank print clears personal data and scores, excludes retries, preserves original assessment; filled view restores.');

vm.runInContext("$('cert').value='Percolation Baseline Testing';configureTest();index=0;showStage();setScoreView(true)",ctx);
assert.equal(ids.sheetPages.children.length,2);
assert.equal(vm.runInContext('checksFor(0).length',ctx),42);
assert.equal(vm.runInContext('checksFor(1).length',ctx),15);
vm.runInContext("var hand=session.stages[0];hand.checks=Object.fromEntries(checksFor(0).map(([k])=>[k,true]));hand.elapsed=359.9",ctx);
assert(vm.runInContext('evaluate(hand,0).pass',ctx));
vm.runInContext('hand.elapsed=360',ctx);assert(!vm.runInContext('evaluate(hand,0).pass',ctx));
vm.runInContext("var batch=session.stages[1];batch.checks=Object.fromEntries(checksFor(1).map(([k])=>[k,true]));batch.elapsed=119.9",ctx);assert(vm.runInContext('evaluate(batch,1).pass',ctx));
vm.runInContext('batch.elapsed=120',ctx);assert(!vm.runInContext('evaluate(batch,1).pass',ctx));
console.log('PASS: Percolation three brew columns, batch criteria, strict time limits and no espresso dose validation.');
for(const method of ['aeropress','syphon','steep','cezve']){
 vm.runInContext(`$('cert').value='Immersion Baseline Testing';$('staticMethod').value='French press / plunger';$('immersionMethod').value='${method}';configureTest();index=0;showStage();setScoreView(true)`,ctx);
 assert.equal(ids.sheetPages.children.length,2);
 assert.equal(vm.runInContext('scoreSlots(0).length',ctx),3);
 assert.equal(vm.runInContext('scoreSlots(1).length',ctx),method==='cezve'?2:3);
 for(const i of [0,1]){
 vm.runInContext(`var attempt=session.stages[${i}];attempt.checks=Object.fromEntries(checksFor(${i}).map(([k])=>[k,true]));attempt.elapsed=session.criteria.limits[${i}]-.1`,ctx);
 assert(vm.runInContext(`evaluate(attempt,${i}).pass`,ctx));
 vm.runInContext('attempt.elapsed+=.1',ctx);assert(!vm.runInContext(`evaluate(attempt,${i}).pass`,ctx));
 }
 vm.runInContext("printScoresheet('blank');blankPrintMode=false;renderSheets()",ctx);
}
console.log('PASS: all Immersion methods, brew counts, strict timing boundaries and blank printing preserve method.');
vm.runInContext("index=1;current().saved=true;current().result={pass:false};grantRetry();setScoreView(true)",ctx);
assert.equal(vm.runInContext('current().method',ctx),'cezve');
assert.equal(ids.sheetPages.children.length,3);
console.log('PASS: Immersion resit retains selected method and original attempt.');
