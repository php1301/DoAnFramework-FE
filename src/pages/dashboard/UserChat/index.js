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
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions
import { openUserSidebar, setFullUser, addMessage, chatLogs, setIsTyping } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import { useTranslation } from 'react-i18next';
import ImageItem from './ImageItem';

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

    }, [props?.log]);

    useEffect(() => {
        ref.current.recalculate();
        scrolltoBottom();
    }, [chatMessages]);

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
    const currentUser = localStorage.getItem("authUser")

    function scrolltoBottom() {
        ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight - 400;
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
                                                                {
                                                                    dt?.UserCreatedBy?.Avatar === "Resource/no_img.jpg" ?
                                                                        <div className="chat-user-img align-self-center me-3">
                                                                            <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {dt.UserCreatedBy?.FullName?.charAt(0)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        : <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${dt?.UserCreatedBy?.Avatar}`} alt="chatvia" />
                                                                }
                                                            </div>

                                                            <div className="user-chat-content">
                                                                <div className="ctext-wrap">
                                                                    <div className="ctext-wrap-content">
                                                                        {
                                                                            (dt.Type !== "attachment" && dt.type !== "media") && dt?.Content &&
                                                                            <p className="mb-0">
                                                                                {dt?.Content}
                                                                            </p>
                                                                        }
                                                                        {
                                                                            dt.Type === "media" &&
                                                                            // image list component
                                                                            <ImageItem image={dt.Path} title={dt.Content} />
                                                                        }
                                                                        {
                                                                            dt.Type === "attachment" &&
                                                                            //file input component
                                                                            <FileList path={`${process.env.REACT_APP_BASE_API_URL}/Auth/file?key=${dt?.Path}`} fileName={dt.Content} fileSize={chat.size} />
                                                                        }
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
                                {
                                    <>
                                        {props.isTyping?.map((dt, keyDt) =>
                                            dt.groupCode === props.active_user.Code && dt.code !== currentUser && (

                                                <li key={keyDt + "aa"} >
                                                    <div className="conversation-list">

                                                        <div className="chat-avatar">
                                                            {
                                                                dt?.UserCreatedBy?.Avatar === "Resource/no_img.jpg" ?
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {dt.userName?.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    : <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${dt?.avatar}`} alt="chatvia" />
                                                            }
                                                        </div>

                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            {
                                                                <div className="conversation-name">{dt?.userName}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </>
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

                        <ChatInput profile={props.profile} setIsTyping={setIsTyping} connection={props.connection} onaddMessage={addMessageState} addMessageRealtime={props.addMessage} chatLogs={props.chatLogs} active_user={props.active_user} scrolltoBottom={scrolltoBottom} />
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
    const { active_user, log, connection, isTyping } = state.Chat;
    const { userSidebar } = state.Layout;
    const { profile } = state.Auth;
    return { active_user, userSidebar, log, connection, isTyping, profile };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, setFullUser, addMessage, chatLogs, setIsTyping })(UserChat));

