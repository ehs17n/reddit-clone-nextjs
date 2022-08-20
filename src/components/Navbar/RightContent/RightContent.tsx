import React from 'react';
import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import AuthModal from '../../Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';
import Icons from './Icons';
import MenuWrapper from '../../ProfileMenu/MenuWrapper';
// import Icons from './Icons';
// import MenuWrapper from './ProfileMenu/MenuWrapper';
type RightContentProps = {
  user: any
};



const RightContent: React.FC<RightContentProps> = ({user}) => {
  return (
    <>
      <AuthModal />
      <Flex justifyContent='space-between' alignItems='center'>
        {user ? <Icons /> : <AuthButtons />}

        <MenuWrapper user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
