let selected = Array(32).fill(false);
const requiredCount = 8;

fetch("data/traits.json")
  .then(res => res.json())
  .then(traits => {
    renderTraits(traits);
    updateOutput();
  });

function renderTraits(traits) {
  const container = document.getElementById("traits-container");
  container.innerHTML = "";

  traits.forEach((trait, i) => {
    const div = document.createElement("div");
    div.className = "trait";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `trait-${i}`;
    input.dataset.index = i;

    input.addEventListener("change", () => {
      selected[i] = input.checked;
      enforceTraitLimit();
      updateOutput();
    });

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = `[${trait.layer}] ${trait.name}`;

    div.appendChild(input);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function enforceTraitLimit() {
  const count = selected.filter(Boolean).length;
  document.getElementById("count-warning").hidden = count <= requiredCount;
}

function updateOutput() {
  let binaryString = "";
  let hexParts = [];

  for (let i = 0; i < 32; i += 8) {
    const byte = selected.slice(i, i + 8).map(bit => bit ? '1' : '0').join('');
    binaryString += byte + " ";
    hexParts.push(parseInt(byte, 2).toString(16).padStart(2, '0').toUpperCase());
  }

  document.getElementById("binary-output").textContent = binaryString.trim();
  document.getElementById("hex-output").textContent = hexParts.join(" ");
}
