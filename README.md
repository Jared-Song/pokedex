# Pokedex

- [Live](https://jared-song-pokedex.vercel.app/)
- [PokeAPI](https://pokeapi.co/)
- [Design](https://dribbble.com/shots/15128634-Pokemon-Pokedex-Website-Redesign-Concept/attachments/6864101?mode=media)
- [Colour Codes](https://bulbapedia.bulbagarden.net/wiki/Category:Type_color_templates)
- [Type Icons](https://github.com/duiker101/pokemon-type-svg-icons)

## Features:

- Shows pokemon information up to #649 of the National Pokedex (Generation V - Black/White)
- Renders Pokemon Sprites (animated) and information from the PokeAPI such as:
  - National Pokedex Number
  - Name
  - Species
  - Type
  - Flavour Text
  - Abilities
  - Height
  - Weight
  - Weaknesses
  - Base Experience
  - Stats (HP, ATK, DEF, SpA, SpD, SPD)
  - Evolution Chain and Triggers
- Allows navigation between neighbouring pokemon on the pokedex

## TO-DO:

- Refactoring css/js
- Consider move type [immunity](https://pokemon-archive.fandom.com/wiki/Move_Immunity_Abilities) for pokemon weaknesses e.g. Solrock, Lanturn
- Adding unique forms for special pokemon: shaymin, deoxys, keldeo, rotom, giratina (487), wormadom etc.
- Improve evolution chain for multiple path evolutions such as Eevee
- checkout species.varieties --> special forms start at pokemonId 10001, pikachu sinnoh cap id 10096
- Investigate different forms/varieties of pokemon, discuessed [here](https://github.com/PokeAPI/pokeapi/issues/401), full list [here](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_with_form_differences)
- Add more pokemon:
  - gen 5: 694 - Genesect - sprites not provided after this id
  - gen 8: 905 - Enamorus
  - gen 9: 1010 - Iron Leaves - current max
- Improve rendering time: allow fetch on demand to match uncached server speed
