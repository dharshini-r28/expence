const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const { Expense } = require('./schema.js')
const cors=require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://2dharshini82004:2dharshini82004@cluster0.grwbibo.mongodb.net/')
        console.log('DB connection established ;)')
        const port=process.env.PORT||8000
        app.listen(port, function() {
            console.log(`Listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
        console.log('Cloudn\'t establish connection :(')
    }
}
connectToDb()

app.post('/add-expense', async function(request, response) {
    try {
        await Expense.create({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "entry created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})
app.get('/get-expenses', async function(request, response){
    try{
   
      const expenseDetails = await Expense.find()
       response.status(200).json(expenseDetails)
       
    }catch(error){
               
      response.status(500).json({
        "Status" : "Sorry !!! , could not fetch data",
        "Error"  : error
       })
    }
   })


    app.delete('/delete-expense/:id', async function(request,response){
    /*//console.log(request.params.id)
    const expenseEntry=
   })*/


   const expenseEntry = await Expense.findById(request.params.id)
      if(expenseEntry){
        
        await Expense.findByIdAndDelete(request.params.id)
        response.status(200).json({
          "Status" : "Deleted Successfully"
        })
      }else{
        response.status(404).json({
          "Status" : "Entry Not found"
        })

      }
    })



/*
    app.patch('/update-expense/:id', async function(request,response){
        /*////console.log(request.params.id)
     //   const //expenseEntry=
      // })*/*/
    
    
       app.patch('/update-expense/:id', async function(request, response) {
        try {
            const expenseEntry = await Expense.findById(request.params.id)
            if(expenseEntry) {
                await expenseEntry.updateOne({
                    "amount" : request.body.amount,
                    "category" : request.body.category,
                    "date" : request.body.date
                })
                response.status(200).json({
                    "status" : "success",
                    "message" : "entry updated"
                })
            } else {
                response.status(404).json({
                    "status" : "failure",
                    "message" : "entry not found"
                })
            }
        } catch(error) {
            response.status(500).json({
                "status" : "failure",
                "message" : "could not update entry",
                "error" : error
            })
        }
    })