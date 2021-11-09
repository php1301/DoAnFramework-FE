import React from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";
import { useInterval } from "../../helpers/use-interval";
import { connect } from "react-redux";


const Index = (props) => {
    const Code = localStorage.getItem("authUser");
    useInterval(() => {
        props.connection.invoke("SendActiveFriends", Code)
    }, 5000);
    return (
        <React.Fragment >
            {/* chat left sidebar */}
            < ChatLeftSidebar recentChatList={props.users} />

            {/* user chat */}
            {this.props.active_user && <UserChat recentChatList={props.users} />}

        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
    const { users, active_user, connection } = state.Chat;
    return { users, active_user, connection };
};

export default connect(mapStateToProps, {})(Index);