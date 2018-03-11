import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView, Image, ActivityIndicator, TextInput, StatusBar, TouchableWithoutFeedback, TouchableHighlight, Button, Animated, Dimensions} from 'react-native';
import {StackNavigator, Header} from 'react-navigation';
import {LinearGradient, SQLite, DangerZone} from 'expo';
const { Lottie } = DangerZone;
import {Ionicons} from '@expo/vector-icons';
import fuzzysort from './fuzzysort.js';
import data from './data_min.json';
var {height, width} = Dimensions.get('window');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      data: null,
    }
  };
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state;
    return {
      title: 'Vortaro',
      // headerRight: <Button title="Favs" color="white" onPress={() => navigation.navigate('Favorites')} />,
    }
  };
  componentDidMount() {
    this.animation.play();
  }
  setSearchText(text) {
    let searchText = text.replace(/cx|gx|hx|jx|sx|ux/gi, function (x) {
      switch (x) {
        case 'cx':
            return 'ĉ';
        case 'gx':
          return 'ĝ';
        case 'hx':
          return 'ĥ';
        case 'jx':
          return 'ĵ';
        case 'sx':
          return 'ŝ';
        case 'ux':
          return 'ŭ';
      }
    });
    this.setState({searchText});
    let rawResults = fuzzysort.go(this.state.searchText, data, {keys: ['word', 'meaning'], threshold: -200, limit: 200,});
    var results = [];
    for (i = 0; i < rawResults.length; i++) {
      results.push(rawResults[i].obj);
    }
    this.setState({data: results});
  }
  render() {
    return (
      <LinearGradient colors={['#00c9ff', '#00f7ff']} style={{flex: 1}}>
        <ScrollView>
          <TextInput style={styles.searchBar} value={this.state.searchText} onChangeText={(text) => this.setSearchText(text)} placeholder="Search..." returnKeyType="search" clearButtonMode="while-editing" autoCorrect={false} autoCapitalize="none" />
          <FlatList style={{backgroundColor: 'white'}} data={this.state.data} keyExtractor={(item, index) => item.word} renderItem={({item}) =>
          <ListItem title={item.word} subtitle={item.meaning} onPress={() => this.props.navigation.navigate('WordView', {wordInfo: item})} />} />
          {/* <Br/>
          <FlatList
            data={[{key: 'Common Phrases'}, {key: '16 Rules of Esperanto', toPage: 'Rules'}, {key: 'Report an Issue'}, {key: 'Forming Verbs'}]}
            renderItem={({item}) => <ListItem containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottomColor: '#00c9ff'}} titleStyle={{color: 'white'}} chevronColor='white' title={item.key} onPress={() => this.props.navigation.navigate(item.toPage)} />}
          /> */}
          <Lottie ref={animation => {
            this.animation = animation;
          }} source={require('./animation/wordcloud-data.json')} style={{height: 300, width: width}} loop={true} speed={2} />
        </ScrollView>
      </LinearGradient>
    );
  }
}

class WordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExamples: false,
    }
  }
  static navigationOptions = ({navigation}) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: 'Definition',
      // headerRight: <Ionicons name={params.favorite ? "md-heart" : "md-heart-outline"} size={25} color="white" style={{padding: 10}} onPress={() => {
      //   navigation.setParams({favorite: !params.favorite});
      //   store.push('favorites', params.wordInfo);
      // }} />
    }
  }
  render() {
    const { params } = this.props.navigation.state;
    var examples = [];
    if (params.wordInfo.examples) {
      for (let i = 0; i < params.wordInfo.examples.length; i++) {
        var example = Object.keys(params.wordInfo.examples[i])[0];
        var translation = params.wordInfo.examples[i][example];
        examples.push(
          <View key={i}>
            <Text style={{padding: 15, paddingVertical: 5}}>
              <Text>{example} </Text>
              <Text style={{color: 'grey'}}>{translation}</Text>
            </Text>
          </View>
        );
      }
    } else {
      // examples.push(<Text style={{color: 'grey', padding: 10}} key={0}>No examples found.</Text>);
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.word}>{params.wordInfo.word}</Text>
        <Text style={styles.meaning}>{params.wordInfo.meaning}</Text>
        <Br/>
        {this.state.showExamples &&
          <View>
            <Text style={{fontWeight: 'bold'}}>Examples:</Text>
            {examples}
          </View>
        }
      </ScrollView>
    );
  }
}

class FavoritesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  };
  static navigationOptions = ({navigation}) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: 'Favorites',
    }
  }
  componentDidMount() {
    store.get('favorites').then((res) => {
      console.log(res);
    	this.setState({data: res});
    });
  }
  render() {
    return (
      <LinearGradient colors={['#00c9ff', '#00f7ff']} style={{flex: 1}}>
        <ScrollView>
          <FlatList style={{backgroundColor: 'white'}} data={this.state.data} keyExtractor={(item, index) => item.word} renderItem={({item}) =>
          <ListItem title={item.word} subtitle={item.meaning} onPress={() => this.props.navigation.navigate('WordView', {wordInfo: item})} />} />
        </ScrollView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchBar: {
    margin: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'lightgrey',
    borderWidth: StyleSheet.hairlineWidth,
  },
  word: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    paddingVertical: 20,
  },
  meaning: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    paddingVertical: 20,
    color: '#00c9ff'
  }
});

const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  WordView: {
    screen: WordScreen,
  },
  Favorites: {
    screen: FavoritesScreen,
  }
  }, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#00c9ff',
      borderBottomWidth: 0
    },
    headerTitleStyle: {
      fontWeight: '900',
      fontSize: 23
    },
    headerTintColor: 'white',
  }
});

const Br = () => {
  return <View style={{height: 20}}/>
}

const ListItem = (props) => {
  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={{backgroundColor: 'white', padding: 10, paddingLeft: 20}}>
        <Text>{props.title}</Text>
        <Text style={{color: 'grey'}}>{props.subtitle}</Text>
      </View>
    </TouchableHighlight>
  );
}

export default class App extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return <RootStack />;
  }
}
