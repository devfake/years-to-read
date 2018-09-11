require('dotenv').config()

const express = require('express')
const path = require('path')
const http = require('axios')

const app = express()

const STATUS_FORBIDDEN = 403
const STATUS_NOT_FOUND = 404

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../dist/index.html'))
})

app.get('/api', (req, res) => {
  const {q, translation} = req.query
  const key = process.env.GOOGLE_API_KEY
  
  http.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&key=${key}&fields=items(volumeInfo/title,volumeInfo/pageCount,volumeInfo/imageLinks/smallThumbnail)&maxResults=1&langRestrict=${translation}`)
    .then(({data}) => {
      const formattedData = buildResponse(data)
      
      res.json(formattedData)
    })
    .catch(error => {
      if (error.response.status === STATUS_FORBIDDEN) {
        res.json(forbiddenResponse())
      }
      
      console.log(error.response)
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
    status: STATUS_NOT_FOUND,
    message: 'No results found'
  }
}

function forbiddenResponse() {
  return {
    status: STATUS_FORBIDDEN,
    message: 'Request forbidden. Google Books API volume used up.'
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
