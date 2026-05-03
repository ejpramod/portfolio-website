/* ═══════════════════════════════════════════
   SCRIPT.JS — Portfolio Interactivity
   ═══════════════════════════════════════════ */

// ─── Skills Data ───
const skills = [
  { name: 'EDI X12',          level: 95, icon: 'ph-fill ph-file-text',        cat: 'Expert' },
  { name: 'EDIFACT',          level: 85, icon: 'ph-fill ph-globe',            cat: 'Advanced' },
  { name: 'Cleo Integration Cloud', level: 90, icon: 'ph-fill ph-cloud',      cat: 'Expert' },
  { name: 'SQL',              level: 88, icon: 'ph-fill ph-database',         cat: 'Advanced' },
  { name: 'API Integration',  level: 80, icon: 'ph-fill ph-plugs-connected',  cat: 'Advanced' },
  { name: 'Azure Logic Apps', level: 75, icon: 'ph-fill ph-microsoft-teams-logo', cat: 'Intermediate' },
  { name: 'XML / JSON',       level: 90, icon: 'ph-fill ph-code',             cat: 'Expert' },
  { name: 'Supply Chain Integration', level: 92, icon: 'ph-fill ph-truck',    cat: 'Expert' },
  { name: 'ERP / WMS / TMS',  level: 78, icon: 'ph-fill ph-factory',          cat: 'Advanced' },
];

// ─── Render Skills ───
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map(s => `
    <div class="skill-card glass-card reveal">
      <div class="skill-card-header">
        <div class="skill-icon"><i class="${s.icon}"></i></div>
        <div>
          <div class="skill-name">${s.name}</div>
          <div class="skill-level">${s.cat}</div>
        </div>
      </div>
      <div class="skill-bar-bg">
        <div class="skill-bar" data-width="${s.level}"></div>
      </div>
    </div>
  `).join('');
}

// ─── Scroll Reveal ───
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Skill Bars Animation ───
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar').forEach(bar => observer.observe(bar));
}

// ─── Counter Animation ───
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 30);
}

// ─── Navbar ───
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('.section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

// ─── Back to Top ───
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Form Validation ───
function handleFormSubmit(e) {
  e.preventDefault();
  let valid = true;
  const name = document.getElementById('formName');
  const email = document.getElementById('formEmail');
  const subject = document.getElementById('formSubject');
  const message = document.getElementById('formMessage');

  // Clear previous errors
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(e => e.textContent = '');

  if (!name.value.trim()) {
    setError('formName', 'nameError', 'Please enter your name');
    valid = false;
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    setError('formEmail', 'emailError', 'Please enter a valid email');
    valid = false;
  }
  if (!subject.value.trim()) {
    setError('formSubject', 'subjectError', 'Please enter a subject');
    valid = false;
  }
  if (!message.value.trim()) {
    setError('formMessage', 'messageError', 'Please enter a message');
    valid = false;
  }

  if (valid) {
    const btn = document.getElementById('formSubmit');
    btn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="ph ph-check"></i> Sent!';
      document.getElementById('formSuccess').classList.add('show');
      document.getElementById('contactForm').reset();
      setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
        btn.disabled = false;
        document.getElementById('formSuccess').classList.remove('show');
      }, 4000);
    }, 1500);
  }
}

function setError(inputId, errorId, msg) {
  document.getElementById(inputId).closest('.form-group').classList.add('error');
  document.getElementById(errorId).textContent = msg;
}

// ─── Resume Download ───
function downloadResume(e) {
  e.preventDefault();
  // Placeholder — replace with actual resume URL
  alert('Resume download will be available soon! Please contact me directly.');
}

// ─── Footer Year ───
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  initReveal();
  initSkillBars();
  initCounters();
  initNavbar();
  initBackToTop();
  setFooterYear();
});
