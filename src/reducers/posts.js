import {ADD_POSTS, EDIT_POST, FILTER_POSTS, CREATE_POST, UPDATE_VOTE_POST, DELETE_POST} from '../actions';
import * as _ from 'lodash';

export default function posts(state = {}, action) {
    let posts = state.posts ? state.posts.slice() : [];
    let visiblePosts = state.visiblePosts ? state.visiblePosts.slice() : [];
    switch (action.type) {
        case FILTER_POSTS:
            return Object.assign({}, state, {
                visiblePosts: action.category === 'all' ? posts : posts.filter((post) => post.category === action.category)
            });
        case ADD_POSTS:
            posts = _.union(posts, action.posts);
            return Object.assign({}, state, {posts});
        case CREATE_POST:
            posts = _.union(posts, [action.post]);
            return Object.assign({}, state, {posts});
        case EDIT_POST:
            posts = _.uniqBy(_.union([action.post], posts), (post)=>post.id);
            return Object.assign({}, state, {posts});
        case UPDATE_VOTE_POST:
            let visiblePost = visiblePosts.filter((post) => post.id === action.id)[0];
            visiblePost.voteScore += action.option === 'upVote' ? 1 : -1;
            return Object.assign({}, state, {posts, visiblePosts});
        case DELETE_POST:
            posts = posts.filter((post) => post.id !== action.post.id);
            visiblePosts = visiblePosts.filter((post) => post.id !== action.post.id);
            return Object.assign({}, state, {posts, visiblePosts});
        default:
            return state;
    }
}