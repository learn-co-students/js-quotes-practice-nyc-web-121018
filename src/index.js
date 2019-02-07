// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let allQuotes = []
// let newLike
document.addEventListener("DOMContentLoaded", e => {
  const quoteList = document.getElementById("quote-list");
  const newForm = document.getElementById("new-quote-form");

  //const likes = document.getElementById("likes")



  fetch("http://localhost:3000/quotes")
  .then(r => r.json())
  .then(data => {
    allQuotes = data
    allQuotes.map(quote => {

      quoteList.innerHTML += `
      <li class='quote-card'>
      <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}.</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id=${quote.id} id= like-btn class='btn-success'>Likes: <span id='likes'>${quote.likes}</span></button>
      <button data-id=${quote.id} class='btn-danger'>Delete</button>
      </blockquote>
       </li>

      `

    })// end of last then in post fetch

    //addLike(4)
  })

    newForm.addEventListener('submit', e => {
      e.preventDefault()
      let newSaying = document.getElementById("new-quote").value
      let newAuthor = document.getElementById("author").value
      let likes = 0
      let newQuote = {quote: newSaying,likes:0, author: newAuthor}
      allQuotes.push(newQuote)



        fetch("http://localhost:3000/quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify (
            newQuote
          )
        })
        .then(r => r.json())
        .then(data => {

          return quoteList.innerHTML +=
          `
          <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${newQuote.quote}.</p>
          <footer class="blockquote-footer">${newQuote.author}</footer>
          <br>
          <button data-id=${newQuote.id} id='like-btn' class='btn-success'> <span id='likes'>${newQuote.likes}</span></button>
          <button data-id=${newQuote.id} class='btn-danger'>Delete</button>
          </blockquote>
           </li>
          `
        })//end of second then in post fetch
    })// event listener

    // const likeBtn = document.getElementById("like-btn")
    function addLike(quoteId) {
      const likeBtn = document.querySelector(`[data-id="${quoteId}"]`)
      console.log(likeBtn)
      let likeCount = parseInt(likeBtn.children[0].innerHTML)
      //console.log(likeCount +1);
      let newLike = likeCount +1
      likeBtn.children[0].innerHTML = newLike
    }

    document.addEventListener('click', e => {
      let quoteId = parseInt(e.target.dataset.id)
      console.log(quoteId)
      const likeBtn = document.querySelector(`[data-id="${quoteId}"]`)
      let likeCount = parseInt(likeBtn.children[0].innerHTML)
      let newLike = likeCount +1
      addLike(quoteId)

     fetch(`http://localhost:3000/quotes/${quoteId}`, {
       method: "PATCH",
       headers: {
         "Content-Type": "application/json",
         "Accept": "application/json"
       },
       body: JSON.stringify ({
          likes: newLike
       })

     })//end fetch
   })

  //  .then(r => r.json())

  //  .then(quote => console.log(quote))
  //
  //
  // })//second then patch fetch
  })
// end of DOM
