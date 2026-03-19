/**
 * Dark Sentinel - Cybersecurity Portfolio
 * Pure JavaScript Implementation
 */

// ========================================
// DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initParallax();
  initStatsCounter();
  initTestimonialsCarousel();
  initFAQAccordion();
  initSmoothScroll();
});
const sliders = document.querySelectorAll(".slider");

sliders.forEach(slider => {

let slides = slider.querySelectorAll(".slide");
let index = 0;

const next = slider.querySelector(".next");
const prev = slider.querySelector(".prev");

function showSlide(i){
slides.forEach(s => s.classList.remove("active"));
slides[i].classList.add("active");
}

next.addEventListener("click", ()=>{
index = (index + 1) % slides.length;
showSlide(index);
});

prev.addEventListener("click", ()=>{
index = (index - 1 + slides.length) % slides.length;
showSlide(index);
});

});

// ========================================
// Navigation
// ========================================
function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
  
  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  const gridItems = document.querySelectorAll('.grid-item');
  const projectCards = document.querySelectorAll('.project-card');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay if specified
        const delay = entry.target.dataset.delay;
        if (delay) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseInt(delay));
        } else {
          entry.target.classList.add('revealed');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));
  gridItems.forEach(el => revealObserver.observe(el));
  projectCards.forEach(el => revealObserver.observe(el));
}

// ========================================
// Parallax Effect
// ========================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = (elementCenter - viewportCenter) * speed;
          
          el.style.transform = `translateY(${distance}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

// ========================================
// Stats Counter Animation
// ========================================
function initStatsCounter() {
  const statItems = document.querySelectorAll('.stat-item');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statItem = entry.target;
        const targetValue = parseInt(statItem.dataset.count);
        const valueEl = statItem.querySelector('.stat-value');
        
        animateCounter(valueEl, targetValue);
        counterObserver.unobserve(statItem);
      }
    });
  }, { threshold: 0.5 });
  
  statItems.forEach(item => counterObserver.observe(item));
}

function animateCounter(element, target) {
  const duration = 2000;
  const startTime = performance.now();
  const startValue = 0;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-quart)
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// ========================================
// Testimonials Carousel
// ========================================
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (!track) return;
  
  const cards = track.querySelectorAll('.testimonial-card');
  const totalSlides = cards.length;
  let currentSlide = 0;
  let autoplayInterval;
  
  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  
  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
    resetAutoplay();
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  
  // Event listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }
  
  // Initialize
  updateCarousel();
  startAutoplay();
  
  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  track.addEventListener('mouseleave', startAutoplay);
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.getElementById('nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// Utility Functions
// ========================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
// Performance: Disable complex animations on touch devices
// ========================================
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (isTouchDevice) {
  // Disable parallax on mobile for better performance
  document.querySelectorAll('[data-parallax]').forEach(el => {
    el.style.transform = 'none';
  });
}
const text = `
> Hello  ̶w̶o̶r̶l̶d̶  vistor 
`;

let index = 0;
const speed = 40;

function typeWriter() {
  if (index < text.length) {
    document.getElementById("terminalText").textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}

window.addEventListener("load", typeWriter);

