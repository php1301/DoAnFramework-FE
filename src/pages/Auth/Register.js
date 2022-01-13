import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';

//Import action
import { registerUser, apiError } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Images
import logodark from "../../assets/images/logo.svg";
/**
 * Register component
 * @param {*} props 
 */
const Register = (props) => {

    const clearError = () => {
        props.apiError("");
    }

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    useEffect(clearError);

    // validation
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            fullName: '',
            phone: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Thông tin bắt buộc'),
            email: Yup.string().email('Enter proper email').required('Thông tin bắt buộc'),
            phone: Yup.string().matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, 'Chưa đúng định dạng').required("Thông tin bắt buộc"),
            password: Yup.string()
                .required('Thông tin bắt buộc')
        }),
        onSubmit: values => {
            props.registerUser(values, props.history);
        },
    });


    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div className="text-center mb-4">
                                <Link to="/" className="auth-logo mb-5 d-block">
                                    <img src={logodark} alt="" height="30" className="logo logo-dark" />
                                    <img src={logodark} alt="" height="30" className="logo logo-light" />
                                </Link>

                                <h4>{t('Sign up')}</h4>
                                <p className="text-muted mb-4">{t('Get your Chatlife account now')}.</p>

                            </div>

                            <Card>
                                <CardBody className="p-4">
                                    {
                                        props.error && <Alert variant="danger">{props.error}</Alert>
                                    }
                                    {
                                        props.user && <Alert variant="success">Thank You for registering with us!</Alert>
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Email')}</Label>
                                                <InputGroup className="input-group bg-soft-light rounded-3 mb-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-mail-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Email"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email}
                                                        invalid={formik.touched.email && formik.errors.email ? true : false}
                                                    />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Username')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Username"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.username}
                                                        invalid={formik.touched.username && formik.errors.username ? true : false}
                                                    />
                                                    {formik.touched.username && formik.errors.username ? (
                                                        <FormFeedback type="invalid">{formik.errors.username}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">{t('Họ Tên')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="fullName"
                                                    name="fullName"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Nguyễn Văn A"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.fullName}
                                                        invalid={formik.touched.fullName && formik.errors.fullName ? true : false}
                                                    />
                                                    {formik.touched.fullName && formik.errors.fullName ? (
                                                        <FormFeedback type="invalid">{formik.errors.fullName}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">{t('Số Điện Thoại')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="phone"
                                                        name="phone"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="0909090909"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.phone}
                                                        invalid={formik.touched.phone && formik.errors.phone ? true : false}
                                                    />
                                                    {formik.touched.phone && formik.errors.phone ? (
                                                        <FormFeedback type="invalid">{formik.errors.phone}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                                                    <span className="input-group-text border-light text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="Enter Password"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.password}
                                                        invalid={formik.touched.password && formik.errors.password ? true : false}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                                                    ) : null}

                                                </InputGroup>
                                            </FormGroup>


                                            <div className="d-grid">
                                                <Button color="primary" block className=" waves-effect waves-light" type="submit">Sign up</Button>
                                            </div>

                                            <div className="mt-4 text-center">
                                                <p className="text-muted mb-0">{t('By registering you agree to the Chatlife')} <Link to="#" className="text-primary">{t('Terms of Use')}</Link></p>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t('Already have an account')} ? <Link to="/login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
                                <p>© {t('2021 Chatlife')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by php1301')}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { registerUser, apiError })(Register));