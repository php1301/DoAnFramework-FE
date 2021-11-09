import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Form, Label, Input, InputGroup, } from 'reactstrap';
import SimpleBar from "simplebar-react";

import { connect } from "react-redux";

import { withTranslation } from 'react-i18next';
import { addContact, requestContactList, searchContact, chatLogs, changeView } from '../../../redux/actions';

//use sortedContacts variable as global variable to sort contacts
class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        }
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        this.setState({ modal: !this.state.modal });
    }

    componentDidMount() {
        this.props.requestContactList()
    }

    handleClick = () => {
        const keyword = document.getElementById("addcontactemail-input")?.value
        if (keyword)
            this.props.searchContact(keyword)
    }
    handleAddContact = (code) => {
        const keyword = document.getElementById("addcontactemail-input")?.value
        this.props.addContact({ code, keyword });
    }
    // handleSearchContact = (e) => {
    //     this.setState({ searchContact: e.target.value });
    //     const search = e.target.value;
    //     let conversation = this.state.contactLists;
    //     let filtered = []
    //     //find conversation name from array
    //     console.group(conversation)
    //     conversation?.forEach(i => {
    //         let filteredArray = [];
    //         i.children.forEach(x => {
    //             if (x?.FullName?.toLowerCase().includes(search) || x?.FullName?.toUpperCase().includes(search))
    //                 filteredArray.push(x);
    //         })
    //         const index = filtered.findIndex(y => y?.group === i?.group)
    //         if (index === -1) {
    //             filtered.push({
    //                 group: i?.group,
    //                 children: filteredArray
    //             })
    //         }
    //     })
    //     console.log(filtered)
    //     //set filtered items to state
    //     this.setState({ contactLists: filtered })

    //     //if input value is blanck then assign whole recent chatlist to array
    //     if (search === "") this.setState({ contactLists: this.props.contact })
    // }
    handleText = (contact) => {
        console.log(contact)
        this.props.changeView("Chat");
        this.props.chatLogs(null, contact.Code, true)
    }
    containUsersOnline = (code) => {
        const { active } = this.props
        const data = active?.active?.length > 0 && active?.active?.filter(c => c.code !== active.userCode)
        const index = data?.length > 0 ? data?.findIndex(i => i.code === code) : -1
        return index;
    }
    render() {
        const { t, contact } = this.props;
        return (
            <React.Fragment>
                <div>
                    <div className="p-4">
                        <div className="user-chat-nav float-end">
                            <div id="add-contact">
                                {/* Button trigger modal */}
                                <Button type="button" color="link" onClick={this.toggle} className="text-decoration-none text-muted font-size-18 py-0">
                                    <i className="ri-user-add-line"></i>
                                </Button>
                            </div>
                            <UncontrolledTooltip target="add-contact" placement="bottom">
                                Thêm liên hệ
                            </UncontrolledTooltip>
                        </div>
                        <h4 className="mb-4">Liên hệ</h4>

                        {/* Start Add contact Modal */}
                        <Modal isOpen={this.state.modal} centered toggle={this.toggle}>
                            <ModalHeader tag="h5" className="font-size-16" toggle={this.toggle}>
                                {t('Add Contacts')}
                            </ModalHeader>
                            <ModalBody className="p-4">
                                <Form>
                                    <div className="mb-4">
                                        <Label className="form-label" htmlFor="addcontactemail-input">{t('Từ khoá')}</Label>
                                        <Input type="text" className="form-control" id="addcontactemail-input" placeholder="Email, SĐT, Họ Tên" />
                                    </div>
                                    {this.props.searchContacts?.length > 0 ?
                                        (
                                            <div>
                                                <Label className="form-label" htmlFor="addcontact-invitemessage-input">Kết quả</Label>
                                                <hr style={{ marginTop: "8px", marginBottom: "10px" }} />
                                                {this.props.searchContacts?.map(s => {
                                                    return (
                                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                            {s?.Avatar !== "Resource/no_img.jpg" ?
                                                                <div className="me-3 ms-0">
                                                                    <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${s?.Avatar}`} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                </div>
                                                                : <div className="chat-user-img align-self-center me-3">
                                                                    <div className="avatar-xs">
                                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                            {s?.FullName?.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                </div>}
                                                            <p>{s.FullName}</p>
                                                            <span onClick={() => { this.handleAddContact(s.Code) }} style={{ width: "30px", height: "30px", cursor: "pointer" }} className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                <i class="mdi mdi-plus"></i>
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div>
                                                <hr style={{ marginBottom: "10px" }} />
                                                <Label className="form-label" htmlFor="addcontact-invitemessage-input">Không có kết quả</Label>
                                            </div>
                                        )
                                    }
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="button" color="link" onClick={this.toggle}>Đóng</Button>
                                <Button onClick={this.handleClick} type="button" color="primary">Tìm liên hệ</Button>
                            </ModalFooter>
                        </Modal>
                        {/* End Add contact Modal */}

                        <div className="search-box chat-search-box">
                            <InputGroup size="lg" className="bg-light rounded-lg">
                                <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                                    <i className="ri-search-line search-icon font-size-18"></i>
                                </Button>
                                <Input onChange={this.handleSearchContact} type="text" className="form-control bg-light " placeholder={t('Search users..')} />
                            </InputGroup>
                        </div>
                        {/* End search-box */}
                    </div>
                    {/* end p-4 */}

                    {/* Start contact lists */}
                    <SimpleBar style={{ maxHeight: "100%" }} id="chat-room" className="p-4 chat-message-list chat-group-list">

                        {
                            contact?.map((contact, key) =>
                                <div key={key} className={key + 1 === 1 ? "" : "mt-3"}>
                                    <div className="p-3 fw-bold text-primary">
                                        {contact.group}
                                    </div>

                                    <ul className="list-unstyled contact-list">
                                        {
                                            contact.children.map((child, key) =>
                                                <li key={key} >
                                                    <div className="d-flex align-items-center">
                                                        {child?.Avatar !== "Resource/no_img.jpg" ?
                                                            <div className={`${this.containUsersOnline(child?.Code) !== -1 ? "chat-user-img online" : "chat-user-img"} me-3 ms-0`}>
                                                                <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${child?.Avatar}`} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                {
                                                                    <span className="user-status"></span>
                                                                }
                                                            </div>
                                                            : <div className={`${this.containUsersOnline(child?.Code) !== -1 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3`}>
                                                                <div className="avatar-xs">
                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                        {child?.FullName?.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                {
                                                                    <span className="user-status"></span>
                                                                }
                                                            </div>}
                                                        <div className="flex-1">

                                                            <h5 className="font-size-14 m-0">{child.FullName}</h5>
                                                        </div>
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle tag="a" className="text-muted">
                                                                <i className="ri-more-2-fill"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu className="dropdown-menu-end">
                                                                <DropdownItem onClick={() => this.handleText(child)}>{t('Nhắn tin')} <i className="ri-message-line float-end text-muted"></i></DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                            )
                        }

                    </SimpleBar>
                    {/* end contact lists */}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { contact, searchContacts, active } = state.Chat;
    return { contact, searchContacts, active };
};

export default connect(mapStateToProps, { addContact, requestContactList, searchContact, chatLogs, changeView })(withTranslation()(Contacts));