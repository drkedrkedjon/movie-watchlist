const searchField = document.querySelector('#search-field');
const searchBtn = document.querySelector('#search-btn')
const mainContainer = document.querySelector('#main-container')
const cardAddBtn = document.querySelector('#card-add-btn')
const cardRemoveBtn = document.querySelector('#card-remove-btn')

// http://www.omdbapi.com/?i=tt3896198&apikey=b4ee78c6
//  falta catch

searchBtn.addEventListener('click', searchMovies)

async function fetchData(searchInput, type) {
  const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=b4ee78c6&${type}=${searchInput}`)
  const data = await res.json()
  return data
}

function renderHTML(searchHTML) {
  mainContainer.innerHTML = searchHTML
}

function addEventsBtnDetail() {
  const allDetailsBtn = document.querySelectorAll('#card-details-btn')
  const btnArray = [...allDetailsBtn]
  btnArray.map(
    btn => btn.addEventListener('click', () => {
      fetchData(btn.dataset.title, 't')
      .then(data => console.log(data))
      // Hace falta seguir y render HTML en el main container
    }
    )
  )
  // console.log(btnArray[0].dataset.title)
}

function getSearchHTML(data) {
  const searchHTML = data.map(
    singleMovie => {
      return `
        <section class="search-card">
          <div>
            <div class="search-card-poster"><img src="${singleMovie.Poster}" alt="Algo asi"></div>
          </div>
          <div class="search-card-meta">
            <button id="card-details-btn" class="search-card-btn" data-title="${singleMovie.Title}" >Get details ...</button>
            <h2>${singleMovie.Title}</h2>
            <p><span>${singleMovie.Type}</span> (<span>${singleMovie.Year}</span>)</p>
          </div>
        </section>
      `
    }
    ).join('')
    renderHTML(searchHTML)
    addEventsBtnDetail()
  }
  
  function searchMovies() {
    const searchInput = searchField.value
    fetchData(searchInput, 's')
    .then(data => getSearchHTML(data.Search))
}