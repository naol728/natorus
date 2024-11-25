const express=require('express')
const fs=require('fs')
const { stringify } = require('querystring')
const app=express()

app.use(express.json())
const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


app.get('/',(req,res)=>{
    res.status(200).send('this is the message from server')
})
app.post('/',(req,res)=>{
    res.status(200).send('you can post anything in this url')
})
app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        "status":"success",
         tours
    })
})

app.post('/api/v1/tours',(req,res)=>{
     const tourid=tours[tours.length-1].id+1
     const newtour=Object.assign({id:tourid},req.body)
     tours.push(newtour)

     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),()=>{
        res.status(201).json({
            "status":"succsus",
            data:{
                tours:newtour
            }
        })
     })

     
})
const port=3000
app.listen(port,()=>{
    console.log(`server starts at ${port} port number`)
})