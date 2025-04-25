let selected = Array(32).fill(false);
const requiredCount = 8;

// Canonical bitstring for comparison (example: binary for 8E 44 02 03)
const canonicalBits = [
  1,0,0,0,1,1,1,0,  // Physical
  0,1,0,0,0,1,0,0,  // Functional
  0,0,0,0,0,0,1,0,  // Abstract
  0,0,0,0,0,0,1,1   // Social
];

fetch("data/traits.json")
  .then(res => res.json())
  .then(traits => {
    renderTraits(traits);
    updateOutput();
  });

function renderTraits(traits) {
  traits.forEach((trait, i) => {
    const container = document.getElementById(`layer-${trait.layer}`);
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
    label.textContent = trait.name;

    div.appendChild(input);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function enforceTraitLimit() {
  const count = selected.filter(Boolean).length;
  document.getElementById("selected-count").textContent = count;
  document.getElementById("count-warning").hidden = count <= requiredCount;
}

function updateOutput() {
  let binaryString = "";
  let hexParts = [];
  let match = true;

  for (let i = 0; i < 32; i += 8) {
    const byte = selected.slice(i, i + 8).map(bit => bit ? '1' : '0').join('');
    binaryString += byte + " ";
    hexParts.push(parseInt(byte, 2).toString(16).padStart(2, '0').toUpperCase());
  }

  // Update output
  document.getElementById("binary-output").textContent = binaryString.trim();
  document.getElementById("hex-output").textContent = hexParts.join(" ");

  // Compare to canonical
  for (let i = 0; i < 32; i++) {
    if ((selected[i] ? 1 : 0) !== canonicalBits[i]) {
      match = false;
      break;
    }
  }

  document.getElementById("comparison-result").textContent =
    match ? "✅ Matches canonical encoding!" : "❌ Does not match canonical.";
}
