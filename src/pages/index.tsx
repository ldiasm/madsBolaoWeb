import Image from 'next/image';
import appPreview from '../assets/preview.png';
import logo from '../assets/logo.svg';
import avatars from '../assets/avatars.png';
import checkIcon from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [pollTitle, setPollTitle] = useState('');

  async function createPoll(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      });
      const { code } = response.data;
      console.log('Codigo: ', response, code);
      await navigator.clipboard.writeText(code);

      setPollTitle('');

      alert(
        'Bolão copiado com sucesso! O código ' +
          code +
          ' foi copiado para a área de transferência'
      );
    } catch (error) {
      alert('Falha ao criar o Bolão');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logo} alt='Logo' />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatars} alt='Avatares estáticos' />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPoll} className='mt-10 flex'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-white'
            required
            type='text'
            placeholder='Qual o nome do seu bolão?'
            onChange={(event) => setPollTitle(event.target.value)}
            value={pollTitle}
          ></input>
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type='submit'
          >
            Criar seu bolão
          </button>
        </form>
        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar seus amigos
        </p>
        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100'>
          <div className='px-8 flex items-center gap-6'>
            <Image src={checkIcon} alt='Check icon' />
            <div className='flex flex-col '>
              <span className='font-bold text-2xl'>+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600' />
          <div className='px-8 flex items-center gap-6'>
            <Image src={checkIcon} alt='Check icon' />
            <div className='flex flex-col '>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreview} alt='Banner com dois smartphones' quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/polls/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};

// export async function getStaticProps() {
//   return {
//     props: {},
//   };
// }
