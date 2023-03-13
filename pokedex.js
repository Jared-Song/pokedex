function renderPokedex() {
  if (numRendered < numAvailable) {
    renderPokedexPokemon(numRendered);
  }
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
          onMouseOut="${setPokemonBorderMouseOut(
            renderedList[id].types.length
          )}"
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