import React from 'react';
import {
  View,
  ImageBackground,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import CountryPicker from 'react-native-country-picker-modal';
import { Tab, Tabs } from 'native-base';
import { styles, buttonStyles, textInputStyles } from './styles';
import { Color } from '../styles'
import * as NavigationService from '../../../../navigator/NavigationService';
import { connect } from 'react-redux';
import * as authServices from '../../../../store/auth/services';
import { signInWithEmailAndPasswordAction, ssoAuthAction } from '../../../../store/auth/actions';

export const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const TextInputField = (props) => (
  <View>
    <Text style={[textInputStyles.label, props.labelStyle]}>
      {props.label}
    </Text>
    <TextInput
      autoCapitalize="none"
      style={[textInputStyles.textInput, props.textInputStyle]}
      placeholderTextColor={Color.steel}
      underlineColorAndroid={'transparent'}
      {...props}
    />
    {!!props.error && <Text style={textInputStyles.error}>{props.error}</Text>}
  </View>
)

const Button = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    disabled={props.loading} >
    <View style={[buttonStyles.viewStyle, props.viewStyle]}>
      {props.loading ?
        <ActivityIndicator
          color={props.loadingColor ? props.loadingColor : Color.white}
          style={props.loadingStyle} />
        :
        <Text style={[buttonStyles.textStyle, props.textStyle]}>{props.title}</Text>}
    </View>
  </TouchableOpacity>)

class SignUpComponent extends React.Component {
  state = {
    email: '',
    password: '',
    phone: '',
    phoneError: '',
    confirmPassword: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
    authLoading: false,
    fbLoading: false,
    countryCode: 'US',
    country: { callingCode: ['1'], cca2: 'US' }
  }

  onPressFacebookLogin = async () => {
    let result;
    this.setState({ fbLoading: true, });
    try {
      result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log('facebook sdk res', result);
    } catch (e) {
      this.setState({ fbLoading: false, });
      console.log('facebook error', e);
    }
    // handle the case that users clicks cancel button in Login view
    if (result.isCancelled) {
      this.setState({ fbLoading: false, });
    } else {
      const accessData = await AccessToken.getCurrentAccessToken();
      const signinResponse = await this.props.ssoAuthAction('facebook', accessData.accessToken);
      this.setState({ fbLoading: false, });
      if (signinResponse && signinResponse.data) {
        //success, navigate home
        NavigationService.navigate('BlankScreen3177788')
      } else if (signinResponse && signinResponse.error) {
        //handle special cases
      }

    }
  };

  onSignupPress = async () => {
    const { email, password, phone, countryCode, country, confirmPassword, } = this.state
    if (emailValidationRegex.test(email)) {
      if (phone != '') {
        if (password != '') {
          if (password == confirmPassword) {
            this.setState({ authLoading: true })
            const signupResponse = await authServices.signupService({ email, phone_number: `+${country.callingCode[0]}${phone}`, password })
            this.setState({ authLoading: false })
            if (signupResponse && signupResponse.data) {
              Alert.alert('Signup Success', 'Please confirm your email address by clicking on the link sent to your email address')
            } else if (signupResponse && signupResponse.error) {
              //handle special cases
              if (signupResponse.error.response && signupResponse.error.response.status == 400)
                alert('This Email is already registered')
            }
          } else {
            this.setState({ confirmPasswordError: 'Confirm password and password do not match' })
          }
        } else {
          this.setState({ passwordError: 'Please enter a valid password' })
        }
      } else {
        this.setState({ phoneError: 'Please enter a valid phone number' })
      }
    } else {
      this.setState({ emailError: 'Please enter a valid email address' })
    }
  }

  render() {
    const { email, password, phone, phoneError, countryCode, country, emailError, passwordError, confirmPassword, confirmPasswordError, authLoading, fbLoading } = this.state
    return (
      <KeyboardAvoidingView>
        <View style={{ marginVertical: 20, marginHorizontal: 15 }}>
          <TextInputField
            keyboardType="email-address"
            label="Email address"
            placeholder="Email address"
            onChangeText={email => this.setState({ email })}
            value={email}
            error={emailError}
          />
          <Text style={textInputStyles.label}>
            Mobile Number
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderColor: Color.steel,
              borderWidth: 0.5,
              borderRadius: 5,
              paddingVertical: 1,
              marginTop: 5,
              marginBottom: 5,
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
              error={phoneError}
            />
          </View>
          {!!phoneError && <Text style={textInputStyles.error}>{phoneError}</Text>}
          <TextInputField
            label="Password"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            value={password}
            error={passwordError}
          />
          <TextInputField
            label="Confirm Password"
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            value={confirmPassword}
            error={confirmPasswordError}
          />
        </View>
        <Button
          title="Sign Up"
          loading={authLoading}
          onPress={this.onSignupPress}
        />
        <Button
          title="Connect with Facebook"
          viewStyle={{ backgroundColor: Color.facebook }}
          loading={fbLoading}
          onPress={this.onPressFacebookLogin}
        />
      </KeyboardAvoidingView>
    )
  }
}

const SignUp = connect(null, { ssoAuthAction })(SignUpComponent)


class SignInComponent extends React.Component {
  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    authLoading: false,
    fbLoading: false,
  }

  onPressFacebookLogin = async () => {
    let result;
    this.setState({ fbLoading: true, });
    try {
      result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log('facebook sdk res', result);
    } catch (e) {
      this.setState({ fbLoading: false, });
      console.log('facebook error', e);
    }
    // handle the case that users clicks cancel button in Login view
    if (result.isCancelled) {
      this.setState({ fbLoading: false, });
    } else {
      const accessData = await AccessToken.getCurrentAccessToken();
      const signinResponse = await this.props.ssoAuthAction('facebook', accessData.accessToken);
      this.setState({ fbLoading: false, });
      if (signinResponse && signinResponse.data) {
        //success, navigate home
        NavigationService.navigate('BlankScreen3177788')
      } else if (signinResponse && signinResponse.error) {
        //handle special cases
      }

    }
  };

  onSigninPress = async () => {
    const { email, password, } = this.state
    if (emailValidationRegex.test(email)) {
      if (password != '') {
        this.setState({ authLoading: true })
        // const signinResponse = await authServices.signinService({ email, password })
        const signinResponse = await this.props.signInWithEmailAndPasswordAction({ email, password })
        this.setState({ authLoading: false })
        console.log('signinResponse', signinResponse)
        if (signinResponse && signinResponse.data) {
          //success, navigate home
          NavigationService.navigate('BlankScreen3177788')
        } else if (signinResponse && signinResponse.error) {
          //handle special cases
          if (signinResponse.error.response && signinResponse.error.response.status == 400)
            alert('Invalid Credentials')
        }
      } else {
        this.setState({ passwordError: 'Please enter a valid password' })
      }
    } else {
      this.setState({ emailError: 'Please enter a valid email address' })
    }
  }
  render() {
    const { email, password, emailError, passwordError, authLoading, fbLoading } = this.state
    return (
      <KeyboardAvoidingView>
        <View style={{ marginVertical: 20, marginHorizontal: 15 }}>
          <TextInputField
            keyboardType="email-address"
            label="Email address"
            placeholder="Email address"
            onChangeText={email => this.setState({ email })}
            value={email}
            error={emailError}
          />
          <TextInputField
            label="Password"
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            value={password}
            error={passwordError}
          />
        </View>
        <Button
          title="Login"
          loading={authLoading}
          onPress={this.onSigninPress}
        />
        <Button
          title="Connect with Facebook"
          viewStyle={{ backgroundColor: Color.facebook }}
          loading={fbLoading}
          onPress={this.onPressFacebookLogin}
        />
        <View
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity activeOpacity={.7} onPress={() => { NavigationService.navigate("PasswordRecover") }}>
            <Text>
              Forgot your password?
             </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const SignIn = connect(null, { signInWithEmailAndPasswordAction, ssoAuthAction })(SignInComponent)

export default class Blank extends React.Component {
  render() {
    return (
      <ScrollView style={[styles.container]}>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={[styles.container]}>
            <View style={{ flex: 1 }}>
              <View
                style={styles.imageContainer}>
                <ImageBackground
                  source={{ uri: "https://crowdbotics-slack-dev.s3.amazonaws.com/media/project_component_resources/halfbg.png" }}
                  style={{ flex: 1, justifyContent: 'center', resizeMode: 'cover', }}>
                  <Image
                    source={{ uri: "https://crowdbotics-slack-dev.s3.amazonaws.com/media/project_component_resources/cb-icon.png" }}
                    style={{ width: 155, height: 155, alignSelf: 'center', resizeMode: 'contain', }}
                  />
                </ImageBackground>
              </View>
            </View>
            <View style={[styles.cardView]}>
              <View style={{ marginBottom: 20 }}>
                <Tabs
                  tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                  tabContainerStyle={styles.tabContainerStyle}>
                  <Tab
                    heading="Sign In"
                    activeTabStyle={styles.activeTabStyle}
                    tabStyle={styles.tabStyle}
                    activeTextStyle={styles.activeTextStyle}
                    textStyle={styles.textStyle}
                  >
                    <SignIn />
                  </Tab>
                  <Tab
                    heading="Sign Up"
                    activeTabStyle={styles.activeTabStyle}
                    tabStyle={styles.tabStyle}
                    activeTextStyle={styles.activeTextStyle}
                    textStyle={styles.textStyle}
                  >
                    <SignUp />
                  </Tab>
                </Tabs>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    )
  }
};
