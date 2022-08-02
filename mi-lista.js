const watchlistContainer = document.querySelector('#watchlist-container')

function loadWatchlistFromStorage() {
  const watchlist = window.localStorage.getItem('myWatchlist')
  console.log(JSON.parse(watchlist))
}

loadWatchlistFromStorage()