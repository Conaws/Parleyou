import { React, View, BackButton, Button, List, Input, Label, SearchBar} from 'reapp-kit';
import * as _ from 'ramda';



const storageSetter = _.curry(function(key, value){ return localStorage[key] = value });
const storageGetter = _.curry(function(key){return localStorage[key] || "[]" });
// setLocalJSON("Brave New World")({brave: "new world"});
const setLocalJSON = (term) => {return _.compose(storageSetter(term), JSON.stringify)}
const getLocalJSON = _.compose(JSON.parse, storageGetter);


const setLocalState = (data) => setLocalJSON("state")(data);
const getLocalState = () => getLocalJSON("state");


const logger = (x) => {console.log(x); return x};



const addSpeaker = (speaker, state) => {
  let speakers = state.speakers;
  let newspeakers = speakers.concat(speaker)
  let newState = Object.assign(state, {speakers: newspeakers})
  return newState;
}



const divStyle ={
  hidden: {
    display: 'none'
  },
  list: {
    marginBottom: 12
  }
}



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
    let localspeakers = getLocalJSON("speakers")? getLocalJSON("speakers") : [];
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
          <b style={(this.state.speakers == 0)? divStyle.hidden : divStyle.list}>Participants</b>
          {this.state.speakers}

        <h1 style={{marginLeft: "auto", marginRight: "auto"}}>Add Participants</h1>
          <Input style={{marginBottom: 12}} ref="name" onChange={this.filterSpeaker} onKeyUp={this.searchKeyPress.bind(this)}placeholder="Person's Name"/>
          <b style={(this.state.suggestions == 0)? divStyle.hidden : divStyle.list}>Suggestions</b>
          {this.state.suggestions.map((s, index) => {
            return <a style={{marginBottom: 1}} tabindex={index+1} onKeyUp={this.searchKeyPress.bind(this)} onClick={this.addSpeaker.bind(event, s.toString(), s.toString())}><b>{s}</b></a>
          })}
          <div style={{marginBottom: 12}}/>
          <Button ref="addButton" onTap={this.addSpeaker}>Add Participant</Button>
          <div style={{marginBottom: 3}}/>
          <Button style={(this.state.speakers == 0)? divStyle.hidden : divStyle.list} ref="startConvo" onTap={this.startConvo}>Start Conversation</Button>
      </View>
    );
  }
}

// <p>Ready to deploy? Run <code>reapp build</code> and check your build directory</p>



