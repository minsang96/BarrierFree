import AuthTemplate from '../components/auth/AuthTemplate';
import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const RegisterCompletedPageBlock = styled.div`
  h2 {
    margin: 0;
    margin-bottom: 1rem;
  }
  p {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`;

const ButtonWith = styled(Button)`
  margin-top: 0.5rem;
  width: 90%;
  padding-right: 10px;
`;
const RegisterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userNickname = searchParams.get('userNickname');
  const certified = searchParams.get('certified');

  useEffect(
    () =>
      axios({
        url: '/user/email/certified',
        method: 'post',
        params: {
          userNickname: userNickname,
          certified: certified,
        },
      }),
    [],
  );

  return (
    <AuthTemplate>
      <RegisterCompletedPageBlock>
        <h1>
          <span style={{ color: '#EA5455' }}>베</span>리어{' '}
          <span style={{ color: '#EA5455' }}>프</span>리에 <br />
          오신 것을 환영합니다!
        </h1>
        <h4>
          안녕하세요 <span style={{ color: '#EA5455' }}>{userNickname}</span>님!
        </h4>
        <p>이메일 인증이 완료되었습니다.</p>
        <p>베리어 프리에서 여러분의 신나는 여행을 공유해보세요!</p>
        <Link to="/loginpage">
          <ButtonWith fullWidth cyan>
            로그인하기
          </ButtonWith>
        </Link>
        <Link to="/">
          <ButtonWith fullWidth cyan style={{ marginTop: '0.5rem' }}>
            메인페이지로 이동
          </ButtonWith>
        </Link>
      </RegisterCompletedPageBlock>
    </AuthTemplate>
  );
};

export default RegisterPage;
