# #13.0 Introduction (02:23)

## React native facebook, skype..

# #13.1 Why Expo is Awesome (12:45)

## Don't do CLI manually, jus use expo

## When use

1. can build android/ios from windows, mac linux
2. support expo SDK: RN is decreasing SDK
3. easy to install
4. expo go: can test with phone
5. expo snack: build on web
6. over-the-air updates: fetch new js file

# #13.2 Why Expo Sucks (08:37)

- https://docs.expo.io/introduction/why-not-expo/

1. When have to access to native files: use CLI
2. Some expo SDK doesn't exist: CLI with donwloading from npm

- eg: bluetooth is not supported on expo

3. No background player, background push
4. App can be bigger
5. Cuz of Social media auth SDK, cannot target only children under 13 years old.

# #13.3 Our Plan (09:54)

## eject: export but keep current code

### managed workflow(expo) => bare workflow(CLI)

- https://docs.expo.io/introduction/managed-vs-bare/#workflow-comparison

# #13.4 Creating Our Project (08:29)

```
npm install --global expo-cli
expo init instaclone-native
> blank (TypeScript)
cd instaclone-native
git init
git remote add origin https://github.com/devgony/instaclone-native
```

- app.json: configure integration
- splash: when we login
- npm run start: web console

# #13.5 Working with the Simulator (04:01)

## simulator expo cannot connect?: update app

# #13.6 AppLoading (10:06)

```
expo install expo-app-loading
expo install expo-font
```

## @expo/vector-icons are default

## we use ionicons

## preload? app should be ready before user run

- load font
- cache stuff later

```js
const [loading, setLoading] = useState(true);
const onFinish = () => setLoading(false);
const preload = async () => {
  const fontsToLoad = [Ionicons.font];
  const fontPromises = fontsToLoad.map(font => Font.loadAsync(font));
  console.log(fontPromises);
  Promise.all(fontPromises);
};
if (loading) {
  return (
    <AppLoading
      startAsync={preload}
      onError={console.warn}
      onFinish={onFinish}
    />
  );
}
```

# #13.7 AppLoading part Two (05:36)

```
expo install expo-asset
npm install @react-navigation/native
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack
```

## preload logo

## Promise.all<void | Asset[]>

```js
const imagesToLoad = [
      require("./assets/logo.png"),
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png",
    ];
    const imagePromises = imagesToLoad.map(image => Asset.loadAsync(image));
    Promise.all<void | Asset[]>([...fontPromises, ...imagePromises]);
```

# #14.0 Your First Navigation (06:39)

## React navigation - stack prototype: sequential nav

```js
mkdir screens navigators
touch screens/Welcome.tsx
touch screens/Login.tsx
touch screens/CreateAccount.tsx
touch navigators/LoggedOutNav.tsx

// navigators/LoggedOutNav.tsx
const Stack = createStackNavigator();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={LogIn} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}
```

## should be covered with NavigationContainer

```js
// App.tsx
return (
  <NavigationContainer>
    <LoggedOutNav />
  </NavigationContainer>
);
```

# #14.1 Moving Through Screens (09:06)

## component rule: screen component will always get props: `navigation, route`

## component mapper

```js
<View> = <div>
<Text> = <span>
```

## 1. Create stack

```ts
// LoggedOutNav.tsx
export type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  CreateAccount: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
```

## 2. navigation.navigate

```ts
// Welcome.tsx
type Props = {
navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

export default function Welcome({ navigation }: Props) {
return (
<View>
<Text>Welcome</Text>
<TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>

```

# #14.2 Navigator Props (11:43)

## https://reactnavigation.org/docs/stack-navigator/

- Stack.Navigator(Global)
  - `initialRouteName`
  - `mode="modal"`: comes from bottom
  - `headerMode="screen" | "float"(default)`
  - `screenOptions: {headerBackTitleVisible: false}`: set options globally
- Options(Indivisual screen): `options={{key: val}}`
  - `title:"modifiedTitle"`: only for current screen
  - `headerShown: false`
  - `headerBackTitleVisible: false`

# #14.3 Dark Mode (07:19)

## https://docs.expo.io/versions/latest/sdk/appearance/

```ts
npm i styled-components
npm i --save-dev @types/styled-components-react-native
expo install react-native-appearance
```

## Add userInterfaceStyle

```js
// app.json
{
  "expo": {
    ...
    "userInterfaceStyle": "automatic",
```

## conver with `AppearanceProvider`

```js
// App.tsx
return (
  <AppearanceProvider>
    <NavigationContainer>
      <LoggedOutNav />
    </NavigationContainer>
  </AppearanceProvider>
);
```

## Get the current color scheme once

```js
let colorScheme = Appearance.getColorScheme(); // "light" | "dark"
```

or

```js
let colorScheme = useColorScheme();
```

## subscript color change

```js
let subscription = Appearance.addChangeListener(({ colorScheme }) => {
  // do something with color scheme
});
```

# #14.4 Welcome Screen (10:05)

## shared color file => Homework: later change it to theme

```ts
// touch color.ts
export const colors = {
  blue: "#0095F6",
};
```

## give `headerShown: false` at LoggedOutNave.tsx

## TS needs `@types/styled-components-react-native`

## fontsize of styled component does not work at parent: use fontsize at the right child

# #14.5 Create Account part One (10:44)

## TouchableOpacity is kinda View: move it from Component to Styled

```js
// screens/CreateAccount.js
const CreateAccount = styled.TouchableOpacity``
<CreateAccount onPress={goToCreateAccount}>
  <CreateAccountText>Create Account</CreateAccountText>
</CreateAccount>
```

## Options

```ts
// LoggedOutNav.tsx
<Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}> // remove title of headerBack
options={{
          headerTitle: "", // ts recommand "", not false
          headerTransparent: true,
          headerTintColor: "white",
        }}
```

## disabled opacity

```js
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
```

# #14.6 Create Account part Two (13:39)

## duplicated logo => AuthLayout

```ts
mkdir -p components/auth
touch /components/auth/AuthLayout.tsx

```

## shared button => Authbutton

```ts
touch components/auth/AuthButton.tsx
```

## onPress type

```js
onPress: (event: GestureResponderEvent) => void;
```

## children type

```js
chilren: React.ReactNode;
```

## UX is the most important on RN

```js
// screens/CreateAccount.tsx
returnKeyType = "next";
returnKeyType = "next";
returnKeyType = "next";
returnKeyType = "done";
```

# #14.7 Natural Forms part One (08:22)

- autofocus: show keyboard right after load
- useRef()
- onSubmitEditing
- onNext () => {nextRef.current?.focus()};
- onDone

## RN useRef types

```ts
const passwordRef = useRef<TextInput>(null);
const onNext = (nextOne: React.RefObject<any>) => {
  nextOne?.current?.focus();
};
```

# #14.8 Natural Forms part Two (09:29)

## KeyboardAvoidingView: moves virtual keyboard out of view

```ts
// CreateAcount.tsx
<AuthLayout>
      <KeyboardAvoidingView
        style={{ width: "100%" }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
```

- position: move the position of children only
- padding: pad the bottom to avoid above all

## KeyboardAvoidingView

```js
// AuthLayout.tsx
import { Keyboard, TouchableWithoutFeedback } from "react-native";
...
const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
...
<TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <Container>
```

- Android: "height: "100%". instead of "flex"

# #14.9 Login Screen (10:44)

## KeyboardAvoidingView from `CreateAccount` to `AuthLayout`

## Share styles from `CreateAccount` to TextInput at `AuthShared.ts`

```
// touch components/auth/AuthShared.ts
```

## Share options from screen to `navigator`.`screenOptions` at `LoggedOutNav.tsx`

## Add `lastOne={true}` at last input (`CreateAccount.tsx`)

## `AuthLayout, Username, Password` to Login.tsx

# #14.10 React Hooks Forms on Native (14:33)

## disable TouchableWithoutFeedback at "web"

## add onNext and useRef at `Login.tsx`

# install react-hook-form

```js
npm i react-hook-form
```

## What is different with web?

1. Register manually
2. No onChange at RN => use `onChangeText`
3. No form at RN => handleSubmit at `onPress` of button

```js
// Login.tsx
useEffect(() => {
  register("username");
  register("password");
}, [register]);
...
  onChangeText={text => setValue("username", text)}
...
<AuthButton text="Log In" disabled={false} onPress={handleSubmit(onValid)} />
```

# #14.11 Apollo Client (12:04)

## ActivityIndicator: shows loading

## testing phone: share url with,

1. ngrox,

- download ngrox

```
unzip /path/to/ngrok.zip
./ngrok authtoken <your_auth_token>
./ngrok help
./ngrok http 4000
```

2. localtunnel

```js
npx localtunnel --port 4001 --subdomain ninstaclone
=> https://ninstaclone.loca.lt

// package.json
    "loca": "npx localtunnel --port 4001 --subdomain ninstaclone",
```

## Install apollo

```js
npm i @apollo/client graphql
// touch apollo.ts
const client = new ApolloClient({
  uri: "https://ninstaclone.loca.lt/graphql",
  cache: new InMemoryCache(),
});

// cover with ApolloProvider at App.tsx
return (
    <ApolloProvider client={client}>
```
