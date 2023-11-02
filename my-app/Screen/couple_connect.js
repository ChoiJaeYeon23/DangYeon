
import { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Button,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native'
import { createStack } from '@react-navigation/stack'

const CoupleConnect = () => {
    const Stack = createStackNavigator()
    const [text, setText] = useState('')

    const onChangeText = (inputText) => {
        setText(inputText)

    const Separator = () => <View style={styles.separator} />
    }
    return(
        <View>
            <Text> 서로의 초대코드를 입력하세요.</Text>
            <Separator/>
            <View>
                <Text>내 초대코드</Text>
            </View>
            <Separator/>
                <View>
                    <Text>상대방의 초대코드를 입력하세요.</Text>
                    <TextInput
                        onChange={onChangeText}
                        value={text}
                        placeholder="전달받은 코드 입력"
                    />
                </View>
                <Separator/>
                    <View>
                        <Button
                            title="연결하기"
                            onPress={() => Alert.alert('Simple Button pressed')}
                        />
                    </View>
        </View>
    )
}

export default CoupleConnect