'use strict';
/* global $*/

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = { //default store is empty array
  videos: [],
};


function renderResult(result) {
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
  console.log('generateEmbededVideo ran');
  $('.embeded-video-player').html(`<iframe src="http://www.youtube.com/embed/${embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`);
}

function handleThumbClicked(){
  $('.js-search-results').on('click', '.js-result-thumbnail', function(event){
    const embedLink = $(event.currentTarget).attr('data-embedlink');
    generateEmbededVideo(embedLink);
  });
}


function getVideosFromApi(searchTerm, callback){
  const query = {
    'key': 'AIzaSyA7d_pPgxIQP-QxDzHnkK3SBq_nOQOV3Wk',
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': searchTerm,
    'type': 'video'
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

  
function displayYoutubeSearchData(data) {
  console.log(data);
  if (store.videos.length >= 4) store.videos = []; //returns back to empty array
  data.items.forEach((item, index) => { //push array object for each result returned
    store.videos.push(
      { printTitle : item.snippet.title,
        displayThumbnailUrl : item.snippet.thumbnails.default.url,
        displayThumbnailWidth : item.snippet.thumbnails.default.width,
        displayThumbnailHeight : item.snippet.thumbnails.default.height,
        embedLink :  item.id.videoId,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
      }
    );
  }
  );

  const results = store.videos.map(item => renderResult(item));

  $('.js-search-results').html(results);
  generateEmbededVideo(store.videos[0].embedLink); //default embeded video with first search result, before any thumbnails clicked
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

}

$(watchSubmit);