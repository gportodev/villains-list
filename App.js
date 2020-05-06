import React, {Component} from 'react';

import {
  View,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';

import User from './components/User';

const {width} = Dimensions.get('window');

console.disableYellowBox = true;

export default class App extends Component {
  state = {
    scrollOffset: new Animated.Value(0),
    listProgress: new Animated.Value(0),
    userInfoProgress: new Animated.Value(0),
    userSelected: null,
    userInfoVisible: false,
    users: [
      {
        id: 1,
        name: 'Sauron',
        description: 'Ring Master',
        avatar:
          'https://www.kametoys.cl/wp-content/uploads/2020/04/LOTR-Sauron-Prime1.jpg',
        thumbnail:
          'https://www.kametoys.cl/wp-content/uploads/2020/04/LOTR-Sauron-Prime1.jpg',
        likes: 200,
        color: 'red',
      },
      {
        id: 2,
        name: 'Joker',
        description: 'Psycho Mastermind',
        avatar: 'https://avatarfiles.alphacoders.com/212/212168.jpg4',
        thumbnail: 'https://avatarfiles.alphacoders.com/212/212168.jpg',
        likes: 250,
        color: '#361563',
      },
      {
        id: 3,
        name: 'Thanos',
        description: 'StoneSeeker',
        avatar: 'https://avatarfiles.alphacoders.com/208/208122.png',
        thumbnail: 'https://avatarfiles.alphacoders.com/208/208122.png',
        likes: 350,
        color: '#f04c1f',
      },

      {
        id: 4,
        name: 'Handsome Jack',
        description: 'Hyperion CEO',
        avatar:
          'https://pbs.twimg.com/profile_images/591372923417460736/dkmOAeyA.jpg',
        thumbnail:
          'https://pbs.twimg.com/profile_images/591372923417460736/dkmOAeyA.jpg',
        likes: 350,
        color: '#ffd500',
      },
    ],
  };

  selectUser = (user) => {
    this.setState({userSelected: user});

    Animated.sequence([
      Animated.timing(this.state.listProgress, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }),

      Animated.timing(this.state.userInfoProgress, {
        toValue: 100,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.setState({userInfoVisible: true});
    });
  };

  renderDetail = () => (
    <View>
      <User user={this.state.userSelected} onPress={() => {}} />
    </View>
  );

  renderList = () => (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateX: this.state.listProgress.interpolate({
                inputRange: [0, 100],
                outputRange: [0, width],
              }),
            },
          ],
        },
      ]}>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {y: this.state.scrollOffset},
            },
            useNativeDriver: false,
          },
          null,
        ])}>
        {this.state.users.map((user) => (
          <User
            key={user.id}
            user={user}
            onPress={() => this.selectUser(user)}
            scrollEnabled={false}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );

  render() {
    const {userSelected} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Animated.View
          style={[
            styles.header,
            {
              height: this.state.scrollOffset.interpolate({
                inputRange: [0, 140],
                outputRange: [200, 70],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <Animated.Image
            style={[
              styles.headerImage,
              {
                opacity: this.state.userInfoProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 1],
                }),
              },
            ]}
            source={userSelected ? {uri: userSelected.thumbnail} : null}
          />

          <Animated.Text
            style={[
              styles.headerText,
              {
                fontSize: this.state.scrollOffset.interpolate({
                  inputRange: [120, 140],
                  outputRange: [24, 16],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateX: this.state.userInfoProgress.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, width],
                    }),
                  },
                ],
              },
            ]}>
            Villain List
          </Animated.Text>

          <Animated.Text
            style={[
              styles.headerText,
              {
                transform: [
                  {
                    translateX: this.state.userInfoProgress.interpolate({
                      inputRange: [0, 100],
                      outputRange: [width * -1, 0],
                    }),
                  },
                ],
              },
            ]}>
            {userSelected ? userSelected.name : null}
          </Animated.Text>
        </Animated.View>
        {this.state.userInfoVisible ? this.renderDetail() : this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 15,
    backgroundColor: 'black',
  },

  headerImage: {
    ...StyleSheet.absoluteFillObject,
  },

  headerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFF',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 25,
    bottom: 10,
  },
});
