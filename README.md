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

# 1. npx way

```js
npx localtunnel --port 4001 --subdomain <NAME>
=> https://<NAME>.loca.lt
```

# 2. API at backend way => backend repo

```js
npm i babel-plugin-inline-dotenv

// touch .env
URI_GQL=<uriOfGql>
```

## Install apollo

```js
npm i @apollo/client graphql
// touch apollo.ts
const client = new ApolloClient({
  uri: process.env.URI_GQL,
  cache: new InMemoryCache(),
});

// cover with ApolloProvider at App.tsx
return (
    <ApolloProvider client={client}>
```

# #14.12 Log In Mutation (13:52)

## Tabnavigator

```js
npm install @react-navigation/bottom-tabs
// touch navigators/LoggedInNav.tsx
const Tabs = createBottomTabNavigator();

touch screens/Feed.tsx
```

## Reactive variable

```js
// apollo.ts
export const isLoggedInVar = makeVar(false);

// App.tsx
const isLoggedIn = useReactiveVar(isLoggedInVar);
isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />;
```

## First mutation: LOGIN

```js
npm i rimraf
// package.json
"apollo:codegen": "rimraf src/__generated__ && apollo client:codegen src/__generated__ --target=typescript --outputFlat --globalTypesFile false"

// touch apollo.config.js
require("dotenv").config();
module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "instaclone-backend",
      url: process.env.URI_GQL,
    },
  },
};
```

## watch instead of formState

- formState doesn't work on RN

```js
// Login.tsx
        disabled={!watch("username") || !watch("password")}
```

# #14.13 Create Account Mutation (10:19)

## Shared type at `types.d.ts`

```ts
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  LogIn: { username: string; password: string } | undefined;
  CreateAccount: undefined;
};

export type Props<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
};
```

## To Prefil form right after creeatAccount...

## Send and get paramter to other screen

```js
// CreateAccount.tsx
navigation.navigate("LogIn", { username, password });

// Login.tsx
defaultValues: {
      username: params?.username,
      password: params?.password,
    },
```

## defaultValue does not work at RN => manually show with `value=watch()`

```js
// Login.tsx
<AuthLayout>
      <TextInput
        value={watch("username")}
```

# #14.14 AsyncStorage part One (07:00)

# Check RN library compatibility at `https://reactnative.directory/`

# `AsyncStorage` instead of local storage

- same with localStorage except fot needing await

```ts
expo install @react-native-async-storage/async-storage

// apollo.ts
export const logUserIn = async (token: login_login["token"]) => {
  await AsyncStorage.multiSet([
    ["token", JSON.stringify(token)],
    ["loggedIn", JSON.stringify("yes")],
  ]);
  isLoggedInVar(true);
};
```

# #14.14 AsyncStorage part One (07:00)

## web: token at http header whenever send gql => RN: keep token at reactive variable

```js
// apollo.ts
export const tokenVar = makeVar("");
...
token && tokenVar(token);
...
```

## getItem => App preloading at `App.tsx`

```js
const preload = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    isLoggedInVar(true);
    tokenVar(token);
  }
  return preloadAssets();
};
```

## Homework: Logout button and multi remove

## Lookup type

```ts
// apoll.ts (modified)
export const logUserIn = async (token: login_login["token"]) => {
```

# #14.16 Recap (05:04)

# #15.0 Tab Navigator (12:58)

## `Feed.tsx` + Create 3 more Tabs

```
touch screens/Notifications.tsx
touch screens/Profile.tsx
touch screens/Search.tsx
```

## Bottom Tab style options

- showLabel: false
- Ionicons with focused

```js
<Tabs.Navigator
      tabBarOptions={{
        activeTintColor: "white",
        showLabel: false,
        style: {
          borderTopColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "black",
        },
      }}
    >
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home" color={color} size={focused ? 24 : 20} />
          ),
        }}
      />
...
```

# #15.1 Tab Navigator part Two (06:55)

## Use Empty view for camera pop-up

```js
import { View } from "react-native";
<Tabs.Screen
  name="Camera"
  component={View}
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <TabIcon iconName={"camera"} color={color} focused={focused} />
    ),
  }}
/>;
```

## Use outline for icons and create My ICons

```js
// types.d.ts
export type ICons =
  | "link"
  | "search"
...
```

## Ioncions to shared component

```ts
mkdir components/nav/
// touch components/nav/TabIcon.tsx
interface ITabIcon {
  iconName: ICons;
  color: string;
  focused: boolean;
}

export default function TabIcon({ iconName, color, focused }: ITabIcon) {
  return (
    <Ionicons
      name={focused ? iconName : (`${iconName}-outline` as ICons)}
      color={color}
      size={22}
    />
  );
}
```

## Explicit type assertion

```js
type GlyphNames = ComponentProps<typeof FontAwesome>["name"];
type typeList = "이것만" | "된다" | "된다-suffix";
const correct = "된다";
const ok: typeList = correct;
const error: typeList = `${correct}-suffix`;

<Ionicons
name={focused ? iconName : (`${iconName}-outline` as ICons)}
// without as ICons: Type 'string' is not assignable to type 'typeList'.ts(2322)
```

# #15.2 Stack and Tabs (14:04)

## Stack navigator inside of each Tab navigator

- first page of stack is different
- rest are shared (Profile, Photo)

```js
touch screens/Me.tsx
touch screens/Photo.tsx
touch components/nav/StackNavFactory.tsx
```

## New way to render with `()=>{}`

- should choose one component? or children?
- only 1 comp: component
- if want to send props, children is better

```js
<Tabs.Screen
  name="Feed"
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <TabIcon iconName={"home"} color={color} focused={focused} />
    ),
  }}
>
  {() => <StackNavFactory screenName="Feed" />}
</Tabs.Screen>
```

## With navigation, navigate through stacks

## Set screenName with `keyof RootStackParamList`

```js
interface IStackNavFactory {
  screenName: keyof RootStackParamList;
}

export default function StackNavFactory({ screenName }: IStackNavFactory) {
```

# #15.3 Stack and Tabs part Two (07:04)

- recap

# #15.4 Apollo Auth (10:17)

- logo

```js
// navigators/SharedStackNav.tsx
options={{
            headerTitle: () => (
              <Image
                style={{
                  width: 120,
                  height: 40,
                }}
                resizeMode="contain"
                source={require("../assets/logo.png")}
              />
            ),
```

- token at `apollo`
- SEE_FEED at `Fees.tsx`
- fragment at `fragments.ts`

```
touch fragments.ts
mv components/nav/StackNavFactory.tsx navigators/SharedStackNav.tsx
```

# #15.5 FlatList (13:24)

## ScreenLayout.tsx : loading handler

```js
// touch components/ScreenLayout.tsx
{
  loading ? <ActivityIndicator color="white" /> : children;
}
```

## Web load at once like `ScrolView`, Mobile shouldn't => `FlatList`

```js
// Feed.tsx
const renderPhoto = ({ item: photo }: { item: seeFeed_seeFeed }) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: "white" }}>{photo.caption}</Text>
    </View>
  );
};
return (
  <ScreenLayout loading={loading}>
    <FlatList
      data={data?.seeFeed}
      keyExtractor={photo => "" + photo.id}
      renderItem={renderPhoto}
    />
  </ScreenLayout>
);
```

# #15.6 Photo part One (12:48)

```js
touch components/Photo.tsx
```
