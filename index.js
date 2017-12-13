'use strict';
/* global $*/

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = {
  videos: []
}


function renderResult(result) {

  return `
    <div>
      <p> ${result.printTitle} </p>
      <img class="js-result-thumbnail" src="${result.displayThumbnailUrl}" alt="image" height="${result.displayThumbnailHeight}" width="${result.displayThumbnailWidth}">
    </div>
  `;
}


function generateEmbededVideo(){
 return `<iframe src="http://www.youtube.com/embed/${embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`
}

function handleThumbClicked(){
  $('.js-search-results').on('click', '.js-result-thumbnail', function(){
  console.log('A thumbnail was clicked');
  });
}


function getVideosFromApi(searchTerm, callback){
  const query = {
    'key': 'AIzaSyA7d_pPgxIQP-QxDzHnkK3SBq_nOQOV3Wk',
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': `${searchTerm}`,
    'type': 'string'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

  
function displayYoutubeSearchData(data) {
  if (store.videos.length >= 4) store.videos = [];

  const results = data.items.map((item, index) => {
    store.videos.push(
      { printTitle : item.snippet.title,
        displayThumbnailUrl : item.snippet.thumbnails.default.url,
        displayThumbnailWidth : item.snippet.thumbnails.default.width,
        displayThumbnailHeight : item.snippet.thumbnails.default.height,
        embedLink :  item.id.videoId
      }
    );
  }
);

    store.videos.map(item => renderResult(item));

  $('.js-search-results').html(results);
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

  handleThumbClicked();
}

$(watchSubmit);