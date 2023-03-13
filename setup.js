const POKEAPI = "https://pokeapi.co/api/v2/pokemon/";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";
let pokemonList = [];
let renderedList = [];
let renderedPokemon = 0;
const maxIndex = 649;
let numAvailable = 20; // num pokemon to be rendered
let numRendered = 0; // index of visible pokemon

async function setup() {
  await getAllPokemon();
  await setupTypes();
  loadingCompletion();
}

async function getAllPokemon() {
  let url = POKEAPI + "?limit=" + maxIndex;
  let resp = await fetch(url);
  let respJson = await resp.json();
  for (let i = 0; i < respJson.results.length; i++) {
    pokemonList.push({
      id: i + 1,
      name: respJson.results[i].name,
      types: [],
      species: "",
      flavour_text: "",
      height: "",
      weight: "",
      stats: [],
      base_exp: 0,
      evolution_chain_url: "",
      fetched: false,
    });
  }
  await setupPokemon();
  setupOtherPokemon();
}

async function fetchPokemon(id) {
  let url = pokemonUrl + id;
  let pokemonResp = await fetch(url);
  let pokemonJson = await pokemonResp.json();

  let pokemon = pokemonList[id - 1];

  pokemon.abilities = pokemonJson.abilities;
  pokemon.height = pokemonJson.height;
  pokemon.weight = pokemonJson.weight;
  pokemon.base_exp = pokemonJson.base_experience;
  pokemon.stats = pokemonJson.stats;

  let species = speciesUrl + id;
  let speciesResp = await fetch(species);
  let speciesJson = await speciesResp.json();

  pokemon.species = speciesJson.genera["7"].genus;

  flavour_text_entries = speciesJson.flavor_text_entries;
  // could eventually have multiple FT for each pokemon
  flavour_text_entries.forEach((entry) => {
    if (entry.language.name == "en") {
      pokemon.flavour_text = cleanFlavourText(entry.flavor_text);
    }
  });
  pokemon.evolution_chain_url = speciesJson.evolution_chain.url;
  pokemon.fetched = true;
}

async function setupPokemon() {
  let progress = 0;
  for (let i = 1; i <= 20; i++) {
    await fetchPokemon(i);
    progress += 80 / 20;
    updateProgressBar(progress);
  }
}

async function setupOtherPokemon() {
  for (let i = 21; i <= maxIndex; i++) {
    fetchPokemon(i);
  }
}

function updateProgressBar(value) {
  document.querySelector(".progress-bar-fill").style.width = value + "%";
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

async function setupTypes() {
  const urlAllTypes = "https://pokeapi.co/api/v2/type";
  const allTypesResponse = await fetch(urlAllTypes);
  const allTypesObj = await allTypesResponse.json();
  let progress = 80; 
  for (const type of allTypesObj.results) {
    await setupType(type);
    progress += 20 / allTypesObj.results.length;
    updateProgressBar(progress);
  }
}

async function setupType(typeObj) {
  const urlType = typeObj.url;
  const typeResponse = await fetch(urlType);
  const type = await typeResponse.json();

  const doubleDamageFrom = type.damage_relations.double_damage_from;
  const halfDamageFrom = type.damage_relations.half_damage_from;
  let dbl_dmg = [];
  let half_dmg = [];
  doubleDamageFrom.forEach((obj) => {
    dbl_dmg.push(obj.name);
  });
  halfDamageFrom.forEach((obj) => {
    half_dmg.push(obj.name);
  });

  allTypes[type.name] = [dbl_dmg, half_dmg];

  type.pokemon.forEach((pokemonType) => {
    const pokemonId = pokemonType.pokemon.url
      .replace("https://pokeapi.co/api/v2/pokemon/", "")
      .replace("/", "");

    if (pokemonList[pokemonId - 1]) {
      pokemonList[pokemonId - 1].types[pokemonType.slot - 1] = type.name;
    }
  });
}

function search() {
  setTimeout(function () {
    let results = [];
    let input = document.getElementById("search-input").value.toLowerCase();
    for (let i = 0; i < pokemonList.length; i++) {
      if (pokemonList[i].name) {
        if (pokemonList[i].name.replaceAll("-", " ").includes(input)) {
          results.push(pokemonList[i]);
        }
      }
    }

    document.getElementById("pokedex-list-render-container").innerHTML = "";

    renderedList = results;
    renderedPokemon = 0;
    numRendered = 0;
    increaseNumAvailable(30);
    renderPokedex();
  }, 1);
}

async function renderPokedexPokemon(id) {
  if (renderedList[id].id) {
    const renderContainer = document.getElementById(
      "pokedex-list-render-container"
    );

    renderContainer.innerHTML += `<div onclick="displayPokemonInfo(${
      renderedList[id].id
    })" class="pokemon-render-result-container container center column"
        onMouseOver="${setPokemonBorderMouseOver(renderedList[id].types)}"
        onMouseOut="${setPokemonBorderMouseOut(renderedList[id].types.length)}"
      >
      <div class="pokedex-sprite-container">
        <img class="pokedex-sprite" src="${
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" +
          renderedList[id].id +
          ".gif" // needs to be changed when special forms are considered
        }">
      </div>
      <span class="bold font-size-12">N°${renderedList[id].id}</span>
      <h3>${formatString(renderedList[id].name)}</h3>
      ${renderPokedexPokemonTypes(renderedList[id].types)}
    </div>`;

    numRendered += 1;
    renderPokedex();
  }
}

function setPokemonBorderMouseOut(length) {
  if (length == 1) {
    return "this.style.border='2px solid white'";
  }
  return "this.style.borderImage='linear-gradient(#FFFFFF, #FFFFFF) 1'";
}

function setPokemonBorderMouseOver(types) {
  if (types.length == 1) {
    return (
      "this.style.border='2px solid " + pokemonTypeInfo[types[0]].colour + "'"
    );
  }
  return (
    "this.style.borderImage='linear-gradient(90deg," +
    pokemonTypeInfo[types[0]].colour +
    "," +
    pokemonTypeInfo[types[1]].colour +
    ") 1'"
  );
}

function renderPokedexPokemonTypes(types) {
  let html = '<div class="row">';
  types.forEach((type) => {
    html += `
      <div class="pokemon-type-container" 
        style="background: ${pokemonTypeInfo[type].colour}; 
               border: 2px solid ${pokemonTypeInfo[type].border};"
      >
        <h3>${type.toUpperCase()}</h3>             
      </div>`;
  });

  return html + "</div>";
}

const pokemonTypeInfo = {
  normal: { colour: "#A8A878", border: "#6D6D4E", icon: "#A0A29F" },
  fire: { colour: "#F08030", border: "#9C531F", icon: "#FBA54C" },
  water: { colour: "#6890F0", border: "#445E9C", icon: "#539DDF" },
  electric: { colour: "#F8D030", border: "#A1871F", icon: "#F2D94E" },
  grass: { colour: "#78C850", border: "#4E8234", icon: "#5FBD58" },
  ice: { colour: "#98D8D8", border: "#638D8D", icon: "#75D0C1" },
  fighting: { colour: "#C03028", border: "#7D1F1A", icon: "#D3425F" },
  poison: { colour: "#A040A0", border: "#682A68", icon: "#B763CF" },
  ground: { colour: "#E0C068", border: "#927D44", icon: "#DA7C4D" },
  flying: { colour: "#A890F0", border: "#6D5E9C", icon: "#A1BBEC" },
  psychic: { colour: "#F85888", border: "#A13959", icon: "#FA8581" },
  bug: { colour: "#A8B820", border: "#6D7815", icon: "#92BC2C" },
  rock: { colour: "#B8A038", border: "#786824", icon: "#C9BB8A" },
  ghost: { colour: "#705898", border: "#493963", icon: "#5F6DBC" },
  dragon: { colour: "#7038F8", border: "#4924A1", icon: "#0C69C8" },
  dark: { colour: "#705848", border: "#49392F", icon: "#595761" },
  steel: { colour: "#B8B8D0", border: "#787887", icon: "#5695A3" },
  fairy: { colour: "#EE99AC", border: "#9B6470", icon: "#EE90E6" },
};

function loadingCompletion() {
  const loadingDiv = document.getElementById("loading-div");
  loadingDiv.classList.add("hideLoading");

  setTimeout(function () {
    loadingDiv.classList.replace("hideLoading", "hide");
    document.body.style.overflow = "unset";
  }, 500);

  renderedList = pokemonList;

  renderPokedex();
}

window.addEventListener("scroll", function () {
  addNewScrollPokemon();
});

function renderPokedex() {
  if (numRendered < numAvailable) {
    renderPokedexPokemon(numRendered);
  }
}

function addNewScrollPokemon() {
  if (
    window.scrollY + 100 >=
    document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  ) {
    increaseNumAvailable(20);
    renderPokedex();
  }
}

function increaseNumAvailable(num) {
  if (numAvailable + num <= renderedList.length) {
    numAvailable += num;
  } else {
    numAvailable = renderedList.length;
  }
}
