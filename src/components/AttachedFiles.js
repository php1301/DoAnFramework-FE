import React from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, Card, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";

//i18n
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

function AttachedFiles(props) {
    const files = props.files;

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const handleDownload = async (link) => {
        const data = await fetch(link)
        const blob = await data.blob()
        saveAs(blob, link?.Content);
    }
    return (
        <React.Fragment>
            {
                files.map((file, key) =>
                    <Card key={key} className="p-2 border mb-2">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm me-3 ms-0">
                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                    <i className={file.Type === "attached" ? "ri-file-text-fill" : "ri-image-fill"}></i>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-left">
                                    <h5 className="font-size-14 mb-1">{file.Content}</h5>
                                    {/* <p className="text-muted font-size-13 mb-0">{file.size}</p> */}
                                </div>
                            </div>

                            <div className="ms-4">
                                <ul className="list-inline mb-0 font-size-18">
                                    <li onClick={() => { handleDownload(file) }} className="list-inline-item">
                                        <Link to="#" className="text-muted px-1">
                                            <i className="ri-download-2-line"></i>
                                        </Link>
                                    </li>
                                    <UncontrolledDropdown className="list-inline-item">
                                        <DropdownToggle className="text-muted px-1" tag="a">
                                            <i className="ri-more-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>{t('Action')}</DropdownItem>
                                            <DropdownItem>{t('Another Action')}</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem>{t('Delete')}</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </ul>
                            </div>
                        </div>
                    </Card>
                )
            }
        </React.Fragment>
    );
}

export default AttachedFiles;