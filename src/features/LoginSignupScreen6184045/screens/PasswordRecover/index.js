import React, { Component } from 'react';
import { Image, Alert, Dimensions, View, TouchableOpacity, TextInput, Text, ScrollView } from 'react-native';

import { styles, Color } from '../styles';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CountryPicker from 'react-native-country-picker-modal';
import * as authServices from '../../../../store/auth/services';

export const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class PasswordRecover extends Component {
    static navigationOptions = {
        headerMode: 'none'
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            phone: '',
            countryCode: 'US',
            country: { callingCode: ['1'], cca2: 'US' },
            loading: false
        };
    }


    renderImage = () => {
        const imageSize = {
            width: 365,
            height: 161
        };
        return (<Image
            style={[styles.image, imageSize]}
            source={{ uri: "https://crowdbotics-slack-dev.s3.amazonaws.com/media/project_component_resources/cb-icon.png" }}
        />);
    };


    submitPasswordReset = async () => {
        const { email, phone, country, countryCode } = this.state;
        this.setState({ loading: true })
        if (emailValidationRegex.test(email)) {
            const response = await authServices.resetPasswordEmailService({ email })
            if (response && response.data) {
                Alert.alert('', 'Password reset link has been sent to your email address')
                this.props.navigation.goBack()
            } else if (response && response.error) {
                //handle special cases
                if (response.error.response && response.error.response.status == 400)
                alert('This Email is not registered\nPlease signup')
                this.props.navigation.goBack()
            }
        } else if (phone != '') {
            const response = await authServices.resetPasswordPhoneNumberService({ to_number: `+${country.callingCode[0]}${phone}` })
            if (response && response.data) {
                Alert.alert('', 'Password reset code has been sent to your phone number')
                this.props.navigation.navigate("SetPassword", { phone, country, countryCode })
            } else if (response && response.error) {
                //handle special cases
            }
        } else {
            alert('Please enter a valid email or phone')
        }
        this.setState({ loading: false })
    }

    render() {
        const { email, phone, country, countryCode } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView contentContainerStyle={styles.screen}>
                    {this.renderImage()}
                    <Text style={styles.heading}>{"Password Recovery"}</Text>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            value={email}
                            onChangeText={(email) => this.setState({ email })}
                            placeholder="eg: yourname@gmail.com"
                            size="small"
                            style={styles.input}
                            keyboardType="email-address"
                            textStyle={styles.text}
                            autoCapitalize="none" />
                    </View>
                    <Text style={{ alignSelf: 'center', marginTop: 10 }}>or</Text>
                    <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingVertical: 1,
                            ...styles.input
                        }}>
                        
                        <CountryPicker
                            {...{
                                countryCode,
                                withFilter: true,
                                withAlphaFilter: true,
                                withCallingCode: true,
                                withModal: true,
                                onSelect: (country) => this.setState({ country, countryCode: country.cca2 }),
                            }}
                            containerButtonStyle={{
                                paddingLeft: 2,
                            }}
                        />
                        <View
                            style={{ fontSize: 11, }}>
                            <Text style={{ textAlign: 'right', marginRight: 5 }}>{`+${country.callingCode[0]}`}</Text>
                        </View>
                        <TextInput
                            keyboardType="phone-pad"
                            // label="Mobile number"
                            placeholder="Mobile number"
                            onChangeText={phone => this.setState({ phone })}
                            value={phone}
                        />
                    </View>
                    </View>
                    {/* <Button
                        title="Reset Password"
                        loading={submitLoading}
                        textStyle={{ fontSize: 16 }}
                        onPress={this.submitPasswordReset}
                    /> */}
                    <TouchableOpacity
                        disabled={this.state.loading}
                        activeOpacity={.7}
                        style={[styles.actionButon]}
                        onPress={this.submitPasswordReset}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 15
                            }}>{"Reset Password"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => {
                            this.props.navigation.navigate("SetPassword", { phone, country, countryCode })
                        }}>
                        <Text style={[styles.textRow]}>
                            have reset code ? reset now!
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => {
                            this
                                .props
                                .navigation
                                .goBack()
                        }}>
                        <Text style={[styles.textRow]}>
                            Back to login?
                        </Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default PasswordRecover;
