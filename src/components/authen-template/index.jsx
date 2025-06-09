import React from 'react';
import LoginForm from '../authen-form/LoginForm';
import RegisterFrom from '../authen-form/RegisterForm';
import './index.css'
function AuthenTemplate({isLogin}) {
  return (
    <div className='authen-template'>
        <div className='authen-template__form'>
            {isLogin  ? <LoginForm/> : <RegisterFrom/>}
        </div>
        <div className='authen-template__image'></div>
    </div>
  );
}

export default AuthenTemplate;