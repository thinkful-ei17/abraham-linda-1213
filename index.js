'use strict';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

/*
// Global variables for GoogleAuth object, auth status.
var GoogleAuth;

/**
   * Load the API's client and auth2 modules.
   * Call the initClient function after the modules load.
   * /
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes

  gapi.client.init({
    'clientId': 'REPLACE_ME',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    setSigninStatus();

    // Call handleAuthClick function when user clicks on "Authorize" button.
    $('#execute-request-button').click(function() {
      handleAuthClick(event);
    }); 
  });
}

function handleAuthClick(event) {
  // Sign user in after click on auth button.
  GoogleAuth.signIn();
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get();
  isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
  // Toggle button text and displayed statement based on current auth status.
  if (isAuthorized) {
    defineRequest();
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}

function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    }
    }
  return resource;
}

function removeEmptyParams(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

function executeRequest(request) {
  request.execute(function(response) {
    console.log(response);
  });
}

function buildApiRequest(requestMethod, path, params, properties) {
  params = removeEmptyParams(params);
  var request;
  if (properties) {
    var resource = createResource(properties);
    request = gapi.client.request({
      'body': resource,
      'method': requestMethod,
      'path': path,
      'params': params
    });
  } else {
    request = gapi.client.request({
      'method': requestMethod,
      'path': path,
      'params': params
    });
  }
  executeRequest(request);
}

*/



function renderResult(result) {
  let printTitle = result.snippet.title;
  let displayThumbnailUrl = result.snippet.thumbnails.default.url;
  let displayThumbnailWidth = result.snippet.thumbnails.default.width;
  let displayThumbnailHeight = result.snippet.thumbnails.default.height;
  let embedLink = displayThumbnailHeight = result.id.videoID;
  return `
    <div>
      <p> ${printTitle} </p>
      <iframe src="http://www.youtube.com/embed/${embedLink}"
      width="560" height="315" frameborder="0" allowfullscreen></iframe>
      <img class="js-result-thumbnail" src="${displayThumbnailUrl}" alt="image" height="${displayThumbnailHeight}" width="${displayThumbnailWidth}">
    </div>
  `;
}


function getVideosFromApi(searchTerm, callback){
  const query = {
    'key': 'AIzaSyA3MLZQz9_qUiSL6qM-zKL6igf6KxR6ckA',
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': `${searchTerm}`,
    'type': 'string'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

  
function displayYoutubeSearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  console.log(data);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val('');
    getVideosFromApi(query, displayYoutubeSearchData);
  });
}

$(watchSubmit);