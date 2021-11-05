import React, { useState, useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { DateTime } from 'luxon';
import SimpleBar from "simplebar-react";
import _ from "lodash";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions
import { openUserSidebar, setFullUser, addMessage, chatLogs } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function UserChat(props) {

    const ref = useRef();
    const user = localStorage.getItem("authUser")
    const [modal, setModal] = useState(false);

    /* intilize t letiable for multi language implementation */
    const { t } = useTranslation();
    const formatDate = (date) => {
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

    const formatDateGroupBy = (date) => { return DateTime.fromISO(date).toFormat("dd/MM/20yy"); }

    //demo conversation messages
    //userType must be required
    const [allUsers] = useState(props.recentChatList);
    const groupByLogs = _.chain(props.log).groupBy(function (item) {
        return formatDateGroupBy(item?.Created)
    }).map((value, key) => ({ date: key, data: value })).value();
    const [chatMessages, setchatMessages] = useState(groupByLogs || []);
    useEffect(() => {
        const groupByLogs = _.chain(props.log).groupBy(function (item) {
            return formatDateGroupBy(item?.Created)
        }).map((value, key) => ({ date: key, data: value })).value();
        setchatMessages(groupByLogs);
        ref.current.recalculate();
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }, [props?.log]);

    const toggle = () => setModal(!modal);

    const addMessageState = (message, type) => {
        let messageObj = null;

        let d = new Date();
        let n = d.getSeconds();

        //matches the message type is text, file or image, and create object according to it
        switch (type) {
            case "textMessage":
                messageObj = {
                    id: chatMessages.length + 1,
                    message: message,
                    time: "00:" + n,
                    userType: "sender",
                    image: avatar4,
                    isFileMessage: false,
                    isImageMessage: false
                }
                break;

            case "fileMessage":
                messageObj = {
                    id: chatMessages.length + 1,
                    message: 'file',
                    fileMessage: message.name,
                    size: message.size,
                    time: "00:" + n,
                    userType: "sender",
                    image: avatar4,
                    isFileMessage: true,
                    isImageMessage: false
                }
                break;

            case "imageMessage":
                let imageMessage = [
                    { image: message },
                ]

                messageObj = {
                    id: chatMessages.length + 1,
                    message: 'image',
                    imageMessage: imageMessage,
                    size: message.size,
                    time: "00:" + n,
                    userType: "sender",
                    image: avatar4,
                    isImageMessage: true,
                    isFileMessage: false
                }
                break;

            default:
                break;
        }

        //add message object to chat        
        setchatMessages([...chatMessages, messageObj]);

        let copyallUsers = [...allUsers];
        copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        copyallUsers[props.active_user].isTyping = false;
        props.setFullUser(copyallUsers);

        scrolltoBottom();
    }

    function scrolltoBottom() {
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        let filtered = conversation.filter(function (item) {
            return item.id !== id;
        });

        setchatMessages(filtered);
    }


    return (
        <React.Fragment>
            <div className="user-chat w-100">

                <div className="d-lg-flex">

                    <div className={props.userSidebar ? "w-70" : "w-100"}>

                        {/* render user head */}
                        <UserHead />

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            ref={ref}
                            className="chat-conversation p-3 p-lg-4"
                            id="messages">
                            <ul className="list-unstyled mb-0">


                                {
                                    chatMessages?.map((chat, key) =>
                                        <>
                                            <li key={"dayTitle" + key}>
                                                {/* chat.isToday && chat.isToday === true ? <li key={"dayTitle" + key}> */}
                                                <div className="chat-day-title">
                                                    <span className="title">{chat?.date}</span>
                                                </div>
                                                {/* </li> : */}
                                            </li>

                                            {chat?.data?.map((dt, keyDt) => {
                                                return (

                                                    <li key={keyDt} className={dt.CreatedBy === user ? "right" : ""} >
                                                        <div className="conversation-list">

                                                            <div className="chat-avatar">
                                                                {dt.CreatedBy === user ? <img src={avatar4} alt="chatvia" /> :
                                                                    dt.Avatar === "Resource/no_img.jpg" ?
                                                                        <div className="chat-user-img align-self-center me-3">
                                                                            <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {"Test name"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        : <img src={dt?.UserCreatedBy?.Avatar} alt="chatvia" />
                                                                }
                                                            </div>

                                                            <div className="user-chat-content">
                                                                <div className="ctext-wrap">
                                                                    <div className="ctext-wrap-content">
                                                                        {
                                                                            dt?.Content &&
                                                                            <p className="mb-0">
                                                                                {dt?.Content}
                                                                            </p>
                                                                        }
                                                                        {/* {
                                                                        chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                    }
                                                                    {
                                                                        chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                    }
                                                                    {
                                                                        chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    } */}
                                                                        {/* {
                                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                    } */}
                                                                        {
                                                                            <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{formatDate(dt?.Created)}</span></p>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        !dt.isTyping &&
                                                                        <UncontrolledDropdown className="align-self-start">
                                                                            <DropdownToggle tag="a">
                                                                                <i className="ri-more-2-fill"></i>
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                                <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                                <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                                <DropdownItem onClick={() => deleteMessage(dt.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                            </DropdownMenu>
                                                                        </UncontrolledDropdown>
                                                                    }

                                                                </div>
                                                                {
                                                                    <div className="conversation-name">{dt.UserCreatedBy.FullName}</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </>
                                    )
                                }
                            </ul>
                        </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{ maxHeight: "200px" }}>
                                        <SelectContact handleCheck={() => { }} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Forward</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody>
                        </Modal>

                        <ChatInput onaddMessage={addMessageState} addMessageRealtime={props.addMessage} chatLogs={props.chatLogs} />
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
    const { active_user, log } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user, userSidebar, log };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, setFullUser, addMessage, chatLogs })(UserChat));

