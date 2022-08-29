import {
  collection,
  doc,
  getDocs,
  increment,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import {
  Community,
  CommunitySnippet,
  communityState,
} from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';

type useCommunityDataProps = {};

const useCommunityData = () => {
  const [communityStateValue, setcommunityStateValue] =
    useRecoilState(communityState);
  const [user] = useAuthState(auth);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuthModalState = useSetRecoilState(authModalState);

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippet = async () => {
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setcommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      console.log(communityStateValue);
    } catch (error) {
      console.log('useCommunity getMySnippet', error);
    }
  };

  const joinCommunity = async (communityData: Community) => {
    //batch write
    //creating a new communty snippet
    //updating number of members
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, 'community', communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      //update reciol communtyState.mySnippets
      setcommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
      setLoading(false);
    } catch (error) {
      console.log('join community error', error);
    }
  };
  const leaveCommunity = async (communityId: string) => {
    //batch write
    //updating number of members
    //update reciol communtyState.mySnippets
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      //deleting communty snippet from user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      batch.update(doc(firestore, 'community', communityId), {
        numberOfMembers: increment(-1),
      });
      await batch.commit();
      setcommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
      setLoading(false);
    } catch (error) {
      console.log('leave community error', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    getMySnippet();
  }, [user]);

  return {
    joinCommunity,
    leaveCommunity,
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
