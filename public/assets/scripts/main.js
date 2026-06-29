console.log("EcoRuta Landing Page");

/* =========================
Beneficios
========================= */

document.addEventListener('DOMContentLoaded', function () {
const benefitsSection = document.getElementById('benefits');

if (!benefitsSection) {
    return;
}

const benefitCards = document.querySelectorAll('.benefit-card');
const reclaimBtns = document.querySelectorAll('.reclaim-btn');
const modal = document.getElementById('confirmModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const pointsNumber = document.getElementById('pointsNumber');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const seeAllBtn = document.getElementById('seeAllBtn');
const seeAllLabel = document.getElementById('seeAllLabel');
const navLinks = document.querySelectorAll('.benefits-nav .nav-link');

let currentBenefit = null;
let userPoints = 12500;

const benefitsCost = {
    movilidad: 500,
    reparaciones: 800,
    transporte: 800,
    bienestar: 950,
    alimentacion: 600,
    fitness: 1200
};

reclaimBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        currentBenefit = this.getAttribute('data-benefit');

        const benefitCard = this.closest('.benefit-card');
        const benefitTitle = benefitCard.querySelector('h3').textContent;
        const benefitCost = benefitsCost[currentBenefit];

        document.getElementById('modalTitle').textContent = `¿Reclamar ${benefitTitle}?`;
        document.getElementById('modalMessage').textContent =
            `Este beneficio cuesta ${benefitCost} puntos eco. ¿Deseas continuar?`;

        openModal();
    });
});

function openModal() {
    if (!modal) return;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentBenefit = null;
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
}

if (confirmBtn) {
    confirmBtn.addEventListener('click', function (e) {
        e.preventDefault();

        if (!currentBenefit) return;

        const benefitCost = benefitsCost[currentBenefit];

        if (userPoints >= benefitCost) {
            userPoints -= benefitCost;
            updatePoints();

            showToast(`¡Beneficio reclamado! Ahora tienes ${userPoints} puntos eco.`, 'success');

            const btn = document.querySelector(`[data-benefit="${currentBenefit}"]`);

            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
                btn.innerHTML = '<span>✓</span><span>Reclamado</span>';
            }

            closeModal();
        } else {
            showToast('No tienes suficientes puntos eco para este beneficio.', 'error');
            closeModal();
        }
    });
}

function updatePoints() {
    if (!pointsNumber || !progressBar || !progressText) return;

    pointsNumber.style.transform = 'scale(1.1)';

    setTimeout(function () {
        pointsNumber.textContent = userPoints.toLocaleString('es-ES');
        pointsNumber.style.transform = 'scale(1)';
    }, 100);

    const maxPoints = 13000;
    const progress = (userPoints / maxPoints) * 100;

    progressBar.style.width = progress + '%';

    const pointsToNext = maxPoints - userPoints;

    if (pointsToNext > 0) {
        progressText.textContent = `Faltan ${pointsToNext} ptos para desbloquear tu próximo beneficio`;
    } else {
        progressText.textContent = '¡Has desbloqueado todos tus beneficios!';
    }
}

function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
}

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
        closeModal();
    }
});

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        navLinks.forEach(function (item) {
            item.classList.remove('active');
        });

        this.classList.add('active');
    });
});

if (seeAllBtn) {
    seeAllBtn.addEventListener('click', function () {
        const extras = document.querySelectorAll('.benefit-card.extra');
        const expanded = seeAllBtn.classList.toggle('expanded');

        extras.forEach(function (card) {
            card.classList.toggle('hidden', !expanded);
        });

        if (seeAllLabel) {
            seeAllLabel.textContent = expanded
                ? 'Ver menos beneficios'
                : 'Ver todos los beneficios';
        }
    });
}

benefitCards.forEach(function (card, index) {
    card.style.animationDelay = `${index * 0.1}s`;
});

});

/* =========================
   Rutas - US01, US02, US03 y US04
========================= */

(() => {
  const rutaOrigen = document.getElementById('rutaOrigen');
  const rutaDestino = document.getElementById('rutaDestino');
  const routeError = document.getElementById('routeError');

  const btnBuscarRuta = document.getElementById('btnBuscarRuta');
  const btnNuevaBusqueda = document.getElementById('btnNuevaBusqueda');
  const btnAbrirFiltros = document.getElementById('btnAbrirFiltros');

  const screenRutasOpciones = document.getElementById('screenRutasOpciones');
  const screenRutaPreferida = document.getElementById('screenRutaPreferida');
  const screenFiltros = document.getElementById('screenFiltros');
  const screenSinResultados = document.getElementById('screenSinResultados');
  const screenRutaEnCurso = document.getElementById('screenRutaEnCurso');
  const screenCompararRutas = document.getElementById('screenCompararRutas');

  const modalErrorCalculo = document.getElementById('modalErrorCalculo');
  const btnReintentar = document.getElementById('btnReintentar');

  const origenTexto = document.getElementById('origenTexto');
  const destinoTexto = document.getElementById('destinoTexto');

  const cardRutaRecomendada = document.getElementById('cardRutaRecomendada');
  const cardRutaAlternativa2 = document.getElementById('cardRutaAlternativa2');
  const cardRutaAlternativa3 = document.getElementById('cardRutaAlternativa3');
  const filterSuccessMessage = document.getElementById('filterSuccessMessage');

  const btnRutaRecomendada = document.querySelector('.btnRutaRecomendada');
  const btnRutaAlternativa = document.querySelector('.btnRutaAlternativa');
  const btnRutaEspecifica = document.querySelector('.btnRutaEspecifica');

  const btnVolverRutas = document.getElementById('btnVolverRutas');
  const btnIniciarRutaPreferida = document.getElementById('btnIniciarRutaPreferida');

  const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
  const btnFiltroEstricto = document.getElementById('btnFiltroEstricto');
  const btnCerrarFiltros = document.getElementById('btnCerrarFiltros');
  const btnBuscarOtrasRutas = document.getElementById('btnBuscarOtrasRutas');
  const btnVolverDesdeSinResultados = document.getElementById('btnVolverDesdeSinResultados');

  const btnCompararRutas = document.getElementById('btnCompararRutas');
  const btnIniciarRutaComparada = document.getElementById('btnIniciarRutaComparada');
  const btnVolverComparacion = document.getElementById('btnVolverComparacion');

  const environmentAlertModal = document.getElementById('environmentAlertModal');
  const recalculatingBox = document.getElementById('recalculatingBox');
  const routeUpdatedMessage = document.getElementById('routeUpdatedMessage');
  const environmentWarningMessage = document.getElementById('environmentWarningMessage');

  const rutaOriginalLine = document.getElementById('rutaOriginalLine');
  const rutaAlternativaLine = document.getElementById('rutaAlternativaLine');
  const zonaContaminada = document.getElementById('zonaContaminada');
  const warningMapIcon = document.getElementById('warningMapIcon');

  const routeLiveTime = document.getElementById('routeLiveTime');
  const routeLiveDetails = document.getElementById('routeLiveDetails');

  const btnIgnorarAlerta = document.getElementById('btnIgnorarAlerta');
  const btnDesviarRuta = document.getElementById('btnDesviarRuta');
  const btnCancelarRutaCurso = document.getElementById('btnCancelarRutaCurso');

  function ocultarError() {
    if (routeError) {
      routeError.style.display = 'none';
    }
  }

  function mostrarError() {
    if (routeError) {
      routeError.style.display = 'block';
    }
  }

  function activarNavRutas() {
    const navLinks = document.querySelectorAll('.inicio-nav a');

    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    const rutasLink = document.querySelector('.inicio-nav a[href="#rutas"]');

    if (rutasLink) {
      rutasLink.classList.add('active');
    }
  }

  function ocultarPantallasSecundarias() {
    if (screenRutasOpciones) screenRutasOpciones.style.display = 'none';
    if (screenRutaPreferida) screenRutaPreferida.style.display = 'none';
    if (screenFiltros) screenFiltros.style.display = 'none';
    if (screenSinResultados) screenSinResultados.style.display = 'none';
    if (screenRutaEnCurso) screenRutaEnCurso.style.display = 'none';
    if (screenCompararRutas) screenCompararRutas.style.display = 'none';
    const misRutas = document.getElementById('screenMisRutas');
    if (misRutas) misRutas.style.display = 'none';
  }

  function validarOrigenDestino() {
    if (!rutaOrigen || !rutaDestino) return false;

    const origen = rutaOrigen.value.trim();
    const destino = rutaDestino.value.trim();

    if (origen === '' || destino === '') {
      mostrarError();
      return false;
    }

    ocultarError();

    if (origenTexto) origenTexto.textContent = origen;
    if (destinoTexto) destinoTexto.textContent = destino;

    return true;
  }

  function mostrarErrorCalculo() {
    if (modalErrorCalculo) {
      modalErrorCalculo.classList.remove('hidden');
    }
  }

  function ocultarErrorCalculo() {
    if (modalErrorCalculo) {
      modalErrorCalculo.classList.add('hidden');
    }
  }

  function mostrarPantallaOpciones() {
    if (!validarOrigenDestino()) return;

    // US08 Escenario 3: si origen y destino son iguales, no se puede calcular ruta
    const origen = rutaOrigen ? rutaOrigen.value.trim().toLowerCase() : '';
    const destino = rutaDestino ? rutaDestino.value.trim().toLowerCase() : '';
    if (origen === destino) {
      mostrarErrorCalculo();
      return;
    }

    ocultarErrorCalculo();
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (cardRutaRecomendada) cardRutaRecomendada.style.display = 'flex';
    if (cardRutaAlternativa2) cardRutaAlternativa2.style.display = 'flex';
    if (cardRutaAlternativa3) cardRutaAlternativa3.style.display = 'flex';
    if (filterSuccessMessage) filterSuccessMessage.style.display = 'none';

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'flex';
      screenRutasOpciones.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function mostrarPantallaFiltros() {
    if (!validarOrigenDestino()) return;

    activarNavRutas();
    ocultarPantallasSecundarias();

    if (screenFiltros) {
      screenFiltros.style.display = 'block';
      screenFiltros.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function aplicarFiltros() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (cardRutaRecomendada) cardRutaRecomendada.style.display = 'flex';
    if (cardRutaAlternativa2) cardRutaAlternativa2.style.display = 'flex';
    if (cardRutaAlternativa3) cardRutaAlternativa3.style.display = 'none';
    if (filterSuccessMessage) filterSuccessMessage.style.display = 'block';

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'flex';
      screenRutasOpciones.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function aplicarFiltroEstricto() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (screenSinResultados) {
      screenSinResultados.style.display = 'block';
      screenSinResultados.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function mostrarPantallaRutaPreferida() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (screenRutaPreferida) {
      screenRutaPreferida.style.display = 'block';
      screenRutaPreferida.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function mostrarComparacionRutas() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (screenCompararRutas) {
      screenCompararRutas.style.display = 'block';
      screenCompararRutas.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function volverAOpciones() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'flex';
      screenRutasOpciones.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function nuevaBusqueda() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (rutaOrigen) {
      rutaOrigen.focus();
    }
  }

  function iniciarRutaEnCurso() {
    activarNavRutas();
    ocultarPantallasSecundarias();

    if (environmentAlertModal) environmentAlertModal.style.display = 'block';
    if (recalculatingBox) recalculatingBox.style.display = 'none';
    if (routeUpdatedMessage) routeUpdatedMessage.style.display = 'none';
    if (environmentWarningMessage) environmentWarningMessage.style.display = 'none';

    if (rutaOriginalLine) rutaOriginalLine.style.display = 'block';
    if (rutaAlternativaLine) rutaAlternativaLine.style.display = 'none';
    if (zonaContaminada) zonaContaminada.style.display = 'block';
    if (warningMapIcon) warningMapIcon.style.display = 'block';

    if (routeLiveTime) routeLiveTime.textContent = '39 min';
    if (routeLiveDetails) routeLiveDetails.textContent = '19km · 10:09 a.m.';

    if (screenRutaEnCurso) {
      screenRutaEnCurso.style.display = 'block';
      screenRutaEnCurso.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function desviarRutaContaminada() {
    if (environmentAlertModal) environmentAlertModal.style.display = 'none';
    if (environmentWarningMessage) environmentWarningMessage.style.display = 'none';
    if (recalculatingBox) recalculatingBox.style.display = 'block';

    setTimeout(() => {
      if (recalculatingBox) recalculatingBox.style.display = 'none';

      if (rutaOriginalLine) rutaOriginalLine.style.display = 'none';
      if (rutaAlternativaLine) rutaAlternativaLine.style.display = 'block';

      if (zonaContaminada) zonaContaminada.style.display = 'none';
      if (warningMapIcon) warningMapIcon.style.display = 'none';

      if (routeLiveTime) routeLiveTime.textContent = '32 min';
      if (routeLiveDetails) routeLiveDetails.textContent = '19km · 10:13 a.m.';

      if (routeUpdatedMessage) routeUpdatedMessage.style.display = 'block';
    }, 1300);
  }

  function ignorarAlertaAmbiental() {
    if (environmentAlertModal) environmentAlertModal.style.display = 'none';

    if (rutaOriginalLine) rutaOriginalLine.style.display = 'block';
    if (rutaAlternativaLine) rutaAlternativaLine.style.display = 'none';

    if (zonaContaminada) zonaContaminada.style.display = 'block';
    if (warningMapIcon) warningMapIcon.style.display = 'block';

    if (environmentWarningMessage) environmentWarningMessage.style.display = 'block';

    if (routeLiveTime) routeLiveTime.textContent = '29 min';
    if (routeLiveDetails) routeLiveDetails.textContent = '19km · 10:09 a.m.';
  }

  if (btnBuscarRuta) {
    btnBuscarRuta.addEventListener('click', mostrarPantallaOpciones);
  }

  if (btnReintentar) {
    btnReintentar.addEventListener('click', ocultarErrorCalculo);
  }

  if (btnAbrirFiltros) {
    btnAbrirFiltros.addEventListener('click', mostrarPantallaFiltros);
  }

  if (rutaOrigen) {
    rutaOrigen.addEventListener('input', ocultarError);
  }

  if (rutaDestino) {
    rutaDestino.addEventListener('input', ocultarError);
  }

  if (btnRutaRecomendada) {
    btnRutaRecomendada.addEventListener('click', () => {
      alert('Ruta recomendada seleccionada. Esta ruta prioriza mejor calidad del aire.');
    });
  }

  if (btnRutaAlternativa) {
    btnRutaAlternativa.addEventListener('click', () => {
      alert('Ruta alternativa 2 seleccionada. Puedes continuar con esta ruta manteniendo la información ambiental visible.');
    });
  }

  if (btnRutaEspecifica) {
    btnRutaEspecifica.addEventListener('click', mostrarPantallaRutaPreferida);
  }

  if (btnCompararRutas) {
    btnCompararRutas.addEventListener('click', mostrarComparacionRutas);
  }

  if (btnVolverRutas) {
    btnVolverRutas.addEventListener('click', volverAOpciones);
  }

  if (btnNuevaBusqueda) {
    btnNuevaBusqueda.addEventListener('click', nuevaBusqueda);
  }

  if (btnIniciarRutaPreferida) {
    btnIniciarRutaPreferida.addEventListener('click', iniciarRutaEnCurso);
  }

  if (btnIniciarRutaComparada) {
    btnIniciarRutaComparada.addEventListener('click', iniciarRutaEnCurso);
  }

  if (btnVolverComparacion) {
    btnVolverComparacion.addEventListener('click', volverAOpciones);
  }

  if (btnAplicarFiltros) {
    btnAplicarFiltros.addEventListener('click', aplicarFiltros);
  }

  if (btnFiltroEstricto) {
    btnFiltroEstricto.addEventListener('click', aplicarFiltroEstricto);
  }

  if (btnCerrarFiltros) {
    btnCerrarFiltros.addEventListener('click', volverAOpciones);
  }

  if (btnBuscarOtrasRutas) {
    btnBuscarOtrasRutas.addEventListener('click', volverAOpciones);
  }

  if (btnVolverDesdeSinResultados) {
    btnVolverDesdeSinResultados.addEventListener('click', mostrarPantallaFiltros);
  }

  if (btnIgnorarAlerta) {
    btnIgnorarAlerta.addEventListener('click', ignorarAlertaAmbiental);
  }

  if (btnDesviarRuta) {
    btnDesviarRuta.addEventListener('click', desviarRutaContaminada);
  }

  if (btnCancelarRutaCurso) {
    btnCancelarRutaCurso.addEventListener('click', volverAOpciones);
  }
})();

/* =========================
   Navbar activo por sección
========================= */

(() => {
  const navLinks = document.querySelectorAll('.inicio-nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function activarLink(id) {
    navLinks.forEach(link => {
      link.classList.remove('active');

      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activarLink(entry.target.id);
      }
    });
  }, {
    threshold: 0.45
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').replace('#', '');
      activarLink(id);
    });
  });
})();



/* =========================
   US06 - Rutas Favoritas / Mis Rutas
========================= */

(() => {
  // Elements
  const btnVerFavoritas    = document.getElementById('btnVerFavoritas');
  const modalGuardarFav    = document.getElementById('modalGuardarFavorita');
  const inputNombreRuta    = document.getElementById('inputNombreRuta');
  const btnCancelarFav     = document.getElementById('btnCancelarFavorita');
  const btnConfirmarFav    = document.getElementById('btnConfirmarFavorita');
  const screenMisRutas     = document.getElementById('screenMisRutas');
  const misRutasList       = document.getElementById('misRutasList');
  const misRutasEmpty      = document.getElementById('misRutasEmpty');
  const btnVolverMisRutas  = document.getElementById('btnVolverDesdeMisRutas');
  const btnIniciarDesdeRutas = document.getElementById('btnIniciarDesdeRutas');
  const btnEditarRuta      = document.getElementById('btnEditarRuta');

  // Rutas guardadas en memoria (simula localStorage)
  const rutasGuardadas = [
    { id: 1, nombre: 'Ruta UPC San Miguel',  tiempo: '28 min', aqi: 'AQI 12 (Excelente)', color: '#457F4C', selected: true  },
    { id: 2, nombre: 'Ruta UPC Lince',       tiempo: '15 min', aqi: 'AQI 22 (Bueno)',     color: '#457F4C', selected: false },
    { id: 3, nombre: 'Ruta UPC Monterrico',  tiempo: '58 min', aqi: 'AQI 52 (Moderado)',  color: '#E8A838', selected: false },
    { id: 4, nombre: 'Ruta Trabajo',         tiempo: '70 min', aqi: 'AQI 52 (Moderado)',  color: '#E8A838', selected: false },
    { id: 5, nombre: 'Ruta Parque Kennedy',  tiempo: '38 min', aqi: 'AQI 22 (Bueno)',     color: '#457F4C', selected: false },
  ];

  let selectedRutaId = 1;

  // SVG mini sparklines
  function miniChart(color) {
    const paths = {
      '#457F4C': 'M2,18 Q8,6 14,10 Q20,14 26,4 Q32,8 38,6',
      '#E8A838': 'M2,12 Q8,18 14,8 Q20,16 26,10 Q32,6 38,14',
    };
    const d = paths[color] || paths['#457F4C'];
    return `<svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="${d}" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  function renderMisRutas() {
    if (!misRutasList) return;
    misRutasList.innerHTML = '';

    if (rutasGuardadas.length === 0) {
      if (misRutasEmpty) misRutasEmpty.classList.remove('hidden');
      return;
    }
    if (misRutasEmpty) misRutasEmpty.classList.add('hidden');

    rutasGuardadas.forEach(ruta => {
      const card = document.createElement('div');
      card.className = 'mis-ruta-card' + (ruta.id === selectedRutaId ? ' selected' : '');
      card.dataset.id = ruta.id;
      card.innerHTML = `
        <div class="mis-ruta-check">${ruta.id === selectedRutaId ? '✓' : ''}</div>
        <div class="mis-ruta-info">
          <strong>${ruta.nombre}</strong>
          <span>${ruta.tiempo} recorrido</span>
          <span>${ruta.aqi}</span>
        </div>
        <div class="mis-ruta-mini-chart">${miniChart(ruta.color)}</div>
        <button class="mis-ruta-ver">Ver<br>Detalle</button>
      `;
      card.addEventListener('click', () => {
        selectedRutaId = ruta.id;
        renderMisRutas();
      });
      misRutasList.appendChild(card);
    });
  }

  function abrirModalGuardar() {
    if (!modalGuardarFav) return;
    if (inputNombreRuta) inputNombreRuta.value = '';
    modalGuardarFav.classList.remove('hidden');
    if (inputNombreRuta) inputNombreRuta.focus();
  }

  function cerrarModal() {
    if (modalGuardarFav) modalGuardarFav.classList.add('hidden');
  }

  function mostrarMisRutas() {
    // Hide all secondary screens first
    document.querySelectorAll('.hidden-route-screen').forEach(el => {
      el.style.display = 'none';
    });
    if (screenMisRutas) {
      screenMisRutas.style.display = 'flex';
      screenMisRutas.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function volverDesdeMisRutas() {
    if (screenMisRutas) screenMisRutas.style.display = 'none';
  }

  function guardarRutaYMostrar() {
    const nombre = inputNombreRuta ? inputNombreRuta.value.trim() : '';
    if (!nombre) return;

    const nuevaRuta = {
      id: Date.now(),
      nombre: nombre,
      tiempo: '28 min',
      aqi: 'AQI 12 (Excelente)',
      color: '#457F4C',
      selected: false
    };
    rutasGuardadas.unshift(nuevaRuta);
    selectedRutaId = nuevaRuta.id;

    cerrarModal();
    renderMisRutas();
    mostrarMisRutas();
  }

  // Event listeners
  if (btnVerFavoritas) {
    btnVerFavoritas.addEventListener('click', () => {
      renderMisRutas();
      mostrarMisRutas();
    });
  }

  if (btnCancelarFav) {
    btnCancelarFav.addEventListener('click', cerrarModal);
  }

  if (btnConfirmarFav) {
    btnConfirmarFav.addEventListener('click', guardarRutaYMostrar);
  }

  if (inputNombreRuta) {
    inputNombreRuta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') guardarRutaYMostrar();
      if (e.key === 'Escape') cerrarModal();
    });
  }

  if (btnVolverMisRutas) {
    btnVolverMisRutas.addEventListener('click', volverDesdeMisRutas);
  }

  if (btnIniciarDesdeRutas) {
    btnIniciarDesdeRutas.addEventListener('click', () => {
      alert('Iniciando recorrido con la ruta seleccionada.');
    });
  }

  if (btnEditarRuta) {
    btnEditarRuta.addEventListener('click', () => {
      alert('Editar ruta: función disponible en la app.');
    });
  }

  // Also wire "Seleccionar" buttons on rutas disponibles to open save modal
  document.querySelectorAll('.btnRutaRecomendada, .btnRutaAlternativa').forEach(btn => {
    btn.addEventListener('click', abrirModalGuardar);
  });

})();
