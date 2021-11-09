import {
	SET_ACTIVE_TAB,
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	TOGGLE_CALL_MODAL,
	CHANGE_VIEW
} from "./constants";

export const setActiveTab = (tabId) => ({
	type: SET_ACTIVE_TAB,
	payload: tabId
});

export const openUserSidebar = () => ({
	type: OPEN_USER_PROFILE_SIDEBAR
});

export const closeUserSidebar = () => ({
	type: CLOSE_USER_PROFILE_SIDEBAR
});

export const toggleCallModal = () => ({
	type: TOGGLE_CALL_MODAL
})
export const changeView = (payload) => ({
	type: CHANGE_VIEW,
	payload
})
export const setconversationNameInOpenChat = (conversationName) => ({
	type: SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	payload: conversationName
});
