const express=require('express')
const fs=require('fs')
const app=express()


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

const port=3000
app.listen(port,()=>{
    console.log(`server starts at ${port} port number`)
})