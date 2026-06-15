const filterBtns = document.querySelectorAll('.filter-btn');
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
const navLinks = document.querySelectorAll('.nav-link');
const seeAllBtn = document.getElementById('seeAllBtn');

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

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        filterBenefits(filter);
    });
});

function filterBenefits(category) {
    benefitCards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hidden');
        } else {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

reclaimBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentBenefit = this.getAttribute('data-benefit');
        const benefitTitle = this.closest('.benefit-card').querySelector('h3').textContent;
        const benefitCost = benefitsCost[currentBenefit];
        document.getElementById('modalTitle').textContent = `¿Reclamar ${benefitTitle}?`;
        document.getElementById('modalMessage').textContent = 
            `Este beneficio cuesta ${benefitCost} puntos eco. ¿Deseas continuar?`;
        openModal();
    });
});

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentBenefit = null;
}

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

confirmBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentBenefit) {
        const benefitCost = benefitsCost[currentBenefit];
        
        if (userPoints >= benefitCost) {
            userPoints -= benefitCost;
            updatePoints();
            
            showToast(`¡Beneficio reclamado! Ahora tienes ${userPoints} puntos eco.`, 'success');
          
            const btn = document.querySelector(`[data-benefit="${currentBenefit}"]`);
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.textContent = '✓ Reclamado';
            
            closeModal();
        } else {
            showToast('No tienes suficientes puntos eco para este beneficio.', 'error');
            closeModal();
        }
    }
});

function updatePoints() {
    pointsNumber.style.transform = 'scale(1.1)';
    setTimeout(() => {
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
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const seeAllLabel = document.getElementById('seeAllLabel');
seeAllBtn.addEventListener('click', function() {
    const extras = document.querySelectorAll('.benefit-card.extra');
    const expanded = seeAllBtn.classList.toggle('expanded');
    extras.forEach(card => card.classList.toggle('hidden', !expanded));
    if (seeAllLabel) {
        seeAllLabel.textContent = expanded
            ? 'Ver menos beneficios'
            : 'Ver todos los beneficios';
    }
});

window.addEventListener('load', function() {
    benefitCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    console.log('✅ EcoRuta Beneficios Cargado');
});

confirmBtn.addEventListener('click', function(e) {
    e.stopPropagation();
});

cancelBtn.addEventListener('click', function(e) {
    e.stopPropagation();
});
