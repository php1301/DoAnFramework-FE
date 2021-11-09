import React from 'react'
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { toggleCallModal, cancelVideoCall, getDetailsCallHistory, callHistory } from "../../../redux/actions";
function CallModal({ callModal, toggleCallModal, cancelVideoCall, callingUser, callHistory, getDetailsCallHistory, activeCallLog }) {
    const handleCloseCall = () => {
        cancelVideoCall(callingUser)
        callHistory()
        if (activeCallLog && activeCallLog?.Code) {
            getDetailsCallHistory(activeCallLog?.Code);
        }
        toggleCallModal()
    }
    return (
        <Modal isOpen={callModal} id="modalOutgoingCall" data-keyboard="false" data-backdrop="false" style={{ maxWidth: "none", height: "100%" }}>
            <ModalBody className="modal-dialog-full">
                <div>
                    {callingUser && <iframe width="100%" height="600px" id="outgoingCallIframe" title="callbox" src={callingUser} frameborder="0" allow="camera *;microphone *"></iframe>}
                </div>
                <ModalFooter className="modal-footer">
                    <div style={{ textAlign: "center" }}>
                        <button onClick={handleCloseCall} type="button" className="btn btn-danger btn-sm">
                            Đóng cuộc gọi
                        </button>
                    </div>
                </ModalFooter>
            </ModalBody>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    const { callModal } = state.Layout;
    const { callingUser, activeCallLog } = state.Call;
    return { callModal, callingUser, activeCallLog };
};

export default (connect(mapStateToProps, { toggleCallModal, cancelVideoCall, getDetailsCallHistory, callHistory })((CallModal)));