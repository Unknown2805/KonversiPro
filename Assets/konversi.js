// helper conversion with validation
function parseInputAuto(str, forcedBase) {
    str = String(str).trim();
    if(!str) return null;
    // allow forms: "20(8)" or "AF" with forced base
    const m = str.match(/^([0-9A-Fa-f]+)\\((\\d+)\\)$/);
    if(m) return {number: m[1], base: parseInt(m[2],10)};
    
    // if forcedBase provided, use it; else try detect prefixes
    if(forcedBase) return {number: str, base: forcedBase};
    const low = str.toLowerCase();
    if(low.startsWith('0b')) return {number: low.slice(2), base: 2};
    if(low.startsWith('0o')) return {number: low.slice(2), base: 8};
    if(low.startsWith('0x')) return {number: low.slice(2), base: 16};
    // fallback assume decimal
    if(/^[01]+$/.test(str)) return {number: str, base: 2};
    if(/^[0-7]+$/.test(str)) return {number: str, base: 8};
    if(/^[0-9]+$/.test(str)) return {number: str, base: 10};
    if(/^[0-9A-Fa-f]+$/.test(str)) return {number: str, base: 16};
    return null;
}
function toDecimal(number, base){
    return parseInt(number, base);
}
function formatAll(decimal) {
    return {
    bin: decimal.toString(2),
    dec: decimal.toString(10),
    oct: decimal.toString(8),
    hex: decimal.toString(16).toUpperCase()
    };
}
// UI
const optBtns = {bin: document.getElementById('optBin'), dec: document.getElementById('optDec'), oct: document.getElementById('optOct'), hex: document.getElementById('optHex')};
let forcedBase = null;
Object.entries(optBtns).forEach(([k,el])=>{
    el.addEventListener('click', ()=>{
    // highlight
    Object.values(optBtns).forEach(x=>x.classList.remove('ring-2','ring-[#4E2BFF]'));
    el.classList.add('ring-2','ring-[#4E2BFF]');
    forcedBase = ({bin:2,dec:10,oct:8,hex:16}[k]);
    });
});
document.getElementById('convertBtn').addEventListener('click', ()=>{
    const raw = document.getElementById('inputNumber').value.trim();
    const parsed = parseInputAuto(raw, forcedBase);
    const out = document.getElementById('resultBox');
    if(!parsed){ out.textContent = 'Input unknown..'; return; }
    const dec = toDecimal(parsed.number, parsed.base);
    if(Number.isNaN(dec)){ out.textContent = 'Conversion Failed.'; return; }
    const all = formatAll(dec);
    out.innerHTML = `<div class="font-semibold mb-2">Result :</div>
    <div>Binary: <span class="font-mono">${all.bin}</span></div>
    <div>Decimal: <span class="font-mono">${all.dec}</span></div>
    <div>Octal: <span class="font-mono">${all.oct}</span></div>
    <div>Hexadecimal: <span class="font-mono">${all.hex}</span></div>`;
    // save to localStorage
    localStorage.setItem('konv_number', parsed.number);
    localStorage.setItem('konv_base', String(parsed.base));
    localStorage.setItem('konv_decimal', String(dec));
    localStorage.setItem('konv_timestamp', String(Date.now()));
    // optional: save full results as JSON
    localStorage.setItem('konv_results', JSON.stringify(all));
});
// preview explanation page
document.getElementById('previewExplain').addEventListener('click', ()=>{
    // ensure something saved; if not, try to save current input
    const cur = document.getElementById('inputNumber').value.trim();
    if(!localStorage.getItem('konv_number') && cur){
    document.getElementById('convertBtn').click(); // perform convert then open
    }
    // open penjelasan page
    window.location.href = 'penjelasan.html';
});