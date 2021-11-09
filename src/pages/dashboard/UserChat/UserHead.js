import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Button, Row, Col, Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { openUserSidebar, setFullUser, callUser, toggleCallModal } from "../../../redux/actions";


function UserHead(props) {
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [Videomodal, setVideoModal] = useState(false);

    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
    const toggleVideoModal = () => setVideoModal(!Videomodal);

    const openUserSidebar = (e) => {
        e.preventDefault();
        props.openUserSidebar();
    }

    function closeUserChat(e) {
        e.preventDefault();
        let userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    }

    function deleteMessage() {
        let allUsers = props.users;
        let copyallUsers = allUsers;
        copyallUsers[props.active_user].messages = [];

        props.setFullUser(copyallUsers);
    }
    const containUsersOnline = (code) => {
        const data = props?.active?.active?.length > 0 && props?.active?.active?.filter(c => c.code !== props?.active.userCode)
        const index = data?.length > 0 ? data?.findIndex(i => i.code === code) : -1
        return index
    }
    const containUsersOnlineGroup = () => {
        let flag = 1
        const data = props.active?.active?.length > 0 && props?.active?.active?.filter(c => c.code !== props?.active.userCode)
        data?.length > 0 && data?.every(c => {
            const exists = props?.active_user?.Users.findIndex(i => i.Code === c.code)
            if (exists !== -1) {
                flag = 2;
            }
        })
        return flag;
    }
    const handleCall = () => {
        toggleVideoModal()
        props?.callUser(props?.active_user?.UserCode);
        props?.toggleCallModal();
    }
    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom">
                <Row className="align-items-center">
                    <Col sm={4} xs={8}>
                        <div className="d-flex align-items-center">
                            <div className="d-block d-lg-none me-2 ms-0">
                                <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                    <i className="ri-arrow-left-s-line"></i></Link>
                            </div>
                            {
                                props.active_user?.Avatar !== "Resource/no_img.jpg" ?
                                    <div className="me-3 ms-0">
                                        <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${props.active_user?.Avatar}`} className="rounded-circle avatar-xs" alt="chatvia" />
                                    </div>
                                    : <div className="chat-user-img align-self-center me-3">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                {props.active_user?.IsGroup ? props.active_user?.Name?.charAt(1) : props.active_user?.FullName?.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                            }

                            <div className="flex-1 overflow-hidden">
                                <h5 className="font-size-16 mb-0 text-truncate">
                                    <Link to="#" onClick={(e) => openUserSidebar(e)} className="text-reset user-profile-show">
                                        {props.active_user?.Name || props.active_user?.FullName}
                                    </Link>
                                    {props.active_user?.IsGroup ? (containUsersOnlineGroup() === 2 ? <>
                                        <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                                    </> : <>
                                        <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                                    </>) : (containUsersOnline(props.active_user?.UserCode) !== -1 ? <>
                                        <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                                    </> : <>
                                        <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                                    </>)}

                                </h5>
                            </div>
                        </div>
                    </Col>
                    <Col sm={8} xs={4} >
                        <ul className="list-inline user-chat-nav text-end mb-0">
                            {!props?.active_user.IsGroup && <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                <button type="button" onClick={toggleVideoModal} className="btn nav-btn">
                                    <i className="ri-vidicon-line"></i>
                                </button>
                            </li>
                            }

                            <li className="list-inline-item d-none d-lg-inline-block">
                                <Button type="button" color="none" onClick={(e) => openUserSidebar(e)} className="nav-btn user-profile-show">
                                    <i className="ri-user-2-line"></i>
                                </Button>
                            </li>

                            <li className="list-inline-item">
                                <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                                    <DropdownToggle className="btn nav-btn " color="none" type="button" >
                                        <i className="ri-more-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem className="d-block d-lg-none user-profile-show" onClick={(e) => openUserSidebar(e)}>View profile <i className="ri-user-2-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem>Archive <i className="ri-archive-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem>Muted <i className="ri-volume-mute-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem onClick={(e) => deleteMessage(e)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>

                        </ul>
                    </Col>
                </Row>
            </div>

            {/* Start VideoCall Modal */}
            <Modal tabIndex="-1" isOpen={Videomodal} toggle={toggleVideoModal} centered>
                <ModalBody>
                    <div className="text-center p-4">
                        {props.active_user?.Avatar !== "Resource/no_img.jpg" ?
                            <div className="avatar-lg mx-auto mb-4">
                                <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${props.active_user?.Avatar}`} className="rounded-circle avatar-lg" alt="chatvia" />
                            </div>
                            : <div className="chat-user-img align-self-center me-3">
                                <div className="avatar-lg mx-auto mb-4">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {props.active_user?.IsGroup ? props.active_user?.Name?.charAt(1) : props.active_user?.FullName?.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        }
                        <h5 className="text-truncate">{props.active_user?.FullName}</h5>
                        <p className="text-muted">Bắt đầu cuộc gọi Video</p>

                        <div className="mt-5">
                            <ul className="list-inline mb-1">
                                <li className="list-inline-item px-2 me-2 ms-0">
                                    <button type="button" className="btn btn-danger avatar-sm rounded-circle" onClick={toggleVideoModal}>
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-close-fill"></i>
                                        </span>
                                    </button>
                                </li>
                                <li className="list-inline-item px-2">
                                    <button type="button" className="btn btn-success avatar-sm rounded-circle" onClick={handleCall}>
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <i className="ri-vidicon-fill"></i>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { users, active_user, active } = state.Chat;
    return { ...state.Layout, users, active_user, active };
};

export default connect(mapStateToProps, { openUserSidebar, setFullUser, callUser, toggleCallModal })(UserHead);