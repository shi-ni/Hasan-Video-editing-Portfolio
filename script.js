// ── Loader ──
(function() {
  document.body.classList.add('loading');
  function dismissLoader() {
    document.body.classList.remove('loading');
    var loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(function() { loader.remove(); }, 700);
    }
  }
  window.addEventListener('load', function() { setTimeout(dismissLoader, 1600); });
  setTimeout(dismissLoader, 3000);
})();

document.addEventListener('DOMContentLoaded', function() {

// ── Custom cursor ──
const dot = document.querySelector('.cursor-dot');
const glow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let cursorActive = false;

if (dot && glow) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    if (!cursorActive) {
      cursorActive = true;
      document.body.classList.add('custom-cursor');
    }
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  const hoverTargets = document.querySelectorAll('a, button, .btn-primary, .btn-outline, .gig-link, .video-card, .gig-card, .tool-item');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
}

// ── Scroll progress bar ──
const scrollProgress = document.querySelector('.scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }, { passive: true });
}

// ── Split text animation for hero h1 ──
try {
  const splitTarget = document.querySelector('.split-reveal');
  if (splitTarget) {
    const html = splitTarget.innerHTML;
    let charIndex = 0;
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.split('').map((char) => {
          if (char === ' ') return ' ';
          const delay = 0.3 + charIndex++ * 0.04;
          return '<span class="char" style="animation-delay:' + delay + 's">' + char + '</span>';
        }).join('');
      }
      if (node.nodeName === 'BR') return '<br>';
      if (node.nodeName === 'EM') {
        const inner = Array.from(node.childNodes).map(processNode).join('');
        return '<em>' + inner + '</em>';
      }
      return node.outerHTML;
    };
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const result = Array.from(tempDiv.childNodes).map(processNode).join('');
    splitTarget.innerHTML = result;
  }
} catch(e) { console.warn('Split text error:', e); }

// ── Fade-up observer ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ── Section border animation ──
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('#about, #work, #hire').forEach((s) => sectionObserver.observe(s));

// ── Animated stat counters ──
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      if (!target) return;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.floor(target / (1500 / 16)));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          el.classList.add('counted');
        }
        el.textContent = current + suffix;
      }, 16);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach((el) => statObserver.observe(el));

// ── 3D tilt effect on cards ──
document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(8px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// ── Card spotlight glow follow ──
document.querySelectorAll('.video-card, .gig-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ── Magnetic effect on buttons ──
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ── Parallax orbs on mouse move ──
const orbs = document.querySelectorAll('.orb');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 12;
    orb.style.transform = 'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
  });
});

// ── Typewriter effect ──
try {
  var tw = document.querySelector('.typewriter');
  if (tw) {
    var fullText = tw.getAttribute('data-text') || '';
    var idx = 0;
    function typeChar() {
      if (idx < fullText.length) {
        tw.textContent += fullText.charAt(idx);
        idx++;
        setTimeout(typeChar, 22);
      } else {
        tw.classList.add('done');
      }
    }
    // Start after hero animations
    setTimeout(typeChar, 1400);
  }
} catch(e) { console.warn('Typewriter error:', e); }

// ── Scroll-triggered parallax ──
try {
  var parallaxEls = document.querySelectorAll('.parallax-el');
  if (parallaxEls.length) {
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-speed')) || 0.03;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - window.innerHeight / 2) * speed;
        el.style.transform = 'translateY(' + (-offset) + 'px)';
      });
    }, { passive: true });
  }
} catch(e) { console.warn('Parallax error:', e); }

// ── Page transition effect ──
try {
  var overlay = document.querySelector('.page-transition');
  var navLinks = document.querySelectorAll('.nav-transition');
  if (overlay && navLinks.length) {
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = link.getAttribute('href');
        overlay.classList.add('active');
        setTimeout(function() {
          var el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: 'auto' });
          }
          setTimeout(function() {
            overlay.classList.remove('active');
          }, 200);
        }, 400);
      });
    });
  }
} catch(e) { console.warn('Transition error:', e); }

// ── Dark / Gold theme toggle ──
try {
  var toggleBtn = document.querySelector('.theme-toggle');
  var toggleIcon = document.querySelector('.theme-toggle-icon');
  if (toggleBtn && toggleIcon) {
    // Restore saved theme
    if (localStorage.getItem('theme') === 'gold') {
      document.body.classList.add('theme-gold');
      toggleIcon.textContent = '🌙';
    }
    toggleBtn.addEventListener('click', function() {
      document.body.classList.toggle('theme-gold');
      var isGold = document.body.classList.contains('theme-gold');
      toggleIcon.textContent = isGold ? '🌙' : '☀';
      toggleIcon.style.transform = 'rotate(360deg)';
      setTimeout(function() { toggleIcon.style.transform = 'rotate(0deg)'; }, 500);
      localStorage.setItem('theme', isGold ? 'gold' : 'dark');
    });
  }
} catch(e) { console.warn('Theme toggle error:', e); }

}); // end DOMContentLoaded
