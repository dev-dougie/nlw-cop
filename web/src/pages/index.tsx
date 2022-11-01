
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import LogoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import IconCheckImage from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolCount: Number
  guessCount: Number
  userCount: Number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle]  = useState('')

  async function createPool(ev: FormEvent) {
    ev.preventDefault();
   
    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })
      

      const { code } = response.data
      await navigator.clipboard.writeText(code);
      alert('Bolão criado com sucesso. O código foi copiado para sua área de transferência')
    } catch (error) {
      alert('Falha ao criar o bolão')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={LogoImg} alt="Logo Nlw Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu prório bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2 '>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> {props.userCount > 1 ? "pessoas" : " pessoa"} já estão usando
          </strong>
        </div>

        <form action="" className='mt-10 flex gap-2' onSubmit={createPool}>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm  text-gray-100'
            type="text"
            required
            placeholder='Qual nome do seu bolão?'
            onChange={ev => setPoolTitle(ev.target.value)}
            value={poolTitle} />
          <button
            type='submit'
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase'>Criar meu bolão</button>
        </form>

        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between  text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={IconCheckImage} alt="" />
            <div className="flex flex-col" >
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>{props.poolCount > 1 ? "Bolões criados" : "Bolão criado"}</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={IconCheckImage} alt="" />
            <div className="flex flex-col">
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>{props.guessCount > 1 ? "Palpites enviados" : "Palpite enviado"}</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        quality={100}
        alt="Dois celulares exibindo o app NLW COPA" />
    </div>
  )
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCount, usersCount] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.poolsCount,
      guessCount: guessesCount.data.guessesCount,
      userCount: usersCount.data.usersCount
    },
    revalidate: 60
  }
}

