
const quoteList = document.getElementById('quote-list')         // grab the HTML where all quotes are painted
const quoteForm = document.getElementById('new-quote-form')     // grab the HTML for the form (used for new and edit)
const body = document.querySelector('.container')               // grab the container so we are able to place the sort button

const url = `http://localhost:3000/quotes`                      // single url for DRY purposes
let quotes = []                                                 // upon first fetch this variable is populated


document.addEventListener("DOMContentLoaded", function(event) { // all actions take place after content loaded

  // fetch request for all quotes
  getQuotes(url)

  // listener for creatation of new quote, or edit of existing quote
  quoteForm.addEventListener('submit', e => {
    // prevent default submission
    e.preventDefault()

    // grab form values for quote and author
    let quote = e.target.quote.value
    let author = e.target.author.value

    // if we are creating a new quote fetch request to POST
    if (e.target.className === 'new-quote-form') {
      newQuote(url, quote, author)
    } else {
      // steps to edit an existing quote:
      // find the quote
      let foundquote = findQuote(e.target.dataset.id)

      // edit local varialbe to be albe optimistically edit the DOM
      foundquote.quote = quote
      foundquote.author = author

      //optimistically render to DOM
      quoteList.innerHTML = createHTML(quotes)

      // fectch to PATCH
      editQuote(url, e.target.dataset.id, quote, author)

      //reset form values to placeholders
      quoteForm.reset()
    } // end if statement
  }) // end form listener

  quoteList.addEventListener('click', e => {
    // if delete button clicked - fetch DELETE and optimistically remove from DOM
    if (e.target.className === 'btn-danger') {
      deleteQuote(url, e.target.dataset.id)
      e.target.parentElement.parentElement.remove()
    }

    // if like btn clicked optimistically increase like and fetch PATCH
    if (e.target.className === 'btn-success') {
      let foundquote = findQuote(e.target.dataset.id)
      foundquote.likes += 1
      quoteList.innerHTML = createHTML(quotes)
      increaseLike(url, e.target.dataset.id, foundquote)
    }

    // if edit clicked...
    if (e.target.className === 'btn-warning') {
      // find the quote to edit in local variable
      let foundquote = findQuote(e.target.dataset.id)

      // autoscroll to the form
      quoteForm.scrollIntoView();

      //change form class so the submit listener will know not creating a new quote
      quoteForm.id = 'edit-quote-form'

      // change text from New Quote to Edit for UX
      document.querySelector('.form-group').firstElementChild.innerText = "Edit Quote: "

      // Populate values with existing data
      document.querySelector('.form-control').value = foundquote.quote
      document.getElementById('author').value = foundquote.author

      // add data-id field to form so that that info can be captured for PATCH
      quoteForm.dataset.id = foundquote.id

    }
  })

  // listener for sort functionality
  body.addEventListener('click', e => {
    // only actionalbe when class matches the sort btn class
    if (e.target.className === 'btn btn-info') {

      // sort the local quotes variable based on author names
      const sorted = quotes.sort(function(a,b) {
        let nameA = a.author.toLowerCase()
        let nameB = b.author.toLowerCase()
          if (nameA < nameB) {
            return -1
          } else if (nameA > nameB){
            return 1
          }
            return 0 //default return value (no sorting)
      })
      // edit DOM based on sorted quotes by author
      quoteList.innerHTML = createHTML(sorted)
    }
  })
}) // end DOMContentLoaded


// --------------------- FETCH -------------------------------

// fetch request for geting all quotes the first time
function  getQuotes(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // sets local varialbe to hold all returned data
      quotes = data

      // renders pessimistically
      quoteList.innerHTML = createHTML(quotes)
    })
}

// fetch to POST a new quote
function newQuote(url, quote, author) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: quote,
      likes: 0,
      author: author
    })
  }).then(response => response.json())
    .then(data => {
      console.log(data);
      quotes.push(data)
      // renders pessimistically
      quoteList.innerHTML += createHTML([data])
      quoteForm.reset()
    })
}

// fetch to PATCH when quote is edited
function editQuote(url, id, quote, author) {
  fetch(url + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: quote,
      author: author
    })
  })
}

// fetch to delete quote
function deleteQuote(url, id) {
  fetch(url + `/${id}`, {
    method: "DELETE"
  })
}

// fetch to PATCH when quote likes are increased
function increaseLike(url, id, quote) {
  fetch(url + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: quote.likes
    })
  })
}

// -------------------- Make HTML ---------------------------

// creates all HTML for a given array of quotes
function createHTML(quoteArray) {
  return quoteArray.map( quote => {
    return `<li class='quote-card'>
              <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
                <button class='btn-danger'data-id="${quote.id}">Delete</button>
                <button class='btn-warning'data-id="${quote.id}">Edit</button>
              </blockquote>
            </li>`
  }).join("")
}

// ------------------- Helpers ------------------------------

// finds quote from local variable from id
function findQuote(id) {
  return quotes.find( quote => {
    return parseInt(id) === quote.id
  })
}
