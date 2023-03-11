let allTypes = {};

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

function formatAbilityName(name) {
  // capitalises first letters and removes hyphens
  return name
    .replace(/\b\w/g, function (l) {
      return l.toUpperCase();
    })
    .replace(/-/g, " ");
}

function renderPokemonTypes(types) {
  let typeHtml = `<div class="row center">`;
  types.forEach((type) => {
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
  document.getElementById(`selected-pokemon-weaknesses`).innerHTML = `<div
    class="selected-pokemon-weakness-icon"
    style="background: #8f9396">
    2X
  </div>`;

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
  const rightId = (id + 1) % maxIndex || maxIndex;

  const leftButton = document.getElementById("left-button");
  leftButton.setAttribute(
    "onClick",
    "javascript: " + "displayPokemonInfo(" + leftId + ")"
  );
  document.getElementById("left-neighbour-name").innerHTML = titleCase(
    pokemonList[leftId - 1].name
  );

  document.getElementById("left-neighbour-id").innerHTML = "#" + leftId;
  document.getElementById("left-neighbour-sprite").src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" +
    leftId +
    ".gif";

  const rightButton = document.getElementById("right-button");
  rightButton.setAttribute(
    "onClick",
    "javascript: " + "displayPokemonInfo(" + rightId + ")"
  );
  document.getElementById("right-neighbour-name").innerHTML = titleCase(
    pokemonList[rightId - 1].name
  );
  document.getElementById("right-neighbour-id").innerHTML = "#" + rightId;
  document.getElementById("right-neighbour-sprite").src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" +
    rightId +
    ".gif";
}

async function fetchPokemonInfo(id) {
  const pokemon = pokemonList[id - 1];
  document.getElementById("selected-pokemon-info").classList.remove("hide");
  document.getElementById("selected-pokemon-sprite").src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
    id +
    ".png";

  document.getElementById("selected-pokemon-id").innerHTML = "#" + id;
  document.getElementById("selected-pokemon-name").innerHTML = titleCase(
    pokemon.name
  );
  document.getElementById("selected-pokemon-title").innerHTML = pokemon.species;

  renderPokemonTypes(pokemon.types);
  renderAbilities(pokemon.abilities);

  document.getElementById("selected-pokemon-flavour-text").innerHTML =
    pokemon.flavour_text;

  document.getElementById("selected-pokemon-height").innerHTML =
    pokemon.height / 10 + "m";

  document.getElementById("selected-pokemon-weight").innerHTML =
    pokemon.weight / 10 + "kg";

  renderWeaknesses(getTypeWeaknesses(pokemon.types));

  document.getElementById("selected-pokemon-base-exp").innerHTML =
    pokemon.base_exp;
  renderStats(pokemon.stats);
  renderEvolutionChain(pokemon.evolution_chain_url);
  renderNeighbours(id);
  setupResponsiveBackground(pokemon.types);
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

async function renderEvolutionChain(evolutionChainUrl) {
  let chainHtml = "";
  const evolutionArr = await getEvolutionChain(evolutionChainUrl);
  for (const evolution of evolutionArr) {
    const evolDetails = evolution[1];
    chainHtml += `<img onclick="displayPokemonInfo(${evolution[0]})" class="selected-pokemon-evolution-sprite"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution[0]}.png">
      </div>`;
    if (evolution !== evolutionArr[evolutionArr.length - 1]) {
      let evolMethod = "?";
      if (evolDetails[0] === "level-up") {
        evolMethod = "Lv. " + evolDetails[1];
      }
      chainHtml += `<div class="selected-pokemon-evolution-level-container bold font-size-12">${evolMethod} </div>`;
    }
  }
  document.getElementById(`selected-pokemon-evolution-chain`).innerHTML =
    chainHtml;
}

async function getEvolutionChain(chainUrl) {
  const evolutionChainResponse = await fetch(chainUrl);
  const evolutionChain = await evolutionChainResponse.json();

  let evolutionArr = [];
  let chain = evolutionChain.chain;

  while (chain) {
    // console.log(chain);
    const id = chain.species.url
      .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
      .replace("/", "");
    if (id > maxIndex) {
      break; // to avoid errors with cross-gen evolutions
    }
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
    evolutionArr.push([id, evolution_info]);
    chain = chain.evolves_to[0];
  }
  return evolutionArr;
}

function getTypeWeaknesses(types) {
  const dbl_damage_from = new Set();
  const half_damage_from = new Set();
  types.forEach((typeObj) => {
    const [double_damage, half_damage] = allTypes[typeObj];
    double_damage.forEach((type) => dbl_damage_from.add(type));
    half_damage.forEach((type) => half_damage_from.add(type));
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

function setupResponsiveBackground(types) {
  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.background = pokemonTypeInfo[types[0]].colour;
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
