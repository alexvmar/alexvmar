/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text, ListView,
  View, Button,
  AsyncStorage
} from 'react-native';

var SmsAndroid = require('react-native-sms-android');

var STORAGE_KEY = '@SmsParser:lastParsedId';

export default class smsparser extends Component {
  constructor(props) { 
      super(props);
      this.state = {
        messages: [],
        status: "init...",
        lastParsedId: 0
      };
  }
  formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    var yy = date.getFullYear();
    return dd + '.' + mm + '.' + yy;
  }
  formatTime(date) {
    var hh = date.getHours();
      if (hh < 10) hh = '0' + hh;
      var mm = date.getMinutes();
      if (mm < 10) mm = '0' + mm;
    return hh + ':' + mm;
  }
  refreshMessagesList() {
    var filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        // the next 4 filters should NOT be used together, they are OR-ed so pick one
        // read: 0, // 0 for unread SMS, 1 for SMS already read
        // _id: 1234, // specify the msg id
        address: '0800300900', // sender's phone number
        // body: 'Hello', // content to match
        // the next 2 filters can be used for pagination
        // indexFrom: 0, // start from index 0
        maxCount: 100, // count of SMS to return each time
    };
    SmsAndroid.list(JSON.stringify(filter), (fail) => {
        console.log("OH Snap: " + fail)
        this.setState({ status: "OH Snap: " + fail});
    },
    (count, smsList) => {
        console.log('Count: ', count);
        console.log('List: ', smsList);
        var arr = JSON.parse(smsList);
        var msgs = arr.map(msg => { 
          let dt = new Date(msg.date);
          let sumPattern = /na sumu ([\,\.\d]*) UAH. (\d{2}\.\d{2}.\d{4}) v (\d{2}:\d{2}). ([\w\W]+). Balans/i;
          let parsed = sumPattern.test(msg.body);
          let parsedMessage = (parsed) ? msg.body.match(sumPattern) : null;
          return (parsed) ? { id: msg._id, day: parsedMessage[2], time: parsedMessage[3], sum: parsedMessage[1], category: parsedMessage[4], body: msg.body }
            : { id: msg._id, day: this.formatDate(dt), time: this.formatTime(dt), sum: '-', category: '-', body: msg.body };
        });
        this.setState({ messages: this.state.messages.concat(msgs) });
        this.setState({ status: "OK -> " + count});
    });
  }
  componentWillMount() {
    this._loadInitialState().done();
    this.refreshMessagesList();
    this.setState({ status: "mounted" });
  }
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) this.setState({ lastParsedId: value });
    } catch (error) {
      this.setState({ status: 'AsyncStorage error: ' + error.message });
    }
  }
  async _saveInitialState(lastParsedId) {
    this.setState({ lastParsedId: lastParsedId });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lastParsedId.toString());
    } catch (error) {
      this.setState({ status: 'AsyncStorage error: ' + error.message });
    }
  }
  onPressLoadMore() {
    if (this.state.messages.length > 0)
      this._saveInitialState(this.state.messages[0].id);
  }
  onPressRefresh() {
    this.setState({ messages: [] });
    this.refreshMessagesList();
  }
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    const source = ds.cloneWithRows(this.state.messages);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          SMS from 0800300900
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 10 }} >Count: {this.state.messages.length}. {this.state.status}. Last parsed id = {this.state.lastParsedId}</Text>
        </View>
        <ListView dataSource={source} renderRow={(rowData) => {
          let isNew = (rowData.id > this.state.lastParsedId);
          return (
          <View style={{ borderTopColor: 'lightgrey', borderTopWidth: 1, margin: 20 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={ (isNew) ? { color: 'maroon' } : { color: 'silver', textDecorationLine: 'underline' }}>{rowData.sum} &#8372;</Text><Text>{rowData.day}</Text><Text>{rowData.time}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', color: 'darkgreen' }}>{rowData.category}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 10 }}>{rowData.body} #{rowData.id}</Text>
            </View>
          </View>);}} 
          enableEmptySections={true} />
          <View style={{ flexDirection: 'row' }}>
            <Button title="Mark all as parsed" onPress={this.onPressLoadMore.bind(this)} />
            <Button title="Refresh" color="lightgray" onPress={this.onPressRefresh.bind(this)} />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('smsparser', () => smsparser);
