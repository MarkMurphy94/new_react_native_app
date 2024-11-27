import { StyleSheet, Text, Button, View, SafeAreaView } from 'react-native'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react'

const DateTimePickerComponent = (props) => {
    const [date, setDate] = useState(new Date(1598051730000));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        props.onDateSelected(currentDate)
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            minimumDate: new Date(),
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button onPress={showDatepicker} title="Set Event Date" />
                <Button onPress={showTimepicker} title="Set Event Time" />
            </View>
        </SafeAreaView>
    );
};

export default DateTimePickerComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row', // Arrange buttons in a row
        justifyContent: 'space-between', // Add space between the buttons
        alignItems: 'center', // Align buttons vertically in the container
        width: '80%', // Adjust width of the button container
    },
});