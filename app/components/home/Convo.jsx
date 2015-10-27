import { React, View, BackButton, Button, List, Card, Input} from 'reapp-kit';
import * as _ from 'ramda';
import divStyle, {paint} from '../styles';
import {getLocalJSON, setLocalJSON, logger} from '../simpleStorage';
import {Motion, spring, TransitionMotion} from 'react-motion';
require('velocity-animate/velocity.ui');

import {VelocityTransitionGroup} from 'velocity-react';
import {speakers} from './convo/Transition'




/*onClick={this.handleClick.bind(null, key)}*/

const bluebox = () => { return <Motion 
          defaultStyle={{x: 0, z: 0}} 
          style={{x: spring(220, [200, 7]), z: spring(400, [5, 1])}}>
            {value => {
              let viz = {
                backgroundColor: 'blue',
                border: '1px solid black',
                width: value.x,
                height: value.z / 2,
                opacity: (value.z / 400)
          //      transform: `rotate(${value.x}deg)`
              }
              return(<div style={viz}>{value.x}</div>)}}
        </Motion>  
}



const getStyleMap = function(blocks) {
    let configs = [];
    //or blocks.keys.map
    blocks.forEach(object, index => {
      configs[index] = {
        opacity: spring(1, [5, 10]),
        width: 200,
        height: spring(100, [5, 1]),
        backgroundColor: 'blue',
        text: blocks[index], // not interpolated
      };
    });
    return configs;
}



// const Demo = React.createClass({
//   getInitialState() {
//     return {
//       blocks: {
//         a: 'I am a',
//         b: 'I am b',
//         c: 'I am c',
//       },
//     };
//   },

//   handleClick(key) {
//     const {...newBlocks} = this.state.blocks;
//     delete newBlocks[key];
//     const whatda = {[key + 'blah']: 'blah'+key};
//     this.setState({blocks: Object.assign(newBlocks, whatda)});
//   },

//   render() {
//     return (
//       <TransitionMotion
//         styles={getStyles()}
//         willEnter={willEnter}
//         willLeave={willLeave}>
//         {interpolatedStyles =>
//           <div>
//             {Object.keys(interpolatedStyles).map(key => {
//               const {text, ...style} = interpolatedStyles[key];
//               return (
//                 <div onClick={this.handleClick.bind(null, key)} style={style}>
//                   {text}
//                 </div>
//               );
//             })}
//           </div>
//         }
//       </TransitionMotion>
//     );
//   },
// });


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

    let that = this

    return (
      <View {...this.props} title="Track Conversation" titleLeft={backButton}>
        {//bluebox()
        }
        <div style={paint(divStyle.center, {width: 250})}>
          <h1 style={paint(divStyle.center)}>Add Participants</h1>
          <b style={(this.state.speakers == 0)? divStyle.hidden : divStyle.center}>Participants</b>
            {speakers(this.state.speakers, that)}
            
            <Input style={{marginBottom: 12, marginTop: 12}} ref="name" onChange={this.filterSpeaker} onKeyUp={this.searchKeyPress.bind(this)}placeholder="Name"/>
            
            <b style={(this.state.suggestions == 0)? divStyle.hidden : paint(divStyle.centerDiv, {width: "100%"})}>
              Suggestions
            </b>
            {speakers(this.state.suggestions, that)}


            <div name="addButtons" style={{marginBottom: 12}}/>
            <Button ref="addButton" onTap={this.addSpeaker}>Add Participant</Button>
            <div style={{marginBottom: 3}}/>
            <Button style={(this.state.speakers == 0)? divStyle.hidden : divStyle.list} ref="startConvo" onTap={this.startConvo}>Start Conversation</Button>
        </div>
      </View>
    );
  }
}

const cbSug = {

  onKeyUp: 'onKeyUp={this.searchKeyPress.bind(this)}',

  onClick: 'onClick={this.addSpeaker.bind(event, s.toString(), s.toString())}'

}



//mapping suggestions
//           {this.state.suggestions.map((s, index) => {
//               return <a style={{marginBottom: 1}} tabindex={index+1} onKeyUp={this.searchKeyPress.bind(this)} onClick={this.addSpeaker.bind(event, s.toString(), s.toString())}><b>{s}</b></a>
//             })}


//            <div key={i} style={divStyle.centerDiv}>{s}</div>
