import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import { DateTime } from "luxon";
import { callUser, toggleCallModal } from "../../../redux/actions";
function CallLog({ detailCallHistory, active, callUser, toggleCallModal }) {
    const activeCallUser = detailCallHistory?.[0]?.User;
    const ref = useRef()
    const containUsersOnline = (code) => {
        const data = active?.active?.length > 0 && active?.active?.filter(c => c.code !== active.userCode)
        const index = data?.length > 0 ? data?.findIndex(i => i.code === code) : -1
        return index;
    }
    const formatDate = (date) => {
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
    const handleCall = (code) => {
        callUser(code)
        toggleCallModal()
    }
    useEffect(() => {
        ref.current.scrollIntoView()
    }, [])
    return (
        <div ref={ref} class="main-box-call">
            <div class="main-box-call-header">
                <div class="box-avatar mr-1">
                    {activeCallUser?.Avatar === "Resource/no_img.jpg" ?
                        <div className={`${containUsersOnline(activeCallUser?.Code) !== -1 ? "chat-user-img online" : "chat-user-img"} align-self-center me-3 ms-0`}>
                            <div className="avatar-xs">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    {activeCallUser?.FullName?.charAt(0)}
                                </span>
                            </div>
                            {
                                <span className="user-status"></span>
                            }
                        </div>
                        :
                        <div className={`${containUsersOnline(activeCallUser?.Code) !== -1 ? "chat-user-img online" : "chat-user-img"} align-self-center ms-0`}>
                            <img src={`${process.env.REACT_APP_BASE_API_URL || localStorage.getItem("baseApi")}/Auth/img?key=${activeCallUser?.Avatar}`} className="rounded-circle avatar-xs" alt="chatvia" />
                            {
                                <span className="user-status"></span>
                            }
                        </div>
                    }
                </div>
                <p style={{ padding: "10px" }}>{activeCallUser?.FullName}</p>
            </div>
            <div class="box-main-call">
                <ul class="list-group">
                    {
                        detailCallHistory?.length > 0 && detailCallHistory?.map(c => {
                            return (
                                <li class="list-group-item">
                                    <div class="list-call-detail">
                                        <div>
                                            {
                                                (c?.Status === "MISSED" && <i className="mdi mdi-phone-missed"></i>) ||
                                                (c?.Status === "OUT_GOING" && <i className="mdi mdi-phone-outgoing"></i>) ||
                                                (c?.Status === "IN_COMMING" && <i className="mdi mdi-phone-incoming"></i>)
                                            }

                                            <div>
                                                <div>
                                                    {
                                                        (c?.Status === "MISSED" && <b>Cuộc gọi nhỡ</b>) ||
                                                        (c?.Status === "OUT_GOING" && <b>Cuộc gọi đi</b>) ||
                                                        (c?.Status === "IN_COMMING" && <b>Cuộc gọi đến</b>)
                                                    }
                                                </div>
                                                <div>
                                                    <small>{formatDate(c?.Created)}</small>
                                                </div>
                                            </div >
                                        </div >
                                        <div>
                                            <span onClick={() => { handleCall(c.UserCode) }} class="span-call span-call-video">
                                                <i class="mdi mdi-video"></i>
                                            </span>
                                        </div >
                                    </div >
                                </li >
                            )
                        })
                    }
                </ul >
            </div >
        </div >
    )
}
const mapStateToProps = (state) => {
    const { active } = state.Chat
    const { detailCallHistory } = state.Call;
    return { detailCallHistory, active };
};
export default (connect(mapStateToProps, { callUser, toggleCallModal })((CallLog)));