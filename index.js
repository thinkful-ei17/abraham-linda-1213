'use strict';
/* global $*/

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = {
  videos: [],
  currentSelectedVideo: 0,
};


function renderResult(result) {
  return `
    <div>
      <p> ${result.printTitle} </p>
      <img class="js-result-thumbnail" src="${result.displayThumbnailUrl}" alt="image" height="${result.displayThumbnailHeight}" width="${result.displayThumbnailWidth}">
    </div>
  `;
}

//default first result to display, switch once other thumbnails selected
function generateEmbededVideo(){
  //let embedVideo = $('iframe').attr('src', imgSrc);
  console.log('generateEmbededVideo ran');
  $('.embeded-video-player').html(`<iframe src="http://www.youtube.com/embed/${store.videos[store.currentSelectedVideo].embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`);

  
}

function handleThumbClicked(){
  $('.js-search-results').on('click', '.js-result-thumbnail', function(event){
    const imgSrc = $(event.currentTarget).attr('src'); //current source of image
    
    //find in object
    //search for imagesource is same as imge source selected; replace index with clicked index
    
  //   const imgSrc = $(this).find('img').attr('src');  
  //   const imgAlt = $(this).find('img').attr('alt');
   
  //  $('.hero img').attr('src', imgSrc).attr('alt', imgAlt);


  console.log('A thumbnail was clicked');
  console.log(event.currentTarget);
  console.log('imgSrc is', imgSrc);
  ///use current image to look up store for current image existin; pass index to generate embedvideo

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

  data.items.forEach((item, index) => {
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

  const results = store.videos.map(item => renderResult(item));

  $('.js-search-results').html(results);
  generateEmbededVideo();
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