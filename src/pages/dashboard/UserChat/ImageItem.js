import React, { useState } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Link } from "react-router-dom";
import { saveAs } from 'file-saver';

//i18n
import { useTranslation } from 'react-i18next';

//lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function ImageItem(props) {
    const [isOpen, setisOpen] = useState(false);
    const [currentImage, setcurrentImage] = useState(null);
    const [image] = useState(props.image);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const toggleLightbox = (currentImage) => {
        setisOpen(!isOpen);
        setcurrentImage(currentImage);
    }
    const handleDownload = async (link) => {
        const data = await fetch(link)
        const blob = await data.blob()
        saveAs(blob, props?.title);
    }
    return (
        <React.Fragment>
            <ul className="list-inline message-img  mb-0">
                {/* image list */}
                {
                    <li className="list-inline-item message-img-list">
                        <div>
                            <Link to="#" onClick={() => toggleLightbox(`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${image}`)} className="popup-img d-inline-block m-1" title={props.title}>
                                {props.local ? <img src={image} alt="chat" className="rounded border" width={50} height={50} /> : <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${image}`} alt="chat" className="rounded border" />}
                            </Link>
                        </div>
                        {!props.local && <div className="message-img-link">
                            <ul className="list-inline mb-0">
                                <li onClick={() => {
                                    handleDownload(`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${image}`)
                                }} className="list-inline-item">
                                    <Link to="#">
                                        <i className="ri-download-2-line"></i>
                                    </Link>
                                </li>
                                <UncontrolledDropdown tag="li" className="list-inline-item">
                                    <DropdownToggle tag="a">
                                        <i className="ri-more-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem>{t('Forward')} <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                        <DropdownItem>{t('Delete')} <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </ul>
                        </div>
                        }
                    </li>
                }

                {isOpen && (
                    <Lightbox
                        mainSrc={currentImage}
                        onCloseRequest={toggleLightbox}
                        imageTitle={props.title}
                    />
                )}

            </ul>
        </React.Fragment >
    );
}

export default ImageItem;