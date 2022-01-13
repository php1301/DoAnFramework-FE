import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Form, Label, Input, Collapse, CardHeader, CardBody, Alert, InputGroup, Card, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { DateTime } from "luxon";
import { toggleCallModal } from "../../../redux/actions";

import { withTranslation } from 'react-i18next';

//simple bar
import SimpleBar from "simplebar-react";

//components
import SelectContact from "../../../components/SelectContact";

//actions
import { createGroup, callHistory, callUser, getDetailsCallHistory, changeView, setActiveCallLog } from "../../../redux/actions";

class Groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            isOpenCollapse: false,
            groups: this.props.callHistoryList || [],
            selectedContact: [],
            isOpenAlert: false,
            message: "",
            groupName: "",
            groupDesc: "",
        }
        this.toggle = this.toggle.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleChangeGroupName = this.handleChangeGroupName.bind(this);
        this.handleChangeGroupDesc = this.handleChangeGroupDesc.bind(this);
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
    toggle() {
        this.setState({ modal: !this.state.modal });
    }
    toggleCollapse() {
        this.setState({ isOpenCollapse: !this.state.isOpenCollapse });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                groups: this.props?.callHistoryList
            });
        }
    }
    componentDidMount() {
        this.props.callHistory()
    }

    createGroup() {
        if (this.state.selectedContact.length > 2) {
            // gourpId : 5, name : "#Project-aplha", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "project related Group",
            let obj = {
                gourpId: this.state.groups.length + 1,
                name: "#" + this.state.groupName,
                profilePicture: "Null",
                isGroup: true,
                unRead: 0,
                isNew: true,
                desc: this.state.groupDesc,
                members: this.state.selectedContact
            }
            //call action for creating a group
            this.props.createGroup(obj);
            this.toggle();

        } else if (this.state.selectedContact.length === 1) {
            this.setState({ message: "Minimum 2 members required!!!", isOpenAlert: true });
        } else {
            this.setState({ message: "Please Select Members!!!", isOpenAlert: true });
        }
        setTimeout(
            function () {
                this.setState({ isOpenAlert: false });
            }
                .bind(this),
            3000
        );
    }

    handleCheck(e, contactId) {
        let selected = this.state.selectedContact;
        let obj;
        if (e.target.checked) {
            obj = {
                Code: contactId,
                name: e.target.value
            };
            selected.push(obj);
            this.setState({ selectedContact: selected })
        }
    }

    handleChangeGroupName(e) {
        this.setState({ groupName: e.target.value });
    }

    handleChangeGroupDesc(e) {
        this.setState({ groupDesc: e.target.value });
    }

    handleClickGroup = (group) => {
        this.props.getDetailsCallHistory(group.Code)
        this.props.setActiveCallLog(group);
        this.props.changeView("Call");
    }
    containUsersOnline = (chat) => {
        let flag = 1
        const data = this.props.active?.active?.length > 0 && this.props?.active?.active?.filter(c => c.code !== this.props?.active.userCode)
        data?.length > 0 && data?.every(c => {
            const exists = chat?.Calls.findIndex(i => i.UserCode === c.code)
            if (exists !== -1) {
                flag = 2;
            }
        })
        return flag;
    }
    handleCall = (contact) => {
        const currentUser = localStorage.getItem("authUser");
        const index = contact?.Calls.findIndex(i => i.UserCode !== currentUser)
        if (index !== -1) {
            this.props.callUser(contact?.Calls?.[index]?.UserCode);
            this.props.setActiveCallLog(contact);
            this.props.getDetailsCallHistory(contact.Code);
            this.props.changeView("Call");
            this.props.toggleCallModal();
        }
    }
    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <div>
                    <div className="p-4">
                        <div className="user-chat-nav float-end">
                            <div id="create-group">
                                {/* Button trigger modal */}
                                <Button onClick={this.toggle} type="button" color="link" className="text-decoration-none text-muted font-size-18 py-0">
                                    <i className="ri-group-line me-1"></i>
                                </Button>
                            </div>
                            <UncontrolledTooltip target="create-group" placement="bottom">
                                Create group
                            </UncontrolledTooltip>

                        </div>
                        <h4 className="mb-4">{t('Nhóm và cuộc gọi')}</h4>

                        {/* Start add group Modal */}
                        <Modal isOpen={this.state.modal} centered toggle={this.toggle}>
                            <ModalHeader tag="h5" className="modal-title font-size-14" toggle={this.toggle}>{t('Create New Group')}</ModalHeader>
                            <ModalBody className="p-4">
                                <Form>
                                    <div className="mb-4">
                                        <Label className="form-label" htmlFor="addgroupname-input">{t('Group Name')}</Label>
                                        <Input type="text" className="form-control" id="addgroupname-input" value={this.state.groupName} onChange={(e) => this.handleChangeGroupName(e)} placeholder="Enter Group Name" />
                                    </div>
                                    <div className="mb-4">
                                        <Label className="form-label">{t('Group Members')}</Label>
                                        <Alert isOpen={this.state.isOpenAlert} color="danger">
                                            {this.state.message}
                                        </Alert>
                                        <div className="mb-3">
                                            <Button color="light" size="sm" type="button" onClick={this.toggleCollapse}>
                                                {t('Select Members')}
                                            </Button>
                                        </div>

                                        <Collapse isOpen={this.state.isOpenCollapse} id="groupmembercollapse">
                                            <Card className="border">
                                                <CardHeader>
                                                    <h5 className="font-size-15 mb-0">{t('Contacts')}</h5>
                                                </CardHeader>
                                                <CardBody className="p-2">
                                                    <SimpleBar style={{ maxHeight: "150px" }}>
                                                        {/* contacts */}
                                                        <div id="addContacts">
                                                            <SelectContact handleCheck={this.handleCheck} />
                                                        </div>
                                                    </SimpleBar>
                                                </CardBody>
                                            </Card>
                                        </Collapse>
                                    </div>
                                    <div>
                                        <Label className="form-label" htmlFor="addgroupdescription-input">Description</Label>
                                        <textarea className="form-control" id="addgroupdescription-input" value={this.state.groupDesc} onChange={(e) => this.handleChangeGroupDesc(e)} rows="3" placeholder="Enter Description"></textarea>
                                    </div>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="button" color="link" onClick={this.toggle}>{t('Close')}</Button>
                                <Button type="button" color="primary" onClick={this.createGroup}>Create Group</Button>
                            </ModalFooter>
                        </Modal>
                        {/* End add group Modal */}
                        {/* <div className="search-box chat-search-box">
                            <InputGroup size="lg" className="bg-light rounded-lg">
                                <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                                    <i className="ri-search-line search-icon font-size-18"></i>
                                </Button>
                                <Input type="text" className="form-control bg-light" placeholder="Search groups..." />
                            </InputGroup>
                        </div> */}
                        {/* end search-box */}
                    </div>
                    {/* Start chat-group-list */}
                    <SimpleBar style={{ maxHeight: "100%" }} className="p-4 chat-message-list chat-group-list">


                        <ul className="list-unstyled chat-list">
                            {
                                this.state.groups?.length > 0 && this.state.groups?.map((group, key) =>
                                    <li onClick={() => { this.handleClickGroup(group) }} key={key} >
                                        <Link to="#">
                                            <div className="d-flex align-items-center">
                                                {
                                                    group.Avatar === "Resource/no_img.jpg" ?
                                                        <div className={`${this.containUsersOnline(group) === 2 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3 ms-0`}>
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    {group?.Name?.charAt(0)}
                                                                </span>
                                                            </div>
                                                            {
                                                                <span className="user-status"></span>
                                                            }
                                                        </div>
                                                        :
                                                        <div className={`${this.containUsersOnline(group) === 2 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3 ms-0`}>
                                                            <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${group?.Avatar}`} className="rounded-circle avatar-xs" alt="Chatlife" />
                                                            {
                                                                <span className="user-status"></span>
                                                            }
                                                        </div>
                                                }

                                                <div className="flex-1 overflow-hidden">
                                                    <h5 className="text-truncate font-size-14 mb-0">
                                                        {group.Name}
                                                        {
                                                            group.unRead !== 0
                                                                ? <Badge color="none" pill className="badge-soft-danger float-end">
                                                                    {
                                                                        group.unRead >= 20 ? group.unRead + "+" : group.unRead
                                                                    }
                                                                </Badge>
                                                                : null
                                                        }

                                                        {
                                                            group.isNew && <Badge color="none" pill className="badge-soft-danger float-end">New</Badge>
                                                        }

                                                    </h5>
                                                    <p className="chat-user-message text-truncate mb-0">
                                                        {
                                                            this.formatDate(group?.LastCall?.Created)
                                                        }



                                                    </p>
                                                </div>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle tag="a" className="text-muted">
                                                        <i className="ri-more-2-fill"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <DropdownItem onClick={() => this.handleCall(group)}>{t('Gọi điện')} <i className="ri-phone-line float-end text-muted"></i></DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    </SimpleBar>
                    {/* End chat-group-list */}
                </div>
            </React.Fragment >
        );
    }
}

const mapStateToProps = (state) => {
    const { groups, active_user, active } = state.Chat;
    const { callHistoryList } = state.Call;
    return { groups, active_user, callHistoryList, active };
};

export default (connect(mapStateToProps, { createGroup, callHistory, toggleCallModal, callUser, getDetailsCallHistory, changeView, setActiveCallLog })(withTranslation()(Groups)));