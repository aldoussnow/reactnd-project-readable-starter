import * as jwtDecode from 'jwt-decode';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJNaWtlIiwibmJmIjoxNTE0MTExNjQ4LCJleHAiOjE1MTQxMTUyNDgsImlhdCI6MTUxNDExMTY0OCwianRpIjoiaWQxMjM0NTYiLCJ0eXAiOiJodHRwczovL2V4YW1wbGUuY29tL3JlZ2lzdGVyIn0.24GsMoiqhdBuYSagoHzGiwQKilJn7WsxkLniTi7shuo';
const host = `http://localhost:5000/`;

/**
 * Getter for the author from jwt token (used sub because,
 * the online generator had only specific fields)
 * @returns {string}
 */
export function getAuthor() {
    return jwtDecode(token).sub;
}

/**
 * Wrapper for server communcation
 * @param urlPartial
 * @param requestParams
 * @returns {Promise<any>}
 */
function f(urlPartial, requestParams) {
    return fetch(`${host}${urlPartial}`, Object.assign({}, requestParams || {}, {
        headers: {
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }))
        .then((res) => res.json());
}

/**
 * Get all of the categories available for the app. List is found in `categories.js`. Feel free to extend this list as you desire.
 * @returns {Promise<any>}
 */
export function readCategories() {
    const urlPartial = 'categories';
    return f(urlPartial);
}

/**
 * Get all of the posts for a particular category.
 * @param {string} category The category of which to fetch from
 * @returns {Promise<any>}
 */
export function readCategoryPosts(category) {
    if (!category) {
        throw new Error('category must be specified');
    }
    const urlPartial = `${category}/posts`;
    return f(urlPartial);
}

/**
 * Get all of the posts. Useful for the main page when no category is selected.
 * @returns {Promise<any>}
 */
export function readPosts() {
    const urlPartial = 'posts';
    return f(urlPartial);
}

/**
 * Add a new post. | **id** - UUID should be fine, but any unique id will work <br> **timestamp** - [Timestamp] Can in whatever format you like, you can use `Date.now()` if you like. <br> **title** - [String] <br> **body** - [String] <br> **author** - [String] <br> **category** -  Any of the categories listed in `categories.js`. Feel free to extend this list as you desire.
 * @param {object} post Variable data of the post
 * @returns {Promise<any>}
 */
export function createPost(post) {
    const {title, body, category} = post;
    if (!(title || body || category)) {
        throw new Error('You missed data that is necessary to post');
    }
    const id = Math.random().toString(36).replace(/[^a-z]+/g, '');
    const urlPartial = 'posts';
    const requestBody = {id, title, body, category, timestamp: Date.now(), author: getAuthor(), deleted: false};
    return f(urlPartial, {method: 'post', body: JSON.stringify(requestBody)});
}

/**
 * Get the details of a single post.
 * @param {string} id The UUID of the the post
 * @returns {Promise<any>}
 */
export function readPostId(id) {
    if (!id) {
        throw new Error('id must be specified');
    }
    const urlPartial = `posts/${id}`;
    return f(urlPartial);
}

/**
 * Used for voting on a post. | **option** - [String]: Either `"upVote"` or `"downVote"`.
 * @param {string} id UUID of the post
 * @param {string} option downVote | upVote
 * @returns {Promise<any>}
 */
export function updateVotePost(id, option) {
    const urlPartial = `posts/${id}`;
    if (!id) {
        throw new Error('id must be specified');
    }
    if (option !== 'upVote' && option !== 'downVote') {
        throw new Error('You must specify if you either want to up- or downVote a post');
    }
    let requestBody = {option};
    return f(urlPartial, {method: 'post', body: JSON.stringify(requestBody)});
}

/**
 * Edit the details of an existing post. | **title** - [String] <br> **body** - [String]
 * @param {object} post Payload of post to update
 * @returns {Promise<any>}
 */
export function updatePost(post) {
    const {id, title, body, category} = post;
    if (!(id || title || body || category)) {
        throw new Error('You missed data that is necessary to update a post');
    }
    const urlPartial = `posts/${id}`;
    return f(urlPartial, {method: 'put', body: JSON.stringify(post)});
}

/**
 *Sets the deleted flag for a post to 'true'. <br> Sets the parentDeleted flag for all child comments to 'true'.
 * @param post
 * @returns {Promise<any>}
 */
export function deletePost(post) {
    const {id} = post;
    if (!id) {
        throw new Error('id must be specified');
    }
    const urlPartial = `posts/${id}`;
    return f(urlPartial, {method: 'delete'});
}

/**
 * Get all the comments for a single post.
 * @returns {Promise<any>}
 */
export function readComments(postId) {
    const urlPartial = `posts/${postId}/comments`;
    if (!postId) {
        throw new Error('postId must be specified');
    }
    return f(urlPartial);
}

/**
 * Get the details for a single comment.
 * @param {string} commentId UUID of the comment
 * @returns {Promise<any>}
 */
export function readComment(commentId) {
    const urlPartial = `posts/${commentId}/comments`;
    if (!commentId) {
        throw new Error('commentId must be specified');
    }
    return f(urlPartial);
}

/**
 * Add a comment to a post. | **id** - Any unique ID. As with posts, UUID is probably the best here. <br> **timestamp** - [Timestamp] Get this however you want. <br> **body** - [String] <br> **author** - [String] <br> **parentId** - Should match a post id in the database.
 * @param {object} comment Payload of comment
 * @returns {Promise<any>}
 */
export function createComment(comment) {
    const urlPartial = `comments`;
    const {body, parentId} = comment;
    if (!(body || parentId)) {
        throw new Error('You missed data that is necessary to comment');
    }
    const id = Math.random().toString(36).replace(/[^a-z]+/g, '');
    const requestBody = {id, body, parentId, timestamp: Date.now(), author: getAuthor()};
    return f(urlPartial, {method: 'post', body: JSON.stringify(requestBody)});
}

/**
 * Used for voting on a comment. | **option** - [String]: Either `"upVote"` or `"downVote"`.
 * @param {string} id UUID of the post
 * @param {string} option downVote | upVote
 * @returns {Promise<any>}
 */
export function updateVoteComment(id, option) {
    const urlPartial = `comments/${id}`;
    if (!id) {
        throw new Error('id must be specified');
    }
    if (option !== 'upVote' && option !== 'downVote') {
        throw new Error('You must specify if you either want to up- or downVote a post');
    }
    return f(urlPartial, {method: 'post', body: {option}});
}

/**
 * Edit the details of an existing comment. | **timestamp** - timestamp. Get this however you want. <br> **body** - [String]
 * @param {object} comment Payload of the update
 * @returns {Promise<any>}
 */
export function updateComment(comment) {
    const {id, body} = comment;
    if (!(id || body)) {
        throw new Error('You missed data that is necessary to update a comment');
    }
    const urlPartial = `comments/${id}`;
    return f(urlPartial, {method: 'put', body: JSON.stringify(comment)});
}

/**
 * Sets a comment's deleted flag to `true`.
 * @param {object} comment The comment to delete
 * @returns {Promise<any>}
 */
export function deleteComment(comment) {
    const {id} = comment;
    if (!id) {
        throw new Error('id must be specified');
    }
    const urlPartial = `comments/${id}`;
    return f(urlPartial, {method: 'delete'});
}




