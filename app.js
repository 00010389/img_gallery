const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello!')
})

app.listen(5000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 5000...')
})