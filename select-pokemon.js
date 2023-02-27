let allTypes = {};
const maxIndex = 1008; // gen 9 goes up to miraidon - 1008 but spirtes not supported by pokeAPI yet
const pokemonApi = "https://pokeapi.co/api/v2/pokemon/";

function displayPokemonInfo(id) {
  if (window.innerWidth > 1100) {
    slideOutSelectedPokemon();

    setTimeout(function () {
      fetchPokemonInfo(id);
    }, 350);
  } else {
    fetchPokemonInfo(id);
  }
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

async function renderAbilities(abilitiesObj) {
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

async function renderWeaknesses(weaknesses) {
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

function renderStats(stats) {
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

async function renderNeighbours(id) {
  const leftId = (id + maxIndex - 1) % maxIndex || maxIndex;
  const rightId = (id + 1) % maxIndex;

  const leftPokemonResponse = await fetch(pokemonApi + leftId);
  const leftPokemon = await leftPokemonResponse.json();
  const rightPokemonResponse = await fetch(pokemonApi + rightId);
  const rightPokemon = await rightPokemonResponse.json();
  // console.log(leftPokemon);
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

async function fetchPokemonInfo(id) {
  const urlPokemon = pokemonApi + id;
  const pokemonResponse = await fetch(urlPokemon);
  const pokemon = await pokemonResponse.json();

  const urlPokemonSpecies = pokemon.species.url;
  const pokemonSpeciesResponse = await fetch(urlPokemonSpecies);
  const species = await pokemonSpeciesResponse.json();

  const pokemonName = titleCase(pokemon.name);
  document.getElementById("selected-pokemon-info").classList.remove("hide");
  // rendering elements
  document.getElementById("selected-pokemon-sprite").src =
    pokemon.sprites.other["official-artwork"].front_default;
  document.getElementById("selected-pokemon-id").innerHTML = "#" + id;
  document.getElementById("selected-pokemon-name").innerHTML =
    titleCase(pokemonName);
  document.getElementById("selected-pokemon-title").innerHTML =
    species.genera["7"].genus;

  renderPokemonTypes(pokemon.types);
  renderAbilities(pokemon.abilities);

  document.getElementById("selected-pokemon-flavour-text").innerHTML =
    cleanFlavourText(species.flavor_text_entries["1"].flavor_text);

  document.getElementById("selected-pokemon-height").innerHTML =
    pokemon.height / 10 + "m";

  document.getElementById("selected-pokemon-weight").innerHTML =
    pokemon.weight / 10 + "kg";

  renderWeaknesses(getTypeWeaknesses(pokemon.types));

  document.getElementById("selected-pokemon-base-exp").innerHTML =
    pokemon.base_experience;
  renderStats(pokemon.stats);
  renderEvolutionChain(species);
  renderNeighbours(id);
  setupResponsiveBackground(pokemon);
  slideInSelectedPokemon();
  if (window.innerWidth < 1100) {
    openPokemonResponsiveInfo();
  }
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

async function renderEvolutionChain(species) {
  let chainHtml = "";
  const evolutionArr = await getEvolutionChain(species);
  // console.log(evolutionArr);
  for (const evolution of evolutionArr) {
    const evolDetails = evolution[1];
    chainHtml += `<img class="selected-pokemon-evolution-sprite"
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution[0]}.png">
      </div>`;
    if (evolDetails[0] === "level-up") {
      chainHtml += `<div class="selected-pokemon-evolution-level-container bold">${
        "Lv. " + evolDetails[1]
      } </div>`;
    }
  }
  document.getElementById(`selected-pokemon-evolution-chain`).innerHTML =
    chainHtml;
}

async function getEvolutionChain(species) {
  const urlEvolutionChain = species.evolution_chain.url;
  const evolutionChainResponse = await fetch(urlEvolutionChain);
  const evolutionChain = await evolutionChainResponse.json();

  let evolutionArr = [];
  let chain = evolutionChain.chain;

  while (chain) {
    // console.log(chain);
    let evolution_details = chain?.evolves_to[0]?.evolution_details[0];
    let evolution_info = [];

    if (evolution_details?.trigger?.name !== undefined) {
      evolution_info.push(evolution_details.trigger.name);
      if (evolution_details.trigger.name === "level-up") {
        evolution_info.push(evolution_details.min_level);
      } else if (evolution_details.trigger.name === "use-item") {
        evolution_info.push(evolution_details.item.name);
      }
    }
    evolutionArr.push([
      chain.species.url
        .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
        .replace("/", ""),
      evolution_info,
    ]);
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

function slideInSelectedPokemon() {
  document.getElementById("selected-pokemon-placeholder").classList.add("hide");
  document
    .getElementById("selected-pokemon-container")
    .classList.add("slide-in");
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("slide-out");
}

function slideOutSelectedPokemon() {
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("slide-in");

  document
    .getElementById("selected-pokemon-container")
    .classList.add("slide-out");
}

function setupResponsiveBackground(pokemon) {
  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.background = pokemonTypeInfo[pokemon.types[0].type.name].colour;
}

function openPokemonResponsiveInfo() {
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("hide");
  document.getElementById("selected-pokemon-container").style.display = "flex";
  document
    .getElementById("selected-pokemon-responsive-close")
    .classList.remove("hide");

  document
    .getElementById("selected-pokemon-responsive-background")
    .classList.remove("hide");

  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.opacity = 0;
  setTimeout(function () {
    document.getElementById(
      "selected-pokemon-responsive-background"
    ).style.opacity = 1;
  }, 20);

  document.getElementsByTagName("html")[0].style.overflow = "hidden";
}

function closePokemonInfo() {
  setTimeout(function () {
    document.getElementById("selected-pokemon-container").classList.add("hide");
    document
      .getElementById("selected-pokemon-responsive-close")
      .classList.add("hide");

    document
      .getElementById("selected-pokemon-responsive-background")
      .classList.add("hide");
  }, 350);

  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.opacity = 1;
  setTimeout(function () {
    document.getElementById(
      "selected-pokemon-responsive-background"
    ).style.opacity = 0;
  }, 10);

  document.getElementsByTagName("html")[0].style.overflow = "unset";

  slideOutSelectedPokemon();
}

/**make selected pokemon container visible after resizing to < 1100px width && show scrollbar*/
window.addEventListener("resize", function () {
  if (
    document
      .getElementById("selected-pokemon-container")
      .classList.contains("slide-out")
  ) {
    document
      .getElementById("selected-pokemon-container")
      .classList.replace("slide-out", "slide-in");
  }

  if (window.innerWidth > 1100) {
    document.getElementsByTagName("html")[0].style.overflow = "unset";
  }
});
