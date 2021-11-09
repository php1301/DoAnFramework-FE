import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card, Button, UncontrolledDropdown, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";

import SimpleBar from "simplebar-react";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//i18n
import { useTranslation } from 'react-i18next';

function Settings(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [fileImage, setfileImage] = useState("")
    const [base64FileImage, setBase64FileImage] = useState("")
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const handleImageChange = e => {
        if (e.target.files.length !== 0) {
            setBase64FileImage(e.target.files[0])
            setfileImage(URL.createObjectURL(e.target.files[0]))
        }
    }
    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
    };

    const toggleCollapse4 = () => {
        setIsOpen4(!isOpen4);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen2(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const blobToBase64 = () => {
        if (base64FileImage)
            return new Promise((resolve, _) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(base64FileImage);
            });
    }
    const handleUpdate = async () => {
        setIsEditMode(false)
        const name = document.getElementById("edit-name").value
        const email = document.getElementById("edit-email").value
        const phone = document.getElementById("edit-phone").value
        const address = document.getElementById("edit-address").value
        const avatar = await blobToBase64()
        if (props?.profile?.Avatar || avatar) {
            const data = {
                Address: address || props.profile?.Address,
                Avatar: avatar || props.profile?.Avatar,
                Email: email || props.profile?.Email,
                FullName: name || props.profile?.FullName,
                Phone: phone || props.profile?.Phone,
            }
            props.updateUserProfile(data)
        }
    }
    return (
        <React.Fragment>
            <div>
                <div className="px-4 pt-4">
                    <h4 className="mb-0">{t('Settings')}</h4>
                </div>

                <div className="text-center border-bottom p-4">
                    <div className="mb-4 profile-user input-file">
                        {
                            fileImage ?
                                props.profile?.Avatar === "Resource/no_img.jpg" ?
                                    <div className="avatar-lg">
                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                                            {props.profile?.FullName?.charAt(0)}
                                        </span>
                                    </div> :
                                    <img src={fileImage || `${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${props.profile?.Avatar}`} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
                                : <img src={fileImage || `${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${props.profile?.Avatar}`} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
                        }
                        {isEditMode && <Button type="button" color="light" className="avatar-xs p-0 rounded-circle profile-photo-edit">
                            <Label>
                                <i className="ri-pencil-fill"></i>
                                <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file" name="fileInput" size="60" />
                            </Label>
                        </Button>
                        }

                    </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{props.profile.FullName}</h5>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline-block mb-1">
                        <DropdownToggle tag="a" className="text-muted pb-1 d-block" >
                            {t('Available')} <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem>{t('Available')}</DropdownItem>
                            <DropdownItem>{t('Busy')}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {/* End profile user */}

                {/* Start User profile description */}
                <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">

                    <div id="profile-setting-accordion" className="custom-accordion">
                        {!isEditMode ? <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Personal Info"
                                isOpen={isOpen1}
                                toggleCollapse={toggleCollapse1}
                            >

                                <div className="float-end">
                                    <Button color="light" size="sm" type="button" onClick={() => { setIsEditMode(true) }} ><i className="ri-edit-fill me-1 align-middle"></i> {t('Edit')}</Button>
                                </div>

                                <div>
                                    <p className="text-muted mb-1">{t('Name')}</p>
                                    <h5 className="font-size-14">{props.profile?.FullName}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Email')}</p>
                                    <h5 className="font-size-14">{props.profile?.Email}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Số Điện Thoại')}</p>
                                    <h5 className="font-size-14">{props.profile?.Phone}</h5>
                                </div>

                                <div className="mt-4">
                                    <p className="text-muted mb-1">{t('Địa chỉ')}</p>
                                    <h5 className="font-size-14 mb-0">{props.profile?.Address}</h5>
                                </div>
                            </CustomCollapse>
                        </Card> :
                            <Card className="shadow-none border mb-2">
                                <CustomCollapse
                                    title="Personal Info"
                                    isOpen={isOpen1}
                                    toggleCollapse={toggleCollapse1}
                                >

                                    <div className="float-end">
                                        <Button onClick={handleUpdate} color="light" size="sm" type="button" > {t('Done')}</Button>
                                    </div>

                                    <div>
                                        <p className="text-muted mb-1">{t('Name')}</p>
                                        <input id="edit-name" className="font-size-14" defaultValue={props.profile?.FullName} />
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Email')}</p>
                                        <input disabled id="edit-email" type="text" className="font-size-14" defaultValue={props.profile?.Email} />
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Số Điện Thoại')}</p>
                                        <input id="edit-phone" type="text" className="font-size-14" defaultValue={props.profile?.Phone} />
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-muted mb-1">{t('Địa chỉ')}</p>
                                        <input id="edit-address" type="text" className="font-size-14" defaultValue={props.profile?.Address} />
                                    </div>
                                </CustomCollapse>
                            </Card>
                        }
                        {/* end profile card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Privacy"
                                isOpen={isOpen2}
                                toggleCollapse={toggleCollapse2}
                            >

                                <div className="py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Profile photo')}</h5>
                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Last seen')}</h5>

                                        </div>
                                        <div className="ms-2">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="privacy-lastseenSwitch" defaultChecked />
                                                <Label className="form-check-label" htmlFor="privacy-lastseenSwitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Status')}</h5>

                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Read receipts')}</h5>

                                        </div>
                                        <div className="ms-2">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="privacy-readreceiptSwitch" defaultChecked />
                                                <Label className="form-check-label" htmlFor="privacy-readreceiptSwitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Groups')}</h5>

                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Privacy card */}

                        <Card className="accordion-item border mb-2">
                            <CustomCollapse
                                title="Security"
                                isOpen={isOpen3}
                                toggleCollapse={toggleCollapse3}
                            >

                                <div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Show security notification')}</h5>

                                        </div>
                                        <div className="ms-2 me-0">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="security-notificationswitch" />
                                                <Label className="form-check-label" htmlFor="security-notificationswitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Security card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Help"
                                isOpen={isOpen4}
                                toggleCollapse={toggleCollapse4}
                            >

                                <div>
                                    <div className="py-3">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('FAQs')}</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Contact')}</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Terms & Privacy policy')}</Link></h5>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Help card */}
                    </div>
                    {/* end profile-setting-accordion */}
                </SimpleBar>
                {/* End User profile description */}
            </div>
        </React.Fragment>
    );
}

export default Settings;