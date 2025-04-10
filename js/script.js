// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('show'); // Toggles the 'show' class to display/hide the menu
});

// Hero Slider Functionality
const slides = document.querySelectorAll('.slide');
const prevSlideBtn = document.querySelector('.slider-prev'); // Renamed to avoid conflict
const nextSlideBtn = document.querySelector('.slider-next'); // Renamed to avoid conflict
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// Event Listeners for Hero Slider
nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showSlide(index));
});

// Auto-slide (optional)
let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const slider = document.querySelector('.hero-slider');
slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
slider.addEventListener('mouseleave', () => {
  slideInterval = setInterval(nextSlide, 5000);
});
// Portfolio Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.portfolio-carousel');
  const items = document.querySelectorAll('.carousel-item:not(.clone)');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  
  // Configuration
  const visibleItems = 5;
  let currentIndex = 0;
  let isAnimating = false;
  let autoRotateInterval;
  const rotationSpeed = 6000; // 6 seconds
  
  // Clone items for infinite loop
  const firstFew = Array.from(items).slice(0, visibleItems).map(item => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });
  
  const lastFew = Array.from(items).slice(-visibleItems).map(item => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });
  
  lastFew.forEach(item => carousel.insertBefore(item, items[0]));
  firstFew.forEach(item => carousel.appendChild(item));
  
  const allItems = document.querySelectorAll('.carousel-item');
  const totalItems = items.length;

  // Create indicators
  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalItems; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('carousel-indicator');
      indicator.setAttribute('aria-label', `Go to project ${i + 1}`);
      indicator.addEventListener('click', () => goToIndex(i));
      indicatorsContainer.appendChild(indicator);
    }
    updateIndicators();
  }

  // Update active indicator
  function updateIndicators() {
    document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  // Go to specific index
  function goToIndex(index) {
    if (index === currentIndex || isAnimating) return;
    currentIndex = index;
    updateCarousel();
  }

  // Update carousel position
  function updateCarousel(instant = false) {
    if (instant) {
      carousel.style.transition = 'none';
    } else {
      carousel.style.transition = 'transform 0.5s ease';
    }
    
    const itemWidth = allItems[0].offsetWidth + 
                     parseInt(window.getComputedStyle(allItems[0]).marginLeft) + 
                     parseInt(window.getComputedStyle(allItems[0]).marginRight) +
                     parseInt(window.getComputedStyle(carousel).gap);
    
    carousel.style.transform = `translateX(-${(currentIndex + visibleItems) * itemWidth}px)`;
    updateIndicators();
    
    if (instant) {
      void carousel.offsetWidth; // Force reflow
    }
  }

  // Handle navigation
  function handleNavigation(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    updateCarousel();
    
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Auto-rotation
  function startAutoRotate() {
    stopAutoRotate();
    autoRotateInterval = setInterval(() => {
      handleNavigation(1);
    }, rotationSpeed);
  }

  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  // Touch events
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      handleNavigation(1); // Swipe left
    } else if (touchEndX > touchStartX + 50) {
      handleNavigation(-1); // Swipe right
    }
  }

  // Initialize
  createIndicators();
  updateCarousel(true);
  startAutoRotate();

  // Event listeners
  prevBtn.addEventListener('click', () => {
    handleNavigation(-1);
    stopAutoRotate();
  });
  
  nextBtn.addEventListener('click', () => {
    handleNavigation(1);
    stopAutoRotate();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      handleNavigation(-1);
      stopAutoRotate();
    } else if (e.key === 'ArrowRight') {
      handleNavigation(1);
      stopAutoRotate();
    }
  });

  // Touch events
  carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
  carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);

  // Handle window resize
  window.addEventListener('resize', function() {
    updateCarousel(true);
  });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior

      const targetId = this.getAttribute('href').substring(1); // Get the target section ID
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
          // Scroll to the target section smoothly and center it
          targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center' // Center the section on the screen
          });
      }
  });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/Hide Scroll to Top Button on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to Top on Click
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});