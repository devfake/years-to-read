require('dotenv').config()

const express = require('express')
const path = require('path')
const http = require('axios')

const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../dist/index.html'))
})

app.get('/api', (req, res) => {
  const q = req.query.q
  const key = process.env.GOOGLE_API_KEY
  
  http.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&key=${key}&fields=items(volumeInfo/title,volumeInfo/pageCount,volumeInfo/imageLinks/smallThumbnail)&maxResults=1`)
    .then(({data}) => {
      const formattedData = buildResponse(data)
      
      res.json(formattedData)
    })
    .catch(error => {
      console.log(error)
    })
})

function buildResponse(data) {
  let formattedData = []

  if(responseIsEmpty(data)) {
    return emptyResponse()
  }
  
  for(let item of data.items) {
    formattedData.push(formatData(item))
  }

  return formattedData
}

function responseIsEmpty(data) {
  return Object.keys(data).length === 0 || data.totalItems === 0
}

function emptyResponse() {
  return {
    status: 404,
    message: 'No results found'
  }
}

function formatData(item) {
  const {title, pageCount, imageLinks} = item.volumeInfo
  
  return {
    title,
    pages: pageCount || null,
    thumbnail: imageLinks ? imageLinks.smallThumbnail : null
  }
}

app.use(express.static('dist'))
app.listen(3000)
