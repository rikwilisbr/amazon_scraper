
// set form to prevent default
document.querySelector('#search-form').addEventListener('submit', (event)=>{
    event.preventDefault()
})

//get the search button and add a click listener
const button = document.querySelector('#load-data')
button.addEventListener('click', ()=>{
    // set button to loading while data is being fetching
    button.textContent = 'Loading...'
    button.setAttribute('disabled', 'true')

    // get the search input value
    const inputValue = document.querySelector('input').value

    // create the ajax request
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        // check if request is ok
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                // desactive loading button and back it normal
                button.textContent = 'Search'
                button.removeAttribute('disabled', 'true')
                const data = JSON.parse(xhr.responseText)

                // get the div to display fetched data
                const displayDiv = document.querySelector('#data-container')

                //clear the current div list
                while(displayDiv.firstChild){
                    displayDiv.removeChild(displayDiv.firstChild)
                }

                // check if have any data
                if(data.success){
                    // loop each product and push it to screen
                    for(const element of data.data){
                        const dataDiv = document.createElement('div')
                        dataDiv.classList.add('product-item')

                        dataDiv.innerHTML = `
                                                <img class="product-image" src="${element.image_url}" />
                                                <span class="product-name">${element.title}</span>
                                                <div class="product-details">
                                                    <span>Reviews: ${element.reviews}</span>
                                                    <span>Stars: ${element.stars}</span>
                                                </div>
                                            
                                            `
                        displayDiv.appendChild(dataDiv)
                    }

                    
                }

                // if server do not found product display a "no found" message
                if(!data.success){
                    const dataDiv = document.createElement('div')
                    dataDiv.innerHTML = `<span>No product found</span>`
                    displayDiv.appendChild(dataDiv)
                }
            } else {
                // console request error
                console.error('Error:', xhr.status)
            }
        }
    }

    // send the ajax request
    xhr.open('GET', `http://localhost:4080/api/scrape?keyword=${inputValue}`, true)
    xhr.send()
})
