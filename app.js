(function () {
  "use strict";

  const data = window.TIZA_DATA;
  const money = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

  function allItems() {
    return data.categories.reduce((items, category) => items.concat(category.items.map((item) => Object.assign({ category: category.title, categoryId: category.id }, item))), []);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function formatPrice(price) {
    return price == null ? "Consultar" : money.format(price);
  }

  function dishPhoto(item) {
    return data.dishImages && data.dishImages[item.id] ? data.dishImages[item.id] : "";
  }

  function buildMenu() {
    const nav = document.querySelector(".category-nav-inner");
    const container = document.getElementById("menu-categories");
    nav.innerHTML = data.categories.map((category) =>
      `<a href="#cat-${escapeHtml(category.id)}">${escapeHtml(category.title)}</a>`
    ).join("");

    container.innerHTML = data.categories.map((category) => `
      <section class="menu-category" id="cat-${escapeHtml(category.id)}" aria-labelledby="title-${escapeHtml(category.id)}">
        <div class="category-heading"><div><span class="category-index">${String(data.categories.indexOf(category) + 1).padStart(2, "0")}</span><h3 id="title-${escapeHtml(category.id)}">${escapeHtml(category.title)}</h3></div><p>${escapeHtml(category.subtitle)}</p></div>
        <div class="dish-grid">${category.items.map((item) => `
          <article class="dish-card">
            <div class="dish-visual visual-${escapeHtml(category.id)} ${dishPhoto(item) ? "has-photo" : ""}">${dishPhoto(item) ? `<img class="dish-photo" src="${escapeHtml(dishPhoto(item))}" alt="" loading="lazy">` : ""}<span class="chalk-stamp">LA TIZA</span><span class="visual-dish-name">${escapeHtml(item.name)}</span><span class="visual-caption">Hecho para compartir</span>${dishPhoto(item) ? "" : `<span class="image-placeholder">Foto propia pendiente</span>`}</div>
            <div class="dish-content">
              <div class="dish-title-row"><h4>${escapeHtml(item.name)}</h4><span class="example-tag">Ejemplo</span></div>
              <p class="dish-description">${escapeHtml(item.description)}</p><p class="dish-weight">${escapeHtml(item.weight)}</p>
              ${item.extras ? `<p class="included-tag"><span aria-hidden="true">✓</span> Precio final, extras incluidos <span class="included-detail">${escapeHtml(item.extras)}</span></p>` : ""}
              ${item.allergens.length ? `<p class="allergen-list" aria-label="Alérgenos: ${item.allergens.map((key) => escapeHtml(data.allergens[key] || key)).join(", ")}">${item.allergens.map((key) => `<span title="${escapeHtml(data.allergens[key] || key)}">${escapeHtml(key.toUpperCase())}</span>`).join("")}<small>${item.allergens.map((key) => escapeHtml(data.allergens[key] || key)).join(" · ")}</small></p>` : `<p class="allergen-list no-allergens">Consulta posibles trazas al personal</p>`}
              <div class="dish-price-row"><div class="dish-prices">${["tapa", "racion"].map((size) => item.prices[size] != null ? `<span><small>${item.sizeLabel ? escapeHtml(item.sizeLabel) : size === "racion" ? "ración" : size}</small><b>${formatPrice(item.prices[size])}</b></span>` : "").join("") || `<span><small>Precio</small><b>Consultar</b></span>`}</div></div>
            </div>
          </article>`).join("")}</div>
      </section>`).join("");
  }

  function renderDishTour() {
    const items = allItems();
    const tour = document.getElementById("dish-tour");
    const featured = data.featuredDishes.map((id) => items.find((item) => item.id === id)).filter(Boolean);
    tour.innerHTML = featured.map((item, index) => {
      const photo = dishPhoto(item);
      const price = item.prices.racion != null ? item.prices.racion : item.prices.tapa;
      return `<article class="tour-card" data-tour-card>
        <div class="tour-art ${photo ? "has-photo" : ""}">
          ${photo ? `<img src="${escapeHtml(photo)}" alt="" loading="lazy">` : `<div class="tour-plate" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><span>${String(index + 1).padStart(2, "0")}</span></div><span class="tour-photo-note">Ilustración · foto propia pendiente</span>`}
          <span class="tour-category">${escapeHtml(item.category)}</span>
        </div>
        <div class="tour-copy"><p class="eyebrow">Un plato para compartir</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><div class="tour-card-footer"><strong>${formatPrice(price)} <small>ejemplo</small></strong><a href="#cat-${escapeHtml(item.categoryId)}">Ver en la carta <span aria-hidden="true">↗</span></a></div></div>
      </article>`;
    }).join("");
    setupDishTour();
  }

  function setupDishTour() {
    const track = document.getElementById("dish-tour");
    const cards = Array.from(track.querySelectorAll("[data-tour-card]"));
    const progress = document.getElementById("tour-progress-bar");
    const previous = document.getElementById("tour-prev");
    const next = document.getElementById("tour-next");
    let frameRequested = false;

    function updateTour() {
      const trackBounds = track.getBoundingClientRect();
      const trackCenter = trackBounds.left + trackBounds.width / 2;
      const radius = Math.max(trackBounds.width * 0.65, 1);
      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        const distance = Math.max(-1, Math.min(1, (bounds.left + bounds.width / 2 - trackCenter) / radius));
        card.style.setProperty("--tour-tilt", `${distance * -12}deg`);
        card.style.setProperty("--tour-lift", `${(1 - Math.abs(distance)) * -10}px`);
      });
      const maxScroll = track.scrollWidth - track.clientWidth;
      progress.style.transform = `scaleX(${maxScroll > 0 ? track.scrollLeft / maxScroll : 1})`;
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;
      frameRequested = false;
    }

    function requestUpdate() {
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(updateTour);
      }
    }

    function scrollTour(direction) {
      track.scrollBy({
        left: direction * track.clientWidth * 0.72,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    }

    track.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    previous.addEventListener("click", () => scrollTour(-1));
    next.addEventListener("click", () => scrollTour(1));
    requestUpdate();
  }

  function renderZones() {
    const grid = document.getElementById("zone-grid");
    grid.innerHTML = data.zones.map((zone, index) => `
      <article class="zone-card"><div class="zone-visual zone-${escapeHtml(zone.visual)}"><span>${String(index + 1).padStart(2, "0")}</span><i aria-hidden="true"></i><b>${escapeHtml(zone.name)}</b></div><div class="zone-copy"><h3>${escapeHtml(zone.name)}</h3><p>${escapeHtml(zone.description)}</p></div></article>`).join("");
    document.getElementById("reservation-zone").innerHTML = `<option value="" selected disabled>Elige una zona</option>` + data.zones.map((zone) => `<option value="${escapeHtml(zone.name)}">${escapeHtml(zone.name)}</option>`).join("");
  }

  function renderBusinessInfo() {
    const business = data.business;
    document.getElementById("hero-address").textContent = business.address;
    document.getElementById("contact-address").textContent = business.address;
    document.getElementById("opening-hours").innerHTML = business.openingHours.map((row) => `<span>${escapeHtml(row.days)} <b>${escapeHtml(row.hours)}</b></span>`).join("");
    document.getElementById("phone-link").href = `tel:${business.phone}`;
    document.getElementById("phone-text").textContent = business.phone.replace("+34", "+34 ");
    document.getElementById("dock-call").href = `tel:${business.phone}`;
    document.getElementById("maps-link").href = business.googleMapsUrl;
    document.getElementById("directions-link").href = business.directionsUrl;
    document.getElementById("review-link").href = business.googleReviewUrl;
    const instagram = document.getElementById("instagram-link");
    if (business.instagramUrl) instagram.href = business.instagramUrl;
    else instagram.remove();
    renderKitchenStatus();
  }

  function renderKitchenStatus() {
    const banner = document.getElementById("kitchen-banner");
    const [hours, minutes] = data.kitchenClose.split(":").map(Number);
    const now = new Date();
    const isClosed = now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
    banner.innerHTML = `<span class="kitchen-indicator ${isClosed ? "is-closed" : ""}"></span><span>${isClosed ? "Cocina cerrada. Disponible: bebidas y barra." : `Cocina abierta hasta las ${escapeHtml(data.kitchenClose)}`}${data.kitchenCloseIsExample ? `<small>Horario de ejemplo</small>` : ""}</span><a href="#carta">Ver carta <span aria-hidden="true">↗</span></a>`;
  }

  function whatsappUrl(message) {
    const number = data.business.whatsappContacto.replace(/\D/g, "");
    if (number.length < 10 || /PON.?AQU[IÍ]/i.test(data.business.whatsappContacto)) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  document.getElementById("reservation-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const text = `Hola, me gustaría reservar una mesa para ${values.get("people")} personas, el día ${values.get("day")} a las ${values.get("time")}. Zona preferida: ${values.get("zone")}.`;
    const url = whatsappUrl(text);
    const message = document.getElementById("reservation-message");
    if (!url) {
      message.textContent = "WhatsApp pendiente de configurar en data.js.";
      message.classList.add("is-error");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    message.textContent = "Solicitud preparada. El equipo confirmará la reserva.";
    message.classList.remove("is-error");
  });

  document.getElementById("suggestion-link").addEventListener("click", (event) => {
    const url = whatsappUrl("Hola, quiero compartir una sugerencia con el equipo de La Tiza.");
    if (!url) {
      event.preventDefault();
      window.alert("WhatsApp pendiente de configurar en data.js.");
      return;
    }
    event.currentTarget.href = url;
    event.currentTarget.target = "_blank";
    event.currentTarget.rel = "noopener noreferrer";
  });

  buildMenu();
  renderDishTour();
  renderZones();
  renderBusinessInfo();
  window.setInterval(renderKitchenStatus, 30000);
})();
