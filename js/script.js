// Create IIFF for app
var pokemonRepository = (function () {
  // Pokemon repo
  var repository = [];

  /* Server side functions */

  // Adding pokemon to the repository

  /* External API */
  // 1 call for whole dump of Pokemon
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // fetching the pokemon payloads from the API call and storing the pokemon's name and URL
  function loadList() {
    return $.ajax(apiUrl, {
      dataType: 'json',
    })
      .then(function (responseJSON) {
        var payl = responseJSON.results;
        payl.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          // pushes pokemon to repository
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.log('Caught an error:' + e.statusText);
      })
      .then(function () {
        // Add event listener for searchbar that toggles class on or off if there is a match
        var searchInput = $('#searchbar');
        searchInput.on('keyup', function () {
          // grab the value of the input and make it all lowercase to match repo
          var value = $(this).val().toLowerCase();
          // create an array with all pokemon items and filters through, toggling if there is a match with indexOf(value)
          $('.list-group-item').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
          });
        });
      })
      .catch((e) => {
        console.log(`Caught an error: ${e.statusText}`);
      });
  }

  // load details of pokemon by calling the pokemon's URL specifically
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {
      dataType: 'json',
    })
      .then(function (responseJSON) {
        // Now we add the details to the item
        item.imageUrl = responseJSON.sprites.front_default;
        item.height = responseJSON.height;
        // loop through types
        item.types = '';
        responseJSON.types.forEach(function (result) {
          item.types += result.type.name + ' ';
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // Adding them to the internal repo
  function add(pokemon) {
    repository.push(pokemon);
  }

  // search for a Pokemon
  function search(nameSearch) {
    var result = repository.filter((word) => word.name === nameSearch);
    if (result.length > 0) {
      console.log('Here is your Pokemon:' + '<br>');
      return result;
    } else {
      return 'There is no Pokemon with that name in the repo';
    }
  }

  /* Client side functions */

  // Add pokemon as a button in an unordered list
  function addListItem(pokemon) {
    var newListItem = $(
      '<button class="list-group-item list-group-item-action list-group-item-dark" type="button" data-toggle="modal" sr-only="pokemon name" data-target="#pokemonModal">' +
        pokemon.name +
        '</button>'
    );
    $('.list-group').append(newListItem);
    $(newListItem).on('click', function () {
      showDetails(pokemon);
    });
  }

  // function to log details of pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      var bodyContent =
        'Height: ' +
        '\n' +
        pokemon.height +
        '\n' +
        'Types: ' +
        pokemon.types +
        '\n';
      showModal(pokemon.name, bodyContent, pokemon.imageUrl);
      hideLoadingMessage();
    });
  }

  // loading icon function
  function showLoadingMessage() {
    // target loading class
    var loading = $('.loading-message-class');
    // Add CSS style to show loading message
    loading.addClass('shown');
  }

  function hideLoadingMessage() {
    // target loading class
    var loading = $('.loading-message-class');
    // wait 2 seconds for visual's sake
    setTimeout(function () {
      // Add CSS style to hide loading message
      loading.removeClass('shown');
    }, 500);
  }

  // Modal //
  function showModal(title, text, url) {
    // How to empty????
    // $("#pokemonModal .modal-content").empty();
    $('#pokemonModal .modal-title').text(title);
    $('#pokemonModal .modal-text').text(text);
    $('#pokemonModal .modal-body img').attr('src', url);
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
    hideLoadingMessage: hideLoadingMessage,
  };
})();

pokemonRepository.showLoadingMessage();
// Creating list of Pokemon and then load them to page
pokemonRepository.loadList().then(function () {
  pokemonRepository.getALL().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
