import { useState } from 'react'
import { Heading, useToast, VStack } from "native-base";
import { Header } from "../src/components/Header";
import { Input } from "../src/components/Input";
import { Button } from "../src/components/Button";
import { api } from "../src/services/api";
import { useNavigation } from '@react-navigation/native';

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const [code, setCode] = useState('');
    const { navigate } = useNavigation();

    async function handleJoinPool() {
        try {
            setIsLoading(true)
            if (!code.trim()) {
                return toast.show({
                    title: "Esse código não existe!",
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }

            await api.post('/pools/join', { code });
            toast.show({
                title: "Você entrou no bolão com sucesso!",
                bgColor: 'green.500',
                placement: 'top'
            })
            navigate('polls');

        } catch (error) {
            console.log('deu error', error);


            if (error.response?.data?.message === "Poll not found!") {
                return toast.show({
                    title: "Bolão não encontrado!",
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }


            if (error.response?.data?.message === "You already joinned this poll") {
                return toast.show({
                    title: "Você já está nesse bolão.",
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }

            toast.show({
                title: "Erro ao buscar bolão!",
                bgColor: 'red.500',
                placement: 'top'
            })
            setIsLoading(false);
        }
    }
    return (
        <VStack
            flex={1}
            bgColor="gray.900"
        >
            <Header title="Buscar por código" showBackButton />
            <VStack mb={8} mx={5} alignItems="center">
                {/* <Logo /> */}

                <Heading
                    fontFamily="heading"
                    color="white"
                    fontSize="xl"
                    my={8}
                    textAlign="center">
                    Encontrar um bolão através de {'\n'} seu código único
                </Heading>
                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize='characters'
                    onChangeText={setCode} />

                <Button title="BUSCAR O BOLÃO" isLoading={isLoading} onPress={handleJoinPool} />

                {/* <Text
                    color="gray.200"
                    fontSize="sm"
                    textAlign="center"
                    px={10}
                    mt={4}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text> */}
            </VStack>
        </VStack>
    )
}