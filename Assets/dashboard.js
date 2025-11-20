const lastValue = localStorage.getItem('konv_number');
const lastBase = localStorage.getItem('konv_base');
const lastDec = localStorage.getItem('konv_decimal');
const infoEl = document.getElementById('lastInfo');
if(lastValue && lastBase && lastDec !== null) {
  infoEl.innerHTML = `<div class="font-medium">${lastValue} (base ${lastBase}) → ${lastDec} (decimal)</div>`;
}
