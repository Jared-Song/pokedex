// empoleon=395
// exeggcute=102 for type weakness testing (7)
// solrock=338 for type weakness testing (7)
// ^^ https://pokemon-archive.fandom.com/wiki/Move_Immunity_Abilities

// eevee=133 for item/evol testing
// gallade pokedex entry language is korean for some reason
// heatran sprite looks off

// shaymin, deoxys, keldeo, rotom, giratina (487), wormadom for unique names/forms
// -- checkout species.varieties --> special forms start at pokemonId 10001
// pikachu sinnh cap id 10096
// different forms/varieties of pokemon
// https://github.com/PokeAPI/pokeapi/issues/401
// https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_with_form_differences
const POKEAPI = "https://pokeapi.co/api/v2/pokemon/";
let pokemonList = [];
let renderedPokemon = 0;
const maxIndex = 905; // gen 8 goes up to 905 - Enamorus
// gen 9 goes up to miraidon - 1008 but spirtes not supported by pokeAPI yet
let numAvailable = 20; // num pokemon to be rendered
let numRendered = 1; // index of visible pokemon

async function setup() {
  getAllPokemon();
  setupTypesWeaknesses();
}

async function getAllPokemon() {
  let url = POKEAPI + "?limit=" + maxIndex;
  let resp = await fetch(url);
  let respJson = await resp.json();

  for (let i = 0; i < respJson.results.length; i++) {
    pokemonList.push({
      id: i,
      name: respJson.results[i].name,
    });
  }
  loadingCompletion();
}

function search() {
  setTimeout(function () {
    let search = document.getElementById("search-input").value.toLowerCase();
    console.log(search);
  }, 1);
}

async function renderPokedexPokemon(id) {
  if (pokemonList[id]) {
    let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/" + id;
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();

    const renderContainer = document.getElementById(
      "pokedex-list-render-container"
    );

    renderContainer.innerHTML += `<div onclick="displayPokemonInfo(${id})" class="pokemon-render-result-container container center column"
        onMouseOver="${setPokemonBorderMouseOver(pokemon.types)}"
        onMouseOut="${setPokemonBorderMouseOut(pokemon.types.length)}"
      >
      <div class="pokedex-sprite-container">
        <img class="pokedex-sprite" src="${
          pokemon.sprites.versions["generation-v"]["black-white"].animated[
            "front_default"
          ] // needs to be changed when special forms are considered
        }">
      </div>
      <span class="bold font-size-12">N°${id}</span>
      <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
      ${renderPokedexPokemonTypes(pokemon.types)}
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
      "this.style.border='2px solid " +
      pokemonTypeInfo[types[0].type.name].colour +
      "'"
    );
  }
  return (
    "this.style.borderImage='linear-gradient(90deg," +
    pokemonTypeInfo[types[0].type.name].colour +
    "," +
    pokemonTypeInfo[types[1].type.name].colour +
    ") 1'"
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokedexPokemonTypes(types) {
  let html = '<div class="row">';

  types.forEach(({ type: { name } }) => {
    html += `
      <div class="pokemon-type-container" 
        style="background: ${pokemonTypeInfo[name].colour}; 
               border: 2px solid ${pokemonTypeInfo[name].border};"
      >
        <h3>${name.toUpperCase()}</h3>             
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

  renderPokedex();
}

window.addEventListener("scroll", function () {
  addNewScrollPokemon();
});

function renderPokedex() {
  if (numRendered <= numAvailable) {
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
  if (numAvailable + num <= pokemonList.length) {
    numAvailable += num;
  } else {
    numAvailable = pokemonList.length;
  }
}
