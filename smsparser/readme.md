To init a react-native project:

$ react-native init AwesomeProject

You have to use React Native of version 0.38.0 (not newer) due to this issue: http://stackoverflow.com/questions/41074761/ios-react-native-unhandled-js-exception-syntaxerror. 

To build a *release* APK package:
(in the Android folder)

$ gradlew assembleRelease