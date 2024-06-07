const express = require('express')
const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const cors = require('cors')

const app = express()
const PORT = 4080

// setup cors
const corsOptions = {
    origin:'*'
}

app.use(cors(corsOptions));

// creating a get http route to handle scrape requests
app.get('/api/scrape', async (req, res)=>{
    const productName = req.query['keyword']

    // custom user-agent because amazon don't like scrapers
    const customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
    
    // get the amazon product page
    const {data: page} = await axios.get(`https://amazon.com/s?k=${productName}`, {headers:{'User-Agent': customUserAgent}})
    
    // get the html document
    const dom = new JSDOM(page)
    const document = dom.window.document
    
    // finding all products
    const products = document.querySelectorAll('.s-result-item.s-asin')

    // looping all products and pushing data object to payload array
    const payload = []
    for(const element of products){
        const title = element.querySelector('h2 .a-text-normal')
        const image = element.querySelector('img.s-image')
        const stars = element.querySelector('[aria-label*="out of 5 stars"]')
        const reviews = element.querySelector('[aria-label*="ratings"]')
        payload.push({
            title: title?.textContent?.trim(),
            image_url: image?.getAttribute('src'),
            stars: stars?.getAttribute('aria-label'),
            reviews: reviews?.getAttribute('aria-label')
        })
    }

    // checking if payload array is empty
    if(payload.length === 0){
        //sending error message.
        return res.send({ 
            success: false,
            message: `No product found.`,
        })
    }

    // send the scraped data to client in json format
    return res.send({ 
        success: true,
        message: `found successfully ${payload.length} products with keyword: ${productName}`,
        data: payload 
    })

    
})

// setup server to listen provided PORT
app.listen(PORT, ()=>{
    console.log(`Server running succesfully at http://localhost:${PORT}`)
})