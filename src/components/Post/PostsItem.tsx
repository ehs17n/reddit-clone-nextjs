import React, { useState } from 'react';
import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { NextRouter } from 'next/router';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

import Link from 'next/link';
import { Post } from '../../atoms/postsAtom';

type PostsItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: () => {};
  onDeletePost: () => {};
  onSelectPost: () => void;
};

const PostsItem: React.FC<PostsItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) => {
  return <Flex border='1px solid' bg='white' >Have a good coding</Flex>;
};
export default PostsItem;
