import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostsItem from './PostsItem';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const getPosts = async () => {
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {postStateValue.posts.map((post) => (
        <PostsItem
          onDeletePost={onDeletePost}
          onSelectPost={onSelectPost}
          onVote={onVote}
          post={post}
          userIsCreator={user?.uid === post.creatorId}
          userVoteValue={1}
          
        />
      ))}
    </>
  );
};
export default Posts;
