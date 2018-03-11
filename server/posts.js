const clone = require('clone')

let db = {
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJNaWtlIiwibmJmIjoxNTE0MTExNjQ4LCJleHAiOjE1MTQxMTUyNDgsImlhdCI6MTUxNDExMTY0OCwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczovL2V4YW1wbGUuY29tL3JlZ2lzdGVyIn0.24GsMoiqhdBuYSagoHzGiwQKilJn7WsxkLniTi7shuo': {
        "8xf0y6ziyjabvozdd253nd": {
            id: '8xf0y6ziyjabvozdd253nd',
            timestamp: 1467166872634,
            title: 'Udacity is the best place to learn React',
            body: 'Everyone says so after all.',
            author: 'thingtwo',
            category: 'react',
            voteScore: 6,
            deleted: false,
            commentCount: 2
        },
        "6ni6ok3ym7mf1p33lnez": {
            id: '6ni6ok3ym7mf1p33lnez',
            timestamp: 1468479767190,
            title: 'Learn Redux in 10 minutes!',
            body: 'Just kidding. It takes more than 10 minutes to learn technology.',
            author: 'thingone',
            category: 'redux',
            voteScore: -5,
            deleted: false,
            commentCount: 0
        }
    }
}


function getData(token) {
    return db[token];
}

function setData(token, post) {
    db[token] = db[token] ? db[token] : {};
    db[token][post.id] = {
        id: post.id,
        timestamp: post.timestamp,
        title: post.title,
        body: post.body,
        author: post.author,
        category: post.category,
        voteScore: 1,
        deleted: false,
        commentCount: 0
    };
}

function getByCategory(token, category) {
    return new Promise((res) => {
        let posts = getData(token)
        let keys = Object.keys(posts)
        let filtered_keys = keys.filter(key => posts[key].category === category && !posts[key].deleted)
        res(filtered_keys.map(key => posts[key]))
    })
}

function get(token, id) {
    return new Promise((res) => {
        const posts = getData(token)
        res(
            posts[id].deleted
                ? {}
                : posts[id]
        )
    })
}

function getAll(token) {
    return new Promise((res) => {
        const posts = getData(token)
        let keys = Object.keys(posts)
        let filtered_keys = keys.filter(key => !posts[key].deleted)
        res(filtered_keys.map(key => posts[key]))
    })
}

function add(token, post) {
    return new Promise((res) => {
        setData(token, post);
        res(getData(token)[post.id]);
    })
}

function vote(token, id, option) {
    return new Promise((res) => {
        let posts = getData(token)
        let post = posts[id]
        switch (option) {
            case "upVote":
                post.voteScore = post.voteScore + 1
                break
            case "downVote":
                post.voteScore = post.voteScore - 1
                break
            default:
                console.log(`posts.vote received incorrect parameter: ${option}`)
        }
        db[token] = posts;
        res(post)
    })
}

function disable(token, id) {
    return new Promise((res) => {
        let posts = getData(token)
        posts[id].deleted = true
        res(posts[id])
    })
}

function edit(token, id, post) {
    return new Promise((res) => {
        let posts = getData(token);
        for (var prop in post) {
            posts[id][prop] = post[prop]
        }
        db[token] = posts;
        res(posts[id])
    })
}

function incrementCommentCounter(token, id, count) {
    const data = getData(token)
    if (data[id]) {
        data[id].commentCount += count
    }
}

module.exports = {
    get,
    getAll,
    getByCategory,
    add,
    vote,
    disable,
    edit,
    getAll,
    incrementCommentCounter
}
