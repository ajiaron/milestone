/* cloudy-space-872085 */
const express = require('express');
const app = express();
const mysql = require('mysql')
app.use(express.json())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    database:'milestoneDB',
 }
)

app.post('/newfeed/create', (req, res) => {
    const username = req.body.username
    const text = req.body.text
    const context = req.body.context
    const date = req.body.date
    const likes = req.body.likes

    db.query('INSERT INTO posts (username, text, context, date, likes) VALUES (?,?,?,?,?)', 
    [username, text, context, date, likes], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.post('/newfeed/comment', (req, res) => {
    const comment = req.body.comment
    const date = req.body.date
    const postId = req.body.postId
    const username = req.body.username
    db.query('INSERT INTO comments (comment, date, postid, username) VALUES (?,?,?,?)', 
    [comment, date, postId, username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('comment all good sir')
        }
    })
})

app.listen(3000, () => console.log('Listening on port 3000'))
