import React from 'react';
import { Link } from "react-router-dom";

//carousel
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

//Import Images
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";

function OnlineUsers(props) {
    const responsive = {
        0: { items: 4 },
        1024: { items: 4 },
    }
    const handleClick = (code) => {
        props.chatLogs(null, code, true)
    }
    return (
        <React.Fragment>
            {/* Start user status */}
            <div className="px-4 pb-4 dot_remove" dir="ltr" >
                <AliceCarousel
                    responsive={responsive}
                    disableDotsControls={false}
                    disableButtonsControls={false}
                    mouseTracking
                >
                    {props?.active?.active?.length > 0 && props?.active?.active?.map(a => {
                        return (
                            a?.code !== props?.active?.userCode && <div onClick={() => { handleClick(a?.code) }} className="item">
                                <Link to="#" className="user-status-box">
                                    <div className="avatar-xs mx-auto d-block chat-user-img online">

                                        {
                                            <>
                                                {a.avatar === "Resource/no_img.jpg" ?
                                                    <div className={"chat-user-img align-self-center me-3 ms-0"}>
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                {a?.fullName?.charAt(0)}
                                                            </span>
                                                        </div>

                                                    </div>
                                                    :
                                                    <>
                                                        <img src={`${process.env.REACT_APP_BASE_API_URL}/Auth/img?key=${a?.avatar}`} className="img-fluid rounded-circle" alt="chatvia" />
                                                    </>
                                                }
                                            </>
                                        }
                                        <span className="user-status"></span>
                                    </div>

                                    <h5 className="font-size-13 text-truncate mt-3 mb-1">{a?.fullName.split(" ")[0]}</h5>
                                </Link>
                            </div>
                        )
                    })}
                </AliceCarousel>
                {/* end user status carousel */}
            </div>
            {/* end user status  */}
        </React.Fragment>
    );
}

export default OnlineUsers;