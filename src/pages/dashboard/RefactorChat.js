import React, { useEffect } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";
import { requestChatHistory } from "../../redux/actions"
import { connect } from "react-redux";
import { useInterval } from "../../helpers/use-interval";
import CallModal from "./UserChat/CallModal";
import CallLog from "./UserChat/CallLog";
import IncomingCallModal from "./UserChat/IncomingCallModal";

const Index = (props) => {
    const Code = localStorage.getItem("authUser");
    useInterval(() => {
        props.connection.invoke("SendActiveFriends", Code)
    }, 5000);
    useEffect(() => {
        props.requestChatHistory()
    }, [])


    return (
        <React.Fragment>
            {/* chat left sidebar */}
            <ChatLeftSidebar recentChatList={props?.data || props.users} />
            {/* {this.props?.data?.map(vl => {
                    <div>{vl.Code}</div>
                })} */}
            {/* user chat */}
            {props?.view === "Chat" ? ((props.active_user?.Code || props.active_user?.UserCode) && <UserChat recentChatList={props.users} />) : (<CallLog detailCallHistory={props?.detailCallHistory} />)}
            {props?.callingUser && !props.incomingCallUrl && <CallModal />}
            {!props?.callingUser && props.incomingCallUrl && <IncomingCallModal />}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {

    const { users, data, active_user, connection } = state.Chat;
    const { callingUser, incomingCallUrl, detailCallHistory } = state?.Call;
    const { view } = state?.Layout;
    return { users, data, active_user, connection, callingUser, incomingCallUrl, detailCallHistory, view };
};

export default connect(mapStateToProps, { requestChatHistory })(Index);