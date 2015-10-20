import { React, View, Button } from 'reapp-kit';

import * as _ from 'ramda';

// const endSpeech = (start) => {
//     let end = Date.now()
//     return {start, end, total: end - start }
// }

//global variables yuck

// const setStarted(){
//         this.started = Date.now()
//     }

//<Button onTap={()=> alert('hello')}>Boom</Button>













export default class TalkerApp extends React.Component {

    constructor(){
		super()
		this.state = {
		startTalk: Date.now(),
  		speakers: [{name: 'Silence'},{name: 'Conor'},{name: 'Sanj'}]
		}
		}


	startConvo(){
		let end = Date.now()
		let time = Math.floor((end - this.state.startTalk) / 1000)
		alert(time);
		}

	speak(speaker){
		alert(speaker.name);
	}


    render() {


    	return (
        <View title="Talking Stick">
          <Button onTap={this.startConvo}>Start Timer</Button>
          <h1>The Timer Would Go Here</h1>
          {this.state.speakers.map(s => {
            return  <Button onTap={speak(s)}>{s.name}</Button>
          })}
        </View>
        );
    }
}
// function yieldFloor(userA = Silence, userB){
//     let now = Date.now()
//     userA.speeches.push(endSpeech(userA.started, now));
//     AllSpeeches.push({user: userA.name, log: endSpeech(userA.started, now)});
//     userB.setStarted()
// }

// const Silence = new Talker('Silence', true);

// const a = new Talker('Sally');
// const b = new Talker('Bob');


// const speakers = [a, b, Silence];

// const reduceSpeeches = _.reduce((a, b) => a + b.total, 0);