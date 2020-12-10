import React, { Component } from 'react';
import { Image, Dimensions, View, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import { styles } from '../styles';
import * as emailAuthActions from '../../../../store/auth/actions';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CountryPicker from 'react-native-country-picker-modal';
import * as authServices from '../../../../store/auth/services';

class SetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            password: '',
            cpassword: '',
            phone: this.props.navigation.getParam('phone', ''),
            countryCode: this.props.navigation.getParam('countryCode', 'US'),
            country: this.props.navigation.getParam('country', { callingCode: ['1'], cca2: 'US' }),
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
            source={{ uri: "https://crowdbotics-slack-dev.s3.amazonaws.com/media/project_component_resources/cb-icon.png" }} />);
    };

    submitPasswordReset = async () => {
        const { password, cpassword, token, country, phone } = this.state;
        if (phone == '') {
            Toast.show("Phone cannot be empty", Toast.LONG);
            return false;
        }
        if (cpassword != password) {
            Toast.show("Password is different from password confirmation.", Toast.LONG);
            return false;
        }

        if (password.search(/\d/) == -1) {
            Toast.show("Password must be at least 8 digits and must have at least one letter and one num" +
                "ber.",
                Toast.LONG);
            return false;
        } else if (password.search(/[a-zA-Z]/) == -1) {
            Toast.show("Password must be at least 8 digits and must have at least one letter and one num" +
                "ber.",
                Toast.LONG);
            return false;
        } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
            Toast.show("Password must be at least 8 digits and must have at least one letter and one num" +
                "ber.",
                Toast.LONG);
            return false;
        }
        const response = authServices.updatePasswordWithCodeService({ to_number: `+${country.callingCode[0]}${phone}`, code: token, new_password: password })
        if (response && response.data) {
            Alert.alert('', 'Password has been reset\nPlease login')
            this.props.navigation.navigate("LoginSignup")
        } else if (response && response.error) {
            //handle special cases
        }
    }

    render() {
        const { password, cpassword, token, country, countryCode, phone } = this.state;
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
                <KeyboardAwareScrollView contentContainerStyle={styles.screen}>
                    {this.renderImage()}
                    <Text style={styles.heading}>{"Set Password"}</Text>
                    <View style={[styles.fieldContainer]}>
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
                    <View style={[styles.fieldContainer]}>
                        <Text style={styles.label}>Reset Code</Text>
                        <TextInput
                            value={token}
                            onChangeText={token => this.setState({ token })}
                            placeholder="••••••••"
                            size="small"
                            style={styles.input}
                            textStyle={styles.text}
                            autoCapitalize="none" />
                    </View>

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={password => this.setState({ password })}
                            placeholder="••••••••"
                            size="small"
                            style={styles.input}
                            secureTextEntry={true}
                            textStyle={styles.text}
                            autoCapitalize="none" />
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <TextInput
                            value={cpassword}
                            onChangeText={cpassword => this.setState({ cpassword })}
                            placeholder="••••••••"
                            size="small"
                            style={styles.input}
                            secureTextEntry={true}
                            textStyle={styles.text}
                            autoCapitalize="none" />
                    </View>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.actionButon]}
                        onPress={this.submitPasswordReset}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 15
                            }}>{"Reset Password"}</Text>
                    </TouchableOpacity>
                    {/* <Button
                        title="Reset Password"
                        loading={submitLoading}
                        textStyle={{ fontSize: 16 }}
                        onPress={this.submitPasswordReset}
                    /> */}
                    <TouchableOpacity
                        activeOpacity={.7}
                        onPress={() => {
                            this
                                .props
                                .navigation
                                .navigate("LoginSignup")
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

export default SetPassword