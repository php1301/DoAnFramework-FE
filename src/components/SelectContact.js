import React, { Component } from 'react';
import { Input, Label } from "reactstrap";
import { connect } from "react-redux";

//use sortedContacts variable as global variable to sort contacts
let sortedContacts = [
    {
        group: "A",
        children: [{ id: 0, name: "Demo" }]
    }
]

class SelectContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: this.props.contacts
        }
    }

    render() {
        return (

            <React.Fragment>
                {
                    this.props?.contact?.map((contact, key) =>
                        <div key={key}>
                            <div className="p-3 font-weight-bold text-primary">
                                {contact.group}
                            </div>

                            <ul className="list-unstyled contact-list">
                                {
                                    contact.children.map((child, keyChild) =>

                                        <li key={keyChild}>
                                            <div className="form-check">
                                                <Input type="checkbox" className="form-check-input" onChange={(e) => this.props.handleCheck(e, child.Code)} id={"memberCheck" + child.Code} value={child.FullName} />
                                                <Label className="form-check-label" htmlFor={"memberCheck" + child.Code}>{child.FullName}</Label>
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { contacts, contact } = state.Chat;
    return { contacts, contact };
};

export default (connect(mapStateToProps, {})(SelectContact));