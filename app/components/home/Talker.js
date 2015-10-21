import { React, View, Button } from 'reapp-kit';

import * as _ from 'ramda';



// ::int -> string
const prettyTime = (timeinSec) => {

	let hours = (timeinSec > 3600)? parseInt(timeinSec / 3600) : 0;
	timeinSec = timeinSec - (hours * 3600);
	let minutes = (timeinSec > 60)? parseInt(timeinSec / 60) : 0;
	let seconds = timeinSec % 60;

	let val = `${seconds} seconds`
	if (minutes > 0) val = `${minutes} minutes`.concat(" ", val);
	if (hours > 0) val = `${hours} hours`.concat(" ", val);
	return val;
}




const divStyle = {

	outline: {
		borderStyle: 'solid',
		borderWidth: 5,
		borderColor: 'green',
		height: 20,
	}
}




class Clock extends React.Component{

	render(){

		return <h3>{this.props.speaker} has held the floor for {prettyTime(this.props.elapsed)}</h3>
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

const namelens = _.lensProp('name');

const newNames = _.over(namelens, _.add('h'));

const addTime = _.over(_.lensProp('currentSpeech'), _.add(1));



//requires calling startSpeaking(Date.now())
const startSpeaking = _.set(_.lensProp('started'));




let logger = (x) => {console.log(x); return x};


export default class TalkerApp extends React.Component {

    constructor(){
		super()
		this.state = {
			ticking: true,
			started: Date.now(),
			currentLog: [],
	  		speakers: [{name: 'Carlos', started: null, currentSpeech: 0, currentLog: [], speaking: false},
	  		{name: 'Conor', started: null, currentSpeech: 0, currentLog: [], speaking: false},
	  		{name: 'Sanj', started: null, currentSpeech: 3700, currentLog: [], speaking: false}],
	  		currentSpeech: 0,
	  		silence: 0
		}
	}

	componentDidMount(){

		this.timer = setInterval(this.tick, 1000)
	}

	tick(){

		let someoneSpeaking = _.any(get('speaking'));

		//should add one to silence or else return the value of silence
		let newSilence = someoneSpeaking(this.state.speakers)? this.state.silence : 1 + this.state.silence 

		//only adds1, the check happens below
		let newElapsed = _.add(1, this.state.currentSpeech)

		//maps over all the speakers and ticks the ones who are ticking
		let changespeakers = _.map(onlyIf(get('speaking'), addTime), this.state.speakers);
		if (this.state.ticking){
			this.setState({currentSpeech: newElapsed ,speakers: changespeakers, silence: newSilence});
		}
	}

	// restartConvo(){
	// 	this.setState({started: Date.now(), currentLog: [], ticking: true})
	// }

	pause(){
		var thislog = new Date() - this.state.start;
		this.setState({currentLog: this.state.currentLog.concat(thislog), ticking: false});
		}
	
	resume(){

		this.setState({started: new Date(), ticking: true});
	}

	speak(speaker){
		const toggleSpeaking = _.over(speakingLens, _.not);

		
		var onlyspeaker = onlyIf(_.equals(speaker))
		
		var speaknow = startSpeaking(new Date());

		var newspeakers = _.map(onlyspeaker(_.compose(logger, toggleSpeaking, speaknow)));
		

		this.setState({speakers: newspeakers(this.state.speakers)});
	}



	// silence(){
		
	// 	const silenceAll = _.map(_.set(speakingLens, false));

	// 	var newspeakers = silenceAll(this.state.speakers)
	// 	this.setState({speakers: newspeakers});
	// }


    render() {

    	let alt = (this.state.ticking)? <Button color="red" onTap={this.pause}>Pause</Button> : <Button color="green" onTap={this.resume}>Resume</Button>



    	return (

        <View title="Talking Stick">
        	<b>Conversation Length: {prettyTime(this.state.currentSpeech)}</b>
        	<b>Time in Silence: {prettyTime(this.state.silence)}</b>

          {this.state.speakers.map(s => {

          	let ticker = (s.speaking)? <Clock speaker={s.name} elapsed={s.currentSpeech} /> : '';

            return(<div>
            <Button onTap={this.speak.bind(this, s)}>{s.name}</Button>
            <div style={Object.assign(divStyle.outline, {height: 25})}>
            	<div style={Object.assign({}, divStyle.outline, {height: "100%", borderColor: 'black', borderWidth: 1, width: "50%"})}></div>
            </div>
    		{ticker}
            </div>
          )})}

        </View>
        );
    }
}



const get = _.curry((property, object) => object[property]);




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