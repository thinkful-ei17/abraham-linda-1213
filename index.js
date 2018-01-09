'use strict';
/* global $*/

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = { //default store is empty array
  videos: [],
  searchTerm: null,
  nextPageToken: null,
};


function renderResult(result) {
  console.log('3 - renderResult - I take the API returned data and render to HTML');
  return `
    <div>
      <p> ${result.printTitle} </p>
      <a href=""></a><img data-embedlink=${result.embedLink} class="js-result-thumbnail" src="${result.displayThumbnailUrl}" alt="image" height="${result.displayThumbnailHeight}" width="${result.displayThumbnailWidth}">
      <a href="https://www.youtube.com/channel/${result.channelId}" target="_blank">See more at ${result.channelTitle}</a>
    </div>
  `;
}

//default first result to display, switch once other thumbnails selected
function generateEmbededVideo(embedLink){
  console.log('4 - generateEmbededVideo - I generate a placeholder HTML for the enlarged video');
  $('.embeded-video-player').html(`<iframe src="http://www.youtube.com/embed/${embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`);
}

function handleThumbClicked(){
  $('.js-search-results').on('click', '.js-result-thumbnail', function(event){
    const embedLink = $(event.currentTarget).attr('data-embedlink');
    generateEmbededVideo(embedLink);
  });
  console.log('Feature - handleThumbClicked - listen for click event on thumbnail, main/enlarged video swaps out to display clicked thumbnail');
}


function getVideosFromApi(searchTerm, callback){
  const query = {
    'key': 'AIzaSyBrIixEdZ-49tfK_8J4aaCqLs_XF4573bw', //need to get new key, then run localhost server
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': searchTerm,
    'type': 'video'
  };
  store.searchTerm = searchTerm;
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  console.log('2 - getVideosFromApi - I fetch the data from API');
}

function getNextVideosFromApi(callback){
  const query = {
    'key': 'AIzaSyAOb9qrCtfeiKEDIGu2UU0QSsWf6AhshDk', //need to get new key, then run localhost server
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': store.searchTerm,
    'type': 'video',
    'pageToken': store.nextPageToken
  };

  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  console.log('Extension - 7 - getNextVideosFromApi - I fetch the data from API for next videos');
}


  
function displayYoutubeSearchData(data) {
  store.prevPageToken = store.nextPageToken;
  store.nextPageToken = data.nextPageToken;
 // store.prevPageToken = ('prevPageToken' in data ? data.prevPageToken : null);

  store.videos = []; //returns back to empty array
  data.items.forEach((item, index) => { //push array object for each result returned
    store.videos.push(
      { printTitle : item.snippet.title,
        displayThumbnailUrl : item.snippet.thumbnails.default.url,
        displayThumbnailWidth : item.snippet.thumbnails.default.width,
        displayThumbnailHeight : item.snippet.thumbnails.default.height,
        embedLink :  item.id.videoId,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId
      }
    );
  }
  );

  const results = store.videos.map(item => renderResult(item));

  $('.js-search-results').html(results);
  generateEmbededVideo(store.videos[0].embedLink); //default embeded video with first search result, before any thumbnails clicked
  // Check to see if there are additional pages and only render if true
  // if nextPageToken is null -- check docs
  $('.js-search-results').append('<button type="button" class="next-button">Next</button>');
  console.log('5 - displayYoutubeSearchData - the STORE changes here, I display the search results, default the first result to display to enlarged video and added Next button');
}

function handleNextButtonClicked(){
  $('.js-search-results').on('click', '.next-button', function(event){
    console.log('Extension - 6 - handleNextButtonClicked - click event listen and initialize getNextVideosFromApi using displayYoutubeSearchData');
    event.preventDefault();
    getNextVideosFromApi(displayYoutubeSearchData);
  });
}

function watchSubmit() { //starts
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val('');
    getVideosFromApi(query, displayYoutubeSearchData);
  });

  handleThumbClicked();
  handleNextButtonClicked();
  console.log('1 - watchSubmit - kicked it off on page load, listening for submit click event and initialize getVideosFromApi using query and displayYoutubeSearchData');
}

$(watchSubmit);