import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import { auth, firestore } from '../../../firebase/clientApp';
import ModalWrapper from '../ModalWrapper';
import { useAuthState } from 'react-firebase-hooks/auth';
import { async } from '@firebase/util';

type CreateCommunityModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  //   userId: string;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.value);
  };

  const handleCreateCommunity = async () => {
    if (nameError) setNameError('');
    // Validate
    if (nameError) setNameError('');
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3) {
      setNameError(
        'Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.'
      );
      return;
    }

    setLoading(true);
    try {
      // Create the community document in firebase
      // unique name check
      const communityDocRef = doc(firestore, 'community', communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists()) {
          throw new Error('sorry name is taken');
        }
        // Create community
        transaction.set(communityDocRef, {
          createdId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });
        // Create community Snippet as user
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error: any) {
      console.log('handlehandleCreateCommunity', error);
      setNameError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            flexDirection='column'
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display='flex' flexDirection='column' padding='10px 0px'>
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color='gray.500'>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                color='gray.400'
                position='relative'
                top='28px'
                left='10px'
                width='20px'
              >
                r/
              </Text>
              <Input
                position='relative'
                name='name'
                value={communityName}
                onChange={handleChange}
                pl='22px'
                type={''}
                size='sm'
              />
              <Text
                fontSize='9pt'
                color={charsRemaining === 0 ? 'red' : 'gray.500'}
                pt={2}
              >
                {charsRemaining}
                Characters remaining
              </Text>
              <Text>{nameError}</Text>
              <Text fontSize='9pt' color='red' pt={1}>
                {/* {nameError} */}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2} pt={1}>
                  <Checkbox
                    colorScheme='blue'
                    name='public'
                    isChecked={communityType === 'public'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillPersonFill} mr={2} color='gray.500' />
                      <Text fontSize='10pt' mr={1}>
                        Public
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    colorScheme='blue'
                    name='restricted'
                    isChecked={communityType === 'restricted'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    colorScheme='blue'
                    name='private'
                    isChecked={communityType === 'private'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={HiLockClosed} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={1}>
                        Private
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button onClick={() => handleCreateCommunity()} variant='ghost'>
              create comm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
