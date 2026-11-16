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

  function availableItems(category) {
    return category.items.filter((item) =>
      item.available !== false && (data.showProvisionalData || !item.example)
    );
  }

  function buildMenu() {
    const nav = document.querySelector(".category-nav-inner");
    const container = document.getElementById("menu-categories");
    const dataNote = document.getElementById("menu-data-note");
    dataNote.hidden = !data.showProvisionalData;
    nav.innerHTML = data.categories.map((category) =>
      `<a href="#cat-${escapeHtml(category.id)}">${escapeHtml(category.title)}</a>`
    ).join("");

    container.innerHTML = data.categories.map((category) => {
      const items = availableItems(category);
      return `
      <section class="menu-category" id="cat-${escapeHtml(category.id)}" data-menu-category aria-labelledby="title-${escapeHtml(category.id)}">
        <div class="category-heading"><div><span class="category-index">${String(data.categories.indexOf(category) + 1).padStart(2, "0")}</span><h3 id="title-${escapeHtml(category.id)}">${escapeHtml(category.title)}</h3></div><p>${escapeHtml(category.subtitle)}</p></div>
        <div class="dish-grid">${items.map((item) => {
          const photo = dishPhoto(item);
          const searchable = `${item.name} ${item.description} ${category.title}`;
          return `
          <article class="dish-card" data-search="${escapeHtml(searchable)}">
            <div class="dish-visual visual-${escapeHtml(category.id)} ${photo ? "has-photo" : ""}">${photo ? `<img class="dish-photo" src="${escapeHtml(photo)}" alt="" loading="lazy" decoding="async" width="800" height="600">` : ""}<span class="chalk-stamp">LA TIZA</span><span class="visual-dish-name">${escapeHtml(item.name)}</span><span class="visual-caption">Hecho para compartir</span>${photo ? "" : `<span class="image-placeholder">Foto propia pendiente</span>`}</div>
            <div class="dish-content">
              <div class="dish-title-row"><h4>${escapeHtml(item.name)}</h4>${item.example ? `<span class="example-tag">Ejemplo</span>` : item.featured ? `<span class="featured-tag">Recomendado</span>` : ""}</div>
              <p class="dish-description">${escapeHtml(item.description)}</p><p class="dish-weight">${escapeHtml(item.weight)}</p>
              ${item.extras ? `<p class="included-tag"><span aria-hidden="true">✓</span> Precio final, extras incluidos <span class="included-detail">${escapeHtml(item.extras)}</span></p>` : ""}
              ${!data.allergensConfirmed ? `<p class="allergen-list no-allergens">Alérgenos pendientes de confirmar</p>` : item.allergens && item.allergens.length ? `<p class="allergen-list" aria-label="Alérgenos: ${item.allergens.map((key) => escapeHtml(data.allergens[key] || key)).join(", ")}">${item.allergens.map((key) => `<span title="${escapeHtml(data.allergens[key] || key)}">${escapeHtml(key.toUpperCase())}</span>`).join("")}<small>${item.allergens.map((key) => escapeHtml(data.allergens[key] || key)).join(" · ")}</small></p>` : `<p class="allergen-list no-allergens">Consulta al personal sobre posibles alérgenos y trazas</p>`}
              <div class="dish-price-row"><div class="dish-prices">${["tapa", "racion"].map((size) => item.prices[size] != null ? `<span><small>${item.sizeLabel ? escapeHtml(item.sizeLabel) : size === "racion" ? "ración" : size}</small><b>${formatPrice(item.prices[size])}</b></span>` : "").join("") || `<span><small>Precio</small><b>Consultar</b></span>`}</div></div>
            </div>
          </article>`; }).join("")}</div>
        ${items.length ? "" : `<p class="pending-category">Carta pendiente de confirmar por el establecimiento.</p>`}
      </section>`;
    }).join("");

    document.getElementById("menu-search-empty").hidden = true;
    document.getElementById("menu-search").addEventListener("input", filterMenu);
  }

  function filterMenu(event) {
    const query = event.currentTarget.value.trim().toLocaleLowerCase("es");
    let visibleItems = 0;
    document.querySelectorAll("[data-menu-category]").forEach((section) => {
      const cards = Array.from(section.querySelectorAll(".dish-card"));
      let sectionItems = 0;
      cards.forEach((card) => {
        const matches = !query || card.dataset.search.toLocaleLowerCase("es").includes(query);
        card.hidden = !matches;
        if (matches) sectionItems += 1;
      });
      section.hidden = Boolean(query) && sectionItems === 0;
      visibleItems += sectionItems;
      const link = document.querySelector(`.category-nav a[href="#${CSS.escape(section.id)}"]`);
      if (link) link.hidden = section.hidden;
    });
    document.getElementById("menu-search-empty").hidden = !query || visibleItems > 0;
  }

  function renderDishTour() {
    const items = allItems();
    const tour = document.getElementById("dish-tour");
    const featured = data.featuredDishes.map((id) => items.find((item) => item.id === id))
      .filter((item) => item && item.available !== false && (data.showProvisionalData || !item.example));
    document.getElementById("recorrido").hidden = featured.length === 0;
    document.getElementById("tour-note").hidden = !data.showProvisionalData;
    tour.innerHTML = featured.map((item, index) => {
      const photo = dishPhoto(item);
      const price = item.prices.racion != null ? item.prices.racion : item.prices.tapa;
      return `<article class="tour-card" data-tour-card>
        <div class="tour-art ${photo ? "has-photo" : ""}">
          ${photo ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" width="800" height="600">` : `<div class="tour-plate" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><span>${String(index + 1).padStart(2, "0")}</span></div><span class="tour-photo-note">Ilustración provisional · foto propia pendiente</span>`}
          <span class="tour-category">${escapeHtml(item.category)}</span>
        </div>
        <div class="tour-copy"><p class="eyebrow">${item.example ? "Selección de muestra" : "Recomendación de la casa"}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><div class="tour-card-footer"><strong>${formatPrice(price)} ${item.example ? `<small>ejemplo</small>` : ""}</strong><a href="#cat-${escapeHtml(item.categoryId)}">Ver en la carta <span aria-hidden="true">↗</span></a></div></div>
      </article>`;
    }).join("");
    if (featured.length) setupDishTour();
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
      <article class="zone-card"><div class="zone-visual zone-${escapeHtml(zone.visual)}"><span>${String(index + 1).padStart(2, "0")}</span><i aria-hidden="true"></i><b>${escapeHtml(zone.name)}</b><small class="zone-visual-note">Ilustración · foto real pendiente</small></div><div class="zone-copy"><h3>${escapeHtml(zone.name)}</h3><p>${escapeHtml(zone.description)}</p></div></article>`).join("");
    document.getElementById("reservation-zone").innerHTML = `<option value="" selected disabled>Elige una zona</option>` + data.zones.map((zone) => `<option value="${escapeHtml(zone.name)}">${escapeHtml(zone.name)}</option>`).join("");
  }

  function renderGallery() {
    const gallery = document.getElementById("photo-gallery");
    gallery.innerHTML = data.gallery.map((photo) => `
      <figure class="gallery-card gallery-${escapeHtml(photo.id)}">
        ${photo.image
          ? `<img src="${escapeHtml(photo.image)}" alt="${escapeHtml(photo.alt || photo.title)}" loading="lazy" decoding="async" width="900" height="650">`
          : `<div class="gallery-placeholder"><span class="gallery-placeholder-mark" aria-hidden="true">T</span><strong>Foto real pendiente</strong></div>`}
        <figcaption><strong>${escapeHtml(photo.title)}</strong><span>${escapeHtml(photo.description)}</span></figcaption>
      </figure>`).join("");
  }

  function localDateString(timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date()).reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function getZonedClock(timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date()).reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  function parseTime(value) {
    if (value === "24:00") return 1440;
    if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) return null;
    const [hour, minute] = value.split(":").map(Number);
    if (hour > 23 || minute > 59) return null;
    return hour * 60 + minute;
  }

  function isOpenNow(schedule, clock) {
    if (!Array.isArray(schedule) || !schedule.length || !schedule.every((entry) => {
      const opens = parseTime(entry.open);
      const closes = parseTime(entry.close);
      return opens !== null && closes !== null && Array.isArray(entry.days) &&
        entry.days.length > 0 && entry.days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
    })) return null;
    const previousDay = (clock.day + 6) % 7;
    return schedule.some((entry) => {
      const opens = parseTime(entry.open);
      const closes = parseTime(entry.close);
      if (opens === null || closes === null || !Array.isArray(entry.days)) return false;
      if (entry.days.includes(clock.day)) {
        if (closes > opens && clock.minutes >= opens && clock.minutes < closes) return true;
        if (closes <= opens && clock.minutes >= opens) return true;
      }
      return closes <= opens && entry.days.includes(previousDay) && clock.minutes < closes;
    });
  }

  function formatSchedule(schedule) {
    return schedule.map((entry) => `${entry.label}: ${entry.open}–${entry.close}`).join(" · ");
  }

  function updateRestaurantSchema() {
    const business = data.business;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: business.name,
      telephone: business.phone,
      address: {
        "@type": "PostalAddress",
        ...business.structuredAddress
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude
      },
      sameAs: [business.googleMapsUrl]
    };
    if (business.openingHoursConfirmed) {
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      schema.openingHoursSpecification = business.openingSchedule.map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: entry.days.map((day) => `https://schema.org/${weekdays[day]}`),
        opens: entry.open,
        closes: entry.close === "24:00" ? "00:00" : entry.close
      }));
    }
    document.getElementById("restaurant-schema").textContent = JSON.stringify(schema);
  }

  function renderBusinessInfo() {
    const business = data.business;
    document.title = `${business.name} | Carta digital`;
    document.getElementById("header-brand").setAttribute("aria-label", `${business.name}, inicio`);
    document.getElementById("brand-name").textContent = business.shortName;
    document.getElementById("brand-descriptor").textContent = business.descriptor;
    document.getElementById("footer-brand-name").textContent = business.shortName;
    document.getElementById("footer-brand-descriptor").textContent = business.descriptor;
    document.querySelector('meta[property="og:site_name"]').content = business.name;
    document.querySelector('meta[property="og:title"]').content = `${business.name} | Sevilla Este`;
    document.getElementById("business-tagline").textContent = business.tagline;
    document.getElementById("hero-address").textContent = business.address;
    document.getElementById("contact-address").textContent = business.address;
    document.getElementById("opening-hours").textContent = `${business.openingHoursConfirmed ? "" : "Horario orientativo: "}${formatSchedule(business.openingSchedule)}`;
    document.getElementById("phone-link").href = `tel:${business.phone}`;
    document.getElementById("phone-text").textContent = business.phone.replace("+34", "+34 ");
    document.getElementById("dock-call").href = `tel:${business.phone}`;
    document.getElementById("maps-link").href = business.googleMapsUrl;
    document.getElementById("directions-link").href = business.directionsUrl;
    document.getElementById("map-overlay-link").href = business.directionsUrl;
    document.getElementById("map-frame").src = `https://maps.google.com/maps?q=${business.coordinates.latitude},${business.coordinates.longitude}&z=16&output=embed`;
    document.getElementById("review-link").href = business.googleReviewUrl;
    const contactLink = document.getElementById("whatsapp-link");
    const contactUrl = whatsappUrl("Hola, quiero contactar con La Tiza Alcosa Cervecería.");
    if (contactUrl) {
      contactLink.href = contactUrl;
      contactLink.target = "_blank";
      contactLink.rel = "noopener noreferrer";
    } else {
      contactLink.href = "#";
      contactLink.setAttribute("aria-disabled", "true");
      document.getElementById("whatsapp-message").textContent = "WhatsApp pendiente de confirmar por el establecimiento.";
    }
    const instagram = document.getElementById("instagram-link");
    if (business.instagramUrl) instagram.href = business.instagramUrl;
    else instagram.remove();
    renderKitchenStatus();
    renderOpeningStatus();
    updateRestaurantSchema();
    document.getElementById("reservation-form").elements.day.min = localDateString(business.timeZone);
  }

  function renderOpeningStatus() {
    const business = data.business;
    const isOpen = isOpenNow(business.openingSchedule, getZonedClock(business.timeZone));
    const openingStatus = document.getElementById("opening-status");
    openingStatus.textContent = isOpen === null
      ? "Horario pendiente de configurar."
      : `${isOpen ? "Abierto" : "Cerrado"}${business.openingHoursConfirmed ? "" : " · horario provisional"}`;
    openingStatus.className = `status-pill ${isOpen === null ? "is-pending" : isOpen ? "is-open" : "is-closed"}`;
  }

  function renderKitchenStatus() {
    const banner = document.getElementById("kitchen-banner");
    const business = data.business;
    const clock = getZonedClock(business.timeZone);
    const isOpen = isOpenNow(data.kitchenSchedule, clock);
    const hasConfirmedTimes = data.kitchenScheduleConfirmed && isOpen !== null;
    const today = data.kitchenSchedule.find((entry) => Array.isArray(entry.days) && entry.days.includes(clock.day));
    const message = hasConfirmedTimes
      ? isOpen
        ? `Cocina abierta hasta las ${today ? today.close : "la hora configurada"}.`
        : "Cocina cerrada. Disponible: bebidas y barra."
      : `Horario de cocina pendiente de confirmar${today && today.close ? ` · cierre orientativo ${today.close}` : ""}.`;
    const indicator = hasConfirmedTimes ? isOpen ? "" : "is-closed" : "is-pending";
    banner.innerHTML = `<span class="kitchen-indicator ${indicator}"></span><span>${escapeHtml(message)}</span><a href="#carta">Ver carta <span aria-hidden="true">↗</span></a>`;
  }

  function whatsappUrl(message) {
    const configuredNumber = data.business.whatsappContacto;
    const number = configuredNumber.replace(/\D/g, "");
    if (!data.business.whatsappConfirmed || number.length < 10 || /PON.?AQU[IÍ]/i.test(configuredNumber)) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const reservationForm = document.getElementById("reservation-form");
  reservationForm.elements.name.addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    if (!name) {
      form.elements.name.setCustomValidity("Escribe tu nombre.");
      form.elements.name.reportValidity();
      return;
    }
    const comments = String(values.get("comments") || "").trim();
    const text = `Hola, soy ${name}. Quisiera solicitar una reserva para ${values.get("people")} personas, el ${values.get("day")} a las ${values.get("time")}. Zona preferida: ${values.get("zone")}. Comentarios: ${comments || "Ninguno"}.`;
    const url = whatsappUrl(text);
    const message = document.getElementById("reservation-message");
    if (!url) {
      message.textContent = "WhatsApp pendiente de configurar en data.js.";
      message.classList.add("is-error");
      return;
    }
    openWhatsApp(url);
    message.textContent = "Solicitud preparada en WhatsApp. Pulsa Enviar para que llegue al local; la reserva queda pendiente de confirmación.";
    message.classList.remove("is-error");
  });

  document.getElementById("suggestion-link").addEventListener("click", (event) => {
    const url = whatsappUrl("Hola, quiero compartir una sugerencia con el equipo de La Tiza.");
    if (!url) {
      event.preventDefault();
      const message = document.getElementById("suggestion-message");
      message.textContent = "WhatsApp pendiente de confirmar por el establecimiento.";
      message.classList.add("is-error");
      return;
    }
    event.currentTarget.href = url;
    event.currentTarget.target = "_blank";
    event.currentTarget.rel = "noopener noreferrer";
  });

  buildMenu();
  renderDishTour();
  renderZones();
  renderGallery();
  renderBusinessInfo();
  document.getElementById("whatsapp-link").addEventListener("click", (event) => {
    if (!whatsappUrl("")) {
      event.preventDefault();
      const message = document.getElementById("whatsapp-message");
      message.textContent = "WhatsApp pendiente de confirmar por el establecimiento.";
      message.classList.add("is-error");
    }
  });
  window.setInterval(() => {
    renderKitchenStatus();
    renderOpeningStatus();
  }, 30000);
})();
