let allQuotes = []
let quotesURL = `http://localhost:3000/quotes`
document.addEventListener("DOMContentLoaded", function(event) {
  //found DOM elements
  const quoteList = document.getElementById('quote-list')
  const quoteForm = document.getElementById('new-quote-form')

  fetch(quotesURL)
    .then(response => response.json())
    .then(data => {
      allQuotes = data
      let quotes = allQuotes.map(quote => {
        return `<li class='quote-card'>
                  <blockquote class="blockquote">
                    <p class="mb-0">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes}</span></button>
                    <button data-id="${quote.id}" class='btn-danger'>Delete</button>
                  </blockquote>
                </li>`
      }).join("")
      quoteList.innerHTML = quotes
    })

  quoteForm.addEventListener('submit', e =>{
    e.preventDefault()
    const quoteContent = e.target.newQuote.value
    const newAuthor = e.target.author.value

    fetch(quotesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: quoteContent,
        author: newAuthor,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newQuote => {
      let newQuoteHTML =
      `<li class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${newQuote.quote}</p>
            <footer class="blockquote-footer">${newQuote.author}</footer>
            <br>
            <button data-id="${newQuote.id}" class='btn-success'>Likes: <span>0</span></button>
            <button data-id="${newQuote.id}" class='btn-danger'>Delete</button>
          </blockquote>
        </li>`
      quoteList.innerHTML += newQuoteHTML
    })
  })

  quoteList.addEventListener('click', e => {
    // console.log(e.target)
    const quoteId = e.target.dataset.id
    // console.log(buttonId)

    if (e.target.className === "btn-success") {
      let currentLikes = parseInt(e.target.firstElementChild.innerText)
      // console.log(currentLikes);
      let updatedLikes = currentLikes + 1
      e.target.firstElementChild.innerText = updatedLikes

      fetch(`${quotesURL}/${quoteId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          likes: updatedLikes
        })
      })
    }

    if (e.target.className === "btn-danger") {
      fetch(`${quotesURL}/${quoteId}`, {
        method: "DELETE"
      })
      .then(response => {
        e.target.parentElement.remove()
      })
    }
  })

}) //end of DOMContentLoaded
