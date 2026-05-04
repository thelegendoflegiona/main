const events = [
  {
    title: "Genesis Era",
    date: "Dec 2021",
    description: "The Legend of Legiona was created.",
    type: "discovery",
    characters: ["Founder"]
  },
  {
    title: "Exploration Age",
    date: "Feb 2023",
    description: "Ender Dragon defeated after heavy losses.",
    type: "war",
    characters: ["Faiz", "Dyno"]
  },
  {
    title: "Rise of Civilization",
    date: "Mar 2023",
    description: "Base construction and farms begin.",
    type: "politics",
    characters: ["Faiz", "Ikan"]
  },
  {
    title: "Expansion",
    date: "Mar 2023",
    description: "New members join. Identity confusion begins.",
    type: "politics",
    characters: ["Ikan", "Iman"]
  },
  {
    title: "Political Conflict",
    date: "May 2023",
    description: "PPTL faction forms. Power struggle begins.",
    type: "politics",
    characters: ["Faiz", "Dyno", "Ultra"]
  },
  {
    title: "Sabotage Arc",
    date: "May 2023",
    description: "Secret griefing and hidden operations.",
    type: "betrayal",
    characters: ["Faiz", "Ikan"]
  },
  {
    title: "Dark Experiments",
    date: "May 2023",
    description: "Warden weaponization and sculk infection plans.",
    type: "war",
    characters: ["Dyno"]
  }
];

const timeline = document.getElementById("timeline");

events.forEach(event => {
  const div = document.createElement("div");
  div.classList.add("event", event.type);

  div.innerHTML = `
    <h2>${event.title}</h2>
    <div class="date">${event.date}</div>
    <div class="description">${event.description}</div>
    <div class="characters">
      ${event.characters.map(c => `<span class="character">${c}</span>`).join("")}
    </div>
  `;

  timeline.appendChild(div);
});

// Scroll animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".event").forEach(el => observer.observe(el));
