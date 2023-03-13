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

function slideInSelectedPokemon() {
  document.getElementById("selected-pokemon-placeholder").classList.add("hide");
  document
    .getElementById("selected-pokemon-container")
    .classList.add("slide-in");
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("slide-out");
}

function slideOutSelectedPokemon() {
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("slide-in");

  document
    .getElementById("selected-pokemon-container")
    .classList.add("slide-out");
}

function setupResponsiveBackground(types) {
  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.background = pokemonTypeInfo[types[0]].colour;
}

function openPokemonResponsiveInfo() {
  document
    .getElementById("selected-pokemon-container")
    .classList.remove("hide");
  document.getElementById("selected-pokemon-container").style.display = "flex";
  document
    .getElementById("selected-pokemon-responsive-close")
    .classList.remove("hide");

  document
    .getElementById("selected-pokemon-responsive-background")
    .classList.remove("hide");

  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.opacity = 0;
  setTimeout(function () {
    document.getElementById(
      "selected-pokemon-responsive-background"
    ).style.opacity = 1;
  }, 20);

  document.getElementsByTagName("html")[0].style.overflow = "hidden";
}

function closePokemonInfo() {
  setTimeout(function () {
    document.getElementById("selected-pokemon-container").classList.add("hide");
    document
      .getElementById("selected-pokemon-responsive-close")
      .classList.add("hide");

    document
      .getElementById("selected-pokemon-responsive-background")
      .classList.add("hide");
  }, 350);

  document.getElementById(
    "selected-pokemon-responsive-background"
  ).style.opacity = 1;
  setTimeout(function () {
    document.getElementById(
      "selected-pokemon-responsive-background"
    ).style.opacity = 0;
  }, 10);

  document.getElementsByTagName("html")[0].style.overflow = "unset";

  slideOutSelectedPokemon();
}

window.addEventListener("resize", function () {
  if (
    document
      .getElementById("selected-pokemon-container")
      .classList.contains("slide-out")
  ) {
    document
      .getElementById("selected-pokemon-container")
      .classList.replace("slide-out", "slide-in");
  }

  if (window.innerWidth > 1100) {
    document.getElementsByTagName("html")[0].style.overflow = "unset";
  }
});
