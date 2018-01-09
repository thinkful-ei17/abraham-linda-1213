'use strict';
/* global $*/

//Note: get new google youtube API key to obtain response and run on localhost
//Note: This application is an example of using jQuery AJAX library vs. Fetch API library - distint diff, have other types as well.

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = { //start at default store with empty array
  videos: [],
  searchTerm: null,
  nextPageToken: null,
};

//general rule of thumb (grot) - organize code by grouping of business logic (ie core functionality, (ex api, parsing response and render); event handlers; data ; helper functions (ex. capitalize)

//general tip (gt) - write down script - common questions - question and response; job desc and requirements (answer each req with example or future improv/progress)

function handleWatchSubmit() { //starts
  console.log('1 - handleWatchSubmit - kicked off application on page load, listening for submit click event and initialize getVideosFromApi using query and call back function parseYoutubeSearchData');

  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val(''); // clear out the input
    getVideosFromApi(query, parseYoutubeSearchData);
  });

  handleThumbClicked();
  handleNextButtonClicked();

  //NEW EXTENSION - START
  handlePrevButtonClicked();
  //NEW EXTENSION - END

}

function getVideosFromApi(searchTerm, callback){
  console.log('2 - getVideosFromApi - get the JSON data from API');
  const query = {//query built to specification of Youtube API
    'key': 'AIzaSyBrIixEdZ-49tfK_8J4aaCqLs_XF4573bw', //need to get new key, then run localhost server
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': searchTerm,
    'type': 'video'
  };
  store.searchTerm = searchTerm;
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback); //hitting that URL
  
  //get JSON data at/from this URL sending this query.
  //callback is just how its handled (success case and/or unsuccessful cases)
  //callback is really just as if you copied a function (mini program) here
  //ie. when you get this 'response' (better term b/c can be success or unsuccessful vs. 'data' (success term only)) back) 
  //call this function 
  
}

function getNextVideosFromApi(callback){
  console.log('Extension - Option 7b (get) - getNextVideosFromApi - I get the data from API for next videos');
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
}

//NEW EXTENSION - START
function getPrevVideosFromApi(callback){
  console.log('Extension - Option 8b (get) - getPrevVideosFromApi - I get the data from API for previous videos');
  const query = {
    'key': 'AIzaSyAOb9qrCtfeiKEDIGu2UU0QSsWf6AhshDk', //need to get new key, then run localhost server
    'maxResults': '4',
    'safeSearch':'strict',
    'part': 'snippet',
    'q': store.searchTerm,
    'type': 'video',
    'pageToken': store.prevPageToken 
  };

  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

//NEW EXTENSION - END


function parseYoutubeSearchData(data) {  //getting it ready to display, ex. parseResponse, parseYoutubeData
  console.log('3 - parseYoutubeSearchData - the STORE changes here, I parse the search results, default the first result to parse to enlarged video and added Next button');
  console.log('data in parseYoutubeSearchData is', data);
  store.prevPageToken = store.nextPageToken;
  //console.log('first store.prevPageToken', store.prevPageToken);
  store.nextPageToken = data.nextPageToken;
  //console.log('first store.nextPageToken', store.nextPageToken);
  //store.prevPageToken = ('nextPageToken' in data ? data.nextPageToken : null); //NEW EXTENSION
  //console.log('second store.prevPageToken', store.prevPageToken);

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

  console.log('store in parseYoutubeSearchData is', store.videos);

  const results = store.videos.map(item => renderResult(item));

  $('.js-search-results').html(results);
  renderEmbededVideo(store.videos[0].embedLink); //default embeded video with first search result, before any thumbnails clicked

  // Check to see if there are additional pages and only render if true
  // if nextPageToken is null -- check docs
  $('.js-search-results').append('<button type="button" class="next-button">Next</button>');

  //NEW EXTENSION - START
  // if(store.prevPageToken !== null){
  //   $('.js-search-results').append('<button type="button" class="prev-button">Previous</button>'); 
  // }
  //NEW EXTENSION - END
}

function renderResult(result) {
  console.log('4 - renderResult - I render the parsed API returned response/data to HTML');
  return `
    <div>
      <p> ${result.printTitle} </p>
      <a href=""></a><img data-embedlink=${result.embedLink} class="js-result-thumbnail" src="${result.displayThumbnailUrl}" alt="image" height="${result.displayThumbnailHeight}" width="${result.displayThumbnailWidth}">
      <a href="https://www.youtube.com/channel/${result.channelId}" target="_blank">See more at ${result.channelTitle}</a>
    </div>
  `;
}


function renderEmbededVideo(embedLink){ //change name of function to render or display
  console.log('5 - renderEmbededVideo - I render the enlarged video to HTML');
  $('.embeded-video-player').html(`<iframe src="http://www.youtube.com/embed/${embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`);
}

//event handler at top or bottom
function handleThumbClicked(){ 
  $('.js-search-results').on('click', '.js-result-thumbnail', function(event){
    console.log('Extension - option 6 - handleThumbClicked - listen for click event on thumbnail, main/enlarged video swaps out to display clicked thumbnail');
    const embedLink = $(event.currentTarget).attr('data-embedlink');
    renderEmbededVideo(embedLink);
  });
 
}

function handleNextButtonClicked(){
  $('.js-search-results').on('click', '.next-button', function(event){
    console.log('Extension - option 7a (handle) - handleNextButtonClicked - click event listen and initialize getNextVideosFromApi using displayYoutubeSearchData');
    event.preventDefault();
    getNextVideosFromApi(parseYoutubeSearchData);
    
  });
}

//NEW EXTENSION - START
function handlePrevButtonClicked(){
  $('js-search-results').on('click', '.prev-button', function(event) {
    console.log('Extension - option 8a (handle) - handlePrevButtonClicked - click even listen and initialize getPrevVideosFromApi using parseYoutubeSearchData');
    event.preventDefault();
    getPrevVideosFromApi(parseYoutubeSearchData);
  });
}

//NEW EXTENSION - END

$(handleWatchSubmit);