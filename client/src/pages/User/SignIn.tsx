import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

import { images } from '../../utils/importImgUrl';
import { IUserLoginData, IUserLoginFormValid } from '../../types/user';
import { FormType, handleIsValid } from '../../utils/validation';
import { loginAPI } from '../../api/userApi';
import { VITE_OAUTH_GOOGLE_REDIRECT_URL } from '../../utils/envValiable';
import Label from '../../components/label/Label';
import Input from '../../components/input/Input';
import Button from '../../components/buttons/Button';
import { customAlert } from '../../components/alert/sweetAlert';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: '/' };
  const [formValue, setFormValue] = useState<IUserLoginData>({
    username: '',
    password: '',
  });
  const [formValid, setFormValid] = useState<IUserLoginFormValid>({
    username: false,
    password: false,
  });

  const handleUpdateFormValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
    handleFormValidation(e);
  };

  const handleFormValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValid({
      ...formValid,
      [name]: handleIsValid(name as FormType, value),
    });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (formValid.username && formValid.password) {
      const data = {
        username: formValue.username,
        password: formValue.password,
      };
      const response = await loginAPI(data);
      if (response) {
        navigate(from);
      } else {
        customAlert({
          title: '탈퇴한 계정으로 로그인하셨습니다.',
          text: '다시 후즈북의 큐레이터가 되어주시겠어요?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#91C8E4',
          cancelButtonColor: '#777676',
          confirmButtonText: '확인',
          handleRoutePage: () => navigate('/register'),
        });
      }
    }
  };

  const handleGoogleOAuthLogin = () => {
    window.location.href = VITE_OAUTH_GOOGLE_REDIRECT_URL;
  };

  return (
    <Container>
      <HeaderWrap>
        <img src={images.whoseBookLogo} alt="whose book logo" />
        <header className="title">후즈북</header>
      </HeaderWrap>
      <Form onSubmit={handleLogin}>
        <ItemWrap>
          <Label type="title" htmlFor="username" content="이메일" />
          <Input
            id="username"
            name="username"
            placeholder="이메일을 입력해주세요"
            onChange={handleUpdateFormValue}
          />
          {!formValid.username && formValue.username && (
            <Valid>올바른 이메일 형식이 아닙니다.</Valid>
          )}
        </ItemWrap>
        <ItemWrap>
          <Label type="title" htmlFor="password" content="비밀번호" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={handleUpdateFormValue}
          />
          {!formValid.password && formValue.password && (
            <>
              <Valid>영문, 숫자, 특수문자(!@#$%^&*)를 각 1개 포함,</Valid>
              <Valid>8자 이상 15자 미만만 입력가능합니다.</Valid>
            </>
          )}
        </ItemWrap>
        <ItemWrap>
          <Info>
            회원이 아니시라면? <Link to="/register">회원가입하러 가기</Link>
          </Info>
        </ItemWrap>
        <Button
          content="로그인"
          type={formValid.username && formValid.password ? 'primary' : 'disabled'}
          disabled={!(formValid.username && formValid.password)}
        />
        <Line />
        <SocialLoginForm>
          <SocialItemItemWrap onClick={handleGoogleOAuthLogin}>
            <GoogleLogoImg src={images.googleIcon} alt="google social login image" />
            <Button content="구글로 로그인하기" color="#371c1d" />
          </SocialItemItemWrap>
        </SocialLoginForm>
      </Form>
    </Container>
  );
};

const Container = tw.div`
  flex
  flex-col
  items-center
  justify-center
  w-full
  pt-28
`;

const HeaderWrap = tw.header`
  flex
  items-center
  mb-10
  [> img]:w-11
  [> img]:mr-4
`;

const Form = tw.form`
  flex
  flex-col
  items-center
  justify-center
  min-w-min
  w-[33rem]
  px-1
  py-20
  pb-20
  bg-gray-200
  rounded-xl
  shadow-lg
  shadow-gray-300
  [> button]:w-3/5
`;

const ItemWrap = tw.div`
  w-3/5
  mb-8
  [> input]:mt-3
  [> div]:mt-3
`;

const Info = tw.p`
  text-sm
  text-gray-500
  [> a]:text-blue-700
  [> a]:font-bold
`;

const Line = tw.div`
  w-[75%]
  border-t-[1px]
  border-solid
  border-gray-400
  mt-10
`;

const SocialLoginForm = tw.div`
  mt-10
  w-3/5
  [> div]:first:bg-[#fff]
  [> div]:mb-4
`;

const SocialItemItemWrap = tw.div`
  flex
  justify-center
  items-center
  rounded-lg
  cursor-pointer
  [> button]:w-1/2
`;

const GoogleLogoImg = tw.img`
  w-6
  h-6
  `;

const Valid = tw.p`
  mt-2
  text-center
  text-xs
  text-red-400
  [> p]:last:mt-0
`;

export default SignIn;
