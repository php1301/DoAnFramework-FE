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
        console.log(this.props.data)
        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props?.data || this.props.users} />
                {/* {this.props?.data?.map(vl => {
                    <div>{vl.Code}</div>
                })} */}
                {/* user chat */}
                <UserChat recentChatList={this.props.users} />

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {

    const { users, data } = state.Chat;
    return { users, data };
};

export default connect(mapStateToProps, { requestChatHistory })(Index);