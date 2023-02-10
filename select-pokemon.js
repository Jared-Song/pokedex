let allTypes = {};
const maxIndex = 1008; // miraidon
const pokemonApi = "https://pokeapi.co/api/v2/pokemon/";

function displayPokemonInfo(id) {
  // document.getElementById('current-pokemon-unselected').classList.add('hide');
  fetchPokemonInfo(id);
  // renderPokemonInfo(id);
}

async function setupTypes() {
  const urlAllTypes = "https://pokeapi.co/api/v2/type";
  const allTypesResponse = await fetch(urlAllTypes);
  const allTypes = await allTypesResponse.json();
  allTypes.results.forEach(async (type) => {
    setupType(type);
  });
}

async function setupType(typeObj) {
  let urlType = typeObj.url;
  let typeResponse = await fetch(urlType);
  let type = await typeResponse.json();
  let double_dmg_from = type.damage_relations.double_damage_from;
  let half_dmg_from = type.damage_relations.half_damage_from;
  allTypes[typeObj.name] = [double_dmg_from, half_dmg_from];
}

async function fetchPokemonInfo(id) {
  const urlPokemon = pokemonApi + id;
  const urlPokemonSpecies = "https://pokeapi.co/api/v2/pokemon-species/" + id;
  const pokemonResponse = await fetch(urlPokemon);
  const pokemonSpeciesResponse = await fetch(urlPokemonSpecies);
  const pokemon = await pokemonResponse.json();
  const species = await pokemonSpeciesResponse.json();

  console.log("pokemon");
  console.log(pokemon);
  console.log("species:");
  console.log(species);

  // img (static), gender
  // number
  // name
  // title
  // types
  // pokedex entry
  // abilities
  // height, weight
  // weaknesses, base exp
  // stats: hp, atk, def, spA, spD, speed, total
  // evolution chain
  // prev / next pokemon
  console.log("POKEMON INFO:");
  console.log(pokemon.sprites.other["official-artwork"].front_default);
  console.log("#" + id);
  let pokemonName = pokemon.name;
  console.log(pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1));
  console.log(species.genera["7"].genus);
  console.log(species.flavor_text_entries["0"].flavor_text);
  console.log(
    "ability:",
    pokemon.abilities["0"].ability.name,
    ",is_hidden?:",
    pokemon.abilities["0"].is_hidden
  );
  console.log(
    "ability:",
    pokemon.abilities["1"].ability.name,
    ",is_hidden?:",
    pokemon.abilities["1"].is_hidden
  );
  console.log("height:", pokemon.height / 10, "m");
  console.log("weight:", pokemon.weight / 10, "kg");
  console.log("weaknesses:", getTypeWeaknesses(pokemon.types));
  console.log("exp:", pokemon.base_experience);
  console.log("stats:", getStats(pokemon.stats));
  console.log("evolution chain: ", await getEvolutionChain(species));
  console.log("next/prev pokemons: ", await getNeighbourPokemons(id));
}

async function getEvolutionChain(species) {
  const urlEvolutionChain = species.evolution_chain.url;
  const evolutionChainResponse = await fetch(urlEvolutionChain);
  const evolutionChain = await evolutionChainResponse.json();
  let chain = evolutionChain.chain;
  let evolutionArr = [chain.species.name];
  // console.log(chain);
  while (chain.evolves_to.length > 0) {
    chain = chain.evolves_to["0"];
    evolutionArr.push(chain.species.name);
  }
  return evolutionArr;
}

async function getNeighbourPokemons(id) {
  neighbourIds = [
    (id + maxIndex - 1) % maxIndex || maxIndex, // left id
    (id + 1) % maxIndex, // right id
  ];

  let neighbours = [];
  neighbourIds.forEach(async (neighbourId) => {
    let neighbourResponse = await fetch(pokemonApi + neighbourId);
    let neighbourPokemon = await neighbourResponse.json();
    neighbours.push([
      neighbourId,
      neighbourPokemon.name,
      neighbourPokemon.sprites.versions["generation-v"]["black-white"].animated
        .front_default,
    ]);
  });
  return neighbours;
}

function getStats(stats) {
  let statArr = {};
  let total = 0;
  stats.forEach((statObj) => {
    total += statObj.base_stat;
    statArr[statObj.stat.name] = statObj.base_stat;
  });
  statArr.total = total;
  return statArr;
}

function getTypeWeaknesses(types) {
  let dbl_damage_from = new Set();
  let half_dmg_from = new Set();
  types.forEach((typeObj) => {
    [dbl_dmg, half_dmg] = allTypes[typeObj.type.name];
    dbl_dmg.forEach((dbl_dmg_type) => {
      dbl_damage_from.add(dbl_dmg_type.name);
    });
    half_dmg.forEach((half_dmg_type) => {
      half_dmg_from.add(half_dmg_type.name);
    });
  });
  for (const elem of half_dmg_from) {
    dbl_damage_from.delete(elem);
  }
  return dbl_damage_from;
}
