import React, { Component } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";


class Index extends Component {

    render() {

        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props.users} />

                {/* user chat */}
                {this.props.active_user && <UserChat recentChatList={this.props.users} />}

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { users, active_user } = state.Chat;
    return { users, active_user };
};

export default connect(mapStateToProps, {})(Index);