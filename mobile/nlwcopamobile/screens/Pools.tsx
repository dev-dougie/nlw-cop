import { VStack, Icon, useToast, FlatList } from "native-base";
import { useEffect, useState, useCallback } from 'react'
import { Octicons } from '@expo/vector-icons'
import { Button } from "../src/components/Button";
import { Header } from "../src/components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../src/services/api";
import { PoolCard, PoolCardProps } from "../src/components/PoolCard";
import { Loading } from "../src/components/Loading";
import { EmptyPoolList } from "../src/components/EmptyPoolList";



export function Pools() {
    const { navigate } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolCardProps[]>([]);
    const toast = useToast();

    async function fetchPools() {
        setIsLoading(true)
        try {
            const response = await api.get('/pools');
            setPools(response.data.pools);
        } catch (error) {
            console.log('error no Pool', error)
            toast.show({
                title: 'Erro ao buscar bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }


    useFocusEffect(useCallback(() => {
        fetchPools();
    }, []));


    return (
        <VStack
            flex={1}
            bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons}
                        name="search"
                        color="black"
                        size="md" />}
                    onPress={() => navigate('find')} />

                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={pools}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <PoolCard onPress={() => navigate('details', { id: item.id })}
                                data={item} />}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ pb: 10 }}
                            ListEmptyComponent={() => <EmptyPoolList />} />
                }
            </VStack>
        </VStack>
    )
}