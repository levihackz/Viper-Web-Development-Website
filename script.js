const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const closeMenu = () => {
  navLinks?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
};

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (!navLinks?.classList.contains('open')) return;
  if (!navLinks.contains(event.target) && !menuToggle?.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks?.querySelectorAll('a[data-page]').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const contactForm = document.querySelector('#contactForm');
const formNotice = document.querySelector('#formNotice');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  if (formNotice) {
    formNotice.textContent = 'Sending your enquiry...';
    formNotice.classList.add('show');
  }

  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: { Accept: 'application/json' }
  })
    .then((response) => {
      if (!response.ok) throw new Error('The enquiry could not be sent.');
      return response.json();
    })
    .then(() => {
      contactForm.reset();
      if (formNotice) formNotice.textContent = 'Thanks! Your enquiry has been sent.';
    })
    .catch(() => {
      if (formNotice) formNotice.textContent = 'We could not send your enquiry. Please contact us by phone or WhatsApp.';
    })
    .finally(() => {
      if (submitButton) submitButton.disabled = false;
    });
});
