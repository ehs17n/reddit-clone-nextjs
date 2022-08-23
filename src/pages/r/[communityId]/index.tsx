import React from 'react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/clientApp';
import { Community } from '../../../atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import Header from './Header';
import PageContentLayout from '../../../components/Layout/PageContent';
type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <div>community does not exist</div>;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <div>LHS</div>
        </>
        <>
          <div>RHS</div>
        </>
      </PageContentLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'community',
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : '',
      }, // will be passed to the page component as props
    };
  } catch (error) {
    // you can add error page
    console.log('serverSide error', error);
  }
}

export default CommunityPage;
