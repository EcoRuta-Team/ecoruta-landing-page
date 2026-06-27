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
   Rutas - US01
========================= */

(() => {
  const rutaOrigen = document.getElementById('rutaOrigen');
  const rutaDestino = document.getElementById('rutaDestino');
  const routeError = document.getElementById('routeError');

  const btnBuscarRuta = document.getElementById('btnBuscarRuta');
  const btnNuevaBusqueda = document.getElementById('btnNuevaBusqueda');

  const screenRutasOpciones = document.getElementById('screenRutasOpciones');
  const screenRutaPreferida = document.getElementById('screenRutaPreferida');

  const origenTexto = document.getElementById('origenTexto');
  const destinoTexto = document.getElementById('destinoTexto');

  const btnRutaRecomendada = document.querySelector('.btnRutaRecomendada');
  const btnRutaAlternativa = document.querySelector('.btnRutaAlternativa');
  const btnRutaEspecifica = document.querySelector('.btnRutaEspecifica');

  const btnVolverRutas = document.getElementById('btnVolverRutas');
  const btnIniciarRutaPreferida = document.getElementById('btnIniciarRutaPreferida');

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

  function mostrarPantallaOpciones() {
    const origen = rutaOrigen.value.trim();
    const destino = rutaDestino.value.trim();

    if (origen === '' || destino === '') {
      mostrarError();
      return;
    }

    ocultarError();
    activarNavRutas();

    if (origenTexto) {
      origenTexto.textContent = origen;
    }

    if (destinoTexto) {
      destinoTexto.textContent = destino;
    }

    if (screenRutaPreferida) {
      screenRutaPreferida.style.display = 'none';
    }

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'flex';
      screenRutasOpciones.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function mostrarPantallaRutaPreferida() {
    activarNavRutas();

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'none';
    }

    if (screenRutaPreferida) {
      screenRutaPreferida.style.display = 'block';
      screenRutaPreferida.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function volverAOpciones() {
    activarNavRutas();

    if (screenRutaPreferida) {
      screenRutaPreferida.style.display = 'none';
    }

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

    if (screenRutasOpciones) {
      screenRutasOpciones.style.display = 'none';
    }

    if (screenRutaPreferida) {
      screenRutaPreferida.style.display = 'none';
    }

    if (rutaOrigen) {
      rutaOrigen.focus();
    }
  }

  if (btnBuscarRuta) {
    btnBuscarRuta.addEventListener('click', mostrarPantallaOpciones);
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

  if (btnVolverRutas) {
    btnVolverRutas.addEventListener('click', volverAOpciones);
  }

  if (btnNuevaBusqueda) {
    btnNuevaBusqueda.addEventListener('click', nuevaBusqueda);
  }

  if (btnIniciarRutaPreferida) {
    btnIniciarRutaPreferida.addEventListener('click', () => {
      alert('Recorrido iniciado. La información ambiental seguirá visible durante la ruta.');
    });
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