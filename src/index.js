// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteContainer = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
let allQuotes = []

document.addEventListener("DOMContentLoaded", ()=>{

  fetch("http://localhost:3000/quotes")
  .then(r=> r.json())
  .then(quotes => {
    allQuotes = quotes
    displayAllQuotes(allQuotes)
  })

quoteContainer.addEventListener("click" , e =>{
  if(e.target.className === "btn-success"){
    let currentLikes = parseInt(e.target.children[0].innerHTML)
    // console.log(currentLikes);
    let newLikes = currentLikes +1
    // console.log(newLikes);
    let quoteId = e.target.dataset.id
    let currentQuote = allQuotes.find(quote=>{
      return quote.id === parseInt(e.target.dataset.id)
    })
    currentQuote.likes = newLikes //update local variables
    e.target.children[0].innerHTML = newLikes //update DOM
    // update DB
    fetch(`http://localhost:3000/quotes/${quoteId}`,{
      method: "PATCH",
      headers:{
        "Content-Type":"application/json",
        "Accept": "application/json"
      },
      body:JSON.stringify({
        likes:newLikes
      })
    })
  }
  if(e.target.className === "btn-danger"){
    // console.log(e.target.parentElement.parentElement);
    let quoteId = e.target.dataset.id
    let currentQuote = allQuotes.find(quote=>{
      return quote.id === parseInt(e.target.dataset.id)
    })
    let idx = allQuotes.indexOf(currentQuote)
    allQuotes.splice(idx, 1) //update local variables
    e.target.parentElement.parentElement.remove() //update DOM
    fetch(`http://localhost:3000/quotes/${quoteId}`,{
      method: "DELETE"
    })
  }
  if(e.target.className === "edit"){
    let quoteId = e.target.dataset.id
    let currentQuote = allQuotes.find(quote=>{
      return quote.id === parseInt(e.target.dataset.id)
    })
    e.target.parentElement.innerHTML +=`
    <form id ="editQuote" data-id="${currentQuote.id}">
    <label> Quote </label>
    <input id="edit-quote" type="textArea" name="quote" value="${currentQuote.quote}"><br>
    <label> Author </label>
    <input id="edit-author" type="text" name="author" value="${currentQuote.author}"><br>
    <input id="edit" data-id=${currentQuote.id} type="submit" value="Submit">
    </form>
    `
  }
})


document.addEventListener("submit", e=>{
        e.preventDefault()
        if(e.target.id === "editQuote"){
          let quoteId = e.target.dataset.id
          let quoteInput = e.target.querySelector("#edit-quote").value
          let authorInput = e.target.querySelector("#edit-author").value
          let currentQuote = allQuotes.find(quote=>{
            return quote.id === parseInt(e.target.dataset.id)
          })
          //update local variables
          currentQuote.quote = quoteInput
          currentQuote.author = authorInput
          //update the DOM
          e.target.parentElement.children[0].innerHTML = quoteInput
          e.target.parentElement.children[1].innerHTML = authorInput
          //update the DB
          fetch(`http://localhost:3000/quotes/${quoteId}`,{
            method: "PATCH",
            headers:{
              "Content-Type":"application/json",
              "Accept":"application/json"
            },
            body:JSON.stringify({
              quote:quoteInput,
              author:authorInput
            })
          }).then(r=> e.target.style.display = "none")
        }

        if(e.target.id === "new-quote-form"){
            let quoteInput = document.getElementById("new-quote").value
            let authorInput = document.getElementById("author").value
            fetch("http://localhost:3000/quotes",{
              method: "POST",
              headers:{
                "Content-Type" : "application/json",
                "Accept" : "application/json"
              },
              body: JSON.stringify({
                quote:quoteInput,
                author:authorInput,
                likes: 0
              })
            }).then(r=> r.json())
            .then(quote =>{
              allQuotes += quote
              displaySingleQuote(quote)
            })
          }
  })

  function displayAllQuotes(allQuotes){
    allQuotes.forEach(quote=>{
      displaySingleQuote(quote)
    })
  }

  function displaySingleQuote(quote){
    quoteContainer.innerHTML += `
    <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}" >Likes: <span>${quote.likes}</span></button>
      <button class='edit' data-id="${quote.id}" >Edit</button>
      <button class='btn-danger' data-id="${quote.id}" >Delete</button>
    </blockquote>
  </li>
    `
}

})
