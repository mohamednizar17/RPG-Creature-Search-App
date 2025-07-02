const defaultCreatures = [
  {
    name: "Pyrolynx",
    id: "1",
    weight: 42,
    height: 32,
    types: ["fire"],
    stats: {
      hp: 65,
      attack: 80,
      defense: 50,
      "special-attack": 90,
      "special-defense": 55,
      speed: 100
    }
  },
  {
    name: "Aquoroc",
    id: "2",
    weight: 220,
    height: 53,
    types: ["water", "rock"],
    stats: {
      hp: 85,
      attack: 90,
      defense: 120,
      "special-attack": 60,
      "special-defense": 70,
      speed: 40
    }
  }
];

function getCreatures() {
  return JSON.parse(localStorage.getItem('creatures') || 'null') || defaultCreatures;
}
function saveCreatures(creatures) {
  localStorage.setItem('creatures', JSON.stringify(creatures));
}

function showFireAnim(show) {
  document.getElementById('fire-anim').style.display = show ? 'inline-block' : 'none';
  document.getElementById('creature-anim').innerHTML = show
    ? `<div class="fire"></div>`
    : '';
}

function showNotFoundAnim(show) {
  document.getElementById('not-found').classList.toggle('hidden', !show);
  document.getElementById('creature-info').classList.toggle('hidden', show);
  showFireAnim(false);
}

function clearInfo() {
  [
    'creature-name','creature-id','weight','height','types',
    'hp','attack','defense','special-attack','special-defense','speed'
  ].forEach(id => document.getElementById(id).textContent = '');
  document.getElementById('types').innerHTML = '';
  document.getElementById('creature-anim').innerHTML = '';
}

function showCreature(creature) {
  showNotFoundAnim(false);
  clearInfo();
  document.getElementById('creature-name').textContent = creature.name.toUpperCase();
  document.getElementById('creature-id').textContent = creature.id;
  document.getElementById('weight').textContent = creature.weight;
  document.getElementById('height').textContent = creature.height;
  document.getElementById('hp').textContent = creature.stats.hp;
  document.getElementById('attack').textContent = creature.stats.attack;
  document.getElementById('defense').textContent = creature.stats.defense;
  document.getElementById('special-attack').textContent = creature.stats['special-attack'];
  document.getElementById('special-defense').textContent = creature.stats['special-defense'];
  document.getElementById('speed').textContent = creature.stats.speed;
  const typesEl = document.getElementById('types');
  typesEl.innerHTML = '';
  let isFire = false;
  creature.types.forEach(type => {
    const span = document.createElement('span');
    span.className = 'type-badge type-' + type.toLowerCase();
    span.textContent = type.toUpperCase();
    typesEl.appendChild(span);
    if(type.toLowerCase() === 'fire') isFire = true;
  });
  showFireAnim(isFire);
}

document.getElementById('search-button').addEventListener('click', function() {
  const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
  const creatures = getCreatures();
  clearInfo();
  showFireAnim(false);
  if (!searchInput) return;
  const creature = creatures.find(
    c => c.name.toLowerCase() === searchInput || c.id === searchInput || c.id === String(Number(searchInput))
  );
  if (!creature) {
    showNotFoundAnim(true);
    return;
  }
  showCreature(creature);
});

document.getElementById('show-create').addEventListener('click', () => {
  document.getElementById('create-form').classList.remove('hidden');
  document.getElementById('creature-info').classList.add('hidden');
  document.getElementById('not-found').classList.add('hidden');
});

document.getElementById('cancel-create').addEventListener('click', () => {
  document.getElementById('create-form').reset();
  document.getElementById('create-form').classList.add('hidden');
  document.getElementById('creature-info').classList.remove('hidden');
});

document.getElementById('create-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const creatures = getCreatures();
  const newCreature = {
    name: document.getElementById('new-name').value,
    id: document.getElementById('new-id').value,
    weight: Number(document.getElementById('new-weight').value),
    height: Number(document.getElementById('new-height').value),
    types: document.getElementById('new-types').value.split(',').map(t=>t.trim().toLowerCase()),
    stats: {
      hp: Number(document.getElementById('new-hp').value),
      attack: Number(document.getElementById('new-attack').value),
      defense: Number(document.getElementById('new-defense').value),
      "special-attack": Number(document.getElementById('new-special-attack').value),
      "special-defense": Number(document.getElementById('new-special-defense').value),
      speed: Number(document.getElementById('new-speed').value)
    }
  };
  creatures.push(newCreature);
  saveCreatures(creatures);
  document.getElementById('create-form').reset();
  document.getElementById('create-form').classList.add('hidden');
  showCreature(newCreature);
  document.getElementById('creature-info').classList.remove('hidden');
});

// Enter key triggers search
document.getElementById('search-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('search-button').click();
});