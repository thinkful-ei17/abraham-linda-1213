'use strict';
/* global $*/

/* Application Note(s)
+ get new google youtube API key to obtain response and run on localhost
+ this application is an example of using jQuery AJAX library vs. Fetch API library - distint diff, have other types as well.
*/

/*Note(s)
+API - Application Programming Interface => specification for 2 systems to communicate (web API, handles HTTP/XML protocol requests)
1. Event Listener - waiting for user to do action and execute search on API
2. Fetch/Get Data/Response from API
3. Decorate/Parse Data/ADD to STORE - data becomes JS object
4. Render result

+ general rule of thumb (grot) - organize code by grouping of business logic (ie core functionality, (ex api, parsing response and render); event handlers; data ; helper functions (ex. capitalize)

+ grot - organize event handlers at top OR bottom

+ general tip (gt) - write down script - common questions - question and response; job desc and requirements (answer each req with example or future improv/progress)
*/

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const store = { //start at default store with empty array
  videos: [],
  searchTerm: null,
  nextPageToken: null,
  prevPageToken: null
};

/*-------------------------EVENT LISTENER  - START-------------------*/

//#1
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

/*-------------------------API-------------------*/

//#2
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

// Extension - Option 7b (get)
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

// Extension - Option 8b (get)
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


/*-------------------------DECORATE DATA-------------------*/

//#3
function parseYoutubeSearchData(data) {  //getting it ready to display, ex. parseResponse, parseYoutubeData
  console.log('3 - parseYoutubeSearchData - the STORE changes here, I parse the search results, default the first result to parse to enlarged video and added Next button');
  console.log('data in parseYoutubeSearchData is', data);
  console.log('first data.nextPageToken', data.nextPageToken);

  //store.nextPageToken = data.nextPageToken;
  //store.prevPageToken = store.nextPageToken;
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

  const results = store.videos.map(item => renderEachVideoResult(item)); //send each video to renderEachVideoResult

  $('.js-search-results').html(results);

  if (data.nextPageToken) { // Check to see if there are additional pages and only display if true 
    store.nextPageToken = data.nextPageToken;
    $('.js-search-results').append('<button type="button" class="next-button">Next</button>');
    console.log('next button added!!!!');
  }

  if(data.prevPageToken) { //Check to see if there is a prevPageToken and only display if true
    store.prevPageToken = data.prevPageToken;
    $('.js-search-results').append('<button type="button" class="prev-button">Previous</button>');
    console.log('previous button added!!!');
  }

  //$('.js-search-results').append('<button type="button" class="next-button">Next</button>');

  renderEmbededVideo(store.videos[0].embedLink); //default embeded video with first search result, before any thumbnails clicked

  
 

  //NEW EXTENSION - START
  // if(store.prevPageToken !== null){
  //   $('.js-search-results').append('<button type="button" class="prev-button">Previous</button>'); 
  // }
  //NEW EXTENSION - END
}

/*-------------------------RENDER/DISPLAY DATA-------------------*/

//#4
function renderEachVideoResult(result) {
  console.log('4 - renderEachVideoResult - I render the parsed API returned response/data to HTML');
  return `
    <div>
      <p> ${result.printTitle} </p>
      <a href=""></a><img data-embedlink=${result.embedLink} class="js-result-thumbnail" src="${result.displayThumbnailUrl}" alt="image" height="${result.displayThumbnailHeight}" width="${result.displayThumbnailWidth}">
      <a href="https://www.youtube.com/channel/${result.channelId}" target="_blank">See more at ${result.channelTitle}</a>
    </div>
  `;
}

//#5 or option 6b
function renderEmbededVideo(embedLink){ //change name of function to render or display
  console.log('5 (initial) or option 6b - renderEmbededVideo - I render the enlarged video to HTML');
  $('.embeded-video-player').html(`<iframe src="http://www.youtube.com/embed/${embedLink}"
  width="560" height="315" frameborder="0" allowfullscreen></iframe>`);
}

/*-------------------------EVENT HANDLERS-------------------*/

//Extension - Option 6a
function handleThumbClicked(){ 
  $('.js-search-results').on('click', '.js-result-thumbnail', function(event){
    console.log('Extension - option 6a - handleThumbClicked - listen for click event on thumbnail, main/enlarged video swaps out to display clicked thumbnail');
    const embedLink = $(event.currentTarget).attr('data-embedlink');
    renderEmbededVideo(embedLink);
  });
 
}

//Extension 7a
function handleNextButtonClicked(){
  $('.js-search-results').on('click', '.next-button', function(event){
    console.log('Extension - option 7a (handle) - handleNextButtonClicked - click event listen and initialize getNextVideosFromApi using displayYoutubeSearchData');
    event.preventDefault();
    getNextVideosFromApi(parseYoutubeSearchData);
    
  });
}

//Extension 8a
//NEW EXTENSION - START
function handlePrevButtonClicked(){
  $('js-search-results').on('click', '.prev-button', function(event) {
    console.log('Extension - option 8a (handle) - handlePrevButtonClicked - click event listen and initialize getPrevVideosFromApi using parseYoutubeSearchData');
    event.preventDefault();
    getPrevVideosFromApi(parseYoutubeSearchData);
  });
}

//NEW EXTENSION - END

/*-------------------------INITIALIZE-------------------*/

$(handleWatchSubmit);