import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fire from './Fire.js'

class Chat extends React.Component {
    
    state = {
        messages: [],
      };
    componentDidMount() {
        Fire.shared.on(message =>
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }))
        );
    }
    componentWillUnmount() {
        Fire.shared.off();
      }
    get user() {
        return {
          name: Hadar, //await AsyncStorage.getItem('username'),
          _id: Fire.shared.uid,
        };
      }

  render() {
    return (
        <GiftedChat
          messages={this.state.messages}
          onSend={Fire.shared.send}
          user={this.user}
        />
      );
  }
}
const styles = StyleSheet.create({});
export default Chat;
