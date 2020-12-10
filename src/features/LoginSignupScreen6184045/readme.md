# LoginSignup Screen

The Login Signup Screen is a ReactNative based screen that is a tab based screen allowing the user to login or signup. Included is the ability to send a 
6-digit code to your phone or email (via forget password) and allow the user to reset their password using the 6-digit code.
  
## Installation

After you have added the screen module into your project, you will need to configure a few items by modifying the project 
files in the github repository. Please note to replace ####### with the numeric sequence for your screen (found in folder name under /src/features) and also that the @BluePrint tags for ImportInsertion and NavigationInsertion will be removed in future so placement is with other imports and inside the AppNavigator above other screens.

### STEP 1: Add dependency library to the project.
**/PROJECT_ROOT_DIRECTORY/package.json:**

  **ADD** Dependency after Line 16 (dependencies opening line "_"dependencies": {_ ")
  Special note: This was replaced this below due to current issues.  "native-base": "Healthyco/NativeBase#feature/fix-request-animation",
  ```
    "native-base": "https://github.com/Healthyco/NativeBase.git#805e460",
    "redux-thunk": "^2.3.0”,
    "react-native-simple-toast": "^1.1.3",
    "react-native-country-picker-modal": "^2.0.0",
   ```


### STEP 2: Add screen into your project screen navigation.
  **/src/mainNavigator.js:** 
   **ADD** immediately below in the section labeled  //@BlueprintImportInsertion:  
   
   ```import LoginSignupScreen#######Navigator from '../features/LoginSignupScreen#######/navigator';```
   
   **ADD**  immediately below in the section inside AppNavigator definition labeled  //@BlueprintNavigationInsertion section:
   
   ```TermsScreen#######: { screen: LoginSignupScreen#######Navigator },```

### STEP 3: Add reducers to store.
**/src/store/index.js**
**ADD** after Line 4 (sagas import):

```import authReducer from './auth/reducers'```

**MODIFY** Line 16 (const middleware) - **ADD** “, thunk” and should look as follows:

```const middlewares = [sagaMiddleware, thunk /** more middlewares if any goes here */];```

**ADD** comma at end of Line 21 (customReducer) - , and **ADD** below Line 21 above:   authReducer: authReducer
Code should look as follows:

```
const store = createStore(
  combineReducers({
    apiReducer: apiReducer,
    customReducer: customReducer,
    authReducer: authReducer
  }),
  composeEnhancers(applyMiddleware(...middlewares))
);
```

### STEP 4: Change Login screen destination to your desired screen (likely Home screen).
**REPLACE** Line 94 BlankScreen3177788 with desired destination screen (likely Home Screen)

```NavigationService.navigate('BlankScreen3177788’)```

### STEP 5: Modify backend. This needs to be simplified via modular approach
BACKEND: THIS NEEDS TO BE MODULAR and then it will be a couple of lines to add in the app.
*Make changes to project backend files (in /backend/YOUR_PROJECT folder):*

**MODIFY: /backend/fmwk_modules_22844/settings.py** version in your project backend folder
**ADD** in THIRDPARTY_APPS

```'allauth.socialaccount.providers.facebook',```

**ADD** above AWS S3 Config lines:

```
# Twilio

TWILIO_ACCOUNT_SID = env.str('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = env.str('TWILIO_AUTH_TOKEN', '')
TWILIO_MESSAGING_SERVICE_ID = env.str('TWILIO_MESSAGING_SERVICE_ID', '')
# create verification here https://www.twilio.com/console/verify/services
TWILIO_VERIFICATION_SERVICE_ID = env.str('TWILIO_VERIFICATION_SERVICE_ID', '')
```
**REVIEW** *Email settings should be*:
```
EMAIL_HOST = env.str("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = env.str("SENDGRID_USERNAME", "")
EMAIL_HOST_PASSWORD = env.str("SENDGRID_PASSWORD", "")
```
### STEP 6: Update URLs in backend.
**MODIFY: /backend/fmwk_modules_22844/urls.py** version in your project backend folder
**ADD** below “from django.contrib import admin”

```from django.urls import path, include, re_path```

**ADD** above “urlpatterns"

```from users.views import RequestPasswordResetPhoneNumber, VerifyPasswordResetPhoneNumber```

**ADD** below “# Override email confirm to use allauth's HTML view instead of rest_auth's API view“

```
   re_path(r"rest-auth/password/reset/phone/request/?", RequestPasswordResetPhoneNumber.as_view()),
   re_path(r"rest-auth/password/reset/phone/verify/?", VerifyPasswordResetPhoneNumber.as_view()),
```

### STEP 7: Update settings in backend.
**ADD NEW FILE /backend/fmwk_modules_22844/twilio_utils.py**** Containing

```
from twilio.rest import Client

from django.conf import settings

account_sid = settings.TWILIO_ACCOUNT_SID
auth_token = settings.TWILIO_AUTH_TOKEN
messaging_service_sid = settings.TWILIO_MESSAGING_SERVICE_ID
verification_service_sid = settings.TWILIO_VERIFICATION_SERVICE_ID


def send_sms(to_number, message):
	client = Client(account_sid, auth_token)
	
	sms = client.messages.create(
		messaging_service_sid=messaging_service_sid,
		body=message,
		to=to_number,
	)
	
	return sms.sid


def send_verification_token_sms(to_number):
	client = Client(account_sid, auth_token)
	
	verification = client.verify.services(verification_service_sid).\
		verifications.create(to=to_number, channel='sms')
	
	return verification.status


def check_verification_token(to_number, code):
	client = Client(account_sid, auth_token)
	try:
		verification_check = client.verify.services(verification_service_sid). \
			verification_checks.create(to=to_number, code=str(code))
	except:
		return False
	return verification_check.status

```
### STEP 8: Setup SendGrid account and keep reference to username and password.
Reference website [Sendgrid] (https://wwww.sendgrid.com)

## STEP 9: Setup Twillio account and after, configure a verification service.
Reference website for creating account: [Twillio] (https://www.twillio.com)
Reference website for creating verification services: [Twillio Verfication Services] (https://www.twillio.com/console/verify/services)

### STEP 10: Configure Environment Variables.
Using the Crowdbotics Dashboard, navigate to "Settings" and select the tab "Environment Variables", here you will add the following variables:
```
SENDGRID_USERNAME
SENDGRID_PASSWORD
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFICATION_SERVICE_ID
```

### STEP 11: Setup Facebook Developer account (need to get keyhash for Android)
Find general information here for [Facebook Login details] (https://developers.facebook.com/docs/facebook-login/)

Follow these steps to setup [Android] (https://developers.facebook.com/docs/facebook-login/android)

You will need to get the hash key from your Android build. 

Example code to print the key to your logs and used to add in Facebook:

```
try {
        PackageInfo info =     getPackageManager().getPackageInfo("MY PACKAGE NAME",     PackageManager.GET_SIGNATURES);
        for (android.content.pm.Signature signature : info.signatures) {
            MessageDigest md = MessageDigest.getInstance("SHA");
            md.update(signature.toByteArray());
            String sign=Base64.encodeToString(md.digest(), Base64.DEFAULT);
            Log.e("MY KEY HASH:", sign);
        }
} catch (NameNotFoundException e) {
} catch (NoSuchAlgorithmException e) {
}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
