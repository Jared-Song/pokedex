let allTypes = {};

async function displayPokemonInfo(id) {
  if (!pokemonList[id - 1].fetched) {
    await fetchPokemon(id);
  }
  if (window.innerWidth > 1100) {
    slideOutSelectedPokemon();

    setTimeout(function () {
      fetchPokemonInfo(id);
    }, 350);
  } else {
    fetchPokemonInfo(id);
  }
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
    let abilityName = formatString(abilityObj.ability.name);
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
      title=${formatString(weakness)}
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

function renderNeighbours(id) {
  const leftId = (id + maxIndex - 1) % maxIndex || maxIndex;
  const rightId = (id + 1) % maxIndex || maxIndex;

  const leftButton = document.getElementById("left-button");
  leftButton.setAttribute(
    "onClick",
    "javascript: " + "displayPokemonInfo(" + leftId + ")"
  );
  document.getElementById("left-neighbour-name").innerHTML = formatString(
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
  document.getElementById("right-neighbour-name").innerHTML = formatString(
    pokemonList[rightId - 1].name
  );
  document.getElementById("right-neighbour-id").innerHTML = "#" + rightId;
  document.getElementById("right-neighbour-sprite").src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" +
    rightId +
    ".gif";
}

function renderStaticInfo(id) {
  document.getElementById("selected-pokemon-info").classList.remove("hide");
  document.getElementById("selected-pokemon-sprite").src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
    id +
    ".png";

  document.getElementById("selected-pokemon-id").innerHTML = "#" + id;
}

function renderPokemonInfo(pokemon) {
  renderEvolutionChain(pokemon.evolution_chain_url);
  document.getElementById("selected-pokemon-name").innerHTML = formatString(
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
  setupResponsiveBackground(pokemon.types);
}

async function fetchPokemonInfo(id) {
  const pokemon = pokemonList[id - 1];
  await renderNeighbours(id);
  await renderStaticInfo(id);
  await renderPokemonInfo(pokemon);
  slideInSelectedPokemon();
  if (window.innerWidth < 1100) {
    openPokemonResponsiveInfo();
  }
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
      } else if (evolDetails[0] === "min-happiness") {
        evolMethod = evolDetails[1] + " Happiness";
      } else {
        evolMethod = formatString(evolDetails[0]);
      }
      chainHtml += `<div class="selected-pokemon-evolution-trigger bold font-size-12">`;

      if (evolDetails[0] === "use-item") {
        evolMethod = formatString(evolDetails[1]);
        let url = evolDetails[2];
        let resp = await fetch(url);
        let json = await resp.json();
        chainHtml += `<img
          class="selected-pokemon-evolution-item"
          src=${json.sprites.default}
          title="${evolMethod}"
        />`;
      } else {
        chainHtml += evolMethod;
      }
      chainHtml += `</div>`;
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
    const id = chain.species.url
      .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
      .replace("/", "");
    if (id > maxIndex) {
      break; // to avoid errors with cross-gen evolutions
    }
    let evolution_details = chain?.evolves_to[0]?.evolution_details[0];
    let evolution_info = [];

    if (evolution_details?.trigger?.name !== undefined) {
      let trigger = evolution_details.trigger.name;
      if (evolution_details.min_happiness) {
        trigger = "min-happiness";
      }
      evolution_info.push(trigger);
      if (trigger === "level-up") {
        evolution_info.push(evolution_details.min_level);
      } else if (trigger === "use-item") {
        evolution_info.push(evolution_details.item.name);
        evolution_info.push(evolution_details.item.url);
      } else if (trigger === "min-happiness") {
        evolution_info.push(evolution_details.min_happiness);
      }
    }
    evolutionArr.push([id, evolution_info]);
    chain = chain.evolves_to[0];
  }
  return evolutionArr;
}
