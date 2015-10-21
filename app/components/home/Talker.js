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



// const Clocktick = React.createClass({



// 	getInitialState(){
// 		const date = new Date();
// 		const hours = date.getHours();
// 		const minutes = date.getMinutes();
// 		const seconds = date.getSeconds();
// 		return ({hours, minutes, seconds});
// 	},

// 	render() {
// 		return( <span>
// 			<p>{this.state.hours}:
// 			{this.state.minutes}:
// 			{this.state.seconds}</p>

// 			</span>
// 			)
// 	},

// 	componentDidMount(){
// 		setInterval(this.clock, 1000);
// 	}
// });




class Clock extends React.Component{

	render(){

		let elapsed = Math.round(this.props.elapsed / 100);

		let seconds = parseInt(elapsed /10);
		return <h1>{this.props.speaker} started {seconds} seconds ago</h1>
	}




}

//takes a match, a callback
//returns a function that will do the callback if the input matches match
const onlyIf = _.curry((match, callback) => {
	return _.cond([
		[match, callback],
		[_.T, _.identity]
	]);
});



const speakingLens = _.lensProp('speaking');

		const namelens = _.lensProp('name')
const newNames = _.over(namelens, _.add('hey'))



export default class TalkerApp extends React.Component {

    constructor(){
		super()
		this.state = {
			ticking: true,
			start: Date.now(),
			currentLog: [],
	  		speakers: [{name: 'Silence', speaking: true},{name: 'Conor', speaking: false},{name: 'Sanj', speaking: false}],
	  		elapsed: 0
		}
	}

	componentDidMount(){

		this.timer = setInterval(this.tick, 1000)
	}

	tick(){
		if (this.state.ticking){
			var sinceStart = new Date() - this.state.start;
			var timeonfloor = _.reduce(_.add, sinceStart, this.state.currentLog)

			this.setState({elapsed: timeonfloor});
		}
	}

	restartConvo(){
		this.setState({start: Date.now(), currentLog: [], ticking: true})
	}

	pause(){
		var thislog = new Date() - this.state.start;
		this.setState({currentLog: this.state.currentLog.concat(thislog), ticking: false});
		}
	
	resume(){
		this.setState({start: new Date(), ticking: true});
	}

	speak(speaker){
		const toggleSpeaking = _.over(speakingLens, _.not);

		
		var onlyspeaker = onlyIf(_.equals(speaker))

		var newspeakers = _.map(onlyspeaker(toggleSpeaking))(this.state.speakers);


		this.setState({speakers: newspeakers});
	}

	silence(){
		
		const silenceAll = _.map(_.set(speakingLens, false));

		var newspeakers = silenceAll(this.state.speakers)
		this.setState({speakers: newspeakers});
	}


    render() {

    	let alt = (this.state.ticking)? <Button onTap={this.pause}>Pause</Button> : <Button color="green" onTap={this.resume}>Resume</Button>



    	return (

        <View title="Talking Stick">
          {this.state.speakers.map(s => {

          	let ticker = (s.speaking)? <Clock speaker={s.name} elapsed={this.state.elapsed} /> : '';

            return(<div>
            <Button onTap={this.speak.bind(this, s)}>{s.name}</Button>
    		{ticker}
            </div>
          )})}

          <Button color="red" onTap={this.silence}>Silence</Button>
    	  {alt}
    	  <Button onTap={this.restartConvo}>Restart</Button>

        </View>
        );
    }
}



const get = _.curry((property, object) => object[property]);


const ifSpeaking = (callback) => {
	return _.cond([
  		[get('speaking'), (speaker) => {return callback(speaker)}]
	]);
}

const logIfSpeaking = ifSpeaking((s) => {return s.name});

const returnIfSpeaking = (object) => ifSpeaking((s) => {return object} );

const clockIfSpeaking = returnIfSpeaking(<Clock start={Date.now()} speaker={'Bob'}/>)


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