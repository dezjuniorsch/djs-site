/* =========================================================
   NILE CREST HIGH SCHOOL — SITE SCRIPT
   Handles: nav toggle, active link, sticky header shadow,
   scroll reveal, staff directory filter/search,
   FAQ accordion, contact form validation.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Highlight active nav link ---------- */
  var current = (document.body.getAttribute('data-page') || '').toLowerCase();
  document.querySelectorAll('.nav-links a[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === current) {
      a.classList.add('is-active');
    }
  });

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Image slideshow(s) (automatic, with manual override) ---------- */
  var slideshows = Array.prototype.slice.call(document.querySelectorAll('[data-slideshow]'));
  slideshows.forEach(function (slideshow) {
    var slides = Array.prototype.slice.call(slideshow.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(slideshow.querySelectorAll('[data-slide-dot]'));
    var prevBtn = slideshow.querySelector('[data-slide-prev]');
    var nextBtn = slideshow.querySelector('[data-slide-next]');
    var current = 0;
    var AUTOPLAY_MS = 6500;
    var autoplayTimer = null;

    function goToSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(function () { goToSlide(current + 1); }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function restartAutoplay() {
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(current - 1); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(current + 1); restartAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToSlide(i); restartAutoplay(); });
    });

    slideshow.addEventListener('mouseenter', stopAutoplay);
    slideshow.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  });

  /* ---------- Staff directory: search + department filter ---------- */
  var staffGrid = document.querySelector('[data-staff-grid]');
  if (staffGrid) {
    var cards = Array.prototype.slice.call(staffGrid.querySelectorAll('.staff-card'));
    var searchInput = document.querySelector('[data-staff-search]');
    var pills = document.querySelectorAll('.pill[data-dept]');
    var emptyState = document.querySelector('.staff-empty');
    var activeDept = 'all';

    function applyFilters() {
      var query = (searchInput && searchInput.value || '').trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var dept = card.getAttribute('data-dept');
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var role = (card.getAttribute('data-role') || '').toLowerCase();
        var matchesDept = activeDept === 'all' || dept === activeDept;
        var matchesQuery = !query || name.indexOf(query) !== -1 || role.indexOf(query) !== -1;
        var show = matchesDept && matchesQuery;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        activeDept = pill.getAttribute('data-dept');
        applyFilters();
      });
    });

    applyFilters();
  }

  /* ---------- FAQ accordion (admissions page) ---------- */
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      accordionItems.forEach(function (other) {
        other.classList.remove('is-open');
        var otherPanel = other.querySelector('.accordion-panel');
        if (otherPanel) otherPanel.style.maxHeight = null;
        var otherTrigger = other.querySelector('.accordion-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = document.querySelector('.form-status');

    function setError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var errorEl = wrap.querySelector('.field-error');
      if (errorEl) errorEl.textContent = message;
    }
    function clearError(field) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.remove('has-error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var name = form.querySelector('#cf-name');
      var email = form.querySelector('#cf-email');
      var subject = form.querySelector('#cf-subject');
      var message = form.querySelector('#cf-message');

      [name, email, subject, message].forEach(function (f) { if (f) clearError(f); });

      if (!name.value.trim()) {
        setError(name, 'Please tell us your name.');
        valid = false;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError(email, 'Please enter a valid email address.');
        valid = false;
      }
      if (!subject.value) {
        setError(subject, 'Please choose who you would like to reach.');
        valid = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        setError(message, 'Please add a short message (at least 10 characters).');
        valid = false;
      }

      if (!valid) {
        if (status) status.classList.remove('is-visible');
        return;
      }

      if (status) {
        status.textContent = 'Thank you, ' + name.value.trim().split(' ')[0] + '. Your message has been received — our team will respond within two working days.';
        status.classList.add('is-visible');
      }
      form.reset();
    });
  }

  /* ---------- School calendar + upcoming events (data lives in js/events.js) ---------- */
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MON_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function parseDay(str) {
    var p = str.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function dayKey(d) {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  var allEvents = (window.DEZ_EVENTS || []).map(function (e) {
    var start = parseDay(e.date);
    var end = e.end ? parseDay(e.end) : start;
    return { raw: e, start: start, end: end, s: dayKey(start), e: dayKey(end) };
  }).sort(function (a, b) { return a.s - b.s; });

  function eventsOn(date) {
    var k = dayKey(date);
    return allEvents.filter(function (ev) { return ev.s <= k && k <= ev.e; });
  }
  function makeEventNode(ev, tag) {
    var wrap = document.createElement('div');
    wrap.className = tag === 'li' ? 'cal-event' : 'event-card';
    var date = document.createElement('div');
    date.className = 'event-date';
    var day = document.createElement('span'); day.className = 'day'; day.textContent = String(ev.start.getDate()).padStart(2, '0');
    var mon = document.createElement('span'); mon.className = 'mon'; mon.textContent = MON_SHORT[ev.start.getMonth()];
    date.appendChild(day); date.appendChild(mon);
    var body = document.createElement('div');
    var title = document.createElement(tag === 'li' ? 'h4' : 'h3');
    title.textContent = ev.raw.title;
    if (ev.raw.sample) {
      var tagEl = document.createElement('span'); tagEl.className = 'sample-tag'; tagEl.textContent = 'Sample';
      title.appendChild(tagEl);
    }
    body.appendChild(title);
    var meta = document.createElement('div'); meta.className = 'event-meta';
    var lines = [];
    if (ev.e !== ev.s) lines.push(ev.start.getDate() + ' ' + MON_SHORT[ev.start.getMonth()] + ' – ' + ev.end.getDate() + ' ' + MON_SHORT[ev.end.getMonth()]);
    if (ev.raw.time) lines.push(ev.raw.time);
    if (ev.raw.place) lines.push(ev.raw.place);
    lines.forEach(function (t) { var sp = document.createElement('span'); sp.textContent = t; meta.appendChild(sp); });
    body.appendChild(meta);
    wrap.appendChild(date); wrap.appendChild(body);
    return wrap;
  }

  /* Home page: next upcoming events */
  var upcomingBox = document.querySelector('[data-upcoming-events]');
  if (upcomingBox) {
    var limit = parseInt(upcomingBox.getAttribute('data-limit'), 10) || 3;
    var todayKey = dayKey(new Date());
    var upcoming = allEvents.filter(function (ev) { return ev.e >= todayKey; }).slice(0, limit);
    if (!upcoming.length) {
      var none = document.createElement('p');
      none.className = 'events-empty';
      none.textContent = 'No upcoming events are listed right now. Please check the calendar again soon.';
      upcomingBox.appendChild(none);
    }
    upcoming.forEach(function (ev) { upcomingBox.appendChild(makeEventNode(ev, 'div')); });
  }

  /* Calendar page */
  var cal = document.querySelector('[data-calendar]');
  if (cal) {
    var grid = cal.querySelector('[data-cal-grid]');
    var titleEl = cal.querySelector('[data-cal-title]');
    var sideTitle = document.querySelector('[data-cal-side-title]');
    var sideList = document.querySelector('[data-cal-events]');
    var sideEmpty = document.querySelector('[data-cal-empty]');
    var now = new Date();
    var view = new Date(now.getFullYear(), now.getMonth(), 1);
    var selected = null;

    function renderSide() {
      sideList.innerHTML = '';
      var list;
      if (selected) {
        list = eventsOn(selected);
        sideTitle.textContent = selected.getDate() + ' ' + MONTHS[selected.getMonth()] + ' ' + selected.getFullYear();
      } else {
        var first = dayKey(new Date(view.getFullYear(), view.getMonth(), 1));
        var last = dayKey(new Date(view.getFullYear(), view.getMonth() + 1, 0));
        list = allEvents.filter(function (ev) { return ev.s <= last && ev.e >= first; });
        sideTitle.textContent = 'Events in ' + MONTHS[view.getMonth()];
      }
      list.forEach(function (ev) { sideList.appendChild(makeEventNode(ev, 'li')); });
      sideEmpty.classList.toggle('is-visible', list.length === 0);
    }

    function renderCalendar() {
      titleEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';
      var firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7; // Monday first
      var startDate = new Date(view.getFullYear(), view.getMonth(), 1 - firstDow);
      var todayKey = dayKey(new Date());
      for (var i = 0; i < 42; i++) {
        var d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        if (d.getMonth() !== view.getMonth()) btn.classList.add('is-other');
        if (dayKey(d) === todayKey) btn.classList.add('is-today');
        if (selected && dayKey(d) === dayKey(selected)) btn.classList.add('is-selected');
        var num = document.createElement('span'); num.textContent = d.getDate();
        btn.appendChild(num);
        var evs = eventsOn(d);
        if (evs.length) {
          var dots = document.createElement('span'); dots.className = 'cal-dots';
          var seen = {};
          evs.forEach(function (ev) {
            var c = ev.raw.category || 'event';
            if (seen[c]) return; seen[c] = true;
            var dot = document.createElement('i'); dot.className = 'dot dot--' + c; dots.appendChild(dot);
          });
          btn.appendChild(dots);
          btn.setAttribute('aria-label', d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + evs.length + ' event' + (evs.length > 1 ? 's' : ''));
        }
        (function (date) {
          btn.addEventListener('click', function () {
            selected = (selected && dayKey(selected) === dayKey(date)) ? null : date;
            if (selected && selected.getMonth() !== view.getMonth()) view = new Date(selected.getFullYear(), selected.getMonth(), 1);
            renderCalendar();
          });
        })(d);
        grid.appendChild(btn);
      }
      renderSide();
    }

    cal.querySelector('[data-cal-prev]').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1); selected = null; renderCalendar();
    });
    cal.querySelector('[data-cal-next]').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1); selected = null; renderCalendar();
    });
    cal.querySelector('[data-cal-today]').addEventListener('click', function () {
      var t = new Date(); view = new Date(t.getFullYear(), t.getMonth(), 1); selected = null; renderCalendar();
    });
    renderCalendar();
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
