/**
 * Aura Dental Studio - Frontend Interactions & Web3Forms Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sticky Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('bg-white/80');
      } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('bg-white/80');
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Smooth Scroll for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Phone Mask Helper
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      
      if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else {
        e.target.value = value;
      }
    });
  });

  // ==========================================
  // Web3Forms Form Submission & Validation
  // ==========================================
  const footerForm = document.getElementById('footer-booking-form');
  const successBanner = document.getElementById('footer-form-success');
  const errorBanner = document.getElementById('footer-form-error');
  const errorText = document.getElementById('footer-error-text');

  if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous alerts
      if (successBanner) successBanner.classList.add('hidden');
      if (errorBanner) errorBanner.classList.add('hidden');

      // Basic client-side validation
      const nameInput = footerForm.querySelector('[name="name"]');
      const emailInput = footerForm.querySelector('[name="email"]');
      const phoneInput = footerForm.querySelector('[name="phone"]');
      const serviceInput = footerForm.querySelector('[name="service"]');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const rawPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';

      if (!nameInput.value.trim()) {
        showError('Por favor, informe seu nome completo.');
        nameInput.focus();
        return;
      }

      if (rawPhone.length < 10) {
        showError('Por favor, informe um número de WhatsApp ou celular válido com DDD.');
        phoneInput.focus();
        return;
      }

      if (!emailRegex.test(emailInput.value.trim())) {
        showError('Por favor, informe um endereço de e-mail válido.');
        emailInput.focus();
        return;
      }

      if (!serviceInput.value) {
        showError('Por favor, selecione a especialidade de seu interesse.');
        serviceInput.focus();
        return;
      }

      // UI State: Loading
      const submitBtn = footerForm.querySelector('#footer-submit-btn') || footerForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Enviando solicitação...</span>
      `;

      try {
        const formData = new FormData(footerForm);
        const formObject = Object.fromEntries(formData.entries());
        const jsonBody = JSON.stringify(formObject);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: jsonBody
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          // Success Feedback
          footerForm.reset();
          if (successBanner) {
            successBanner.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          // API reported error
          const msg = result.message || 'Houve uma instabilidade temporária no envio.';
          showError(`Erro ao enviar: ${msg}`);
        }
      } catch (err) {
        // Network or fetch error
        console.error('Erro na submissão Web3Forms:', err);
        showError('Falha de conexão ao enviar a mensagem. Verifique sua internet ou tente novamente.');
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  function showError(message) {
    if (errorBanner) {
      if (errorText) {
        errorText.innerHTML = `${message} Se preferir, fale direto via WhatsApp <a href="https://wa.me/5511987654321" class="underline font-semibold hover:text-white">(11) 98765-4321</a>.`;
      }
      errorBanner.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
