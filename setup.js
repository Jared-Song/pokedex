let totalPokemon = 0;
let pokemonIndex = 132;
let n = 5;
let url = "https://pokeapi.co/api/v2/pokemon/";

async function setup() {
  renderPokeballSearchIcon();
  setupTypes();
  let response = await fetch(url);
  let responseAsJson = await response.json();
  totalPokemon = responseAsJson.count;

  // for (let i = 1; i <= 10 + n; i++) {
  //   renderPokemon(i);
  // }

  for (let i = pokemonIndex; i <= pokemonIndex + n; i++) {
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

function renderPokemonTypes(types) {
  let retHtml = '<div class="row">';

  for (let i = 0; i < types.length; i++) {
    retHtml += `<div class="pokemon-type-container" 
                  style = "background: ${
                    pokemonTypeColours[types[i].type.name]
                  }; 
                  border: 2px solid ${
                    pokemonTypeColours[types[i].type.name + "-border"]
                  };"
                >
      <h3>${types[i].type.name.toUpperCase()}</h3>             
    </div>`;
  }
  return retHtml + "</div>";
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokeballSearchIcon() {
  const container = document.getElementById("start-search-button-container");

  container.innerHTML += `<svg
  id="start-search-button-icon"
  preserveAspectRatio="none"
  viewBox="0 0 1024 1024"
>
  <path
    id="pkmn-go-teamless"
    fill="#FFFFFF"
    stroke="none"
    stroke-width="1"
    d="M 512.00,96.80
       C 304.28,96.94 132.17,249.33 101.24,448.41
         101.24,448.41 312.51,448.80 312.51,448.80
         339.50,364.37 418.60,303.25 512.00,303.20
         605.25,303.31 684.24,364.33 711.33,448.61
         711.33,448.61 922.53,448.80 922.53,448.80
         891.82,249.60 719.75,97.06 512.00,96.80
         512.00,96.80 512.00,96.80 512.00,96.80 Z
       M 512.00,376.80
       C 436.89,376.80 376.00,437.69 376.00,512.80
         376.00,587.91 436.89,648.80 512.00,648.80
         512.00,648.80 512.00,648.80 512.00,648.80
         587.11,648.80 648.00,587.91 648.00,512.80
         648.00,512.80 648.00,512.80 648.00,512.80
         648.00,437.69 587.11,376.80 512.00,376.80
         512.00,376.80 512.00,376.80 512.00,376.80
         512.00,376.80 512.00,376.80 512.00,376.80 Z
       M 101.47,576.80
       C 132.18,776.00 304.25,928.54 512.00,928.80
         719.72,928.66 891.83,776.27 922.76,577.19
         922.76,577.19 711.49,576.80 711.49,576.80
         684.50,661.23 605.40,722.35 512.00,722.40
         418.75,722.29 339.76,661.27 312.67,576.99
         312.67,576.99 101.47,576.80 101.47,576.80
         101.47,576.80 101.47,576.80 101.47,576.80 Z"
  />
</svg>`;
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
