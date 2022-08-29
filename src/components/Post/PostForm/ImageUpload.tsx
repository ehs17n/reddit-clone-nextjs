import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react';

import { eventNames } from 'process';
import React, { ReactNode, useRef, useState } from 'react';

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  setSelectedFile,
  onSelectImage,
  setSelectedTab,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex width={'100%'} justify='center' align='center'>
      {selectedFile ? (
        <>
          <Image
            src={selectedFile as string}
            maxWidth='400px'
            maxHeight='400px'
            alt='hi'
          />
          <Stack direction='row' mt={4}>
            <Button height='28px' onClick={() => setSelectedTab('Post')}>
              Back to Post
            </Button>
            <Button
              variant='outline'
              height='28px'
              onClick={() => setSelectedFile('')}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={'center'}
          align='center'
          p={20}
          border='1px dashed'
          borderColor={'gray.300'}
          width='100%'
          borderRadius={4}
        >
          <Button
            variant={'outline'}
            height='20px'
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            type='file'
            ref={selectedFileRef}
            hidden
            onChange={(e) => onSelectImage(e)}
          />
          <img src={selectedFile} />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
