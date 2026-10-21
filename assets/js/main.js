/* VinoTorre — progressive enhancement, no external dependencies. */
(() => {
  'use strict';

  const config = window.VINOTORRE_CONFIG || {};
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interactiveSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const visibleFocusables = element => $$(interactiveSelector, element)
    .filter(node => !node.hidden && !node.closest('[hidden]') && node.getClientRects().length);

  function safeUrl(value, protocols = ['https:', 'http:', 'file:']) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const result = new URL(value, document.baseURI);
      return protocols.includes(result.protocol) ? result.href : '';
    } catch (_) {
      return '';
    }
  }

  function focusWithin(event, container) {
    if (event.key !== 'Tab') return;
    const items = visibleFocusables(container);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  function animateImage(image) {
    if (motion.matches || typeof image.animate !== 'function') return;
    image.getAnimations().forEach(animation => animation.cancel());
    image.animate(
      [{ opacity: 0.35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 300, easing: 'cubic-bezier(.2,.6,.2,1)' }
    );
  }

  // All links and confirmed content remain available without JavaScript.
  document.documentElement.classList.add('js');

  $$('[data-address]').forEach(node => {
    if (config.address) node.textContent = config.address;
  });
  $$('[data-instagram]').forEach(node => {
    const url = safeUrl(config.instagram, ['https:']);
    if (url) node.href = url;
  });
  $$('[data-navigation-link]').forEach(node => {
    const url = safeUrl(config.navigationUrl, ['https:']);
    if (url) node.href = url;
  });

  // Supplied photographs replace original illustrative artwork.
  $$('[data-media]').forEach(wrapper => {
    const media = config.media && config.media[wrapper.dataset.media];
    if (!media || !safeUrl(media.src)) return;
    const image = $('img', wrapper);
    if (!image) return;
    image.src = media.src;
    if (media.srcset) image.srcset = media.srcset;
    else image.removeAttribute('srcset');
    image.alt = media.alt || '';
    const caption = $('figcaption', wrapper);
    // Keep editorial captions and the route's distance/time caution.
    if (caption && wrapper.dataset.media !== 'route') {
      const illustrationLabel = $('[data-art-caption]', caption) || $$('span', caption)
        .find(node => /иллюстрац|графическ/i.test(node.textContent));
      if (illustrationLabel) illustrationLabel.hidden = true;
      else if (/иллюстрац|графическ/i.test(caption.textContent)) caption.hidden = true;
    }
    wrapper.dataset.photograph = 'true';
    if (wrapper.dataset.media === 'route') {
      const routeSection = wrapper.closest('[data-route]');
      if (routeSection) routeSection.hidden = false;
    }
  });

  // Cards and detail galleries share the same configured photographs.
  $$('[data-wine-art]').forEach(wrapper => {
    const wine = Array.isArray(config.wines) && config.wines.find(item => item.id === wrapper.dataset.wineArt);
    if (!wine || !Array.isArray(wine.images)) return;
    const photos = wine.images.filter(item => item && safeUrl(item.src));
    const primary = $('img', wrapper);
    if (!photos.length || !primary) return;
    primary.src = photos[0].src;
    primary.alt = photos[0].alt || wine.name + ', урожай ' + wine.year;
    primary.classList.add('wine-card__primary');
    if (photos[0].srcset) primary.srcset = photos[0].srcset;
    else primary.removeAttribute('srcset');
    if (photos.length > 1) {
      const alternate = document.createElement('img');
      alternate.src = photos[1].src;
      if (photos[1].srcset) alternate.srcset = photos[1].srcset;
      alternate.alt = '';
      alternate.setAttribute('aria-hidden', 'true');
      alternate.className = 'wine-card__alternate';
      alternate.loading = 'lazy';
      alternate.decoding = 'async';
      alternate.width = primary.width || 600;
      alternate.height = primary.height || 1000;
      wrapper.append(alternate);
    }
    const card = wrapper.closest('.wine-card') || wrapper;
    $$('[data-art-caption]', card).forEach(label => { label.hidden = true; });
  });

  $$('[data-legal]').forEach(node => {
    const content = config.legal || {};
    const texts = [content.ageNotice, content.information].filter(value => typeof value === 'string' && value.trim());
    if (!texts.length) return;
    node.textContent = texts.join('\n');
    node.hidden = false;
  });

  const email = typeof config.email === 'string' ? config.email.trim() : '';
  const emailReady = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email);
  $$('[data-contact-link]').forEach(node => {
    if (!emailReady) return;
    node.href = 'mailto:' + encodeURIComponent(email);
    node.textContent = email;
    node.hidden = false;
  });
  $$('[data-contact-phone]').forEach(node => {
    const phone = typeof config.phone === 'string' ? config.phone.trim() : '';
    if (!phone || !/^[+\d\s()\-.]+$/.test(phone) || phone.replace(/\D/g, '').length < 8) return;
    node.href = 'tel:' + phone.replace(/[^+\d]/g, '');
    node.textContent = phone;
    node.hidden = false;
  });

  // A canonical is created only after the owner supplies the final domain.
  const finalDomain = safeUrl(config.domain, ['https:', 'http:']);
  if (finalDomain) {
    const base = finalDomain.replace(/\/+$/, '') + '/';
    const filename = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    const canonicalUrl = new URL(/\.html$/.test(filename) ? filename : 'index.html', base).href;
    let canonical = $('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    const ogUrl = $('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = canonicalUrl;
  }

  // Mobile navigation keeps native links and traps focus only while expanded.
  const menuButton = $('[data-menu-toggle]');
  const navigation = $('#primary-navigation');
  const header = $('.site-header');
  if (menuButton && navigation && header) {
    const mobile = window.matchMedia('(max-width: 760px)');
    const affected = $$('main, .site-footer');
    let menuOpen = false;
    const previousInert = new Map();

    function setMenu(open, restoreFocus = false) {
      menuOpen = Boolean(open && mobile.matches);
      menuButton.setAttribute('aria-expanded', String(menuOpen));
      menuButton.setAttribute('aria-label', menuOpen ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('menu-open', menuOpen);
      navigation.classList.toggle('is-open', menuOpen);
      affected.forEach(node => {
        if (menuOpen) {
          if (!previousInert.has(node)) previousInert.set(node, node.inert);
          node.inert = true;
        } else if (previousInert.has(node)) {
          node.inert = previousInert.get(node);
          previousInert.delete(node);
        }
      });
      if (menuOpen) {
        const firstLink = visibleFocusables(navigation)[0];
        if (firstLink) firstLink.focus();
      } else if (restoreFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', () => setMenu(!menuOpen));
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false, true);
      } else focusWithin(event, header);
    });
    const checkBreakpoint = () => {
      if (!mobile.matches) setMenu(false);
    };
    if (mobile.addEventListener) mobile.addEventListener('change', checkBreakpoint);
    else mobile.addListener(checkBreakpoint);
  }

  // The page content never depends on IntersectionObserver or animation.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(node => observer.observe(node));
  } else reveals.forEach(node => node.classList.add('is-visible'));

  // Restrained parallax affects only visible artwork and respects reduced motion.
  const parallaxImages = $$('[data-parallax]');
  if (parallaxImages.length && !motion.matches) {
    let scheduled = false;
    function updateParallax() {
      scheduled = false;
      if (motion.matches) {
        parallaxImages.forEach(node => node.style.removeProperty('--parallax-offset'));
        return;
      }
      parallaxImages.forEach(node => {
        const box = node.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) return;
        const movement = Math.max(-14, Math.min(14, (box.top + box.height / 2 - innerHeight / 2) * 0.025));
        node.style.setProperty('--parallax-offset', movement.toFixed(2) + 'px');
      });
    }
    addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  // No autoplay: the visitor controls gallery buttons, keyboard and touch swipe.
  $$('[data-gallery]').forEach(gallery => {
    const slides = $$('[data-gallery-slide]', gallery);
    if (slides.length < 2) return;
    const prev = $('[data-gallery-prev]', gallery);
    const next = $('[data-gallery-next]', gallery);
    const status = $('[data-gallery-status]', gallery);
    let index = Math.max(0, slides.findIndex(slide => !slide.hidden));
    function showSlide(newIndex, animate = true) {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      if (status) status.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      const image = $('img', slides[index]);
      if (animate && image) animateImage(image);
    }
    if (prev) {
      prev.hidden = false;
      prev.setAttribute('aria-label', 'Предыдущее изображение');
      prev.addEventListener('click', () => showSlide(index - 1));
    }
    if (next) {
      next.hidden = false;
      next.setAttribute('aria-label', 'Следующее изображение');
      next.addEventListener('click', () => showSlide(index + 1));
    }
    gallery.addEventListener('keydown', event => {
      if (event.target.matches('input, textarea, select')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    addSwipe(gallery, direction => showSlide(index + direction));
    showSlide(index, false);
  });

  function addSwipe(element, callback) {
    let touchStart = null;
    element.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) { touchStart = null; return; }
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    element.addEventListener('touchend', event => {
      if (!touchStart || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) callback(dx < 0 ? 1 : -1);
    }, { passive: true });
    element.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
  }

  // Native accessible dialog. Unknown wine characteristics remain absent.
  const dialog = $('#wine-dialog');
  const wines = Array.isArray(config.wines) ? config.wines : [];
  if (dialog && typeof dialog.showModal === 'function') {
    const image = $('#dialog-image');
    const title = $('#dialog-title');
    const grape = $('#dialog-grape');
    const year = $('#dialog-year');
    const caption = $('#dialog-caption');
    const characteristics = $('#dialog-characteristics');
    const previous = $('[data-wine-prev]', dialog);
    const next = $('[data-wine-next]', dialog);
    const counter = $('#dialog-counter');
    let currentWine = null;
    let currentImages = [];
    let imageIndex = 0;
    let trigger = null;
    let closingFromHash = false;

    function readWineHash() {
      try { return decodeURIComponent(location.hash.slice(1)); }
      catch (_) { return ''; }
    }
    function changeHash(hash, push = false) {
      const target = location.pathname + location.search + (hash ? '#' + encodeURIComponent(hash) : '');
      try { history[push ? 'pushState' : 'replaceState'](null, '', target); }
      catch (_) { /* Some file viewers prohibit History; detail browsing still works. */ }
    }
    function showImage(nextIndex, animate = true) {
      if (!image || !currentImages.length) return;
      imageIndex = (nextIndex + currentImages.length) % currentImages.length;
      const item = currentImages[imageIndex];
      image.src = item.src;
      image.alt = item.alt || currentWine.name + ', урожай ' + currentWine.year;
      if (item.srcset) image.srcset = item.srcset;
      else image.removeAttribute('srcset');
      if (caption) caption.textContent = item.illustration ? 'Графическое изображение бутылки' : (item.caption || '');
      if (counter) {
        counter.textContent = String(imageIndex + 1).padStart(2, '0') + ' / ' + String(currentImages.length).padStart(2, '0');
        counter.hidden = currentImages.length < 2;
      }
      if (previous) previous.hidden = currentImages.length < 2;
      if (next) next.hidden = currentImages.length < 2;
      if (animate) animateImage(image);
    }
    function openWine(id, source = null, updateHistory = true) {
      const wine = wines.find(item => item.id === id);
      if (!wine || !image || !title) return;
      currentWine = wine;
      trigger = source || document.activeElement;
      const photos = Array.isArray(wine.images) ? wine.images.filter(item => item && safeUrl(item.src)) : [];
      currentImages = photos.length ? photos : [{ src: wine.artwork, alt: 'Иллюстрация бутылки VinoTorre ' + wine.name + ' 2025', illustration: true }];
      title.textContent = wine.name;
      if (grape) grape.textContent = wine.grape || '';
      if (year) year.textContent = wine.year || '';
      if (characteristics) {
        characteristics.replaceChildren();
        Object.entries(wine.characteristics || {}).forEach(([label, value]) => {
          if (value === null || value === undefined || value === '') return;
          const term = document.createElement('dt');
          const description = document.createElement('dd');
          term.textContent = label;
          description.textContent = String(value);
          characteristics.append(term, description);
        });
        characteristics.hidden = !characteristics.childElementCount;
      }
      showImage(0, false);
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('modal-open');
      if (updateHistory && readWineHash() !== id) changeHash(id, true);
      const closeButton = $('[data-modal-close]', dialog);
      if (closeButton) closeButton.focus();
    }

    $$('[data-wine]').forEach(button => {
      if (!wines.some(wine => wine.id === button.dataset.wine)) return;
      button.hidden = false;
      button.addEventListener('click', event => {
        event.preventDefault();
        openWine(button.dataset.wine, button);
      });
    });
    $$('[data-modal-close]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('keydown', event => {
      focusWithin(event, dialog);
      if (event.target.matches('input, textarea, select')) return;
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && currentImages.length > 1) {
        event.preventDefault();
        showImage(imageIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('close', () => {
      // Native close events are queued. A new hash can reopen the dialog first.
      // A stale close must not clear the new hash, focus or scroll lock.
      if (dialog.open) {
        closingFromHash = false;
        return;
      }
      document.body.classList.remove('modal-open');
      if (!closingFromHash && currentWine && readWineHash() === currentWine.id) changeHash('');
      closingFromHash = false;
      if (trigger && typeof trigger.focus === 'function' && trigger.isConnected) trigger.focus({ preventScroll: true });
    });
    if (previous) previous.addEventListener('click', () => showImage(imageIndex - 1));
    if (next) next.addEventListener('click', () => showImage(imageIndex + 1));
    const swipeRegion = $('[data-wine-swipe]', dialog);
    if (swipeRegion) addSwipe(swipeRegion, direction => { if (currentImages.length > 1) showImage(imageIndex + direction); });
    function syncHash() {
      const id = readWineHash();
      if (wines.some(wine => wine.id === id)) openWine(id, null, false);
      else if (dialog.open) {
        closingFromHash = true;
        dialog.close();
      }
    }
    addEventListener('hashchange', syncHash);
    addEventListener('popstate', syncHash);
    syncHash();
  }

  // Explicit mailto handoff: no backend, storage or simulated successful sending.
  const form = $('#visit-form');
  if (form) {
    const fieldset = $('#visit-fields');
    const submit = $('#visit-submit');
    const status = $('#form-status');
    const help = $('[data-form-help]', form) || $('.form-submit-row p', form);
    const date = $('[name="date"]', form);
    const contact = $('[name="contact"]', form);
    const now = new Date();
    const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    if (date) date.min = today;
    if (emailReady) {
      if (fieldset) fieldset.disabled = false;
      if (submit) submit.disabled = false;
      if (status) status.textContent = 'Кнопка откроет письмо в вашем почтовом приложении. Отправьте его самостоятельно; посещение требует отдельного подтверждения.';
      if (help) help.textContent = 'Откроется ваш почтовый клиент. Сайт не отправляет сообщения самостоятельно.';
    } else {
      if (fieldset) fieldset.disabled = true;
      if (submit) submit.disabled = true;
      if (status) status.textContent = 'Форма пока недоступна: контактный email винодельни не указан. Для запроса можно написать в Instagram @vino_torre.';
    }
    if (contact) contact.addEventListener('input', () => contact.setCustomValidity(''));
    if (date) date.addEventListener('input', () => date.setCustomValidity(''));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!emailReady) return;
      if (contact) {
        const value = contact.value.trim();
        const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
        const validPhone = /^[+\d\s()\-.]+$/.test(value) && value.replace(/\D/g, '').length >= 8;
        contact.setCustomValidity(validEmail || validPhone ? '' : 'Укажите email или номер телефона, содержащий не менее 8 цифр.');
      }
      if (date) date.setCustomValidity(date.value && date.value < today ? 'Выберите сегодняшнюю или будущую дату.' : '');
      if (!form.reportValidity()) return;
      const field = name => {
        const element = $('[name="' + name + '"]', form);
        return element ? element.value.trim() : '';
      };
      const body = [
        'Запрос о посещении VinoTorre',
        '',
        'Имя: ' + field('name'),
        'Контакт: ' + field('contact'),
        'Желаемая дата: ' + (field('date') || 'не указана'),
        '',
        field('message'),
        '',
        'Это запрос о посещении, а не подтверждённая запись.'
      ].join('\n');
      const url = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Запрос о посещении VinoTorre') + '&body=' + encodeURIComponent(body);
      if (status) status.textContent = 'Открывается почтовое приложение с подготовленным письмом. Запрос поступит винодельне, только когда вы отправите письмо.';
      location.href = url;
    });
  }
})();
