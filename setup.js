let totalPokemon = 0;
let pokemonIndex = 395;
let n = 5;
let url = "https://pokeapi.co/api/v2/pokemon/";

async function setup() {
  renderPokeballSearchIcon();
  setupTypesWeaknesses();
  let response = await fetch(url);
  let responseAsJson = await response.json();
  totalPokemon = responseAsJson.count;

  // for (let i = 1; i <= 10 + n; i++) {
  //   renderPokemon(i);
  // }

  for (i = pokemonIndex; i <= pokemonIndex + n; i++) {
    // pokemon id starts at 1
    renderPokemon(i);
  }
}

async function renderPokemon(id) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + id;
  let response = await fetch(url);
  let pokemon = await response.json();
  // console.log(pokemon);

  const renderContainer = document.getElementById(
    "pokedex-list-render-container"
  );

  renderContainer.innerHTML += `<div onclick = "displayPokemonInfo(${id})" class = "pokemon-render-result-container container center column"
      onMouseOver = "${setPokemonBorderMouseOver(pokemon.types)}"
      onMouseOut = "${setPokemonBorderMouseOut(pokemon.types.length)}"
    >
    <div class = "pokedex-sprite-container">
      <img class = "pokedex-sprite" src = "${
        pokemon.sprites.versions["generation-v"]["black-white"].animated[
          "front_default"
        ]
      }">
    </div>
    <span class = "bold font-size-12">N°${id}</span>
    <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
    ${renderPokemonTypes(pokemon.types)}
  </div>`;
}

function setPokemonBorderMouseOut(length) {
  if (length == 1) {
    return "this.style.border = '2px solid white'";
  }
  return "this.style.borderImage = 'linear-gradient(#FFFFFF, #FFFFFF) 1'";
}

function setPokemonBorderMouseOver(types) {
  if (types.length == 1) {
    return (
      "this.style.border = '2px solid " +
      pokemonTypeColours[types[0].type.name] +
      "'"
    );
  }
  return (
    "this.style.borderImage = 'linear-gradient(90deg," +
    pokemonTypeColours[types[0].type.name] +
    "," +
    pokemonTypeColours[types[1].type.name] +
    ") 1'"
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokeballSearchIcon() {
  const container = document.getElementById("start-search-button-container");

  container.innerHTML += `<img
    id="start-search-button-icon"
    src="resources/pokeball-search-icon.png"
  />`;
}

function renderPokemonTypes(types) {
  let html = '<div class="row">';

  types.forEach(({ type: { name } }) => {
    html += `
      <div class="pokemon-type-container" 
        style="background: ${pokemonTypeColours[name]}; 
               border: 2px solid ${pokemonTypeColours[name + "-border"]};"
      >
        <h3>${name.toUpperCase()}</h3>             
      </div>`;
  });

  return html + "</div>";
}

const pokemonTypeColours = {
  normal: "#A8A878",
  "normal-border": "#6D6D4E",
  fire: "#F08030",
  "fire-border": "#9C531F",
  water: "#6890F0",
  "water-border": "#445E9C",
  electric: "#F8D030",
  "electric-border": "#A1871F",
  grass: "#78C850",
  "grass-border": "#4E8234",
  ice: "#98D8D8",
  "ice-border": "#638D8D",
  fighting: "#C03028",
  "fighting-border": "#7D1F1A",
  poison: "#A040A0",
  "poison-border": "#682A68",
  ground: "#E0C068",
  "ground-border": "#927D44",
  flying: "#A890F0",
  "flying-border": "#6D5E9C",
  psychic: "#F85888",
  "psychic-border": "#A13959",
  bug: "#A8B820",
  "bug-border": "#6D7815",
  rock: "#B8A038",
  "rock-border": "#786824",
  ghost: "#705898",
  "ghost-border": "#493963",
  dragon: "#7038F8",
  "dragon-border": "#4924A1",
  dark: "#705848",
  "dark-border": "49392F",
  steel: "#B8B8D0",
  "steel-border": "#787887",
  fairy: "#EE99AC",
  "fairy-border": "#9B6470",
};
