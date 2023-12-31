require("dotenv").config()
const express = require("express")
const app = express()

const fourOhFour = {
  name: '404Error',
  message: 'This path does not exist'
}

const morgan = require("morgan")
app.use(morgan('dev'))

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use("/api", require("./api"));

const client = require("./db/client")
client.connect()

const apiRouter = require('./api');
app.use('/api', apiRouter);

app.get("*",(req,res)=>{
  res.status(404).send(fourOhFour)
})

apiRouter.use((error, req, res, next) => {
  console.error('Error: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message, table: error.table});
});

module.exports = app;