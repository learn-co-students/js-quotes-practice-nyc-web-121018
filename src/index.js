// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let allQuotes =[]
let quoteContainer = document.querySelector("#quote-list")
let newQuoteForm = document.getElementById("new-quote-form")

document.addEventListener("DOMContentLoaded", ()=>{

  fetch("http://localhost:3000/quotes")
  .then(r=>r.json())
  .then(quotes => {
    allQuotes = quotes
    allQuotes.forEach((quote)=>{
      quoteContainer.innerHTML+=`
      <li data-id=${quote.id} class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button data-id=${quote.id} class='btn-danger'>Delete</button>
        </blockquote>
      </li>
      `
    })
  })

  newQuoteForm.addEventListener("submit", e=>{
    e.preventDefault()
    let quoteInput = document.getElementById("new-quote").value
    let authorInput = document.getElementById("author").value
    let likes = 0
    fetch("http://localhost:3000/quotes",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Accept": "application/json"
      },
      body:JSON.stringify({
        quote:quoteInput,
        likes:likes,
        author:authorInput
      })
    }).then(r=>r.json())
    .then(quote=>{
      allQuotes += quote
      let newQuote= `
      <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button data-id=${quote.id} class='btn-danger'>Delete</button>
        </blockquote>
      </li>
      `
      quoteContainer.innerHTML +=newQuote
    })
  })

  quoteContainer.addEventListener("click", e=>{
    if(e.target.className === "btn-success"){
      let currentLikes = parseInt(e.target.innerText.split(" ")[1])
      let newLikes = currentLikes +1
      e.target.innerText = `Likes: ${newLikes}`
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`,{
        method: "PATCH",
        headers:{
          "Content-Type" : "application/json",
          "Accept" : "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
    }
    if(e.target.className === "btn-danger"){
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`,{
        method: "DELETE"
      }).then(r => e.target.parentElement.parentElement.remove())
    }
  })

})//end of DOMContentLoaded
