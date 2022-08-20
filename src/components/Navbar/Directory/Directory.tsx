import React, { useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Image,
} from '@chakra-ui/react';
// import useDirectory from '../../../hooks/useDirectory';
import Communities from './Communities';
import { TiHome } from 'react-icons/ti';

const Directory: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // const { directoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius='4px'
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex
          alignItems='center'
          justify='space-between'
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex alignItems='center'>
            <Icon as={TiHome} fontSize={24} mr={{ base: 3, md: 2 }} />
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text> Home</Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color='gray.500' />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities/>
      </MenuList>
    </Menu>
  );
};
export default Directory;
