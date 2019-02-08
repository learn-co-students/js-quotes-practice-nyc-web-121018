// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', () => {

  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')
  const sort = document.querySelector('#sort')
  let allQuotes;
  let updateQuoteForm;
  let sortToggle = false

  fetchQuotes()

  sort.addEventListener('click', e => {
    let sortedAuthors = allQuotes.slice().sort(function(a, b) {
      var nameA = a.author.toUpperCase(); // ignore upper and lowercase
      var nameB = b.author.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    sortToggle = !sortToggle

    console.log(sortToggle);
    if (sortToggle) {
      renderAllQuotes(sortedAuthors)
    } else {
      renderAllQuotes(allQuotes)
      console.log('rendering all');
    }
  })

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault();
    let quote = e.target.querySelector('#new-quote').value
    let author = e.target.querySelector('#author').value

    fetch('http://localhost:3000/quotes', {
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
    }) // end of POST fetch
    .then(r => r.json())
    .then(newQuote => {
      fetchQuotes();
      newQuoteForm.reset();
    })
  }) // end of form EventListener

  document.addEventListener('submit', e => {
    if (e.target.id === 'update-quote-form') {
      e.preventDefault()
      let updatedQuoteText = e.target.querySelector('#update-quote').value
      let updatedAuthor = e.target.querySelector('#update-author').value
      let updatedQuote = {quote: updatedQuoteText, likes: 0, author: updatedAuthor}
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updatedQuote)
      })
      .then(fetchQuotes)
    }
  })

  quoteList.addEventListener('click', e => {
    if (e.target.innerText === 'Delete') {
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: "DELETE"
      })// end of DELETE fetch
      // .then(r => fetchQuotes())
      .then(fetchQuotes)
    }

    if (e.target.innerText === 'Edit') {
      console.log('edit');
      let quoteFooter = document.querySelector(`.footer-${e.target.dataset.id}`)
      let currentQuote = allQuotes.find(q => q.id == e.target.dataset.id)
      console.log(currentQuote);
      if (quoteFooter.innerHTML.includes('form') === false) {
        quoteFooter.innerHTML += addEditForm(e.target.dataset.id)
        updateQuoteForm = document.querySelector('#update-quote-form')
        updateQuoteForm.querySelector('#update-author').value = currentQuote.author
        updateQuoteForm.querySelector('#update-quote').value = currentQuote.quote
      }

    }

    if (e.target.className === 'btn-success') {
      e.target.firstElementChild.innerText = parseInt(e.target.firstElementChild.innerText) + 1

      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: parseInt(e.target.firstElementChild.innerText)
        })
      })
      .then(fetchQuotes)
    }
  })

  function addEditForm(id) {
    return `
    <form id="update-quote-form" data-id=${id}>
      <div class="form-group">
        <label for="update-quote">Update Quote</label>
        <input type="text" class="form-control" id="update-quote">
      </div>
      <div class="form-group">
        <label for="Author">Update Author</label>
        <input type="text" class="form-control" id="update-author">
      </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>`
  }

  function fetchQuotes() {
    fetch('http://localhost:3000/quotes')
      .then(r => r.json())
      .then(quotes => {
        allQuotes = quotes
        renderAllQuotes(quotes)
      })
  }

  function renderQuote(quote) {
    return `
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="footer-${quote.id} blockquote-footer">${quote.author}</footer>
        <br>
        <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button data-id=${quote.id} class='btn-danger edit'>Edit</button>
        <button data-id=${quote.id} class='btn-danger'>Delete</button>
      </blockquote>
    </li>`
  }

  function renderAllQuotes(quotes) {
    return quoteList.innerHTML = quotes.map(renderQuote).join('')
  }

}) // end of DOMContentLoaded
