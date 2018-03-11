import React, {Component} from 'react';
import {Tabs, Tab, ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {filterPosts, setCategory} from '../actions';
import PostComponent from './PostComponent';
import * as _ from 'lodash';
import {firstLetterUpperCase} from '../utils/utils';

class CategoryTab extends Component {

    state = {
        orderBy: 'timestamp'
    };

    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.orderBy = this.orderBy.bind(this);
    }

    render() {
        const {categories} = this.props;
        const {orderBy} = this.state;
        const {category} = _.size(this.props.category) > 0 ? this.props.category  : {category:'all'};
        return [
            <ButtonToolbar key={'button-toolbar'}>
                <ButtonGroup>
                    <Button key={'voteScore'} active={orderBy === 'voteScore'} onClick={()=> this.orderBy('voteScore')}>voteScore</Button>
                    <Button key={'timestamp'} active={orderBy === 'timestamp'} onClick={()=> this.orderBy('timestamp')}>timestamp</Button>
                </ButtonGroup>
            </ButtonToolbar>,
            <Tabs key={'tabs'} activeKey={category} onSelect={this.handleSelect} id="controlled-tab-example">
                <Tab key={'all'} eventKey={'all'} title="All">
                    <PostComponent orderByField={orderBy} category={category}/>
                </Tab>
                {categories && categories.length && categories.map((category) => {
                    return (
                        <Tab key={category.name} eventKey={category.name} title={firstLetterUpperCase(category.name)}>
                            <PostComponent orderByField={orderBy} />
                        </Tab>)
                })}
            </Tabs>
            ];
    }

    handleSelect(key) {
        this.props.filterPosts(key);
        window.history.pushState(null, null, `/${key}`);
        this.props.setCategory(key);
    }

    orderBy(orderBy) {
        this.setState({orderBy});
    }
}

function mapStateToProps({categories, category}) {
    return Object.assign({}, categories, {category});
}

function mapDispatchToProps(dispatch) {
    return {
        filterPosts: (category) => dispatch(filterPosts(category)),
        setCategory: (category) => dispatch(setCategory(category))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryTab);