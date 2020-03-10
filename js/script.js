// Create IIFF for app
var pokemonRepository = (function() {
  // Pokemon repo
  var repository = [];

  /* External API */
  // 1 call for whole dump of Pokemon
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // fetching the pokemon payloads from the API call

  function loadList() {
    return $.ajax(apiUrl, {
      dataType: "json"
    })
      .then(function(responseJSON) {
        var payl = responseJSON.results;
        payl.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          // pushes pokemon to repository
          add(pokemon);
        });
      })
      .catch(function(err) {
        console.log("Caught an error:" + err.statusText);
      });
  }

  // load details of pokemon
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {
      dataType: "json"
    })
      .then(function(responseJSON) {
        // Now we add the details to the item
        item.imageUrl = responseJSON.sprites.front_default;
        item.height = responseJSON.height;
        // loop through types
        item.types = "";
        responseJSON.types.forEach(function(result) {
          console.log(result.type.name);
          item.types += result.type.name + " ";
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // Adding them to the internal repo
  function add(pokemon) {
    repository.push(pokemon);
  }

  /*
    Client side functions
    */

  // function that displays pokemon as buttons on the page
  function addListItem(pokemon) {
    var $listItem = $("<li></li>");
    var $button = $(
      '<button class="customButton">' + pokemon.name + "</button>"
    );
    // Add button to li item
    $listItem.append($button);
    // Add list element to the DOM via the ul parent
    $newList.append($listItem);
    // Add event listener to button element
    $button.on("click", () => {
      showLoadingMessage();
      showDetails(pokemon);
    });
  }

  // function to log details of pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      var bodyContent =
        "Height: " +
        "\n" +
        pokemon.height +
        "\n" +
        "Types: " +
        pokemon.types +
        "\n";
      showModal(pokemon.name, bodyContent, pokemon.imageUrl);
      hideLoadingMessage();
    });
  }

  // loading icon function

  function showLoadingMessage() {
    // target loading class
    var $loading = $(".loading-message-class");
    // Add CSS style to show loading message
    $loading.addClass("shown");
  }

  function hideLoadingMessage() {
    // target loading class
    var $loading = $(".loading-message-class");
    // wait 2 seconds for visual's sake
    setTimeout(function() {
      // Add CSS style to hide loading message
      $loading.removeClass("shown");
    }, 500);
  }

  // Modal //
  // grab modal container
  var $modalContainer = $("#modal-container");

  function showModal(title, text, url) {
    //Clear all existing modal content
    $modalContainer.empty();
    // create new modal
    var modal = $('<div class="modal"></div>');

    // Add new modal content
    // button
    var closeButtonElement = $(
      '<button class="modal-close">' + "close" + "</button>"
    );
    // close modal
    closeButtonElement.on("click", hideModal);

    // title
    var titleElement = $("<h1>" + title + "</h1>");
    // wrap body content in a div
    var bodyWrapper = $('<div class="body-element"></div>');
    // paragraph element
    var contentElement = $('<p class="modal-p">' + text + "</p>");

    // img
    var imgWrapper = $('<div class="img-element"></div>');
    var imgElement = $("<img>");
    imgElement.attr("src", url);

    // attach to DOM
    bodyWrapper.append(closeButtonElement);
    bodyWrapper.append(titleElement);
    bodyWrapper.append(contentElement);
    imgWrapper.append(imgElement);
    modal.append(bodyWrapper);
    modal.append(imgWrapper);
    $modalContainer.append(modal);

    // add class to show element
    $modalContainer.addClass("is-visible");
  }

  // hide modal
  function hideModal() {
    // grab modal (parent element)
    $modalContainer.removeClass("is-visible");
  }
  // closing modal with esc button
  $(window).on("keydown", e => {
    if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });

  $modalContainer.on("click", e => {
    // listens to clicks on container
    var $target = e.target;
    if ($target === $modalContainer) {
      hideModal();
    }
  });

  /* 
    Server side function
    */

  // Adding pokemon to the repository

  // search for a Pokemon
  function search(nameSearch) {
    var result = repository.filter(word => word.name === nameSearch);
    if (result.length > 0) {
      console.log("Here is your Pokemon:" + "<br>");
      // return the complete object of the relative Pokemon
      Object.keys(result[0]).forEach(function(property) {
        console.log("<br>" + property + ": " + result[0][property]);
      });
      return "There's a match!";
    } else {
      return "There is no Pokemon with that name in the repo";
    }
  }

  // return complete repository

  function getALL() {
    return repository;
  }

  // return public methods in IIFE object

  return {
    getALL: getALL,
    loadList: loadList,
    add: add,
    search: search,
    addListItem: addListItem,
    showDetails: showDetails,
    showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage
  };
})();

var $newList = $("ul");
pokemonRepository.showLoadingMessage();
// Creating list of Pokemon and then load them to page
pokemonRepository.loadList().then(function() {
  pokemonRepository.getALL().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
