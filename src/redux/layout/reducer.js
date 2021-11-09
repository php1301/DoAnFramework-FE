// @flow
import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	TOGGLE_CALL_MODAL,
	CHANGE_VIEW
} from "./constants";

const INIT_STATE = {
	activeTab: "chat",
	userSidebar: false,
	conversationName: "Doris Brown",
	callModal: false,
	view: "Chat",
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_ACTIVE_TAB:
			return {
				...state,
				activeTab: action.payload
			};

		case OPEN_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: true
			};
		case CHANGE_VIEW:
			return {
				...state,
				view: action?.payload
			};
		case CLOSE_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: false
			};
		case TOGGLE_CALL_MODAL:
			return {
				...state, callModal: !state.callModal
			}
		case SET_CONVERSATION_NAME_IN_OPEN_CHAT:
			return {
				...state,
				conversationName: action.payload
			};
		default:
			return state;
	}
};

export default Layout;
