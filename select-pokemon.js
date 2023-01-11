let allTypes = {};

function displayPokemonInfo(id) {
  // document.getElementById('current-pokemon-unselected').classList.add('hide');
  fetchPokemonInfo(id);
  // renderPokemonInfo(id);
}

async function setupTypes() {
  const urlAllTypes = "https://pokeapi.co/api/v2/type";
  const allTypesResponse = await fetch(urlAllTypes);
  const allTypes = await allTypesResponse.json();
  allTypes["results"].forEach(async (type) => {
    setupType(type);
  });
}

async function setupType(typeObj) {
  let urlType = typeObj["url"];
  let typeResponse = await fetch(urlType);
  let type = await typeResponse.json();
  let double_dmg_from = type["damage_relations"]["double_damage_from"];
  let half_dmg_from = type["damage_relations"]["half_damage_from"];
  allTypes[typeObj["name"]] = [double_dmg_from, half_dmg_from];
}

async function fetchPokemonInfo(id) {
  const urlPokemon = "https://pokeapi.co/api/v2/pokemon/" + id;
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
  console.log(pokemon.sprites.other["official-artwork"]["front_default"]);
  console.log("#" + id);
  let pokemonName = pokemon.name;
  console.log(pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1));
  console.log(species.genera["7"]["genus"]);
  console.log(species.flavor_text_entries["0"]["flavor_text"]);
  console.log(
    "ability:",
    pokemon.abilities["0"]["ability"]["name"],
    ",is_hidden?:",
    pokemon.abilities["0"]["is_hidden"]
  );
  console.log(
    "ability:",
    pokemon.abilities["1"]["ability"]["name"],
    ",is_hidden?:",
    pokemon.abilities["1"]["is_hidden"]
  );
  console.log("height:", pokemon.height / 10, "m");
  console.log("weight:", pokemon.weight / 10, "kg");
  console.log("weaknesses:", getTypeWeaknesses(pokemon.types));
  console.log("exp:", pokemon.base_experience);
  console.log("stats:", getStats(pokemon.stats));
  console.log("evolution chain: ", getEvolutionChain(pokemon));
}

function getEvolutionChain(pokemon) {
  return "test";
}

function getStats(stats) {
  let statArr = {};
  let total = 0;
  stats.forEach((stat) => {
    total += stat["base_stat"];
    statArr[stat["stat"]["name"]] = stat["base_stat"];
  });
  statArr["total"] = total;
  return statArr;
}

function getTypeWeaknesses(types) {
  let dbl_damage_from = new Set();
  let half_dmg_from = new Set();
  types.forEach((type) => {
    [dbl_dmg, half_dmg] = allTypes[type["type"]["name"]];
    dbl_dmg.forEach((dbl_dmg_type) => {
      dbl_damage_from.add(dbl_dmg_type["name"]);
    });
    half_dmg.forEach((half_dmg_type) => {
      half_dmg_from.add(half_dmg_type["name"]);
    });
  });
  for (const elem of half_dmg_from) {
    dbl_damage_from.delete(elem);
  }
  return dbl_damage_from;
}
