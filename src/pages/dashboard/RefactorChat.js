import React, { Component } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";
import { requestChatHistory } from "../../redux/actions"
import { connect } from "react-redux";


class Index extends Component {
    componentDidMount() {
        this.props.requestChatHistory()
    }


    render() {
        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props?.data || this.props.users} />
                {/* {this.props?.data?.map(vl => {
                    <div>{vl.Code}</div>
                })} */}
                {/* user chat */}
                {(this.props.active_user?.Code || this.props.active_user?.UserCode) && <UserChat recentChatList={this.props.users} />}

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {

    const { users, data, active_user } = state.Chat;
    return { users, data, active_user };
};

export default connect(mapStateToProps, { requestChatHistory })(Index);