/* cloudy-space-872085 */
const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    database:'milestoneDB',
 }
)

app.post('/register/account', (req, res) => {
    const name = req.body.name
    const milestones = req.body.milestones
    const blurb = req.body.blurb
    const date = req.body.date
    const password = req.body.password
    const friends = req.body.friends
    const groupcount = req.body.groupcount
    const email = req.body.email
    const fullname = req.body.fullname
    db.query("INSERT INTO users (name, milestones, blurb, date, password, friends, groupcount, email, fullname) VALUES (?,?,?,?,?,?,?,?,?)",
    [name, milestones, blurb, date, password, friends, groupcount, email, fullname], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('new users have been posted')
        }
    })
}) 

app.get('/login/account', (req,res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/login/updateuser', (req, res) => {
    const id = req.body.id
    const fullname = req.body.fullname
    const src = req.body.src
    db.query('UPDATE users SET fullname = ?, src = ? WHERE id = ?', [fullname, src, id],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put('/settings/updateinfo', (req, res) => {
    const id = req.body.id
    const username = req.body.username
    const description = req.body.description
    const email = req.body.email
    const fullname = req.body.fullname
    const src = req.body.src
    const isPublic = req.body.isPublic
    db.query('UPDATE users SET name = ?, blurb = ?, email = ?, fullname = ?, src = ?, public = ? WHERE id = ?', [username, description, email, fullname, src, isPublic, id],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/newfeed/create', (req, res) => {
    const id = req.body.id
    const username = req.body.username
    const text = req.body.text
    const context = req.body.context
    const date = req.body.date
    const likes = req.body.likes
    db.query('INSERT INTO posts (id, username, text, context, date, likes) VALUES (?,?,?,?,?,?)', 
    [id, username, text, context, date, likes], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.get('/newfeed/newposts', (req,res)=> {
    db.query('SELECT * FROM posts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/posts/:id/getpost', (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM posts WHERE id = ?', id, (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.post('/createpost/newpost', (req, res)=> {
    const id = req.body.id
    const username = req.body.username
    const text = req.body.text
    const context = req.body.context
    const date = req.body.date
    const likes = req.body.likes
    db.query('INSERT INTO posts (id, username, text, context, date, likes) VALUES (?,?,?,?,?,?)', 
    [id, username, text, context, date, likes], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})

app.post('/createmilestone/addmilestone', (req, res) => {
    const idmilestones = req.body.idmilestones
    const title = req.body.title
    const ownerID = req.body.ownerID
    const ownerName = req.body.ownerName
    const entries = req.body.entries
    const description = req.body.description
    const src = req.body.src
    const streak = req.body.streak
    const date = req.body.idmilestones
    db.query(
    'INSERT INTO personal_milestones (idmilestones, title, ownerID, ownerName, entries, description, src, streak, date) VALUES (?,?,?,?,?,?,?,?,?)',
    [idmilestones, title, ownerID, ownerName, entries, description, src, streak, date], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("new milestone added")
        }
    })
})

app.post('/createmilestone/addpermissions', (req, res) => {
    const idmilestones = req.body.idmilestones
    const title = req.body.title
    const ownerID = req.body.ownerID
    const collaborate = req.body.collaborate
    const viewable = req.body.viewable
    const comments = req.body.comments
    const likes = req.body.likes
    const links = req.body.links
    const duration = req.body.duration
    db.query('INSERT INTO milestone_permissions (idmilestones, title, ownerID, collaborate, viewable, comments, likes, links, duration) VALUES (?,?,?,?,?,?,?,?,?)',
    [idmilestones, title, ownerID, collaborate, viewable, comments, likes, links, duration], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("milestone permissions added")
        }
    })
})


app.get('/createpost/showmilestones', (req, res) => {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/editpost/:postid/showmilestones', (req, res) => {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/createpost/getposts', (req, res) => {
    db.query('SELECT * FROM posts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/editpost/:postid/getposts', (req, res) => {
    db.query('SELECT * FROM posts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/editpost/:postid/getusers', (req, res) => {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/createpost/linkmilestone', (req, res) => {
    const milestoneid = req.body.milestoneid
    const postid = req.body.postid
    const ownerID = req.body.ownerID
    const ownerName = req.body.ownerName
    const milestoneTitle = req.body.milestoneTitle
    db.query('INSERT INTO milestoneposts (milestoneid, postid, ownerID, ownerName, milestoneTitle) VALUES (?,?,?,?,?)', 
    [milestoneid, postid, ownerID, ownerName, milestoneTitle], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("milestone linked to post")
        }
    })
})

app.post('/editpost/:postid/linkmilestone', (req, res) => {
    const milestoneid = req.body.milestoneid
    const postid = req.body.postid
    const ownerID = req.body.ownerID
    const ownerName = req.body.ownerName
    const milestoneTitle = req.body.milestoneTitle
    db.query('INSERT INTO milestoneposts (milestoneid, postid, ownerID, ownerName, milestoneTitle) VALUES (?,?,?,?,?)', 
    [milestoneid, postid, ownerID, ownerName, milestoneTitle], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("milestone linked to post")
        }
    })
})

app.put('/editpost/:postid/updatepost', (req, res) => {
    const id = req.body.postid
    const text = req.body.text
    db.query('UPDATE posts SET text = ? WHERE id = ?', [text, id],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/editpost/:postid/getlinked', (req, res) => {
    db.query('SELECT * FROM milestoneposts', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.delete('/editpost/:postid/removelinked', (req, res) => {
    const postid = req.params.postid
    db.query("DELETE FROM milestoneposts WHERE postid = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.delete('/editpost/:postid/removelinktag', (req, res) => {
    const postid = req.params.postid
    const milestoneid = req.body.milestoneid
    db.query("DELETE FROM milestoneposts WHERE postid = ? AND milestoneid = ?", [postid, milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/posts/:id/showmilestones', (req, res) => {
    const id = req.params.id
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/posts/:id/showlinked', (req, res) => {
    const id = req.params.id
    db.query('SELECT DISTINCT (milestoneid) FROM milestoneposts WHERE postid = ?',id, (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


app.get('/profile/:name/showmilestones', (req, res) => {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})

app.get('/profile/:name/showgroups', (req, res) => {
    db.query('SELECT * FROM milestone_groups', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.get('/profile/:name/showmembers', (req, res) => {
    db.query('SELECT * FROM groupmembers', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})

app.get('/profile/:name/insights', (req, res) => {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
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

app.get('/newfeed/getcomments', (req,res)=> {
    db.query('SELECT * FROM comments', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.get('/friends/getfriends', (req, res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/:name/milestonelist/showmilestones', (req, res) => {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})

app.post('/createmilestone/postmilestone', (req, res) => {
    const idmilestones = req.body.idmilestones
    const title = req.body.title
    const ownerID = req.body.ownerID
    const ownerName = req.body.ownerName
    const entries = req.body.entries
    const description = req.body.description
    const src = req.body.src
    const streak = req.body.streak
    db.query('INSERT INTO personal_milestones (idmilestones, title, ownerID, ownerName, entries, description, src, streak) VALUES (?,?,?,?,?,?,?,?)',
    [idmilestones, title, ownerID, ownerName, entries, description, src, streak], (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send("personal milestone posted")
        }
    })
})

app.post('/createmilestone/posticons', (req, res) => {
    const src = req.body.src
    const alt = req.body.alt
    db.query('INSERT INTO icons (src, alt) VALUES (?,?)',
    [src, alt], (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send("icons posted")
        }
    })
})


app.get('/createmilestone/getmilestones', (req, res)=> {
    db.query('SELECT * FROM personal_milestones', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.get('/createmilestone/getuser', (req, res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.post('/createmilestone/postpermissions', (req, res) => {
    const idmilestones = req.body.idmilestones
    const title = req.body.title
    const ownerID = req.body.ownerID
    const collaborate = req.body.collaborate
    const viewable = req.body.viewable
    const comments = req.body.comments
    const likes = req.body.likes
    const links = req.body.links
    const duration = req.body.duration
    db.query('INSERT INTO milestone_permissions (idmilestones, title, ownerID, collaborate, viewable, comments, likes, links, duration) VALUES (?,?,?,?,?,?,?,?,?)',
    [idmilestones, title, ownerID, collaborate, viewable, comments, likes, links, duration], (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send("personal milestone posted")
        }
    })
})

app.get('/createmilestone/geticons', (req, res) => {
    db.query('SELECT * FROM milestone_icons', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/milestone/:milestoneid/getmilestone', (req, res) => {
    const milestoneid = req.params.milestoneid
    db.query('SELECT * FROM personal_milestones WHERE idmilestones = ?',milestoneid, (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    }) 
})

app.delete('/milestone/:milestoneid/removemilestone', (req, res) => {
    const milestoneid = req.params.milestoneid
    db.query("DELETE FROM personal_milestones WHERE idmilestones = ?", milestoneid, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.listen(3000, () => console.log('Listening on port 3000'))
