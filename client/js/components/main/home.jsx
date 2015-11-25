"use strict";

import React         from 'react';
import Firebase      from 'firebase';
import SettingsStore from '../../stores/settings';


export default class Home extends React.Component{

  constructor(){
    super();
    this.usersRef = new Firebase(`${SettingsStore.current().firebaseUrl}/users`);
    this.worldsRef = new Firebase(`${SettingsStore.current().firebaseUrl}/worlds`);
    this.state = {
      users: {},
      worlds: {}
    };
  }

  componentWillMount(){
    this.worldsRef.on("child_added", function(data) {
      new Firebase(`${this.worldsRef}/${data.key()}`).remove();
      console.log(data.key())
      this.state.worlds[data.key()] = data.val()
      this.setState({ worlds: this.state.worlds });
    }.bind(this));
    this.worldsRef.on("child_removed", function(data) {
      delete this.state.worlds[data.key()];
      this.setState({ worlds: this.state.worlds });
    }.bind(this));

    // Firebase docs for 'on': https://www.firebase.com/docs/web/api/query/on.html
    this.usersRef.on("child_added", function(data) {
      this.state.users[data.key()] = data.val()
      this.setState({ users: this.state.users });
    }.bind(this));
    this.usersRef.on("child_removed", function(data) {
      delete this.state.users[data.key()];
      this.setState({ users: this.state.users });
    }.bind(this));
  }

  componentWillUnmount(){
    this.usersRef.off();
  }
  
  handlePlay(e, id){
    e.preventDefault();
    var user = this.state.users[id];
    window.location = `${user.url}?user=`;
  }

  addNew(e){
    var ref = new Firebase(`${SettingsStore.current().firebaseUrl}/worlds/one`);
    ref.set({
      name: "world one",
      url: ""
    })
  }

  clearAll(){
    this.worldsRef.set(null);
  }

  render(){
    var users = _.map(this.state.users, (user, id) => {
      return <li key={id}><button onClick={(e) => { this.handlePlay(e, id); }}>{user.name}</button></li>;
    });
    var worlds = _.map(this.state.worlds, (world, id) => {
      return <li key={id}><button onClick={(e) => { this.handlePlay(e, id); }}>{world.name}</button></li>;
    });
    return(<div>
      <button onClick={(e) => { this.addNew(e); }}>Add New</button>
      <button onClick={(e) => { this.clearAll(e); }}>Clear Worlds</button>
      <ul>{users}</ul>
      <ul>{worlds}</ul>
    </div>);
  }
};