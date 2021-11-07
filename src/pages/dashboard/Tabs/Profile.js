import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card } from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";
import AttachedFiles from "../../../components/AttachedFiles";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function Profile(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [files] = useState([
        { name: "Admin-A.zip", size: "12.5 MB", thumbnail: "ri-file-text-fill" },
        { name: "Image-1.jpg", size: "4.2 MB", thumbnail: "ri-image-fill" },
        { name: "Image-2.jpg", size: "3.1 MB", thumbnail: "ri-image-fill" },
        { name: "Landing-A.zip", size: "6.7 MB", thumbnail: "ri-file-text-fill" },
    ]);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <React.Fragment>
            <div>
                <div className="px-4 pt-4">
                    <div className="user-chat-nav float-end">
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle tag="a" className="font-size-18 text-muted dropdown-toggle">
                                <i className="ri-more-2-fill"></i>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>{t('Edit')}</DropdownItem>
                                <DropdownItem>{t('Action')}</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>{t('Another action')}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <h4 className="mb-0">{t('My Profile')}</h4>
                </div>

                <div className="text-center p-4 border-bottom">
                    <div className="mb-4">
                        {props.profile?.Avatar === "Resource/no_img.jpg" ?
                            <div className="avatar-lg">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                                    {props.profile?.FullName?.charAt(0)}
                                </span>
                            </div> :
                            <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${props.profile?.Avatar}`} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />}                                </div>

                    <h5 className="font-size-16 mb-1 text-truncate">{t('Patricia Smith')}</h5>
                    <p className="text-muted text-truncate mb-1"><i className="ri-record-circle-fill font-size-10 text-success me-1 d-inline-block"></i> {t('Active')}</p>
                </div>
                {/* End profile user  */}

                {/* Start user-profile-desc */}
                <div className="p-4 user-profile-desc">
                    <div className="text-muted">
                        <p className="mb-4">{t('If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.')}</p>
                    </div>


                    <div id="profile-user-accordion-1" className="custom-accordion">
                        <Card className="shadow-none border mb-2">
                            {/* import collaps */}
                            <CustomCollapse
                                title="About"
                                iconClass="ri-user-2-line"
                                isOpen={isOpen1}
                                toggleCollapse={toggleCollapse1}
                            >
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
                        </Card>
                        {/* End About card  */}
                        {/* End Attached Files card  */}
                    </div>
                    {/* end profile-user-accordion  */}

                </div>
                {/* end user-profile-desc  */}
            </div>
        </React.Fragment>
    );
}

export default Profile;