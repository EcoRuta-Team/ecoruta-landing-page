const data = {
    semanal: { v: [60, 45, 90, 30, 80, 70, 40], l: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], txt: "Esta semana el AQI promedió 59. El jueves tuvimos la calidad más limpia." },
    quincenal: { v: [40, 50, 60, 40, 50, 120, 90, 40, 50, 60, 40, 50, 110, 90, 50], l: ['1','','3','','5','','7','','9','','11','','13','','15'], txt: "La quincena muestra fluctuaciones. Los días 7 y 14 presentaron picos de contaminación." },
    mensual: { v: [140, 110, 68], l: ['Abr', 'May', 'Jun'], txt: "Tendencia clara a la baja: pasamos de 140 en abril a un saludable 68 en junio." }
};

function render(tipo, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    
    const box = document.getElementById('chart-area');
    const item = data[tipo];
    box.innerHTML = '';
    
  item.v.forEach((val, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'bar-wrap';

    const altura = val * 1.5; 
    const color = val > 100 ? '#ffa500' : val > 60 ? '#ffd700' : '#32cd32';
    
    wrap.innerHTML = `
        <div class="bar" style="height:${altura}px; background:${color}"></div>
        <span style="font-size:9px; color:#888">${item.l[i]}</span>
    `;
    box.appendChild(wrap);
});
    document.getElementById('resumen-text').innerText = item.txt;
}

window.onload = () => render('semanal', document.querySelector('.filter-btn')); 