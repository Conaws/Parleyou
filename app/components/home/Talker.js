import { React, View, Button, BackButton, Modal, Card} from 'reapp-kit';
import divStyle from '../styles.js';

const paint = divStyle.paint;

import * as _ from 'ramda';
import {getLocalJSON, setLocalJSON, addToHistory} from '../simpleStorage';
import {get, onlyIf, logger} from '../../ramdahelpers.js';





const CTG = React.addons.CSSTransitionGroup;



//helpers
const initSpeaker = (speakerName) => ({name: speakerName, started: null, currentSpeech: 0, currentLog: [], speaking: false})
const speakingLens = _.lensProp('speaking');
const namelens = _.lensProp('name');
const newNames = _.over(namelens, _.add('h'));
const addTime = _.over(_.lensProp('currentSpeech'), _.add(1));











const instructions = (speakers) => {
	let nums = _.map(get('currentSpeech'),(speakers));
	if (_.reduce(_.add, 0, nums) == 0)
		return <h1>Click on a Participant To Track The Time They Spend Speaking</h1>
}




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





class Clock extends React.Component{
	render(){
		return <div style={divStyle.bottomSpacing}><b>{this.props.speaker} has held the floor for {prettyTime(this.props.elapsed)}</b></div>
	}
}


export default class TalkerApp extends React.Component {

    constructor(props){
		super(props)
		this.state = _.hasIn("1", getLocalJSON("activeconvo"))? getLocalJSON("activeconvo") : {
			ticking: true,
			started: Date.now(),
			currentLog: [],
	  		speakers: getLocalJSON("activespeakers").map(s => initSpeaker(s)),
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


		// //requires calling startSpeaking(Date.now())
		// 	const startSpeaking = _.set(_.lensProp('started'));

		// //not neccisary for current version		
		// var speaknow = startSpeaking(new Date());

		//silence
		const silenceAll = _.map(_.set(speakingLens, false));
		
		//Only one person can speak at a time now
		var newspeakers = (speaker.speaking)? _.map(onlyspeaker(toggleSpeaking)) :  _.map(_.cond([[_.equals(speaker), _.set(speakingLens, true)],[_.T, _.set(speakingLens, false)]]));


		this.setState({speakers: newspeakers(this.state.speakers)});
	}




	save(){
		addToHistory(this.state);
		this.router().transitionTo('/');
	}


	// silence(){
		
	// 	const silenceAll = _.map(_.set(speakingLens, false));

	// 	var newspeakers = silenceAll(this.state.speakers)
	// 	this.setState({speakers: newspeakers});
	// }


    render() {

    	let alt = (this.state.ticking)? <Button color="red" onTap={this.pause}>Pause</Button> : <Button color="green" onTap={this.resume}>Resume</Button>

    	const percentSpeaking = (speaker) => {
    		return (speaker.currentSpeech > 0)? (speaker.currentSpeech/ this.state.currentSpeech) * 100 : 0;
    	}

    	const backButton =
    	  <BackButton onTap={this.save} />

    	return (

        <View {...this.props} title="Conversation" titleLeft={backButton}>
        <CTG>
        	{instructions(this.state.speakers)}
        	<b>Conversation Length: {prettyTime(this.state.currentSpeech)}</b>
        	<b>Time in Silence: {prettyTime(this.state.silence)}</b>

          {this.state.speakers.map(s => {

          	let ticker = (s.speaking)? <Clock speaker={s.name} elapsed={s.currentSpeech} /> : <div style={{marginBottom: 12}}/>;

            return(<div>
            <Button style={{marginBottom: 10}} onTap={this.speak.bind(this, s)}>{s.name}
            <div style={Object.assign(divStyle.outline, {height: 15, borderRadius: 5, marginTop: 5, marginBottom: 4, minWidth: 70})}>
            	<div style={Object.assign({}, {height: "100%", width: `${percentSpeaking(s)}%`, backgroundColor: (percentSpeaking(s) < 80)? 'green' : 'red'})}></div>
            </div>
            </Button>
    		{ticker}
            </div>
          )})}
          	<br/>
          {alt}
        </CTG>
        </View>
        );
    }
}





