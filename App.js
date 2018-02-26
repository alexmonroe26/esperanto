import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView, Image, ActivityIndicator, TextInput, StatusBar} from 'react-native';
import {StackNavigator, Header} from 'react-navigation';
import {ListItem} from 'react-native-elements';
import {LinearGradient} from 'expo';
import data from './data_min.json';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      search: false
    }
    this.checkToSearch = this.checkToSearch.bind(this);
  }
  static navigationOptions = {
    title: 'Vortaro',
  };
  searchFilter (item) {
    return item.word.includes(this.state.text.toLowerCase()) || item.meaning.includes(this.state.text.toLowerCase());
  }
  checkToSearch () {
    var entry = data.find((element) => {
      if (element.word == this.state.text) {
        return element.word == this.state.text;
      } else if (element.meaning == this.state.text) {
        return element.meaning == this.state.text;
      } else if (element.word.includes(this.state.text)) {
        return element.word.includes(this.state.text);
      } else if (element.meaning.includes(this.state.text)) {
        return element.meaning.includes(this.state.text);
      } else {
        return null;
      }
    });
    if (entry) {
      this.props.navigation.navigate('WordView', {wordInfo: entry})
    }
  }
  render() {
    return (
      <LinearGradient colors={['#00c9ff', '#00f7ff']} style={{flex: 1}}>
        <View>
          <TextInput style={styles.searchBar} onChangeText={(text) => this.setState({text})} placeholder="Search..." returnKeyType="search" clearButtonMode="while-editing" onSubmitEditing={() => this.checkToSearch()} autoCorrect={false} autoCapitalize="none" />
          {!!this.state.text && (
            <FlatList style={{backgroundColor: 'white'}} data={data.filter(item => this.searchFilter(item))} ListHeaderComponent={this.renderHeader} ListFooterComponent={this.renderFooter} keyExtractor={(item, index) => item.word} renderItem={({item}) =>
            <ListItem containerStyle={{borderBottomColor: '#eee'}} title={item.word} subtitle={item.meaning + ` (${item.type})`} onPress={() => this.props.navigation.navigate('WordView', {wordInfo: item})} onLongPress={() => alert('hi')} />} />)
          }
        </View>
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
  componentWillMount() {
    if (this.props.navigation.state.params.wordInfo.type == "verb") {
      this.setState({verb: true});
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
      examples.push(<Text style={{color: 'grey', padding: 10}} key={0}>No examples found.</Text>);
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>{params.wordInfo.word} <Text style={styles.subheader}>({params.wordInfo.type})</Text></Text>
        <Text style={styles.subheader}>{params.wordInfo.meaning}</Text>
        <Br/>
        <Text style={{fontWeight: 'bold'}}>Examples:</Text>
        <View>
          {examples}
        </View>
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
