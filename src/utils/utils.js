import * as _ from 'lodash';
import * as moment from 'moment';

export function firstLetterUpperCase (word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1, word.length -1);
}

export function orderPosts(posts, byField) {
    if (byField.indexOf('voteScore') === -1 && byField.indexOf('timestamp') === -1) {
        throw new Error('Order by only possible by voteScore or timestamp');
    }
    return _.orderBy(posts, byField)
}

export function formatDate(date) {
    return moment(date).format('MM/DD/YYYY');
}