import React, { useState } from 'react';
import { connect } from "react-redux";
import { Button, Card, Badge } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

//components
import AttachedFiles from "./AttachedFiles";
import CustomCollapse from "./CustomCollapse";

//actions
import { closeUserSidebar } from "../redux/actions";

//i18n
import { useTranslation } from 'react-i18next';

//image
import avatar7 from "../assets/images/users/avatar-7.jpg";

function UserProfileSidebar(props) {

    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
    };

    // closes sidebar
    const closeuserSidebar = () => {
        props.closeUserSidebar();
    }
    // style={{display: props.userSidebar  ? "block" : "none"}}
    return (
        <React.Fragment>
            <div style={{ display: (props.userSidebar === true) ? "block" : "none" }} className="user-profile-sidebar">
                <div className="px-3 px-lg-4 pt-3 pt-lg-4">
                    <div className="user-chat-nav  text-end">
                        <Button color="none" type="button" onClick={closeuserSidebar} className="nav-btn" id="user-profile-hide">
                            <i className="ri-close-line"></i>
                        </Button>
                    </div>
                </div>

                <div className="text-center p-4 border-bottom">

                    <div className="mb-4 d-flex justify-content-center">
                        {
                            props.active_user?.Avatar === "Resource/no_img.jpg" ?
                                <div className="avatar-lg">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                                        {props.active_user?.Type === "multi" ? props.active_user?.Name?.charAt(1) : props.active_user?.FullName?.charAt(0)}
                                    </span>
                                </div>
                                : <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${props.active_user?.Avatar}`} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
                        }

                    </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{props.active_user?.Name || props.active_user?.FullName}</h5>
                    <p className="text-muted text-truncate mb-1">
                        {(() => {
                            switch (props.active_user?.status) {
                                case "online":
                                    return (
                                        <>
                                            <i className="ri-record-circle-fill font-size-10 text-success me-1"></i>
                                        </>
                                    )

                                case "away":
                                    return (
                                        <>
                                            <i className="ri-record-circle-fill font-size-10 text-warning me-1"></i>
                                        </>
                                    )

                                case "offline":
                                    return (
                                        <>
                                            <i className="ri-record-circle-fill font-size-10 text-secondary me-1"></i>
                                        </>
                                    )

                                default:
                                    return;
                            }
                        })()}

                        Active</p>
                </div>
                {/* End profile user */}

                {/* Start user-profile-desc */}

                <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">
                    <div className="text-muted">
                        <p className="mb-4">"{t('If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.')}"</p>
                    </div>

                    <div id="profile-user-accordion" className="custom-accordion">
                        {
                            !props.active_user?.IsGroup &&
                            <Card className="shadow-none border mb-2">
                                {/* import collaps */}
                                <CustomCollapse
                                    title="About"
                                    iconClass="ri-user-2-line"
                                    isOpen={isOpen1}
                                    toggleCollapse={toggleCollapse1}
                                >

                                    <div>
                                        <p className="text-muted mb-1">{t('Tên Người Dùng')}</p>
                                        <h5 className="font-size-14">{props.active_user?.UserName}</h5>
                                    </div>
                                    <div>
                                        <p className="text-muted mb-1">{t('Name')}</p>
                                        <h5 className="font-size-14">{props.active_user?.Name || props.active_user?.FullName}</h5>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Email')}</p>
                                        <h5 className="font-size-14">{props.active_user?.Email}</h5>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Sinh Nhật')}</p>
                                        <h5 className="font-size-14">{props.active_user?.Dob}</h5>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Số điện thoại')}</p>
                                        <h5 className="font-size-14 mb-0">{props.active_user?.Phone}</h5>
                                    </div>
                                </CustomCollapse>
                            </Card>}
                        {/* End About card */}

                        <Card className="mb-1 shadow-none border">
                            {/* import collaps */}
                            <CustomCollapse
                                title="Attached Files"
                                iconClass="ri-attachment-line"
                                isOpen={isOpen2}
                                toggleCollapse={toggleCollapse2}
                            >
                                {/* attached files */}
                                <AttachedFiles files={props.files} />
                            </CustomCollapse>
                        </Card>

                        {
                            props.active_user?.IsGroup &&
                            <Card className="mb-1 shadow-none border">
                                {/* import collaps */}
                                <CustomCollapse
                                    title="Members"
                                    iconClass="ri-group-line"
                                    isOpen={isOpen3}
                                    toggleCollapse={toggleCollapse3}
                                >

                                    {props.active_user.Users.map(mem => {
                                        return (
                                            <Card className="p-2 mb-2">
                                                <div className="d-flex align-items-center">
                                                    {mem.Avatar !== "Resource/no_img.jpg" ? (<div className="chat-avatar">
                                                        <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${mem?.Avatar}`} className="rounded-circle chat-user-img avatar-xs me-3" alt="chatvia" />
                                                    </div>) : (
                                                        <div className="chat-user-img align-self-center me-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    {mem.FullName.charAt(0)}
                                                                </span>
                                                            </div>
                                                        </div>)}
                                                    <div>
                                                        <div className="text-left">
                                                            <h5 className="font-size-14 mb-1">{mem.FullName}</h5>
                                                            {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}

                                </CustomCollapse>
                            </Card>
                        }
                    </div>
                </SimpleBar>
                {/* end user-profile-desc */}
            </div>


        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { users, active_user, files } = state.Chat;
    const { userSidebar } = state.Layout;
    return { users, active_user, userSidebar, files };
};

export default connect(mapStateToProps, { closeUserSidebar })(UserProfileSidebar);