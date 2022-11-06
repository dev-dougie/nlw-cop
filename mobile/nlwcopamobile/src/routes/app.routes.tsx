import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { useTheme } from 'native-base'
import { Platform } from 'react-native';
const { Navigator, Screen } = createBottomTabNavigator();
import { New } from '../../screens/New'
import { Pools } from '../../screens/Pools';
import { Find } from '../../screens/Find';
import { Details } from '../../screens/Details';


export function AppRoutes() {
    const { colors, sizes } = useTheme();

    const size = sizes[6]

    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: 87,
                backgroundColor: colors.gray[800],
                borderTopWidth: 0
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS == 'android' ? - 10 : 0
            }
        }}>
            <Screen
                name="new"
                component={New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: 'Novo bolão'
                }}
            />
            <Screen
                name="polls"
                component={Pools}
                options={{
                    tabBarLabel: 'Meus bolões',
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />
                }}
            />
            <Screen
                name="find"
                component={Find}
                options={{
                    tabBarButton: () => null
                }}
            />
             <Screen
                name="details"
                component={Details}
                options={{
                    tabBarButton: () => null
                }}
            />
        </Navigator>
    )
}