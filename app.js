const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const restaurantList = require('./restaurant.json')
const port = 3000

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//setting the route and corresponding response
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant =>
    restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

//use queryString to build search bar
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  const keyword = req.query.keyword.toLowerCase()
  const keywordAdvanced = keyword.replace(/\s*/g, "")
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().replace(/\s*/g, "").includes(keywordAdvanced) || restaurant.category.toLowerCase().replace(/\s*/g, "").includes(keywordAdvanced)
  })

  res.render('index', { restaurants: restaurants, keyword: keyword })
})

//listen the server when it started
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})