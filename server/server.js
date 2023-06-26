const express = require('express');
const app = express();
const mysql = require('mysql')
const axios = require('axios')
const cors = require('cors')
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'password',
    charset:'utf8mb4',
    database:'milestone_db',
 }
)

app.get('/api/testconnect', (req, res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            res.send(false)
        } else {
            res.send(true)
        }
    })
})
app.get('/api/getusers', (req, res)=> {
    db.query('SELECT * FROM users', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmilestones', (req, res)=> {
    db.query('SELECT * FROM milestones', (err, result)=> {
        if (err) {
            console.log('not connected to server')
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getposts', (req, res) => {
    db.query('SELECT * FROM userposts', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getlinkedmilestones', (req, res) => {
    db.query('SELECT * FROM postmilestones', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getcomments', (req, res) => {
    db.query('SELECT * FROM postcomments', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getlikes', (req, res) => {
    db.query('SELECT * FROM postlikes', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getrequests', (req,res) => {
    db.query('SELECT * FROM friends', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getnotifications', (req, res)=> {
    db.query('SELECT * FROM notifications', (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getlinkedposts/:milestoneid', (req, res) => {
    const milestoneid = req.params.milestoneid
    const sql = 'SELECT * FROM userposts ' +
                'WHERE idposts IN (SELECT postid FROM postmilestones WHERE milestoneid = ?)'
    db.query(sql, [milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getpostmilestones/:postid', (req, res) => {
    const postid = req.params.postid
    const sql = 'SELECT * FROM milestones ' +
                'WHERE idmilestones IN (SELECT milestoneid FROM postmilestones WHERE postid = ?)'
    db.query(sql, [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getuserlikes/:postid', (req, res) => {
    const postid = req.params.postid
    const sql = 'SELECT id as userid, name, src as img FROM users ' +
                'INNER JOIN postlikes' +
                'ON id = userid WHERE postid = ?'
    db.query(sql, [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getusertoken/:userid', (req, res) => {
    const userid = req.params.userid
    const sql = 'SELECT pushtoken FROM milestone_db.users WHERE id = ?' 
    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getusercomments/:postid', (req, res) => {
    const postid = req.params.postid
    const sql = 'SELECT id as userid, name, src as img, postcomments.commentid, postcomments.comment, postcomments.date FROM milestone_db.users' +
                'INNER JOIN postcomments' +
                'ON id = userid WHERE postid = ?'
    db.query(sql, [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

// grabs the milestones that have been posted to within the last week, 
// if your either own the milestone, or if the post owner is in your friends list
app.get('/api/getrecentupdates/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT DISTINCT '+
    'milestones.idmilestones, milestones.title, milestones.ownerId as mileOwner, milestones.src as mileImage, milestones.date as mileDate, '+
    'milestones.streak, milestones.postable, milestones.viewable, MAX(userposts.date) as postdate '+
    'FROM milestone_db.milestones ' +
    'INNER JOIN milestone_db.postmilestones ON idmilestones = milestoneid ' +
    'INNER JOIN milestone_db.userposts ON idposts = postid WHERE (userposts.date > CURRENT_TIMESTAMP - interval 1 week) ' +
    'AND milestones.idmilestones IN (SELECT milestoneid FROM milestone_db.postmilestones WHERE postmilestones.postid IN ' +
    '(SELECT idposts FROM milestone_db.userposts WHERE date > CURRENT_TIMESTAMP - interval 1 week)) AND ' +
    '(userposts.ownerId = ? OR milestones.ownerId = ? OR ' +
    '(userposts.ownerID IN ' +
    '(SELECT DISTINCT id FROM milestone_db.users ' +
    'JOIN milestone_db.friends ON (id = requesterId OR id = recipientId) ' +
    'WHERE id IN (SELECT requesterId FROM milestone_db.friends WHERE (recipientId = ? AND approved = true) UNION ' +
    'SELECT recipientId FROM milestone_db.friends WHERE (requesterId = ? AND approved = true))))) ' +
    'GROUP BY idmilestones '+
    'ORDER BY MAX(userposts.date) DESC;'
    db.query(sql, [id,id,id,id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
// grabs all the posts under the recent week's milestone(s) 
app.get('/api/getrecentposts/:milestoneid', (req, res) => {
    const milestoneid = req.params.milestoneid
    const sql = 'SELECT DISTINCT idmilestones, title, userposts.* ' +
    'FROM milestone_db.milestones ' +
    'INNER JOIN milestone_db.postmilestones ON milestoneid = idmilestones ' +
    'INNER JOIN milestone_db.userposts ON idposts = postid WHERE (userposts.date > CURRENT_TIMESTAMP - interval 1 week) ' +
    'AND milestones.idmilestones IN (SELECT milestoneid FROM milestone_db.postmilestones WHERE postmilestones.postid IN ' +
    '(SELECT idposts FROM milestone_db.userposts WHERE date > CURRENT_TIMESTAMP - interval 1 week)) AND milestones.idmilestones = ? '+
    'ORDER BY userposts.date DESC;'
    db.query(sql, [milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
// grabs the user's friends with user info
app.get('/api/getfriendslist/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT DISTINCT users.*, friends.approved FROM milestone_db.users ' +
    'JOIN milestone_db.friends ON (id = requesterId OR id = recipientId) ' +
    'WHERE id IN ( ' +
    'SELECT requesterId FROM milestone_db.friends WHERE (recipientId = ?) UNION ' +
    'SELECT recipientId FROM milestone_db.friends WHERE (requesterId = ?));'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmembers/:idmilestones', (req, res) => {
    const idmilestones = req.params.idmilestones
    const sql = 'SELECT DISTINCT * FROM milestone_db.users '+
                'WHERE id IN (SELECT ownerId FROM milestone_db.milestones WHERE idmilestones = ?) '+
                'OR id IN (SELECT memberid FROM milestone_db.members WHERE idmilestones = ?);'
    db.query(sql, [idmilestones, idmilestones], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmemberposts/:idmilestones/:id', (req, res) => {
    const idmilestones = req.params.idmilestones
    const id = req.params.id
    const sql = 'SELECT DISTINCT * FROM milestone_db.userposts ' +
    'WHERE idposts IN (SELECT postid FROM milestone_db.postmilestones WHERE milestoneid = ?) '+
    'AND ownerid IN (SELECT id FROM milestone_db.users WHERE id = ?); '
    db.query(sql, [idmilestones, id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmembermilestones/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM milestone_db.milestones WHERE idmilestones IN ' +
    'SELECT idmilestones FROM milestone_db.members WHERE memberid = ?);'
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmemberdetails/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM milestone_db.users WHERE id IN (SELECT memberid FROM milestone_db.members) AND id = ?; ' 
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getusermilestones/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM milestone_db.milestones WHERE idmilestones IN '+
                '(SELECT idmilestones FROM milestone_db.members WHERE memberid = ?) OR ownerid = ?;' 
    db.query(sql, [id, id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getmilestonedetails/:idmilestones', (req, res) => {
    const idmilestones = req.params.idmilestones
    const sql = 'SELECT DISTINCT milestones.*, COUNT(DISTINCT postid) as count FROM milestone_db.postmilestones '+
                'RIGHT JOIN milestone_db.milestones ON milestoneid = idmilestones '+ 
                'WHERE idmilestones = ?;'
    db.query(sql, [idmilestones], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getwidgetpost/:userid', (req, res) => {
    const userid = req.params.userid
    const sql = 'SELECT * FROM milestone_db.userposts WHERE ownerid != ? AND public = 1 '+
                'ORDER BY date DESC '+ 
                'LIMIT 1 OFFSET 0;'
    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/api/registeruser', (req, res)=> {
    const name = req.body.username
    const milestones = req.body.milestones
    const blurb = req.body.blurb
    const password = req.body.password
    const friends = req.body.friends
    const groupcount = req.body.groupcount
    const email = req.body.email
    const fullname = req.body.fullname
    const src = req.body.src
    const public = req.body.public
    const favoriteid = req.body.favoriteid
    db.query(
    'INSERT INTO users (name, milestones, blurb, password, friends, groupcount, email, fullname, src, public, favoriteid) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
    [name, milestones, blurb, password, friends, groupcount, email, fullname, src, public, favoriteid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("successfully registered")
        }
    })
})
app.post('/api/pushposts', (req, res)=> {
    const idposts = req.body.idposts
    const username = req.body.username
    const caption = req.body.caption
    const profilepic = req.body.profilepic
    const src = req.body.src
    const date = req.body.date
    const ownerid = req.body.ownerid
    const likes = req.body.likes
    const comments = req.body.comments
    const public = req.body.public
    db.query('INSERT INTO userposts (idposts, username, caption, profilepic, src, date, ownerid, likes, comments, public) VALUES (?,?,?,?,?,?,?,?,?,?)', 
    [idposts, username, caption, profilepic, src, date, ownerid, likes, comments, public], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})
app.post('/api/postmilestones', (req, res) => {
    const title = req.body.title
    const src = req.body.src
    const streak = req.body.streak
    const description = req.body.description
    const ownerid = req.body.ownerid
    const postable = req.body.postable
    const viewable = req.body.viewable
    const duration = req.body.duration
    const token = req.body.token
    db.query('INSERT INTO milestones (title, src, streak, description, ownerid, postable, viewable, duration, token) VALUES (?,?,?,?,?,?,?,?,?)',
    [title, src, streak, description, ownerid, postable, viewable, duration, token], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})
app.post('/api/linkmilestones', (req, res) => {
    const postid = req.body.postid
    const milestoneid = req.body.milestoneid
    db.query('INSERT INTO postmilestones (postid, milestoneid) VALUES (?,?)',
    [postid, milestoneid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})
app.post('/api/requestfriend', (req, res)=> {
    const requesterid = req.body.requesterid
    const recipientid = req.body.recipientid
    const approved = req.body.approved
    db.query('INSERT INTO friends (requesterid, recipientid, approved) VALUES (?,?,?)',
    [requesterid, recipientid, approved], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            result.send("friend request successful")
        }
    })
})
app.post('/api/postcomment', (req, res) => {
    const postid = req.body.postid
    const userid = req.body.userid
    const comment = req.body.comment
    db.query('INSERT INTO postcomments (postid, userid, comment) VALUES (?,?,?)',
    [postid, userid, comment], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("posted comment")
        }
    })
})
app.post('/api/likepost', (req, res) => {
    const postid = req.body.postid
    const userid = req.body.userid
    db.query('INSERT INTO postlikes (postid, userid) VALUES (?,?)',
    [postid, userid], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.send("post all good sir")
        }
    })
})
app.post('/api/likenotification', (req, res) => {
    const requesterId = req.body.requesterId
    const recipientId = req.body.recipientId
    const type = req.body.type
    const postId = req.body.postId
    db.query('INSERT INTO notifications (requesterId, recipientId, type, postId) VALUES (?,?,?,?)',
    [requesterId, recipientId, type, postId], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("like notification sent")
        }
    })
})
app.post('/api/commentnotification', (req, res) => {
    const requesterId = req.body.requesterId
    const recipientId = req.body.recipientId
    const type = req.body.type
    const comment = req.body.comment
    const postId = req.body.postId
    db.query('INSERT INTO notifications (requesterId, recipientId, type, comment, postId) VALUES (?,?,?,?,?)',
    [requesterId, recipientId, type, comment, postId], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("comment notification sent")
        }
    })
})
app.post('/api/friendnotification', (req, res) => {
    const requesterId = req.body.requesterId
    const recipientId = req.body.recipientId
    const type = req.body.type
    db.query('INSERT INTO notifications (requesterId, recipientId, type) VALUES (?,?,?)',
    [requesterId, recipientId, type], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("friend notification sent")
        }
    })
})
app.post('/api/acceptnotification', (req, res) => {
    const requesterId = req.body.requesterId
    const recipientId = req.body.recipientId
    const type = req.body.type
    db.query('INSERT INTO notifications (requesterId, recipientId, type) VALUES (?,?,?)',
    [requesterId, recipientId, type], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("accept notification sent")
        }
    })
})

app.post('/api/postnotification', (req, res) => {
    const requesterId = req.body.requesterId
    const recipientId = req.body.recipientId
    const type = req.body.type
    const postId = req.body.postId
    const milestoneId = req.body.milestoneId
    db.query('INSERT INTO notifications (requesterId, recipientId, type, postId, milestoneId) VALUES (?,?,?,?,?)',
    [requesterId, recipientId, type, postId, milestoneId], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("friend notification sent")
        }
    })
})

// send request to Expo HTTP API for push notifications
app.post('/api/send-push-notification', async (req,res) => {
    const expoPushToken = req.body.expoPushToken
    const message = req.body.message
    const headers = {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {headers});
        const { data } = response;
        const {data: pushTickets, errors} = data;
        if (errors) {
            console.log('Errors sending push notifications:', errors)
            res.status(500).json({error:errors})
        }
        else {
            res.status(200).json({ pushTickets });
        }
    } 
    catch (error) {
        console.log('Error sending push notification:', error);
        res.status(500).json({ error: 'Error sending push notification' });
    }
})

app.post('/api/get-push-receipts', async (req,res) => {
    const ids = req.body.ids
    const headers = {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/getReceipts',{ids:ids}, {headers});
        const { data } = response;
        const {data: pushReceipts, errors} = data;
        if (errors) {
            console.log('Error getting push receipts:', errors)
            res.status(500).json({error:errors})
        }
        else {
            res.status(200).json({ pushReceipts });
        }
    } 
    catch (error) {
        console.log('Error getting push receipts:', error);
        res.status(500).json({ error: 'Error getting push receipts.' });
    }
})
app.post('/api/postmember', (req, res) => {
    const idmilestones = req.body.idmilestones
    const memberid = req.body.userid
    db.query('INSERT INTO members (idmilestones, memberid) VALUES (?,?);',
    [idmilestones, memberid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("friend notification sent")
        }
    })
})


app.put('/api/updatepost', (req, res) => {
    const postid = req.body.postid
    const caption = req.body.caption
    const likes = req.body.likes
    const comments = req.body.comments
    const public = req.body.public
    db.query('UPDATE userposts SET caption = ?, likes = ?, comments = ?, public = ? WHERE idposts = ?', [caption, likes, comments, public, postid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/updateuser', (req, res) => {
    const userid = req.body.userid
    const username = req.body.username
    const fullname = req.body.fullname
    const email = req.body.email
    const description = req.body.description
    const src = req.body.src
    db.query('UPDATE users SET name = ?, blurb = ?, email = ?, fullname = ?, src = ? WHERE id = ?', [username, description, email, fullname, src, userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/updatemilestone', (req, res) => {
    const milestoneid = req.body.milestoneid
    const title = req.body.title
    const description = req.body.description
    const src = req.body.src
    const postable = req.body.postable
    const viewable = req.body.viewable
    const duration = req.body.duration
    const token = req.body.token
    db.query('UPDATE milestones SET title = ?, description = ?, src = ?, postable = ?, viewable = ?, duration = ?, token = ? WHERE idmilestones = ?',
    [title, description, src, postable, viewable, duration, token, milestoneid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/favoritemilestone', (req, res) => {
    const userid = req.body.userid
    const milestoneid = req.body.milestoneid
    db.query('UPDATE users SET favoriteid = ? WHERE id = ?', [milestoneid, userid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/confirmuser', (req, res) => {     // for email confirmation on register
    const confirmed = req.body.confirmed
    const username = req.body.username
    db.query('UPDATE users SET confirmed = ? WHERE name = ?', [confirmed, username],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    }
    )
})
app.put('/api/acceptfriend', (req, res) => {
    const requesterid = req.body.requesterid
    const recipientid = req.body.recipientid
    db.query('UPDATE friends SET approved = ? WHERE requesterid = ? AND recipientid = ?', [true, requesterid, recipientid],
    (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/updatetoken', (req, res) => {
    const id = req.body.id
    const token = req.body.token
    db.query('UPDATE users SET pushtoken = ? WHERE id = ?', [token, id],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/cleartoken', (req, res) => {
    const token = req.body.token
    db.query('UPDATE users SET pushtoken = ? WHERE pushtoken = ?', [null, token],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.put('/api/updatemilestonetoken', (req, res) => {    // need to put this in ec2 to update duration token
    const id = req.body.id
    const token = req.body.token
    db.query('UPDATE milestones SET token = ? WHERE idmilestones = ?', [token, id],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.delete('/api/deletefriend', (req, res) => {
    const requesterid = req.body.requesterid
    const recipientid = req.body.recipientid
    db.query("DELETE FROM friends WHERE requesterid = ? AND recipientid = ?", [requesterid, recipientid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('deleted post')
        }
    })
})
app.delete('/api/deletemilestone', (req, res) => {
    const milestoneid = req.body.milestoneid
    db.query("DELETE FROM milestones WHERE idmilestones = ?", [milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('deleted post')
        }
    })
})
app.delete('/api/removelinkedposts', (req, res) => {
    const milestoneid = req.body.milestoneid
    db.query("DELETE FROM postmilestones WHERE milestoneid = ?", [milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/deletepost', (req, res) => {
    const postid = req.body.postid
    db.query("DELETE FROM userposts WHERE idposts = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('deleted post')
        }
    })
})
app.delete('/api/removelinked', (req, res) => {
    const postid = req.body.postid
    db.query("DELETE FROM postmilestones WHERE postid = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/unlikepost', (req, res) => {
    const postid = req.body.postid
    const userid = req.body.userid
    db.query("DELETE FROM postlikes WHERE postid = ? AND userid = ?", [postid, userid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/removelinktag', (req, res) => {
    const postid = req.body.postid
    const milestoneid = req.body.milestoneid
    db.query("DELETE FROM postmilestones WHERE postid = ? AND milestoneid = ?", [postid, milestoneid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/deletecomments', (req, res) => {
    const postid = req.body.postid
    db.query("DELETE FROM postcomments WHERE postid = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/deletelikes', (req, res) => {
    const postid = req.body.postid
    db.query("DELETE FROM postlikes WHERE postid = ?", [postid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('linked milestones removed')
        }
    })
})
app.delete('/api/deletenotification', (req, res) => {
    const idnotifications = req.body.idnotifications
    db.query("DELETE FROM notifications WHERE idnotifications = ?", [idnotifications], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('notification removed')
        }
    })
})
app.delete('/api/clearnotifications', (req, res) => {
    const recipientId = req.body.recipientId
    db.query("DELETE FROM notifications WHERE recipientId = ?", [recipientId], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('notifications cleared')
        }
    })
})
app.delete('/api/clearmembers', (req, res) => {
    const idmilestones = req.body.idmilestones
    db.query("DELETE FROM milestone_db.members WHERE idmilestones = ?", [idmilestones], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('members cleared')
        }
    })
})
app.delete('/api/removemember', (req, res) => {
    const userid = req.body.userid
    const idmilestones = req.body.idmilestones
    db.query("DELETE FROM milestone_db.members WHERE memberid = ? AND idmilestones = ?", [userid, idmilestones], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send('member removed')
        }
    })
})

// pagination
app.get('/api/paginateposts/:userid/:next/:current', (req, res) => {
    const userid = req.params.userid
    const next = req.params.next
    const current = req.params.current
    const sql = 'SELECT * FROM userposts WHERE public = 1 OR ownerid = ? ORDER BY date DESC LIMIT ? OFFSET ?;' 
    db.query(sql, [userid, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/paginatearchive/:ownerid/:userid/:next/:current', (req, res) => {
    const ownerid = req.params.ownerid
    const userid = req.params.userid
    const next = req.params.next
    const current = req.params.current
    const sql = 'SELECT * FROM milestone_db.userposts '+
                'WHERE ownerid = ? AND (public = 1 OR ownerid = ?) ORDER BY date DESC LIMIT ? OFFSET ?;' 
    db.query(sql, [ownerid, userid, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/paginatemilestones/:userid/:next/:current', (req, res) => {
    const userid = req.params.userid
    const next = Number(req.params.next)
    const current = Number(req.params.current)
    const sql = 'SELECT DISTINCT milestones.*, '+
                'SUM( CASE ' +
                'WHEN (postmilestones.milestoneid = idmilestones AND idposts = postid AND (userposts.public = 1 OR userposts.ownerid = ?)) THEN 1 ELSE 0 '+
                'END ) as count '+
                'FROM milestone_db.milestones '+
                'LEFT JOIN (SELECT DISTINCT * FROM milestone_db.postmilestones) postmilestones ON (idmilestones = milestoneid) '+
                'LEFT JOIN milestone_db.userposts ON (idposts = postid AND (public = 1 OR userposts.ownerid = ?)) '+
                'GROUP BY idmilestones '+
                'ORDER BY MAX(userposts.date) DESC LIMIT ? OFFSET ?; '
    db.query(sql, [userid, userid, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/paginateusers/:next/:current', (req, res) => {
    const next = req.params.next
    const current = req.params.current
    const sql = 'SELECT * FROM milestone_db.users LIMIT ? OFFSET ?;'
    db.query(sql, [next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/paginatefriends/:userid/:next/:current', (req, res) => {
    const userid = req.params.userid
    const next = req.params.next
    const current = req.params.current
    const sql = 'SELECT DISTINCT users.*, friends.approved FROM milestone_db.users '+
                'JOIN milestone_db.friends ON (id = requesterId OR id = recipientId) '+
                'WHERE id IN ( '+
                'SELECT requesterId FROM milestone_db.friends WHERE (recipientId = ?) UNION '+
                'SELECT recipientId FROM milestone_db.friends WHERE (requesterId = ?)) '+
                'LIMIT ? OFFSET ?;'
    db.query(sql, [userid, userid, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/paginatelinkedposts/:idmilestones/:userid/:next/:current', (req, res) => {
    const idmilestones = req.params.idmilestones
    const userid = req.params.userid
    const next = req.params.next
    const current = req.params.current
    const sql = 'SELECT DISTINCT * FROM milestone_db.userposts '+
                'WHERE idposts IN (SELECT postid FROM milestone_db.postmilestones WHERE milestoneid = ?) '+
                'AND (public = 1 OR ownerid = ?) ' +
                'ORDER BY date DESC LIMIT ? OFFSET ?;'
    db.query(sql, [idmilestones, userid, next, current], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


app.listen(19001, () => {
    console.log("ayo server running on port 19001")
})