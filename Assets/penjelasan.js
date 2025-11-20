function charValue(ch){
    const c = ch.toUpperCase();
    if(c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
    return 10 + c.charCodeAt(0) - 65; // A=10
}
function valToChar(v){ return v < 10 ? String(v) : String.fromCharCode(55+v); }
function readSaved(){
    const number = localStorage.getItem('konv_number');
    const base = localStorage.getItem('konv_base');
    const decStr = localStorage.getItem('konv_decimal');
    const results = localStorage.getItem('konv_results');
    if(!number || !base || decStr === null) return null;
    return {number, base: parseInt(base,10), dec: parseInt(decStr,10), results: results ? JSON.parse(results) : null, ts: localStorage.getItem('konv_timestamp')};
}
function toDecimalDetailed(number, base){
    const s = number.toUpperCase();
    const digits = s.split('');
    const n = digits.length;
    let total = 0;
    const lines = [];
    for(let i=0;i<n;i++){
    const pos = n-1-i;
    const ch = digits[i];
    const val = charValue(ch);
    const pow = Math.pow(base, pos);
    const prod = val * pow;
    lines.push({ch,val,pos,pow,prod});
    total += prod;
    }
    return {total, lines};
}
function fromDecimalDetailed(decimal, base){
    if(decimal === 0) return {digits:['0'], steps:[{q:0,newQ:0,r:0}]};
    let q = decimal;
    const steps = [];
    const rem = [];
    while(q > 0){
    const r = q % base;
    const newQ = Math.floor(q / base);
    steps.push({q,newQ,r});
    rem.push(r);
    q = newQ;
    }
    const digits = rem.reverse().map(v => valToChar(v));
    return {digits, steps};
}
// main
(function(){
    const saved = readSaved();
    const notice = document.getElementById('notice');
    const area = document.getElementById('explainArea');
    if(!saved){
    notice.textContent = 'Belum ada konversi tersimpan. Silakan buka halaman Konversi dan lakukan konversi terlebih dahulu.';
    return;
    }
    notice.innerHTML = `<div class="text-slate-200">Input terakhir: <span class="font-mono">${saved.number}</span> (basis ${saved.base}) — hasil desimal: <span class="font-mono">${saved.dec}</span></div>`;
    // 1) show per-digit -> decimal
    const decDetail = toDecimalDetailed(saved.number, saved.base);
    const div1 = document.createElement('div');
    div1.innerHTML = `<h3 class="text-xl font-semibold">Langkah: Ubah ke Desimal (Per digit)</h3>`;
    const list = document.createElement('div');
    decDetail.lines.forEach(it=>{
    const el = document.createElement('div');
    el.className = 'text-slate-200';
    el.style.lineHeight = '1.6';
    el.innerHTML = `Digit '${it.ch}' → ${it.val} × ${saved.base}<sup>${it.pos}</sup> = ${it.val} × ${it.pow} = <strong>${it.prod}</strong>`;
    list.appendChild(el);
    });
    const sumEl = document.createElement('div');
    sumEl.className = 'text-slate-100 mt-2';
    sumEl.innerHTML = `<strong>Jumlah semua produk = ${decDetail.total}</strong> → nilai desimal.`;
    div1.appendChild(list);
    div1.appendChild(sumEl);
    area.appendChild(div1);
    // 2) show division for other bases
    const div2 = document.createElement('div');
    div2.innerHTML = `<h3 class="text-xl font-semibold">Langkah: Dari Desimal → Basis lain (Pembagian berulang)</h3>`;
    ['2','8','16'].forEach(b=>{
    const bnum = parseInt(b,10);
    const d = fromDecimalDetailed(saved.dec, bnum);
    const title = document.createElement('div');
    title.className = 'text-slate-200 font-medium mt-3';
    const name = bnum===2? 'Biner' : bnum===8? 'Oktal' : 'Heksadesimal';
    title.textContent = `${name} (basis ${bnum}) — Hasil: ${d.digits.join('')}`;
    div2.appendChild(title);
    const stepsBox = document.createElement('pre');
    stepsBox.className = 'mt-2';
    let txt = '';
    d.steps.forEach(st => { txt += `${st.q} ÷ ${bnum} = ${st.newQ} sisa ${st.r}\n`; });
    txt += `Baca sisa dari bawah ke atas → ${d.digits.join('')}`;
    stepsBox.textContent = txt;
    div2.appendChild(stepsBox);
    });
    area.appendChild(div2);
    // 3) show quick results (from saved results if present)
    if(saved.results){
    const div3 = document.createElement('div');
    div3.innerHTML = `<h3 class="text-xl font-semibold mt-4">Ringkasan Hasil</h3>`;
    div3.innerHTML += `<div class="text-slate-200 mt-2">
        Biner: <span class="font-mono">${saved.results.bin}</span><br/>
        Desimal: <span class="font-mono">${saved.results.dec}</span><br/>
        Oktal: <span class="font-mono">${saved.results.oct}</span><br/>
        Heksadesimal: <span class="font-mono">${saved.results.hex}</span>
    </div>`;
    area.appendChild(div3);
    }
    // add a small note for navigation
    const navNote = document.createElement('div');
    navNote.className = 'mt-6 text-slate-400';
    area.appendChild(navNote);
})();