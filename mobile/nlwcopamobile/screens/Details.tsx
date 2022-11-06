import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from 'react-native'
import { Header } from "../src/components/Header";
import { Loading } from "../src/components/Loading";
import { api } from "../src/services/api";
import { PoolCardProps } from "../src/components/PoolCard"
import { PoolHeader } from "../src/components/PoolHeader";
import { EmptyMyPoolList } from "../src/components/EmptyMyPoolList";
import { Option } from "../src/components/Option";
import { Guesses } from "../src/components/Guesses";


interface RouteParams {
    id: string
}

export function Details() {
    const route = useRoute();
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do grupo'>('Seus Palpites')
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps)
    const { id } = route.params as RouteParams
    const toast = useToast();

    async function fetchPoolDetails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);


        } catch (error) {
            console.log('error', error);
            toast.show({
                title: 'Erro ao carregar detalhes do bolão. Tente novamente mais tarde.',
                bgColor: 'red.500',
                placement: 'top'

            })
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: `Participe do bolão! Use o código: ${poolDetails.code}`
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1}
            bgColor="gray.900">
            <Header title={poolDetails.title} showShareButton showBackButton onShare={handleCodeShare} />
            {poolDetails._count?.participants > 0 ?
                <VStack flex={1}>
                    <PoolHeader data={poolDetails} />
                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option
                            title="Seus Palpites"
                            isSelected={optionSelected === 'Seus Palpites'}
                            onPress={() => setOptionSelected('Seus Palpites')} />
                        <Option
                            title="Ranking do grupo"
                            isSelected={optionSelected === 'Ranking do grupo'}
                            onPress={() => setOptionSelected('Ranking do grupo')} />

                    </HStack>
                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack> :
                <EmptyMyPoolList code={poolDetails.code} />}
        </VStack>
    )
}