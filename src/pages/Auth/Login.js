import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

//i18n
import { useTranslation } from 'react-i18next';

//redux store
import { loginUser, apiError } from '../../redux/actions';

//Import Images
import logodark from "../../assets/images/logo.svg";

/**
 * Login component
 * @param {*} props 
 */
const Login = (props) => {

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const clearError = () => {
        props.apiError("");
    }

    useEffect(clearError);

    // validation
    const formik = useFormik({
        initialValues: {
            username: 'admin',
            password: '123'
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Thông tin bắt buộc'),
            password: Yup.string().required('Thông tin bắt buộc')
        }),
        onSubmit: values => {
            props.loginUser(values.username, values.password, props.history);
        },
    });

    if (localStorage.getItem("authUser")) {
        return <Redirect to="/" />;
    }

    return (
        <React.Fragment>

            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} >
                            <div className="text-center mb-4">
                                <Link to="/" className="auth-logo mb-5 d-block">
                                    <img src={logodark} alt="" height="30" className="logo logo-dark" />
                                    <img src={logodark} alt="" height="30" className="logo logo-light" />
                                </Link>

                                <h4>{t('Sign in')}</h4>
                                <p className="text-muted mb-4">{t('Sign in to continue to Chatlife')}.</p>

                            </div>

                            <Card>
                                <CardBody className="p-4">
                                    {
                                        props.error && <Alert color="danger">{props.error}</Alert>
                                    }
                                    <div className="p-3">

                                        <Form onSubmit={formik.handleSubmit}>

                                            <div className="mb-3">
                                                <Label className="form-label">{t('Username')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted" id="basic-addon3">
                                                        <i className="ri-user-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder="Enter username"
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

                                            <FormGroup className="mb-4">
                                                <div className="float-end">
                                                    <Link to="forget-password" className="text-muted font-size-13">{t('Forgot password')}?</Link>
                                                </div>
                                                <Label className="form-label">{t('Password')}</Label>
                                                <InputGroup className="mb-3 bg-soft-light rounded-3">
                                                    <span className="input-group-text text-muted">
                                                        <i className="ri-lock-2-line"></i>
                                                    </span>
                                                    <Input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg border-light bg-soft-light"
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

                                            <div className="form-check mb-4">
                                                <Input type="checkbox" className="form-check-input" id="remember-check" />
                                                <Label className="form-check-label" htmlFor="remember-check">{t('Remember me')}</Label>
                                            </div>

                                            <div className="d-grid">
                                                <Button color="primary" block className=" waves-effect waves-light" type="submit">{t('Sign in')}</Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t("Don't have an account")} ? <Link to="register" className="font-weight-medium text-primary"> {t('Signup now')} </Link> </p>
                                <p>© {t('2021 Chatlife')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by Themesbrand')}</p>
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

export default withRouter(connect(mapStateToProps, { loginUser, apiError })(Login));