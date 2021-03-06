import React, { useState, useEffect } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form } from "reactstrap";
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import FileList from "./FileList"
import ImageItem from './ImageItem';

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const [imageFileTarget, setImageFileTarget] = useState({
        file: "",
        name: "",
    });
    const [isOpen, setisOpen] = useState(false);
    const [file, setfile] = useState({
        file: "",
        name: "",
        size: ""
    });
    const [fileImage, setfileImage] = useState("")

    const toggle = () => setisOpen(!isOpen);

    //function for text input value change
    const handleChange = async e => {
        const Code = localStorage.getItem("authUser");
        settextMessage(e.target.value)
        if (!props.active_user?.IsGroup) {
            if (props.log?.length !== 0) {
                if (e.target.value !== "" && props?.lastMessage?.Id) {
                    await props.connection.invoke("IsTyping", props.active_user.Code, props.profile?.FullName, Code, props.profile?.Avatar)
                }
                else {
                    await removeTyping()
                }
            }
        }
        else {
            if (e.target.value !== "") {
                await props.connection.invoke("IsTyping", props.active_user.Code, props.profile?.FullName, Code, props.profile?.Avatar)
            }
            else {
                await removeTyping()
            }
        }
    }

    //function for add emojis
    const addEmoji = e => {
        let emoji = e.native;
        settextMessage(textMessage + emoji)
    };

    //function for file input change
    const handleFileChange = e => {
        if (e.target.files.length !== 0)
            setfile({
                file: e.target.files[0],
                name: e.target.files[0].name,
                size: e.target.files[0].size
            })
    }

    //function for image input change
    const handleImageChange = e => {
        if (e.target.files.length !== 0) {
            setfileImage(URL.createObjectURL(e.target.files[0]))
            setImageFileTarget({
                file: e.target.files[0],
                name: e.target.files[0].name,
            })
        }
    }
    const removeTyping = async () => {
        const Code = localStorage.getItem("authUser");
        await props.connection.invoke("NotIsTyping", props.active_user.Code, props.profile?.FullName, Code, props.profile?.Avatar)
    }
    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                console.log("Enter key was pressed. Run your function.");
                onaddMessage(event)
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [textMessage]);

    useEffect(() => {
        document.getElementById("chatInput").focus();
        settextMessage("")
        removeTyping()
    }, [props.active_user?.Code])

    const onaddMessage = async (e) => {
        e.preventDefault();
        //if text value is not emptry then call onaddMessage function
        const formData = new FormData();
        if (textMessage !== "") {
            formData.append("data", JSON.stringify({
                SendTo: props.active_user?.Code || props.active_user?.UserCode,
                Content: textMessage.trim(),
                Type: "text"
            }));
            props.addMessageRealtime(props.active_user?.Code || props.active_user?.UserCode, formData);
            settextMessage("");
            props.scrolltoBottom()
            await removeTyping()
        }

        //if file input value is not empty then call onaddMessage function
        if (file.name !== "") {
            formData.append("files", file?.file, file.name);
            formData.append("data", JSON.stringify({
                SendTo: props.active_user?.Code || props.active_user?.UserCode,
                Content: textMessage.trim(),
                Type: "attachment"
            }));
            props.addMessageRealtime(props.active_user?.Code || props.active_user?.UserCode, formData);
            setfile({
                file: "",
                name: "",
                size: ""
            })
        }

        //if image input value is not empty then call onaddMessage function
        if (fileImage !== "") {
            formData.append("files", imageFileTarget?.file, imageFileTarget.name);
            formData.append("data", JSON.stringify({
                SendTo: props.active_user?.Code || props.active_user?.UserCode,
                Content: textMessage.trim(),
                Type: "media"
            }));
            props.addMessageRealtime(props.active_user?.Code || props.active_user?.UserCode, formData);
            setfileImage("")
            setImageFileTarget({
                file: "",
                name: "",
            })
        }
    }
    const handleFocus = async () => {
        const Code = localStorage.getItem("authUser");
        if (props?.lastMessage?.Id) {
            props.connection.invoke("SeenMessage", props?.lastMessage?.Id, Code, props.active_user?.Code || props.active_user?.UserCode);
            await removeTyping()
        }
    }
    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-top mb-0">
                <Form onSubmit={(e) => onaddMessage(e)} >
                    <Row noGutters>
                        <Col>
                            <div>
                                {file?.name && <FileList hideControl fileName={file.name} fileSize={file.size} />}
                                {fileImage && <ImageItem local image={fileImage} title={imageFileTarget?.name} />}
                                {!fileImage && !file?.name && <Input onFocus={handleFocus} id="chatInput" autoFocus type="text" value={textMessage} onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />}
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="chat-input-links ms-md-2">
                                <ul className="list-inline mb-0 ms-0">
                                    <li className="list-inline-item">
                                        <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                                            <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                                                <i className="ri-emotion-happy-line"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <Picker onSelect={addEmoji} />
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        <UncontrolledTooltip target="emoji" placement="top">
                                            Emoji
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="list-inline-item input-file">
                                        <Label id="files" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                            <i className="ri-attachment-line"></i>
                                            <Input onChange={(e) => handleFileChange(e)} type="file" name="fileInput" size="60" />
                                        </Label>
                                        <UncontrolledTooltip target="files" placement="top">
                                            Attached File
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="list-inline-item input-file">
                                        <Label id="images" className="me-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                            <i className="ri-image-fill"></i>
                                            <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file" name="fileInput" size="60" />
                                        </Label>
                                        <UncontrolledTooltip target="images" placement="top">
                                            Images
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="list-inline-item">
                                        <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                            <i className="ri-send-plane-2-fill"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    );
}

export default ChatInput;