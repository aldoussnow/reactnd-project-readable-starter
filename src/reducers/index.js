import { combineReducers } from 'redux';
import categories from './categories';
import posts from './posts';
import comments from './comments';
import navigation from './navigation';
import category from './category';

const rootReducer = combineReducers({categories, posts, comments, navigation, category});
export default rootReducer;