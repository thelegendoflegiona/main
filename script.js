const events = [
  {
    title: "Genesis Era",
    date: "Dec 2021",
    description: "The world of Legiona is born.",
    type: "discovery"
  },
  {
    title: "Ender Dragon War",
    date: "Feb 2023",
    description: "First major battle. Heavy losses, but victory achieved.",
    type: "war"
  },
  {
    title: "Rise of TheLoL",
    date: "Mar 2023",
    description: "Civilization begins. Base construction starts.",
    type: "politics"
  },
  {
    title: "PPTL Formation",
    date: "May 2023",
    description: "A secret faction emerges: the traitors.",
    type: "betrayal"
  },
  {
    title: "Sabotage Operations",
    date: "May 2023",
    description: "Griefing, deception, and hidden warfare.",
    type: "betrayal"
  },
  {
    title: "Warden Experiment",
    date: "May 2023",
    description: "Biological warfare begins with Warden weaponization.",
    type: "war"
  }
];

const timeline = document.getElementById("timeline");

function render(eventsList) {
  timeline.innerHTML = "";

  eventsList.forEach(e => {
    const div = document.createElement("div");
    div.className = `event ${e.type}`;

    div.innerHTML = `
      <h3>${e.title}</h3>
      <div class="date">${e.date}</div>
      <p>${e.description.substring(0, 60)}...</p>
    `;

    div.onclick = () => openModal(e);

    timeline.appendChild(div);
  });
}

function openModal(e) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-title").innerText = e.title;
  document.getElementById("modal-date").innerText = e.date;
  document.getElementById("modal-desc").innerText = e.description;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function filterEvents(type) {
  if (type === "all") return render(events);
  render(events.filter(e => e.type === type));
}

// initial render
render(events);
