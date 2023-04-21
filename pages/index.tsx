import {GetServerSideProps} from 'next';
import {useEffect} from 'react';
import initMiro from '../initMiro';
import Image from 'next/image';

import congratulations from '../public/congratulations.png';

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({req}) {
    const {miro} = initMiro(req);

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

export default function Main({boards}: {boards: string[]}) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('panel')) return;

    window.miro.board.ui.on('icon:click', async () => {
      window.miro.board.ui.openPanel({
        url: `/?panel=1`,
      });
    });
  }, []);

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <Image src={congratulations} alt="Congratulations text" />
      </div>
      <div className="cs1 ce12">
        <h1>Congratulations!</h1>
        <p>You've just created your first Miro app!</p>
        <p>This is a list of all the boards that your user has access to:</p>

        <ul>
          {boards.map((board, idx) => (
            <li key={idx}>{board}</li>
          ))}
        </ul>

        <p>
          To explore more and build your own app, see the Miro Developer
          Platform documentation.
        </p>
      </div>
      <div className="cs1 ce12">
        <a
          className="button button-primary"
          target="_blank"
          href="https://developers.miro.com"
        >
          Read the documentation
        </a>
      </div>
    </div>
  );
}
