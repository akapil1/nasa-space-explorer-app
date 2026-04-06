const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const gallery = document.getElementById("gallery");
const button = document.getElementById("getImagesBtn");

// Replace this with your regenerated NASA API key
const API_KEY = "UBdOSVrrriz8XgvelsKpqczbOKkL8FvyeHjPe2kd";

setupDateInputs(startInput, endInput);

const spaceFacts = [
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? A sunset on Mars appears blue.",
  "Did you know? Jupiter has the shortest day of all the planets.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? The footprints on the Moon can last for millions of years."
];

const factBox = document.createElement("div");
factBox.className = "space-fact";
factBox.textContent = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

const filters = document.querySelector(".filters");
filters.insertAdjacentElement("afterend", factBox);

const modal = document.createElement("div");
modal.className = "modal hidden";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn">&times;</span>
    <div id="modalBody"></div>
  </div>
`;
document.body.appendChild(modal);

const closeBtn = modal.querySelector(".close-btn");
const modalBody = document.getElementById("modalBody");

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

button.addEventListener("click", fetchSpaceImages);

async function fetchSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    gallery.innerHTML = `<p class="message">Please select both start and end dates.</p>`;
    return;
  }

  gallery.innerHTML = `<p class="message">🔄 Loading space photos...</p>`;

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch NASA data");
    }

    const data = await response.json();
    renderGallery(data.reverse());
  } catch (error) {
    console.error("Error fetching APOD data:", error);
    gallery.innerHTML = `<p class="message error">Something went wrong while loading NASA images.</p>`;
  }
}

function renderGallery(items) {
  if (!items || items.length === 0) {
    gallery.innerHTML = `<p class="message">No space entries found for this date range.</p>`;
    return;
  }

  gallery.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-item";

    let mediaHTML = "";

    if (item.media_type === "image") {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" />`;
    } else if (item.media_type === "video") {
      mediaHTML = `
        <div class="video-card">
          <p>🎥 Video available</p>
          <a href="${item.url}" target="_blank" class="video-btn">▶ Watch Video</a>
        </div>
      `;
    } else {
      mediaHTML = `
        <div class="video-card">
          <p>Unsupported media type</p>
        </div>
      `;
    }

    card.innerHTML = `
      ${mediaHTML}
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    card.addEventListener("click", () => openModal(item));
    gallery.appendChild(card);
  });
}

function openModal(item) {
  let mediaHTML = "";

  if (item.media_type === "image") {
    mediaHTML = `<img src="${item.hdurl || item.url}" alt="${item.title}" class="modal-image" />`;
  } else if (item.media_type === "video") {
    mediaHTML = `
      <div class="modal-video-link">
        <p>This APOD entry is a video.</p>
        <a href="${item.url}" target="_blank" class="video-btn">▶ Watch Video</a>
      </div>
    `;
  } else {
    mediaHTML = `
      <div class="modal-video-link">
        <p>This media type is not supported for preview.</p>
      </div>
    `;
  }

  modalBody.innerHTML = `
    <h2>${item.title}</h2>
    <p><strong>Date:</strong> ${item.date}</p>
    ${mediaHTML}
    <p class="modal-explanation">${item.explanation}</p>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}
