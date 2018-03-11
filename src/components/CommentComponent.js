import React, {Component} from 'react';
import {Well, FormControl, FormGroup, Col, Form, ControlLabel, Button, Badge} from 'react-bootstrap';
import {connect} from 'react-redux';
import * as api from "../utils/api";
import 'font-awesome/css/font-awesome.min.css';
import {_addComment, _deleteComment, _editComment, addComments, clearComments} from "../actions";
import * as _ from "lodash";

class CommentComponent extends Component {

    state = {
        loadingComments: true,
        addModus: false,
        newComment: ''
    };

    constructor(props) {
        super(props);
        this.fetchComments = this.fetchComments.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    render() {
        const {loadingComments, editModeComments, addModus} = this.state;
        const {deleteComment, comments} = this.props;
        return (<div className='comments'>
            <hr/>
            Comments: <Badge>{comments ? comments.length : 0}</Badge>
            {!loadingComments && comments && comments.length > 0 && comments.map((comment, i) => {
                return (
                    <div key={comment.id}>
                        {!editModeComments[i] ?
                            <Well key={i}>
                                {comment.body}
                                <span className='controls'>
                            <a onClick={() => this.setState({editModeComments: editModeComments.map((e, index) => {
                                    return index === i ? true : e;
                                })})}
                               className='control'><i
                                className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a>
                            <a onClick={() => deleteComment(comment)} className='control'><i
                                className="fa fa-trash-o" aria-hidden="true"></i>Delete</a>
                        </span>
                            </Well> :

                            <div className='form'>
                                <Form horizontal>
                                    <FormGroup controlId="formHorizontalTitle">
                                        <Col sm={10}>
                                            <FormControl defaultValue={comment.body}
                                                         onChange={(ev) => comment.body = ev.target.value} type="text"
                                                         placeholder="Comment"/>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <FormGroup>
                                    <a onClick={() => this.leaveEditMode(comment)}
                                       className='control'>Leave Editmode</a>
                                </FormGroup>
                            </div>}

                    </div>

                );
            })}
            {!loadingComments && (!comments || comments.length === 0) &&
            <div className='no-comments'>No comments for this post</div>}
            {loadingComments && <div className='loading-comments'>Loading comments</div>}
            {addModus ? (
                    <form>
                        <FormGroup>
                            <ControlLabel>Please comment:</ControlLabel>
                            <FormControl
                                defaultValue={this.state.newComment}
                                onChange={(ev) => this.setState({newComment: ev.target.value})}
                                componentClass="textarea"
                                placeholder="Please leave your comment"/>
                        </FormGroup>
                        <Button onClick={this.submitComment}  bsSize="large" block
                                bsStyle="primary">Submit</Button>
                    </form>
                ) :
                <a onClick={() => this.setState({addModus: true})} className="add-comment"><i
                    className="fa fa-plus-square"
                    aria-hidden="true"></i><span>Add Comment</span></a>
            }
        </div>);
    }

    componentDidMount() {
        this.setState({loadingComments: true});
        this.fetchComments(this.props.postId);
    }

    componentWillUnmount() {
        this.props.clearComments();
    }

    submitComment(){
        const {newComment} = this.state;
        const {postId} = this.props;
        const comment = {
            body: newComment,
            parentId: postId
        };
        this.props.addComment(comment)
            .then(()=> {
                this.setState({newComment: '', addModus: false, editModeComments: this.props.comments.map(()=> false)});
            });
    }

    leaveEditMode(comment) {
        const {editModeComments} = this.state;
        const {editComment, comments} = this.props;
        const i = _.indexOf(comments, comment);
        this.props.editComment(comment).then(()=> {
            editComment(comment).then(() => {
                this.setState({editModeComments: editModeComments.map((v, index) => index === i ? false : v)});
            });
        });
    }

    deleteComment(comment) {
        this.props.deleteComment(comment).then(comments => this.setState({loadingComments: false, editModeComments: comments.map(() => false)}))
    }

    fetchComments(postId) {
        api
            .readComments(postId)
            .then(comments => {
                this.setState({loadingComments: false, editModeComments: comments.map(() => false)});
                this.props.addComments(comments);
            });
    }
}

function mapDispatchToProps(dispatch) {
    return {
        editComment: (comment) => dispatch(_editComment(comment)),
        deleteComment: (comment) => dispatch(_deleteComment(comment)),
        addComment: (comment) => dispatch(_addComment(comment)),
        addComments:(comments) => dispatch(addComments(comments)),
        clearComments: ()=> dispatch(clearComments())
    }
}

function mapStateToProps({comments}) {
    return Object.assign({}, comments);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentComponent);