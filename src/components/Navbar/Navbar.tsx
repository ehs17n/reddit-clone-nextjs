import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
// import {
//   defaultMenuItem,
//   directoryMenuState,
// } from '../../atoms/directoryMenuAtom';

// import Directory from './Directory';

import { auth } from '../../firebase/clientApp';
// import useDirectory from '../../hooks/useDirectory';
import SearchInput from './SearchInput';
import router from 'next/router';

import RightContent from './RightContent/RightContent';
import Directory from './Directory/Directory';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  //   // Use <Link> for initial build; implement directory logic near end
  //   const { onSelectMenuItem } = useDirectory();
  return (
    <Flex
      bg='white'
      height='44px'
      padding='6px 12px'
      justifyContent={{ md: 'space-between' }}
    >
      <Flex
        align='center'
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
        cursor='pointer'
        // onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src='/images/redditFace.svg' height='30px' alt='' />
        <Image
          display={{ base: 'none', md: 'unset' }}
          src='/images/redditText.svg'
          height='46px'
          alt=''
        />
      </Flex>
      {user && <Directory />}
     
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
