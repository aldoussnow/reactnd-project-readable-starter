import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';
import CommentComponent from './CommentComponent';
import {formatDate} from '../utils/utils';
import {withRouter} from "react-router";
import {_deletePost, SCREENS} from "../actions";
import {switchVisibleScreen} from "../actions/navigation";
import {_updateVotePost} from '../actions/posts';

class PostDetailComponent extends Component {

    constructor() {
        super();
        this.getVisiblePost = this.getVisiblePost.bind(this);
    }

    render() {
        let post = this.props.location.state;
        const title = (
            <h3>{post.title}</h3>
        );
        const {updateVotePost, visiblePosts} = this.props;
        return (<div className='details'>
            {this.getVisiblePost(visiblePosts, post).map((post)=> {
                    return (<div key={post.id}>
                        <Panel
                            key={'panel_' + post.id}
                            header={<div>
                                <span>{title} Date: {formatDate(post.timestamp)} from: {post.author || 'unknown'}</span>
                                <span className="controls">
                                    <a onClick={() => this.editPost(post)} className='control'><i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a>
                                    &nbsp;
                                    <a onClick={() => this.deletePost(post)} className='control'><i className="fa fa-trash-o" aria-hidden="true"></i>Delete</a>
                                </span>
                                <span className='votes'>
                                    <i onClick={() => updateVotePost(post, 'upVote')} className='fa fa-thumbs-up' aria-hidden='true'></i>
                                    <i onClick={() => updateVotePost(post, 'downVote')} className='fa fa-thumbs-down' aria-hidden='true'></i>
                                    <span className='vote-score'>{post.voteScore}</span>
                                </span>
                            </div>}
                            footer={<a href='' onClick={() => this.editPost(post)}><i className="fa fa-pencil-square-o"></i>&nbsp;Edit</a>}>
                            <div className='post'>{post.body}</div>
                            {<CommentComponent key={'comment_' + post.id} postId={post.id}/>}
                        </Panel>
                    </div>)
            })}
            {(!post || Object.keys(post).length === 0) && <div className='no-details'>Keine details verfügbar</div>}
        </div>);
    }

    getVisiblePost(visiblePosts, post) {
        return visiblePosts && post ?
            Object.keys(post).length > 0 && visiblePosts.filter((p) => p.id === post.id) :
            [post];
    }

    editPost(post) {
        this.props.history.push({pathname: `/${post.category}/${post.id}/edit`, state: post});
        this.props.navigate(SCREENS.POST);
    }

    deletePost(post) {
        this.props.deletePost(post).then(()=> {
            this.props.history.push({pathname: `/${post.category}`});
            this.props.navigate(SCREENS.HOME);
        })

    }
}

function mapStateToProps({posts}) {
    return Object.assign({}, {visiblePosts: posts.visiblePosts});
}


function mapDispatchToProps(dispatch) {
    return {
        navigate: (data) => dispatch(switchVisibleScreen(data)),
        updateVotePost: ({id}, option) => dispatch(_updateVotePost(id, option)),
        deletePost: (post) => dispatch(_deletePost(post))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(PostDetailComponent));