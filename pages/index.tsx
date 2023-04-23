import { GetServerSideProps } from 'next';
import React, { useEffect } from 'react';
import initMiro from '../initMiro';
import MindMap from '../components/MindMap';

export const getServerSideProps: GetServerSideProps = async function getServerSideProps({ req }) {
  const { miro } = initMiro(req);

  // redirect to auth url if user has not authorized the app
  if (!(await miro.isAuthorized(''))) {
    return {
      redirect: {
        destination: miro.getAuthUrl(),
        permanent: false,
      },
    };
  }

  const api = miro.as('');

  const boards: string[] = [];

  for await (const board of api.getAllBoards()) {
    boards.push(board.name || '');
  }

  return {
    props: {
      boards,
    },
  };
};

export default function Main() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('panel')) return;

    window.miro.board.ui.on('icon:click', async () => {
      window.miro.board.ui.openPanel({
        url: `/?panel=1`,
      });
    });
  }, []);

  return (
    <div className="wrapper">
      <MindMap />
    </div>
  );
}
