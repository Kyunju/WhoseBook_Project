import { useState } from 'react';
import { useSelector } from 'react-redux';

import tw from 'twin.macro';
import styled from 'styled-components';
import { images } from '../../utils/importImgUrl';
import Modal from '../modals/Modal';
import Button from '../buttons/Button';

import { RootState } from '../../store/store';
import { ModalType } from '../../types';
import { postSubscribeAPI, deleteSubscribeAPI } from '../../api/profileApi';
import { useNavigate } from 'react-router-dom';
import { itemsPerSize } from '../../types';
import { customAlert } from '../alert/sweetAlert';

interface CuratorProps {
  curator?: string;
  curatorId: number | undefined;
  curatorImage: string | null | undefined;
  isSubscribe: boolean | undefined;
  setIsSubscribe: (data: boolean) => void;
}

const CurationProfileInfo: React.FC<CuratorProps> = ({
  curator,
  curatorId,
  curatorImage,
  isSubscribe,
  setIsSubscribe,
}) => {
  const [isModal, setIsModal] = useState<boolean>();

  const { memberId } = useSelector((state: RootState) => state.user);
  const token = localStorage.getItem('Authorization');
  const navigate = useNavigate();

  const handleModal = () => {
    setIsModal(!isModal);
  };

  const handleSubscribe = async () => {
    if (token) {
      const response = await postSubscribeAPI(Number(curatorId));
      if (response?.status === 201) {
        setIsSubscribe(!isSubscribe);
      }
    } else {
      customAlert({
        title: '로그인이 필요한 서비스입니다.',
        text: '구독기능은 로그인 후에 가능합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#777676',
        confirmButtonText: 'Login',
        handleRoutePage: () => navigate('/login', { state: { from: location.pathname } }),
      });
    }
  };

  const handleSubscribing = () => {
    handleModal();
  };

  const handleCancelSubscribe = async () => {
    const response = await deleteSubscribeAPI(Number(curatorId));
    if (response?.status === 204) {
      handleModal();
      setIsSubscribe(!isSubscribe);
    } else {
      alert('이미 구독을 취소한 상태입니다.');
      handleModal();
    }
  };
  const handleNameClick = () => {
    if (memberId === curatorId) {
      navigate(`/mypage`);
    } else {
      navigate(`/userpage/${curatorId}/written?page=1&size=${itemsPerSize}`);
    }
  };
  return (
    <ProfileInfoContainer>
      {isModal && (
        <Modal
          type={ModalType.SUBSCRIBE}
          handleCloseModal={handleModal}
          handleCancelSubscribe={handleCancelSubscribe}
          nickname={curator}
        />
      )}
      <ProfileInfoLeft>
        <UserInfo>
          <ProfileImage>
            <DefaultImg src={curatorImage || images.profileImg2} alt="profileImg" />
          </ProfileImage>
          <Nickname onClick={handleNameClick}>{curator}</Nickname>
          {memberId !== curatorId && (
            <>
              {isSubscribe ? (
                <Button
                  type="subscribe"
                  content="구독중"
                  width="5rem"
                  isSubscribed
                  onClick={handleSubscribing}
                />
              ) : (
                <Button
                  type="subscribe"
                  content="구독하기"
                  width="5rem"
                  onClick={handleSubscribe}
                />
              )}
            </>
          )}
        </UserInfo>
      </ProfileInfoLeft>
    </ProfileInfoContainer>
  );
};
export default CurationProfileInfo;

const ProfileInfoContainer = tw.section`
    flex
    justify-between
`;

const ProfileInfoLeft = styled.div`
  > div {
    margin: 1rem 0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  > button {
    margin-left: 0.75rem;
  }
`;

const ProfileImage = tw.div`
  rounded-full
  w-10
  h-10
  mr-3
  overflow-hidden
  flex
  justify-center
  border-solid border-[1px] border-gray-300
`;
const DefaultImg = styled.img`
  height: inherit;
  object-fit: cover;
  width: 100%;
`;

const Nickname = tw.p`
    text-lg
    font-thin
    cursor-pointer
`;
