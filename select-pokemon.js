let allTypes = {};
const maxIndex = 1008; // miraidon
const pokemonApi = "https://pokeapi.co/api/v2/pokemon/";

function displayPokemonInfo(id) {
  // document.getElementById('selected-pokemon-unselected').classList.add('hide');
  fetchPokemonInfo(id);
  // renderPokemonInfo(id);
}

async function setupTypesWeaknesses() {
  const urlAllTypes = "https://pokeapi.co/api/v2/type";
  const allTypesResponse = await fetch(urlAllTypes);
  const allTypesObj = await allTypesResponse.json();

  for (const type of allTypesObj.results) {
    await setupTypeWeaknesses(type);
  }
}

async function setupTypeWeaknesses(typeObj) {
  const urlType = typeObj.url;
  const typeResponse = await fetch(urlType);
  const type = await typeResponse.json();

  const doubleDamageFrom = type.damage_relations.double_damage_from;
  const halfDamageFrom = type.damage_relations.half_damage_from;

  allTypes[typeObj.name] = [doubleDamageFrom, halfDamageFrom];
}

function setPokemonTypes(typesObj) {
  return typesObj.map((typeObj) => typeObj.type.name);
}

function formatAbilityName(name) {
  // capitalises first letters and removes hyphens
  return name
    .replace(/\b\w/g, function (l) {
      return l.toUpperCase();
    })
    .replace(/-/g, " ");
}

function renderPokemonTypes(types) {
  const typesArr = types.map((type) => type.type.name);
  let typeHtml = `<div class="row center">`;
  typesArr.forEach((type) => {
    typeHtml += `<div class="pokemon-type-container" 
                  style="background: ${pokemonTypeInfo[type].colour}; 
                  border: 2px solid ${pokemonTypeInfo[type].border};">
                    <h3>${type.toUpperCase()}</h3>             
                  </div>
                `;
  });

  document.getElementById("selected-pokemon-types").innerHTML =
    typeHtml += `</div>`;
}

async function renderPokemonAbilities(abilitiesObj) {
  const element = document.getElementById("selected-pokemon-abilities");
  element.innerHTML = "";

  abilitiesObj.forEach((abilityObj) => {
    let abilityName = formatAbilityName(abilityObj.ability.name);
    const hiddenClass = abilityObj.is_hidden
      ? 'style="outline: 1px solid red"'
      : "";
    const iconHtml = abilityObj.is_hidden
      ? '<i class="fas fa-eye-slash"></i>'
      : "";

    element.innerHTML += `
      <div class="width-100 column center margin-5">
        <div class="pokemon-info-container" ${hiddenClass}>
          ${abilityName}
          ${iconHtml}             
        </div>
      </div>
    `;
  });
}

async function renderPokemonWeaknesses(weaknesses) {
  document.getElementById(`selected-pokemon-weaknesses`).innerHTML =
    weaknesses.size < 6
      ? `<div
          class="selected-pokemon-weakness-icon"
          style="background: #8f9396">
          2X
        </div>`
      : "";

  weaknesses.forEach((weakness) => {
    document.getElementById(`selected-pokemon-weaknesses`).innerHTML += `<img
      class="selected-pokemon-weakness-icon"
      src="resources/type-icons/${weakness}.svg"
      style="background: ${pokemonTypeInfo[weakness].icon};"
      title=${titleCase(weakness)}
    />`;
  });
}

function renderPokemonStats(stats) {
  let statArr = {};
  let total = 0;

  stats.forEach((statObj) => {
    total += statObj.base_stat;
    statArr[statObj.stat.name] = statObj.base_stat;
  });

  statArr.total = total;

  const statIds = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed",
    "total",
  ];
  statIds.forEach((statId) => {
    document.getElementById(`selected-pokemon-stats-${statId}`).innerHTML =
      statArr[statId];
  });
}

async function renderPokemonNeighbours(id) {
  const leftId = (id + maxIndex - 1) % maxIndex || maxIndex;
  const rightId = (id + 1) % maxIndex;

  const leftPokemonResponse = await fetch(pokemonApi + leftId);
  const leftPokemon = await leftPokemonResponse.json();
  const rightPokemonResponse = await fetch(pokemonApi + rightId);
  const rightPokemon = await rightPokemonResponse.json();

  const leftButton = document.getElementById("left-button");
  leftButton.setAttribute(
    "onClick",
    "javascript: " + "fetchPokemonInfo(" + leftId + ")"
  );
  document.getElementById("left-neighbour-name").innerHTML = titleCase(
    leftPokemon.name
  );
  document.getElementById("left-neighbour-id").innerHTML = "#" + leftId;
  document.getElementById("left-neighbour-sprite").src =
    leftPokemon.sprites.versions["generation-v"][
      "black-white"
    ].animated.front_default;

  const rightButton = document.getElementById("right-button");
  rightButton.setAttribute(
    "onClick",
    "javascript: " + "fetchPokemonInfo(" + rightId + ")"
  );
  document.getElementById("right-neighbour-name").innerHTML = titleCase(
    rightPokemon.name
  );
  document.getElementById("right-neighbour-id").innerHTML = "#" + rightId;
  document.getElementById("right-neighbour-sprite").src =
    rightPokemon.sprites.versions["generation-v"][
      "black-white"
    ].animated.front_default;
}

function fetchNeighbour(pokemon) {}

async function fetchPokemonInfo(id) {
  const urlPokemon = pokemonApi + id;
  const urlPokemonSpecies = "https://pokeapi.co/api/v2/pokemon-species/" + id;
  const pokemonResponse = await fetch(urlPokemon);
  const pokemonSpeciesResponse = await fetch(urlPokemonSpecies);
  const pokemon = await pokemonResponse.json();
  const species = await pokemonSpeciesResponse.json();

  const pokemonName = titleCase(pokemon.name);
  console.log("pokemon");
  console.log(pokemon);
  console.log("species:");
  console.log(species);

  console.log("POKEMON INFO:");
  console.log("evolution chain: ", await getEvolutionChain(species));

  // rendering elements
  document.getElementById("selected-pokemon-sprite").src =
    pokemon.sprites.other["official-artwork"].front_default;
  document.getElementById("selected-pokemon-id").innerHTML = "#" + id;
  document.getElementById("selected-pokemon-name").innerHTML =
    titleCase(pokemonName);
  document.getElementById("selected-pokemon-title").innerHTML =
    species.genera["7"].genus;

  renderPokemonTypes(pokemon.types);
  renderPokemonAbilities(pokemon.abilities);

  document.getElementById("selected-pokemon-flavour-text").innerHTML =
    cleanFlavourText(species.flavor_text_entries["1"].flavor_text);

  document.getElementById("selected-pokemon-height").innerHTML =
    pokemon.height / 10 + "m";

  document.getElementById("selected-pokemon-weight").innerHTML =
    pokemon.weight / 10 + "kg";

  renderPokemonWeaknesses(getTypeWeaknesses(pokemon.types));

  document.getElementById("selected-pokemon-base-exp").innerHTML =
    pokemon.base_experience;
  renderPokemonStats(pokemon.stats);
  renderPokemonNeighbours(id);
}

function cleanFlavourText(text) {
  // https://github.com/andreferreiradlw/pokestats/issues/41
  return text
    .replace("\f", "\n")
    .replace("\u00ad\n", "")
    .replace("\u00ad", "")
    .replace(" -\n", " - ")
    .replace("-\n", "-")
    .replace("\n", " ");
}

async function getEvolutionChain(species) {
  const urlEvolutionChain = species.evolution_chain.url;
  const evolutionChainResponse = await fetch(urlEvolutionChain);
  const evolutionChain = await evolutionChainResponse.json();

  let evolutionArr = [];
  let chain = evolutionChain.chain;

  while (chain) {
    evolutionArr.push(chain.species.name);
    chain = chain.evolves_to[0];
  }

  return evolutionArr;
}

function getTypeWeaknesses(types) {
  const dbl_damage_from = new Set();
  const half_damage_from = new Set();

  types.forEach((typeObj) => {
    const [double_damage, half_damage] = allTypes[typeObj.type.name];

    double_damage.forEach((type) => dbl_damage_from.add(type.name));
    half_damage.forEach((type) => half_damage_from.add(type.name));
  });

  for (const type of half_damage_from) {
    dbl_damage_from.delete(type);
  }

  return dbl_damage_from;
}

function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
