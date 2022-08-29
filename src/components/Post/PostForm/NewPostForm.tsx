import { Flex, Icon, SelectField, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { BiPoll } from 'react-icons/bi';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInput from './TextInput';
import ImageUpload from './ImageUpload';
import { Post } from '../../../atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { firestore, storage } from '../../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

type NewPostFormProps = {
  user: User;
};
const formTabs = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Link',
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>();

  const handleCreatePost = async () => {
    const { communityId } = router.query;

    //Post object

    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      voteStatus: 0,
      numberOfComments: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      //store post in db
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

      if (selectedFile) {
        //store image in storage
        const imageRef = ref(storage, `post/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');

        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
    } catch (error: any) {
      console.log('handle create post error: ', error.message);
      setError(true);
    }
    setLoading(false);

    //redirect to communityPage
    router.push;
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return (
    <Flex direction={'column'} bg='white' borderRadius={4} mt={2}>
      <Flex width={'100%'}>
        {formTabs.map((item) => (
          <TabItem
            item={item}
            key={item.title}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInput
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & video' && (
          <ImageUpload
            setSelectedFile={setSelectedFile}
            onSelectImage={onSelectImage}
            setSelectedTab={setSelectedTab}
            selectedFile={selectedFile}
          />
        )}
      </Flex>
      {error && <Text color={'black'}>post Error</Text>}
    </Flex>
  );
};
export default NewPostForm;
