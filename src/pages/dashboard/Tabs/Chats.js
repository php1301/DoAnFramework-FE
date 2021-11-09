import React, { Component } from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { DateTime } from "luxon";
//simplebar
import SimpleBar from "simplebar-react";

//actions
import { setconversationNameInOpenChat, activeUser, chatLogs, startPollingActiveLists, changeView } from "../../../redux/actions"

//components
import OnlineUsers from "./OnlineUsers";

class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchChat: "",
            recentChatList: this.props.recentChatList || []
        }
        this.handleChange = this.handleChange.bind(this);
        this.openUserChat = this.openUserChat.bind(this);
    }

    componentDidMount() {
        const li = document.getElementById("conversation" + this.props.active_user);
        if (li) {
            li.classList.add("active");
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                recentChatList: this.props.recentChatList
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recentChatList !== nextProps.recentChatList) {
            this.setState({
                recentChatList: nextProps.recentChatList,
            });
        }
    }
    formatDate = (date) => {
        const currentDate = new Date();
        const dateCompare = DateTime.fromISO(date).toJSDate();

        if (currentDate.getDay() === dateCompare.getDay() &&
            currentDate.getMonth() === dateCompare.getMonth() &&
            currentDate.getFullYear() === dateCompare.getFullYear()
        ) {
            return DateTime.fromISO(date).toFormat("hh:mm a");;
        }

        return DateTime.fromISO(date).toFormat("dd/MM hh:mm a");;

    }
    handleChange(e) {
        this.setState({ searchChat: e.target.value });
        const search = e.target.value;
        let conversation = this.state.recentChatList;
        let filteredArray = [];

        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if (conversation[i]?.Name?.toLowerCase().includes(search) || conversation[i]?.Name?.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }

        //set filtered items to state
        this.setState({ recentChatList: filteredArray })

        //if input value is blanck then assign whole recent chatlist to array
        if (search === "") this.setState({ recentChatList: this.props.recentChatList })
    }

    openUserChat(e, chat) {

        e.preventDefault();
        this.props?.changeView("Chat")
        //find index of current chat in array
        // if (chat.IsGroup)
        //     this.props.chatLogs(chat.Code)
        //     else {
        //         this.props.chatLogs(null, chat.Code)
        //     }
        const Code = localStorage.getItem("authUser");
        this.props.chatLogs(chat.Code)
        if (chat?.LastMessage?.Id) {
            this.props.connection.invoke("SeenMessage", chat.LastMessage.Id, Code, chat.Code);
        }
        // set activeUser 
        let chatList = document.getElementById("chat-list");
        let clickedItem = e.target;
        let currentli = null;

        if (chatList) {
            const li = chatList.getElementsByTagName("li");
            //remove coversation user
            for (let i = 0; i < li.length; ++i) {
                if (li[i].classList.contains('active')) {
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for (let k = 0; k < li.length; ++k) {
                if (li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                }
            }
        }

        //activation of clicked coversation user
        if (currentli) {
            currentli?.classList.add('active');
        }

        const userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0]?.classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        const unread = document.getElementById("unRead" + chat.id);
        if (unread) {
            unread.style.display = "none";
        }
    }
    containUsersOnline = (chat) => {
        let flag = 1
        const data = this.props.active?.active?.length > 0 && this.props?.active?.active?.filter(c => c.code !== this.props?.active.userCode)
        data?.length > 0 && data?.every(c => {
            const exists = chat?.Users.findIndex(i => i.Code === c.code)
            if (exists !== -1) {
                flag = 2;
            }
        })
        return flag;
    }
    render() {
        const currentUser = localStorage.getItem("authUser")
        return (
            <React.Fragment>
                <div>
                    <div className="px-4 pt-4">
                        <h4 className="mb-4">Chats</h4>
                        <div className="search-box chat-search-box">
                            <InputGroup size="lg" className="mb-3 rounded-lg">
                                <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                    <i className="ri-search-line search-icon font-size-18"></i>
                                </span>
                                <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
                            </InputGroup>
                        </div>
                        {/* Search Box */}
                    </div>

                    {/* online users */}
                    <OnlineUsers chatLogs={this.props?.chatLogs} active={this.props?.active} />

                    {/* Start chat-message-list  */}
                    <div className="px-2">
                        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                        <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">

                            <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                                {
                                    this.state.recentChatList.map((chat, key) => {

                                        let whoIsTyping = ""
                                        chat?.typing?.data && chat?.typing?.data?.length > 0 && chat?.typing?.data.forEach((i, idx) => {
                                            if (chat?.typing?.data?.length < 3) {
                                                if (currentUser !== i.code) {
                                                    if (idx !== chat?.typing?.data?.length - 1)
                                                        whoIsTyping += i.userName + ", "
                                                    else {
                                                        whoIsTyping += i.userName
                                                    }
                                                }
                                            }
                                            else {
                                                whoIsTyping = "Nhiều người"
                                            }
                                        })
                                        return (
                                            <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : !chat.isTyping ? "typing" : key === this.props.active_user ? "active" : ""}>
                                                <Link to="#" onClick={(e) => this.openUserChat(e, chat)}>
                                                    <div className="d-flex">
                                                        {
                                                            chat.Avatar === "Resource/no_img.jpg" ?
                                                                <div className={`${this.containUsersOnline(chat) === 2 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3 ms-0`}>
                                                                    <div className="avatar-xs">
                                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                            {chat?.Type === "multi" ? chat?.Name?.charAt(1) : chat?.Name?.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                    {
                                                                        <span className="user-status"></span>
                                                                    }
                                                                </div>
                                                                :
                                                                <div className={`${this.containUsersOnline(chat) === 2 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3 ms-0`}>
                                                                    <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${chat?.Avatar}`} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                    {
                                                                        <span className="user-status"></span>
                                                                    }
                                                                </div>
                                                        }

                                                        <div className="flex-1 overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">{chat?.Name}</h5>
                                                            <p className="chat-user-message text-truncate mb-0">
                                                                {
                                                                    whoIsTyping && chat?.typing?.data && chat?.typing?.data?.length > 0 ?
                                                                        <>
                                                                            {whoIsTyping} typing<span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {
                                                                                (chat?.LastMessage?.Type === "media") ? <i className="ri-image-fill align-middle me-1"></i> : null
                                                                            }
                                                                            {
                                                                                (chat?.LastMessage?.Type === "attachment") ? <i className="ri-file-text-fill align-middle me-1"></i> : null
                                                                            }
                                                                            {chat?.LastMessage?.Content.length > 30 ? chat?.LastMessage?.Content?.substring(0, 30) + "..." : chat?.LastMessage?.Content}
                                                                        </>
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="font-size-11">{this.formatDate(chat?.LastActive)}</div>
                                                        {chat.Unread === 0 ? null :
                                                            <div className="unread-message" id={"unRead" + chat.id}>
                                                                <span className="badge badge-soft-danger rounded-pill">{chat?.Unread}</span>
                                                            </div>
                                                        }
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    )
                                }
                            </ul>
                        </SimpleBar>

                    </div>
                    {/* End chat-message-list */}
                </div>
            </React.Fragment >
        );
    }
}

const mapStateToProps = (state) => {
    const { active_user, connection, active } = state.Chat;
    return { active_user, connection, active };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser, chatLogs, startPollingActiveLists, changeView })(Chats);