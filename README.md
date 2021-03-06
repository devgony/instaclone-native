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
export default client;

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
type typeList = "?????????" | "??????" | "??????-suffix";
const correct = "??????";
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

## 3 Steps to development

1. Architect skeleton first
2. Fill data
3. Draw styled

```js
// touch components/Photo.tsx
<Container>
  <Header>
    <UserAvatar />
    <Username></Username>
  </Header>
  <File />
  <Actions>
    <Action />
    <Action />
  </Actions>
  <Likes></Likes>
  <Caption>
    <Username>}</Username>
    <CaptionText></CaptionText>
  </Caption>
</Container>
```

## FlatList width + removeScroll

```js
// Feed.tsx
      <FlatList
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
```

## Get window size + Handling file of RN: style={width & height} is mendatory

```js
// components/Photo.tsx
const { width, height } = useWindowDimensions();
...
<File
  style={{
    width,
    height: height - 500,
  }}
  source={{ uri: file }}
/>
      ...
```

# #15.7 Photo part Two (11:50)

## How to get navigation?

1. props down
2. useNavigation

## Keep real size => getSize()

- default size = window.height - 450
- if success to getSize, setImageHeight to height / 3

```js
// components/Photo.tsx
const navigation = useNavigation();
const { width, height } = useWindowDimensions();
const [imageHeight, setImageHeight] = useState(height - 450);
useEffect(() => {
  Image.getSize(file, (width, height) => {
    // (file, if success cb)
    setImageHeight(height / 3);
  });
}, [file]);
```

## resizeMode

- contain: fill margin at bottom
- cover: real size

```js
// components/Photo.tsx
<File
        resizeMode="cover"
```

# #15.8 Photo part Three (09:26)

- caption, action: likes, comment

- Add Likes,Comments to shared stack nav

```js
touch screens/Likes.tsx
touch screens/Comments.tsx

// SharedStackNav.tsx
<Stack.Screen name="Likes" component={Likes} />
<Stack.Screen name="Comments" component={Comments} />

// types.d.ts
export type RootStackParamList = {
...
  Likes;
  Comments;
};
```

# #15.9 Pull to Refresh (07:01)

## if new data => apollo load again..?

- how could it recognize new data?

```js
const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        // refreshing={refreshing}
        // onRefresh={refetch}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="red" // ios
            colors={["red"]} // android
          />
        }
```

- Why refreshing, onRefresh doesn't work?
- IOS: tintColor, Android: colors

# #15.10 Infinite Scrolling part One (08:52)

## BACKEND: offset at `seeFeed.resolvers.ts`

- onEndReached
- onEndReachThreshold: load at the middle
  - 0: no threshold
  - 1: middle

## offset state + setOffset => rerender sucks => use `fetchMore`

```js
// Feed.tsx
const { data, loading, refetch, fetchMore } = useQuery<seeFeed>(SEE_FEED, {
    variables: {
      offset: 0,
    },
...
<FlatList
        onEndReachedThreshold={0}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
```

# #15.11 Infinite Scrolling part Two (09:37)

## Apollo consider offset 1 and 2 is different gql => typePolicies => merge!

- Compoenet is not changed at all => no new rendering

```js
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seeFeed: offsetLimitPagination(), // 1. by package
          // seeFeed: { // 2. vanilla way
          //   keyArgs: false,
          //   merge(exisintg = [], incoming = []) {
          //     return [...exisintg, ...incoming];
          //   },
          // },
        },
      },
    },
  }),
});
```

# #15.12 Cache Persist (11:34)

## persistCache setting

- keep data at cache even though backend is down.
- but why doens't it keep my image?

```js
// apollo.ts
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

// App.tsx
...
await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
...
```

## Mutation toggleLike at `Photo.tsx`

# 16.0 Likes part One

## UserRow for likes list

```
touch components/UserRow.tsx
```

## useQuery with skip at `Likes.js`

```js
// screens/Likes.tsx
const { data, loading, refetch, error } =
  useQuery <
  seePhotoLikes >
  (LIKES_QUERY,
  {
    variables: {
      id: route?.params?.photoId,
    },
    skip: !route?.params?.photoId,
  });
```

## HOMEWORK: persistCache prohibits loading till refresh manually ?

## HOMEWORK: image does not show?

# #16.1 Likes part Two (11:40)

## separator of flatlist => render bolder except top and bottom

```js
// screens/Likes.tsx
<FlatList
  ItemSeparatorComponent={() => (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}
    ></View>
  )}
```

## goToProfile at `components/Photo.tsx`, `components/UserRow.tsx`

## `serialize: false` => when schema and cache are different, does not render

- => but cache does not work at all?

```js
// App.tsx
await persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
  serialize: false,
});
```

# #16.2 Header Domination (07:16)

## 1. by route.params

```js
// screens/Profile.tsx
if (route?.params?.username) {
  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.username,
    });
  });
}
```

## 2. by useMe Query

```js
mkdir hooks
// touch hooks/useMe.ts
export default function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery<me>(ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}

// screens/Me.tsx
const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, []);
```

# #16.3 Search part One (10:21)

## dismissing keyboard from AuthLayout => shared `DismissKeyboard.tsx`

```js
touch components/DismissKeyboard.tsx
```

## screens/Search.tsx

- wecan return even react component to headerTitle

```js
useEffect(() => {
  navigation.setOptions({
    headerTitle: SearchBox,
  });
  register("keyword");
}, []);
```

- RN register to searchbox
- autoCapitalize, returnkeyType="search
- autoCorrenct=false

# #16.4 Search part Two (06:50)

## avatar to me tabnav icon

- useMe => ternary
- remind that RN Image's width and height are mendatory if source is from remote

## `useLazyQuery`: searchPhotos at `screens/Search.tsx` only when search

# #16.5 Search part Three (12:25)

- lazyQuery bug => sending watch has error => use onSubmitValid
- onSubmitValid => fire lazyQuery
- called: has been called or not to diffenciate init screen

# #16.6 Search part Four (09:00)

## styling: Search.tsx

## width / numColumn => stretch max

## numColumns: grid option of Flatlist

```js
// screens/Search.tsx
const renderItem = ({ item: photo }: { item: seeFeed_seeFeed }) => (
  <TouchableOpacity>
    <Image
      source={{ uri: photo.file }}
      style={{ width: width / numColumns, height: 100 }} // calculate each width to stretch max
    />
  </TouchableOpacity>
);
...
<FlatList
  numColumns={numColumns}
  data={data?.searchPhotos}
  keyExtractor={photo => "" + photo.id}
  renderItem={renderItem}
/>
```

# #16.7 Photo Screen (13:29)

## change screen name from Photo => PhotoScreen

## Search.tsx => onPress navigate to PhotoScreen with photoId

## ScrollView at `screens/Photo.tsx`:

- what's different with flatlist?

  - `ScrollView`: show overflown long page + pull to refresh function with `<RefreshControl>`
  - `Flatlist`: refresh to pull down + pull up to load more

- style with: contentContainerStyle

## HOMEWORK: if fullView? show comment and form

## HOMEWORK: notification, profile

# #17.0 Modal Navigator (10:40)

```
touch screens/Upload.tsx
```

## Change page structure: LoggedInNav.tsx => TabsNav.tsx

```js
// structure schema
<BigStack>
  <Tabs>
    <Stacks />
  </Tabs>
  <Upload />
</BigStack>
```

```js
cp navigators/LoggedInNav.tsx navigators/TabsNav.tsx
// navigators/LoggedInNav.tsx
const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
}
```

## Tabnav.`listeners` => `tabPress` => to use props, callback!

- `mode: modal`: come from bottom

# #17.1 Bottom Tabs Navigator (09:14)

## Material Top Tabs Navigator

```js
npm install @react-navigation/material-top-tabs react-native-tab-view@^2.16.0

// touch navigators/UploadNav.tsx
<MaterialTopTab>
  <StackedSelectPhoto /> // stacked for more menu
  <TakePhoto /> // just camera
</MaterialTopTab>

// LoggedInNav.tsx
      <Stack.Screen name="Upload" component={UploadNav} />
```

## Upload.tsx => SelectPhoto.tsx

## TakePhoto

```
cp screens/SelectPhoto.tsx screens/TakePhoto.tsx
```

# #17.2 Select Photo part One (06:57)

## styling `UploadNav.tsx` with `headerBackImage`

## styling `SelectPhoto.tsx` : ready to use expo API

# #17.3 Select Photo part Two (12:05)

## Media Library of expo

```
expo install expo-media-library
```

## Get permission + Get Photo

```js
const getPermissions = async () => {
  const { accessPrivileges, canAskAgain } =
    await MediaLibrary.getPermissionsAsync();
  if (accessPrivileges === "none" && canAskAgain) {
    const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
    if (accessPrivileges !== "none") {
      setOk(true);
    }
  } else if (accessPrivileges !== "none") {
    setOk(true);
  }
};
const getPhotos = async () => {
  if (ok) {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
  }
};
```

## HOMEWORK: select bar to choose albums

# #17.4 Select Photo part Three (10:21)

## loading error => getphotos() right after getting/checking permission not by state

## empty str error: choose 1st photo as default + ternary

## remove left,right margin => useWindowDimensions

## Flatlist for photos

```js
const numColumns = 4;
  const { width } = useWindowDimensions();
  const choosePhoto = (uri: string) => {
    setChosenPhoto(uri);
  };
  const renderItem = ({ item: photo }: { item: MediaLibrary.Asset }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / numColumns, height: 100 }}
      />
      <IconContainer>
        <Ionicons name="checkmark-circle" size={18} color="white" />
      </IconContainer>
    </ImageContainer>
  );
  return (
    <Container>
      <Top>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={photo => photo.id}
          renderItem={renderItem}
        />
```

# #17.5 Select Photo part Four (06:30)

## if chosen => colors.blue

```js
          color={photo.uri === chosenPhoto ? colors.blue : "white"}
```

## headerRight

1. At Stack.Navigator

```js
// UploadNav.tsx
<Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerRight:
```

2. At `navigation.setOptions` (we did)

```js
// SelectPhoto.tsx
navigation.setOptions({
  headerRight: HeaderRight,
});
```

# #17.6 Take Photo part One (13:05)

```
expo install expo-camera
```

## make user camera takes `flex: 1`

```js
// TakePhoto.tsx
export default function TakePhoto() {
  const [ok, setOk] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
  }, []);
  return (
    <Container>
      <Camera type={cameraType} style={{ flex: 1 }} />\
...
```

# #17.7 Take Photo part Two (12:09)

```js
expo install @react-native-community/slider

// TakePhoto.tsx
<SliderContainer>
          <Slider
            style={{ width: 200, height: 20 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
            onValueChange={onZoomValueChange}
          />
        </SliderContainer>
```

## pictureSize only for android?

# #17.8 Take Photo part Three (08:28)

## flash off, auto, on

- how to handle ternary if there is no icon?

```js
<Ionicons
  size={30}
  color="white"
  name={
    flashMode === Camera.Constants.FlashMode.off
      ? "flash-off"
      : flashMode === Camera.Constants.FlashMode.on
      ? "flash"
      : flashMode === Camera.Constants.FlashMode.auto
      ? "eye"
      : "md-warning"
  }
/>
```

## add X to camera + navigation

## delete status bar

- but what for at `SelectPhoto.tsx`?

```js
<StatusBar hidden={true} />
```

# #17.9 Take Photo part Four (07:06)

## create ref

```js
const camera = useRef < Camera > null;
```

## should wait till camera is ready (cb from camera)

- onCameraReady => setCameraReady => cameraReady => takePhoto
- quality:1 (max) exif: extra info

```js
const takePhoto = async () => {
  if (camera.current && cameraReady) {
    const photo = await camera.current.takePictureAsync({
      quality: 1,
      exif: true,
    });
    console.log(photo);
  }
};
```

# #17.10 Take Photo part Five (12:14)

```
import * as MediaLibrary from "expo-media-library";
```

## cache => filesystem

## createAssetAsync(localUri) VS saveToLibraryAsync(localUri)

### createAssetAsync(localUri)

- return assets-library
- can upload photo from returned asset

```js
// TakePhoto.tsx
const asset = await MediaLibrary.createAssetAsync(uri); // save to filesystem
```

### saveToLibraryAsync(localUri)

- does not return asset
- should upload photo from `cache`

## show preview screen

```js
// TakePhoto.tsx
        <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
...
          <PhotoAction onPress={onDismiss}>
```

## `UploadNav.tsx`: change take tab to the first

# #17.11 Take Photo part Six (06:56)

## Alert to save or upload photo

- can use alert("") but less property => use Alert.alert(title, text, [options])
- style: destructive

```js
const onUpload = () => {
  Alert.alert("Save photo?", "Save photo & upload or just upload", [
    {
      text: "Save & Upload",
      onPress: () => goToUpload(true),
    },
    {
      text: "Just Upload",
      onPress: () => goToUpload(false),
      style: "destructive",
    },
  ]);
};
```

# #17.12 Upload Screen part One (12:01)

```
touch screens/UploadForm.tsx
```

## `useIsFocused` => only if focues, turn on camera and hide statuf bar

```js
// TakePhoto.tsx
const isFocused = useIsFocused();
return isFocused ? (
  <Container>...</Container>
) : (
  <View style={{ flex: 1, backgroundColor: "black" }}></View>
);
```

## Add UploadForm stack to LoggedInNav

## Add nav to UploadForm at TakePhoto, SelectPhoto

## LoggedInNav has no header => individual headerShown: false to Tabs and Upload but UploadForm has header

# #17.13 Upload Screen part Two (12:06)

## add chosenPhoto to useEffect dependency

### chosenPhoto changed => redefined HeaderRight => new props to UploadForm

```js
useEffect(() => {
  navigation.setOptions({
    headerRight: HeaderRight,
  });
}, [chosenPhoto]);

const HeaderRight = () => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("UploadForm", {
        file: chosenPhoto,
      })
    }
  >
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>
);
```

# #17.14 Upload Screen part Three (13:47)

## FEED_PHOTO to fragments.ts

## ReactNative File

```js
npm i apollo-upload-client
npm i --save-dev @types/apollo-upload-client
const onValid: SubmitHandler<{ caption: string }> = ({ caption }) => {
    const file = new ReactNativeFile({
      uri: route.params?.file,
      name: `1.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };
```

## httpLink is the terminating Link

```js
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});
...
const client = new ApolloClient({
  link: authLink.concat(onErrorLink).concat(httpLink),
  cache,
});
```

# #17.15 Upload Screen part Four (10:42)

## createUploadLink at `apollo.ts`

## don't need fake object, it's already on the cache

## modify ROOT_QUERY => no need offset

- apollo.ts => offsetLimitPagination.keyargument:false

## nav to Tabs

```js
const updateUploadPhoto: MutationUpdaterFn<uploadPhoto> = (cache, result) => {
  if (result.data?.uploadPhoto?.id) {
    cache.modify({
      id: "ROOT_QUERY",
      fields: {
        seeFeed(prev) {
          return [result.data?.uploadPhoto, ...prev];
        },
      },
    });
    navigation.navigate("Tabs");
  }
};
```

```
If you're the developer...
You and other visitors will only see this page from a standard web browser once per IP every 7 days.

Webhook, IPN, and other non-browser requests "should" be directly tunnelled to your localhost. If your webhook/ipn provider happens to send requests using a real browser user-agent header, those requests will unfortunately also be blocked / be forced to see this tunnel reminder page. FYI, this page returns a 401 HTTP Status.

Options to bypass this page:
Set and send a Bypass-Tunnel-Reminder request header (its value can be anything).
or, Set and send a custom / non-standard browser User-Agent request header.
```

# #18.0 Messages Navigator (10:33)

```js
touch navigators/MessagesNav.tsx
touch screens/Rooms.tsx
touch screens/Room.tsx
```

## add MessagesNav to loggedInNav

## add paper-plane button at `Feed.tsx` navigating to Messages

# #18.1 Rooms Screen part One (11:51)

## ROOM_FRAGMENT to fragments.ts

## MessagesNav > Rooms > Room

# #18.2 Rooms Screen part Two (11:49)

## filter me, styling avatar, unreadTotal, unreadDot

# #18.3 Room Screen part One (11:54)

## D&Q from Rooms to RoomItem => nav to Room

```js
mkdir components/rooms
touch components/rooms/RoomItem.tsx
```

# #18.4 Room Screen part Two (09:20)

## KeyboardAvoidingView

## FlatList inverted

```js
// Screens/Room.tsx
<FlatList
          inverted
          style={{ width: "100%" }}
          data={data?.seeRoom?.messages as seeRoom_seeRoom_messages[]}
          keyExtractor={message => "" + message.id}
          renderItem={renderItem}
        />
```

# #18.5 Room Screen part Three (09:09)

## Rooms styling

## If username is not opponent, move to right => `what if there are 3 people in room?`

## HOMEWORK: add computed isMine

```js
// screens/Room.tsx
const MessageContainer = styled.View<{ outGoing: boolean }>`
  padding: 0px 10px;
  flex-direction: ${props => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
`;
...
<MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
>
```

# #18.6 Room Screen part Four (14:30)

## onMutation ok => updateSendMessage => cache.writeFragment

# #18.7 Room Screen part Five (07:17)

## To update cache => `Should get main id from query`

## clear message with setValues `after` getting value and use watch() at Text

## when load page first, initial position should show last message

## why did you remove persistCache?

# #18.8 Room Screen part Six (09:29)

## invert again.. but two way

1. <`What i did`> orderby desc from backend computed field messages
2. <`What nico did`> reverse at frontend => returned array from mutation is immutable => make new array

```js
// screens/Room.tsx
const messages = [...(data?.seeRoom?.messages ?? [])]; // Nullish coalescing operator
messages.reverse();
```

## Send msg with onPress ionicons of `send`

# #18.9 Subscriptions part One (07:36)

## install transport ws

### functional programming of splitLink: true? wsLink, else httpLink

```js
npm install subscriptions-transport-ws

// apollo.ts
const wsLink = new WebSocketLink({
  uri: "ws://ninstaclone-henry.loca.lt/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      token: tokenVar(),
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
```

# #18.10 Subscriptions part Two (08:57)

## Define subs: load always like useQuery? => we should update every time there is new message => Get subscribeToMore from useQuery

### if there is data, start subscription

```js
const { data, loading, subscribeToMore } = useQuery<seeRoom>(ROOM_QUERY, {
...
useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        // updateQuery......
      });
    }
  }, [data]);
```

## Wait to get token till login: connectionParams can be function intead of object

```js
// apollo.ts
const wsLink = new WebSocketLink({
...
    connectionParams: () => ({
      token: tokenVar(),
    }),
```

# #18.11 Subscriptions part Three (08:25)

## Why did you remove `reconnect: true,` from `apollo.ts`?

## My updateQuery of subscriptToMore

- Looks better but is it okay to compare existingMessage with id?

```js
// screens/Room.tsx
const updateQuery: UpdateQueryFn<seeRoom, roomUpdatesVariables, roomUpdates> =
    (prevQuery, options) => {
      const message = options.subscriptionData.data.roomUpdates;
      const existingMessage = prevQuery?.seeRoom?.messages?.find(
        aMessage => aMessage?.id === message?.id
      );
      if (message?.id && !existingMessage) {
        return {
          seeRoom: {
            ...prevQuery.seeRoom,
            messages: [message, ...(prevQuery.seeRoom?.messages ?? [])],
          },
        } as seeRoom;
      } else {
        return prevQuery;
      }
    };
```

## Nico's cache way => cuz UpdateQueryFn should return Tdata, gets Lint warning

- If this way is not fater, choose my way

```js
// screens/Room.tsx
const client = useApolloClient();
const updateQuery: UpdateQueryFn<seeRoom, roomUpdatesVariables, roomUpdates> = (
  prevQuery,
  options
) => {
  const message = options.subscriptionData.data.roomUpdates;
  if (message?.id) {
    const incomingMessage = client.cache.writeFragment({
      fragment: gql`
        fragment NewMessage on Message {
          id
          payload
          user {
            username
            avatar
          }
          read
        }
      `,
      data: message,
    });
    client.cache.modify({
      id: `Room:${route?.params?.id}`,
      fields: {
        messages(prev) {
          const existingMessage = prev.find(
            (aMessage: Reference) => aMessage.__ref === incomingMessage?.__ref
          );
          if (existingMessage) {
            return prev;
          }
          return [incomingMessage, ...prev];
        },
      },
    });
  }
};
```

# #18.12 Subscriptions part Four (10:03)

## Compare id(my way) or cache's \_\_ref(nico's way) to prevent duplication

### this limitation of apollo pubsub => try redis on product

## HOMEWORK: change read dot and unReadCount 1

# #18.13 Conclusions (03:54)

# #19.6 Building the App (12:15)

## add

```js
// app.json
"ios": {
      "bundleIdentifier": "co.henry.instaclone",
      "buildNumber": "1.0.0",
    },
"android": {
  "package": "co.henry.instaclone",
  "versionCode": 1,
```

## Deploy

```
expo build:ios
  archive: Deploy to appstore (windows)
  simulator: Macos

expo build:android
  apk
    generate new keystore
  app-bundle
```

- https://expo.io/turtle-status

## Over the Air update: expo publish => go server => fetch new js from server

## Release Channels - control beta test

- expo publish --release-channel <your-channel>
- expo build:ios --release-channel <your-channel>

## some does not work with OTA

# #19.7 Building Conclusions (04:54)

## make size half

```js
expo build:android -t app-bundle
```

- increase buildNumber or versionCode

# #20.0 Ejecting from Expo (13:33)

- backup whole project directory: eject is one way
- expo eject
- need to install additional package
- expo run ios
- expo doctor
- install android studio

# #20.1 Ejecting from Expo part Two (11:37)

- android will get error at first
- ios crashes as well when pressing photo tab
- info.plist => permission

```js
cd ios
npx pod-install
```

- crop picker
- android.build.gradle
- android login fali: 10.0.2.2 is localhost

# #20.2 Ejecting Conclusions (08:39)

- install storage ~
- install unimodule

# #20.3 React Native CLI (11:36)

## RN init

```
npx react-native <projectName>
npx react-native run-ios
npx react-native init <projectName>
```

## create-react-natvie-app: best option to choose

- RN init + expo preconfigure library

# #20.4 Conclusions (01:31)
