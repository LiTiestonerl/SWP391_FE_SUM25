import React from 'react';
import LoginForm from '../authen-form/LoginForm';
import RegisterForm from '../authen-form/RegisterForm';
import ForgotPasswordForm from '../authen-form/ForgotPasswordForm';
import './index.css'

function AuthenTemplate({ isLogin, formType }) {
  let FormComponent;
  if (formType === "forgot-password") {
    FormComponent = ForgotPasswordForm;
  } else if (isLogin) {
    FormComponent = LoginForm;
  } else {
    FormComponent = RegisterForm;
  }

  return (
    <div className="authen-template">
      <div className="authen-template__form">
        <FormComponent />
      </div>
      <div className="authen-template__image"></div>
    </div>
  );
}


export default AuthenTemplate;