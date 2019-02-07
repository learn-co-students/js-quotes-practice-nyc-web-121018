allQuotes = []
document.addEventListener("DOMContentLoaded", e => {
  // console.log("DOM fully loaded and parsed");
  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')
  const sortButton = document.querySelector('#sort-button')
  // console.log(quoteList);
  // console.log(newQuoteForm);
  // console.log(sortButton);

  fetch('http://localhost:3000/quotes')
  .then(resp => resp.json())
  .then(data => {
    allQuotes = data
    // console.log(allQuotes);
    quoteList.innerHTML = allQuotes.map(addHTMLToQuote).join('')
  })

  sortButton.addEventListener('click', e => {
    const sortByAttribute = function (attribute) {
      return function (x, y) {
          return ((x[attribute] === y[attribute]) ? 0 : ((x[attribute] > y[attribute]) ? 1 : -1));
      };
    };
    sortedQuotes = allQuotes.sort(sortByAttribute('author'))
    quoteList.innerHTML = sortedQuotes.map(addHTMLToQuote).join('')
  })

  newQuoteForm.addEventListener('submit', e => {
    e.preventDefault()
    const quote = e.target.quote.value
    const name = e.target.name.value

    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
      body: JSON.stringify({
        quote: quote,
        likes: 0,
        author: name
      })
    })
    .then(resp => resp.json())
    .then(data => {
      newQuote = data
      allQuotes.push(newQuote)
      quoteList.innerHTML += addHTMLToQuote(newQuote)
      // console.log(newQuote);
    })

    newQuoteForm.reset()
  })
  quoteList.addEventListener('click', e => {
    const clickedQuoteId = e.target.dataset.id
    const clickedQuote = allQuotes.find(quote => quote.id === parseInt(clickedQuoteId))
    const clickedQuoteIndex = allQuotes.indexOf(clickedQuote)
    const clickedQuoteBox = e.target.parentElement
    // console.log(e.target.innerText);
    // console.log(clickedQuoteId);
    // console.log(clickedQuote);
    // console.log(clickedQuoteIndex);
    if (e.target.innerText.includes('Like')) {
      // console.log('hi');
      currentLikes = clickedQuote.likes
      // console.log(currentLikes);
      updatedLikes = currentLikes += 1
      clickedQuote.likes = updatedLikes
      likesSpan = e.target.querySelector('span')
      likesSpan.innerText = updatedLikes
      allQuotes[clickedQuoteIndex].likes = updatedLikes
      fetch(`http://localhost:3000/quotes/${clickedQuoteId}`,{
        method: 'PATCH',
        headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
        body: JSON.stringify({
          likes: updatedLikes
        })
      })
    }

    if (e.target.innerText.includes('Edit')) {
      // console.log('yo');
      e.target.parentElement.innerHTML += `
        <form data-id="${clickedQuoteId}"id="edit-quote-form">
          <div class="form-group">
            <label for="edit-quote">Edit Quote</label>
            <input name="quote" type="text" class="form-control" id="edit-quote" value="${clickedQuote.quote}">
          </div>
          <div class="form-group">
            <label for="Author">Edit Author</label>
            <input name="name" type="text" class="form-control" id="author" value="${clickedQuote.author}">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
          <hr>
        </form>
        `
      const editForm = document.querySelector(`#edit-quote-form`)
      editForm.addEventListener('submit', e => {
        e.preventDefault()
        // console.log('hey');
        const quote = e.target.quote.value
        const name = e.target.name.value
        // console.log(quote);
        // console.log(name);
        clickedQuoteBox.innerHTML = `
          <p class="mb-0">${quote}</p>
          <footer class="blockquote-footer">${name}</footer>
          <br>
          <button data-id=${clickedQuoteId} class='btn-success'>Likes: <span>${clickedQuote.likes}</span></button>
          <button data-id=${clickedQuoteId} class='btn-primary'>Edit</button>
          <button data-id=${clickedQuoteId} class='btn-danger'>Delete</button>
          <br>
          <br>
          <hr>
          `
          fetch(`http://localhost:3000/quotes/${clickedQuoteId}`, {
            method: "PATCH",
            headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
            body: JSON.stringify({
              quote: quote,
              author: name
            })
          })

          clickedQuote.quote = quote
          clickedQuote.author = name
          allQuotes[clickedQuoteIndex].quote = quote
          allQuotes[clickedQuoteIndex].author = name

        editForm.remove()
      })
    }
    if (e.target.innerText.includes('Delete')) {
      // console.log('bye');
      e.target.parentElement.parentElement.remove()
      allQuotes.splice(clickedQuoteIndex, (clickedQuoteIndex+1))
      // console.log(allQuotes);
      fetch(`http://localhost:3000/quotes/${clickedQuoteId}`, {method: "DELETE"})
    }
  })
})//end of DOM CONTENT LOADED

function addHTMLToQuote(quote) {
  return `<li class='quote-card'>
            <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
              <button data-id=${quote.id} class='btn-primary'>Edit</button>
              <button data-id=${quote.id} class='btn-danger'>Delete</button>
              <br>
              <br>
              <hr>
            </blockquote>
          </li>`
}
