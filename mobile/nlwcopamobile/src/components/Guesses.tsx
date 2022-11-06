import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string
}

export function Guesses({ poolId, code}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();
  const [games, setGames] = useState<GameProps[]>([])

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)

    } catch (error) {
      console.log('error', error);
      toast.show({
        title: 'Erro ao carregar os jogos desse bolão.',
        bgColor: 'red.500',
        placement: 'top'

      })
    } finally {
      setIsLoading(false);
      console.log('jogos', games)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar',
          bgColor: 'red.500',
          placement: 'top'

        })
      }

      await api.post(`/pools/${poolId.trim().toString()}/games/${poolId.trim().toString()}}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });
      toast.show({
        title: 'Palpite realizado!',
        bgColor: 'green.500',
        placement: 'top'
      })

      fetchGames();
    } catch (error) {
      console.log('error', error);
      toast.show({
        title: 'Não foi possível enviar o palpite',
        bgColor: 'red.500',
        placement: 'top'

      })
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])


  if (isLoading) {
    <Loading />
  }

  return (
    <>
      <FlatList data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Game
            data={item}
            setFirstTeamPoints={setFirstTeamPoints}
            setSecondTeamPoints={setSecondTeamPoints}
            onGuessConfirm={() => { handleGuessConfirm(item.id) }}
          />
        )}

        _contentContainerStyle={{ pb: 10 }}
        ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
      />
    </>

  );
}
