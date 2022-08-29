import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Post/PostForm/NewPostForm';
import { auth } from '../../../firebase/clientApp';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  return (
    <PageContent>
      <>
        <Box p={'14px 0'} borderBottom='1px solid' borderColor={'white'}>
          <Text>Create Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>
        <Box></Box>
      </>
    </PageContent>
  );
};
export default SubmitPostPage;
