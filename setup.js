const POKE_API = "https://pokeapi.co/api/v2/pokemon/";
const SPECIES_API = "https://pokeapi.co/api/v2/pokemon-species/";
const TYPE_API = "https://pokeapi.co/api/v2/type/";
const maxIndex = 649;
const maxTypeIndex = 18;

let renderedList = [];
let renderedPokemon = 0;
let numAvailable = 20; // num pokemon to be rendered
let numRendered = 0; // index of visible pokemon
let pokemonList = Array(maxIndex);

async function setup() {
  await getAllPokemon();
  await setupTypes();
  loadingCompletion();
}

async function getAllPokemon() {
  let url = POKE_API + "?limit=" + maxIndex;
  let resp = await fetch(url);
  let respJson = await resp.json();
  for (let i = 0; i < respJson.results.length; i++) {
    pokemonList[i] = {
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
    };
  }
  setupPokemon();
}

async function fetchPokemon(id) {
  let url = POKE_API + id;
  let pokemonResp = await fetch(url);
  let pokemonJson = await pokemonResp.json();
  let species = SPECIES_API + id;

  let speciesResp = await fetch(species);
  let speciesJson = await speciesResp.json();
  let pokemon = pokemonList[id - 1];

  pokemon.abilities = pokemonJson.abilities;
  pokemon.height = pokemonJson.height;
  pokemon.weight = pokemonJson.weight;
  pokemon.base_exp = pokemonJson.base_experience;
  pokemon.stats = pokemonJson.stats;

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
  for (let i = 1; i <= maxIndex; i++) {
    await fetchPokemon(i);
  }
}

async function setupTypes() {
  let progress = 0;
  for (let i = 1; i <= maxTypeIndex; i++) {
    await setupType(i);
    progress += 100 / maxTypeIndex;
    updateProgressBar(progress);
  }
}

async function setupType(id) {
  const urlType = "https://pokeapi.co/api/v2/type/" + id;
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
