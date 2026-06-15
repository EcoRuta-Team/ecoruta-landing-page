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
