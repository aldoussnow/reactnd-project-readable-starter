import {SWITCH_VISIBLE_SCREEN} from "./types";

export const SCREENS = {
    HOME: '',
    POST: 'post',
    POST_DETAILS: 'post-details'
};

export function switchVisibleScreen(visibleScreen) {
    return {
        type: SWITCH_VISIBLE_SCREEN,
        visibleScreen
    };
}