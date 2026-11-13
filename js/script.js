"use strict";

const whatsappNumber = "918438158047";
const photo = (id, width = 850) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const services = [
  { title: "Household Shifting", text: "A considered home move, with packing, loading, transport and unloading arranged around your needs.", image: "photo-1600585154526-990dced4db0d" },
  { title: "Office Shifting", text: "Organized relocation for office furniture, computers, documents and business equipment.", image: "photo-1524758631624-e2822e304c36" },
  { title: "House Shifting", text: "Moving support for apartments, independent houses and villas, with care for your belongings.", image: "photo-1600518464441-9154a4dea21b" },
  { title: "Domestic Relocation", text: "Plan a move between cities and states with coordinated packing and transportation.", image: "photo-1601584115197-04ecc0da31d7" },
  { title: "Packing & Unpacking", text: "Protective packing for everyday items and furniture, with unpacking assistance at arrival.", image: "photo-1603796846097-bee99e4a601f" },
  { title: "Loading & Unloading", text: "Careful loading and unloading assistance for household and commercial goods.", image: "photo-1616401784845-180882ba9ba8" },
  { title: "Car Transportation", text: "Discuss secure, intercity car transportation arranged for your route and moving date.", image: "photo-1617814076367-b759c7d7e738" },
  { title: "Bike Transportation", text: "Protective packing and transportation support for two-wheelers between destinations.", image: "photo-1558981403-c5f9899a28bc" },
  { title: "Transportation & Cargo", text: "Practical transport and cargo solutions for commercial goods and consignments.", image: "photo-1580674285054-bed31e145f59" },
  { title: "AC Services", text: "Air-conditioning removal, installation and servicing assistance for your relocation.", image: "photo-1621905251189-08b45d6a269e" },
  { title: "Carpenter Services", text: "Furniture dismantling, reassembly and carpentry assistance as part of your move.", image: "photo-1504148455328-c376907d081c" },
  { title: "Electrical Services", text: "Appliance disconnection, reconnection and related electrical moving assistance.", image: "photo-1621905251918-48416bd8575a" },
  { title: "Furniture Shifting", text: "Thoughtful handling for sofas, beds, wardrobes, tables and other large furniture.", image: "photo-1586023492125-27b2c045efd7" },
  { title: "Warehousing & Storage", text: "Ask us about storage options for household or commercial goods, subject to availability.", image: "photo-1586528116493-a029325540fa" }
];

const gallery = [
  { title: "Household packing", image: "photo-1603796846097-bee99e4a601f" },
  { title: "Organized office spaces", image: "photo-1524758631624-e2822e304c36" },
  { title: "Furniture, ready to move", image: "photo-1586023492125-27b2c045efd7" },
  { title: "Moving transport", image: "photo-1601584115197-04ecc0da31d7" },
  { title: "Careful home preparation", image: "photo-1600585154526-990dced4db0d" },
  { title: "Vehicle transportation", image: "photo-1617814076367-b759c7d7e738" },
  { title: "Logistics and cargo", image: "photo-1580674285054-bed31e145f59" },
  { title: "Loading and delivery", image: "photo-1616401784845-180882ba9ba8" }
];

const servicesGrid = document.querySelector("#services-grid");
servicesGrid.innerHTML = services.map((service, index) => `
  <article class="service-card">
    <div class="service-image"><img src="${photo(service.image, 650)}" alt="${service.title} service" loading="lazy"><span class="service-number">${String(index + 1).padStart(2, "0")}</span></div>
    <div class="service-content"><h3>${service.title}</h3><p>${service.text}</p><button type="button" data-service="${service.title}">Learn more <span aria-hidden="true">↗</span></button></div>
  </article>`).join("");

const galleryGrid = document.querySelector("#gallery-grid");
galleryGrid.innerHTML = gallery.map((item, index) => `
  <button class="gallery-item" type="button" data-gallery-index="${index}" aria-label="Enlarge image: ${item.title}">
    <img src="${photo(item.image, 750)}" alt="${item.title}" loading="lazy"><span class="gallery-caption">${item.title}</span>
  </button>`).join("");

// Mobile navigation opens and closes on selection, outside click, or Escape.
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

// Service buttons carry the selected service into the quote form.
servicesGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-service]");
  if (!button) return;
  const serviceName = button.dataset.service;
  const quoteSelect = document.querySelector("#service");
  const match = [...quoteSelect.options].find(option => option.text.toLowerCase() === serviceName.toLowerCase());
  if (match) quoteSelect.value = match.value;
  else quoteSelect.value = "Other moving assistance";
  document.querySelector("#quote").scrollIntoView({ behavior: "smooth" });
  window.setTimeout(() => quoteSelect.focus({ preventScroll: true }), 500);
});

// Use one validation path for both enquiry forms. Successful submission opens
// a prefilled WhatsApp message; the visitor still reviews and sends it there.
function phoneError(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"))
    ? ""
    : "Enter a valid 10-digit Indian mobile number.";
}
function validateForm(form) {
  let firstInvalid = null;
  const data = new FormData(form);
  const phone = form.elements.phone;
  const email = form.elements.email;
  form.querySelectorAll(".field-error").forEach(node => { node.textContent = ""; });
  const status = form.querySelector(".form-status");
  if (status) { status.textContent = ""; status.className = "form-status"; }

  form.querySelectorAll("[required]").forEach(field => {
    let message = "";
    if (!String(field.value || "").trim()) message = "This field is required.";
    else if (field.name === "phone") message = phoneError(field.value);
    if (message) {
      const error = field.closest(".field")?.querySelector(".field-error");
      if (error) error.textContent = message;
      else if (status) status.textContent = message;
      field.setAttribute("aria-invalid", "true");
      firstInvalid ||= field;
    } else field.removeAttribute("aria-invalid");
  });
  if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    const error = email.closest(".field")?.querySelector(".field-error");
    if (error) error.textContent = "Enter a valid email address.";
    email.setAttribute("aria-invalid", "true");
    firstInvalid ||= email;
  } else if (email) email.removeAttribute("aria-invalid");

  if (firstInvalid) {
    if (status) { status.textContent = "Please check the highlighted fields."; status.classList.add("is-error"); }
    firstInvalid.focus();
    return null;
  }
  const labels = { name: "Full name", phone: "Mobile number", email: "Email address", from: "Moving from", to: "Moving to", date: "Preferred moving date", service: "Service required", requirements: "Additional requirements" };
  return [...data.entries()].filter(([, value]) => String(value).trim()).map(([key, value]) => `${labels[key] || key}: ${String(value).trim()}`).join("\n");
}
document.querySelectorAll(".whatsapp-form").forEach(form => {
  form.addEventListener("input", event => event.target.removeAttribute("aria-invalid"));
  form.addEventListener("change", event => event.target.removeAttribute("aria-invalid"));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const details = validateForm(form);
    if (!details) return;
    const message = `Hello OM SAI Packers and Movers, I would like a moving quote.\n\n${details}`;
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const status = form.querySelector(".form-status");
    const openLink = document.createElement("a");
    openLink.href = waUrl;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.click();
    if (status) {
      status.textContent = "Your enquiry is ready in WhatsApp. Review the details and tap Send to contact our team.";
      status.classList.add("is-success");
    }
    let fallback = form.querySelector(".whatsapp-fallback");
    if (!fallback) {
      fallback = document.createElement("a");
      fallback.className = "text-link whatsapp-fallback";
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      fallback.textContent = "If WhatsApp didn't open, open your enquiry here ↗";
      form.append(fallback);
    }
    fallback.href = waUrl;
  });
});

// Gallery lightbox: buttons, arrow keys and Escape all work, with focus returned.
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const galleryButtons = [...galleryGrid.querySelectorAll(".gallery-item")];
let currentImage = 0;
let previousFocus = null;
function showGalleryImage(index) {
  currentImage = (index + gallery.length) % gallery.length;
  const item = gallery[currentImage];
  lightboxImage.src = photo(item.image, 1500);
  lightboxImage.alt = item.title;
  lightboxCaption.textContent = item.title;
}
function openLightbox(index, trigger) {
  previousFocus = trigger;
  showGalleryImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox-close").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus) previousFocus.focus();
}
galleryGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-gallery-index]");
  if (button) openLightbox(Number(button.dataset.galleryIndex), button);
});
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(currentImage - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(currentImage + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showGalleryImage(currentImage - 1);
  if (event.key === "ArrowRight") showGalleryImage(currentImage + 1);
});

// Add subtle reveal motion only when the browser supports observation.
const revealItems = document.querySelectorAll(".reveal, .service-card, .gallery-item, .process-step, .testimonial-card");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => { item.classList.add("reveal"); revealObserver.observe(item); });
} else revealItems.forEach(item => item.classList.add("is-visible"));

// Keep moving dates forward and expose the back-to-top control after scrolling.
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach(input => { input.min = localDate; });
document.querySelector("#year").textContent = new Date().getFullYear();
const backToTop = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => backToTop.classList.toggle("visible", window.scrollY > 550), { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
