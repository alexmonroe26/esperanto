import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView, Image, ActivityIndicator, TextInput, StatusBar} from 'react-native';
import {StackNavigator, Header} from 'react-navigation';
import {ListItem} from 'react-native-elements';
import {LinearGradient, SQLite} from 'expo';
import fuzzysort from './fuzzysort.js';
import data from './data_min.json';
// const db = SQLite.openDatabase("data.sqlite");

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      data: null,
    }
  }
  static navigationOptions = {
    title: 'Vortaro',
  };
  setSearchText (event) {
    let searchText = event.nativeEvent.text;
    this.setState({searchText});
    // var results = data.filter(item => item.word.includes(searchText) || item.word == searchText || item.meaning.includes(searchText) || item.meaning == searchText ).sort();
    let rawResults = fuzzysort.go(searchText, data, {keys: ['word', 'meaning'], threshold: -200, limit: 200,});
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
          <TextInput style={styles.searchBar} onSubmitEditing={this.setSearchText.bind(this)} placeholder="Search..." returnKeyType="search" clearButtonMode="while-editing" autoCorrect={false} autoCapitalize="none" />
          <FlatList style={{backgroundColor: 'white'}} data={this.state.data} keyExtractor={(item, index) => item.word} renderItem={({item}) =>
          <ListItem containerStyle={{borderBottomColor: '#eee'}} title={item.word} subtitle={item.meaning} onPress={() => this.props.navigation.navigate('WordView', {wordInfo: item})} />} />
          {/* <Br/>
          <FlatList
            data={[{key: 'Common Phrases'}, {key: '16 Rules of Esperanto', toPage: 'Rules'}, {key: 'Report an Issue'}, {key: 'Forming Verbs'}]}
            renderItem={({item}) => <ListItem containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottomColor: '#00c9ff'}} titleStyle={{color: 'white'}} chevronColor='white' title={item.key} onPress={() => this.props.navigation.navigate(item.toPage)} />}
          /> */}
        </ScrollView>
      </LinearGradient>
    );
  }
}

class WordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static navigationOptions = ({navigation}) => ({
    title: 'Definition',
  });
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
        <Text style={styles.header}>{params.wordInfo.word} <Text style={styles.subheader}>({params.wordInfo.type})</Text></Text>
        <Text style={styles.subheader}>{params.wordInfo.meaning}</Text>
        <Br/>
        {!!examples &&
          <View>
            <Text style={{fontWeight: 'bold'}}>Examples:</Text>
            {examples}
          </View>
        }
      </ScrollView>
    );
  }
}

class RulesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static navigationOptions = ({navigation}) => ({
    title: 'The Rules',
  });
  render() {
    return (
      <ScrollView>
        <Text>Hi</Text>
      </ScrollView>
    );
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
    borderRadius: 8
  }
});

const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  WordView: {
    screen: WordScreen,
  },
  Rules: {
    screen: RulesScreen,
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

export default class App extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return <RootStack />;
  }
}
