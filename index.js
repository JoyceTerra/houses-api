const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')
const app = express()

const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/MyFirstWebServer', {define: { timestamps: false }})
app.use(bodyParser.json())

const House = sequelize.define('house', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
  tableName: 'houses'
})

House.sync() //generates the table for sequelize --sync yout tables with db


// House.create({ // creates a new house
//   title: 'Multi Million Estate',
//   description: 'This was build by a super-duper rich programmer',
//   size: 1235,
//   price: 98400000
// }).then(house => console.log(`The house is now created. The ID = ${house.id}`))


app.get('/houses', function (req, res, next) { //finds all houses
  House.findAll()
    .then(houses => {
      res.json({ houses: houses })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

app.get('/houses/:id', function (req, res, next) { // find a house by id
  const id = req.params.id
  House.findById()
  res.json({ message: `Read house ${id}` })
})


app.post('/houses', function (req, res) { //posts the house
  House
    .create(req.body)
    .then(house => res.status(201).json(house)) //gets the house back with a status
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

  app.put('/houses/:id', function (req, res) {
    const id = req.params.id
    House.update(
        {
            title: req.body.title,
            description: req.body.description,
            size: req.body.size,
            price: req.body.price
        },
        {
            returning: true, where: {id: id} 
        },
    )
    .then(([rowsUpdate, [updateHouse]])=>{
        res.json(updateHouse)
    })
    .catch(err => {
        res.status(500).json({
            message: 'internal error',
            error: err
        })
    })
})

// app.put('/houses/:id', function (req, res) {
//   const id = req.params.id
//   House
//   .findById(id)
//   .then(house => res.status(201).json(house))
//   .catch(err => {
//       res.status(500).json({
//           message: 'internal error',
//           error: err
//       })
//   })
// })

app.delete('/houses/:id', function (req, res) {
  const id = req.params.id
  House.destroy(
    {
     where: { id: id}
    }
  )
  .then(house => res.status(200).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

//to do 
// app.delete('/houses/:id', function (req, res) {
//   const id = req.params.id
//   House
//   .findById(id)
//   .then(house =>{
//     if(house)
//       return house.destroy() //empty because there is nothing to be returned
//     }else{
//     res.status(404).json({
//       message: 'House does not exist', house
//     })
//   }
//     .catch(err => {
//       res.status(500).json({
//           message: 'internal error',
//           error: err
//       })
//   })
// })


const port = 4000
app.listen(port, () => `Listening on port ${port}`)
