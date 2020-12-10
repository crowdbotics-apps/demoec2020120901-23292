import { StyleSheet, Dimensions } from 'react-native'
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
import { Color } from '../styles'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.whiteOff
  },
  imageContainer: { width: width, height: height / 2 },
  cardView: {
    marginTop: -80,
    marginBottom:20,
    marginHorizontal: 20,
    backgroundColor: Color.white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { height: 10, width: 10 },
    shadowOpacity: 0.3,
    shadowColor: Color.steel,
  },
  tabBarUnderlineStyle: {
    width: 50,
    marginBottom: 10,
    marginLeft: width / 6.2,
    borderRadius: 130,
    backgroundColor: Color.malibu
  },
  tabContainerStyle: {
    marginTop: 20,
    elevation: 0,
    paddingBottom: 20,
    backgroundColor: Color.white,
  },
  activeTabStyle: { backgroundColor: Color.white },
  tabStyle: { backgroundColor: Color.white },
  activeTextStyle: { fontSize: 20, fontWeight: 'normal' },
  textStyle: { fontSize: 20, },
});

export const buttonStyles = {
  viewStyle: {
    backgroundColor: Color.malibu,
    borderRadius: 10,
    borderColor: Color.black,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    height: 44
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: Color.white,
    marginHorizontal: 40,
    marginVertical: 12,
  }
}

export const textInputStyles = {
  textInput: {
    borderColor: Color.steel,
    borderWidth: 0.5,
    borderRadius: 5,
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: Color.black,
  },
  label: { color: '#6A6A6A', fontSize: 12 },
  error: { color: Color.red, fontSize: 9 }
}