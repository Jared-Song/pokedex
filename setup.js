let totalPokemon = 0;
let pokemonIndex = 10006;
// empoleon = 395
// exeggcute = 102 for type weakness testing (7)
// solrock = 338 for type weakness testing (7) 
// ^^ https://pokemon-archive.fandom.com/wiki/Move_Immunity_Abilities

// eevee = 133 for item/evol testing

// shaymin, deoxys, keldeo, rotom, giratina (487), wormadom for unique names/forms 
// -- checkout species.varieties giratina origin form is id 10007

// gallade pokedex entry language

// heatran sprite
let n = 5;
let url = "https://pokeapi.co/api/v2/pokemon/";

async function setup() {
  setupTypesWeaknesses();
  renderPokeballSearchIcon();
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
    ${renderPokedexPokemonTypes(pokemon.types)}
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
      pokemonTypeInfo[types[0].type.name].colour +
      "'"
    );
  }
  return (
    "this.style.borderImage = 'linear-gradient(90deg," +
    pokemonTypeInfo[types[0].type.name].colour +
    "," +
    pokemonTypeInfo[types[1].type.name].colour +
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
