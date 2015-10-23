import { React, View, BackButton, Button, List, Card, Input} from 'reapp-kit';
import * as _ from 'ramda';
import divStyle, {paint} from '../styles';
import {getLocalJSON, setLocalJSON, logger} from '../simpleStorage';





export default class Conversation extends React.Page {
  constructor(props){
    super(props)
    this.state = {
      suggestions: [],
      speakers: []
    }
  }

  addSpeaker(event, suggestion){
    let user = suggestion || this.refs.name.getDOMNode().value;
    let newspeakers = this.state.speakers.concat(user);

    this.refs.name.getDOMNode().value = '';
    let localspeakers = getLocalJSON("speakers");
    setLocalJSON("speakers")(_.uniq(localspeakers.concat(user)));
    this.setState({speakers: _.uniq(newspeakers), suggestions: []});
  }


  searchKeyPress(e)
      {
          // look for window.event in case event isn't passed in
          e = e || window.event;
          if (e.keyCode == 13)
          {
              this.addSpeaker(e);
              return false;
          }
          return true;
      }


  filterSpeaker(event) {

    const startsWith = _.curry((starting, string) => {
        return string.toUpperCase().startsWith(starting.toUpperCase())});
    
    let speakers = getLocalJSON("speakers");

    let matches = _.filter(startsWith(this.refs.name.getDOMNode().value), speakers);
    let notIncluded = _.filter((n) => {return this.state.speakers.indexOf(n) == -1 });

    // console.log(notIncluded(matches));
    // console.log(matches);
    this.setState({suggestions: notIncluded(matches)});


    //ContactStore.addContact
    // function (contact) {
    //   this.transitionTo('contact', { id: contact.id });
    // }.bind(this));
  }

  startConvo(){
    if (this.state.speakers == 0) {
      alert('you gotta add some people')
    }
    else
      setLocalJSON("activespeakers")(this.state.speakers);
      this.router().transitionTo('/talker')
  }


  render() {

    let suggestions = () => {
      if(this.state.suggestions > 0){
      return <List >Suggestions
        </List>
      }
      else
        return ''
    }

    const backButton =
      <BackButton onTap={() => window.history.back()} />

    return (
      <View {...this.props} title="Track Conversation" titleLeft={backButton}>
          
        <div style={paint(divStyle.center, {width: 250})}>
          <h1 style={paint(divStyle.center)}>Add Participants</h1>
          <b style={(this.state.speakers == 0)? divStyle.hidden : divStyle.centerDiv}>Participants</b>
            {speakers(this.state.speakers)}
            
            <Input style={{marginBottom: 12, marginTop: 12}} ref="name" onChange={this.filterSpeaker} onKeyUp={this.searchKeyPress.bind(this)}placeholder="Name"/>
            
            <b style={(this.state.suggestions == 0)? divStyle.hidden : divStyle.list}>Suggestions</b>
            {this.state.suggestions.map((s, index) => {
              return <a style={{marginBottom: 1}} tabindex={index+1} onKeyUp={this.searchKeyPress.bind(this)} onClick={this.addSpeaker.bind(event, s.toString(), s.toString())}><b>{s}</b></a>
            })}
            <div style={{marginBottom: 12}}/>
            <Button ref="addButton" onTap={this.addSpeaker}>Add Participant</Button>
            <div style={{marginBottom: 3}}/>
            <Button style={(this.state.speakers == 0)? divStyle.hidden : divStyle.list} ref="startConvo" onTap={this.startConvo}>Start Conversation</Button>
        </div>
      </View>
    );
  }
}


const speakers = _.map((s, i) => {return <div key={i} style={divStyle.centerDiv}>{s}</div>})
