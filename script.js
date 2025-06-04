AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

window.addEventListener('scroll', () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = `${scrollPercent}%`;
});

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

function animateCounter(element, target) {
  let count = 0;
  const speed = 2000 / target; 
  
  const counter = setInterval(() => {
    count++;
    element.textContent = count + '+';
    
    if (count >= target) {
      clearInterval(counter);
    }
  }, speed);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.count');
      counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        animateCounter(counter, target);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.header-stats'));

document.addEventListener("DOMContentLoaded", () => {
  fetch("events.json")
    .then(response => response.json())
    .then(data => {
      window.events = data; 
      displayEvents(data);

      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", debounce(function () {
        const query = this.value.toLowerCase();
        const filtered = window.events.filter(event => 
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
        displayEvents(filtered);
      }, 300));
    });
});

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

function displayEvents(events) {
  const container = document.getElementById("eventCards");
  container.innerHTML = "";

  if (events.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="no-results">
          <i class="bi bi-search"></i>
          <h3>No events found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      </div>
    `;
    return;
  }

  events.forEach((event, index) => {
    const delay = index * 100;
    const card = `
      <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="card h-100 position-relative">
          ${event.featured ? '<div class="ribbon"><i class="bi bi-star-fill"></i> Featured</div>' : ''}
          <div class="card-img-wrapper">
            <img src="${event.image}" class="card-img-top" alt="${event.name}">
            <div class="card-img-overlay">
              <div class="overlay-content">
                <i class="bi bi-calendar-check"></i>
                <span>View Details</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-calendar-event"></i> ${event.name}
            </h5>
            <p class="card-text">
              <i class="bi bi-calendar2"></i> <strong>Date:</strong> ${event.date}<br>
              <i class="bi bi-clock"></i> <strong>Time:</strong> ${event.time}<br>
              <i class="bi bi-geo-alt"></i> <strong>Location:</strong> ${event.location}
            </p>
            <p class="card-text">${event.description}</p>
            <button class="btn btn-primary w-100">
              <i class="bi bi-ticket-perforated"></i> Register Now
            </button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });

  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => {
    new bootstrap.Tooltip(tooltip);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    
    btn.classList.add('active');

    const type = btn.dataset.type;
    const filtered = type === 'all' ? 
      window.events : 
      window.events.filter(e => e.type && e.type.toLowerCase() === type);
    displayEvents(filtered);
  });
});
