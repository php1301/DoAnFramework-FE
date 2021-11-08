import React, { useEffect } from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Groups from "./Tabs/Groups";
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";

import { requestUserProfile, updateUserProfile } from "../../redux/actions"

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;
    useEffect(() => {
        props.requestUserProfile()
    }, [])
    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">

                <TabContent activeTab={activeTab}>
                    {/* Start Profile tab-pane */}
                    {props?.profile && <TabPane tabId="profile" id="pills-user">
                        {/* profile content  */}
                        <Profile profile={props?.profile} />
                    </TabPane>
                    }
                    {/* End Profile tab-pane  */}

                    {/* Start chats tab-pane  */}
                    <TabPane tabId="chat" id="pills-chat">
                        {/* chats content */}
                        <Chats recentChatList={props.recentChatList} />
                    </TabPane>
                    {/* End chats tab-pane */}

                    {/* Start groups tab-pane */}
                    <TabPane tabId="group" id="pills-groups">
                        {/* Groups content */}
                        <Groups />
                    </TabPane>
                    {/* End groups tab-pane */}

                    {/* Start contacts tab-pane */}
                    <TabPane tabId="contacts" id="pills-contacts">
                        {/* Contact content */}
                        <Contacts />
                    </TabPane>
                    {/* End contacts tab-pane */}

                    {/* Start settings tab-pane */}
                    {props?.profile && <TabPane tabId="settings" id="pills-setting">
                        {/* Settings content */}
                        <Settings profile={props?.profile} updateUserProfile={props?.updateUserProfile} />
                    </TabPane>
                    }
                    {/* End settings tab-pane */}
                </TabContent>
                {/* end tab content */}

            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    const { profile } = state.Auth
    return {
        ...state.Layout,
        profile
    };
};

export default connect(mapStatetoProps, { requestUserProfile, updateUserProfile })(ChatLeftSidebar);