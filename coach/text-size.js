const textSizes=[1,1.15,1.3,1.5];
let textSizeIndex=0;
try{const saved=Number(localStorage.getItem('bh-text-size'));if(Number.isInteger(saved)&&saved>=0&&saved<textSizes.length)textSizeIndex=saved}catch{}
function applyTextSize(){
 const scoring=['assess','sheet'].includes(visibleScreen);
 document.querySelector('.text-size-tools').hidden=!scoring;
 const scale=scoring?textSizes[textSizeIndex]:1;
 document.documentElement.style.setProperty('--text-scale',scale);
 document.documentElement.toggleAttribute('data-large-text',scoring&&textSizeIndex>0);
 document.getElementById('textSizeValue').textContent=Math.round(scale*100)+'%';
 document.getElementById('textSmaller').disabled=textSizeIndex===0;
 document.getElementById('textLarger').disabled=textSizeIndex===textSizes.length-1;
}
function changeTextSize(direction){textSizeIndex=Math.max(0,Math.min(textSizes.length-1,textSizeIndex+direction));applyTextSize();try{localStorage.setItem('bh-text-size',textSizeIndex)}catch{}}
applyTextSize();
