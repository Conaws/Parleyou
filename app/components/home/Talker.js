import { React, View, Button, BackButton, Modal, Card} from 'reapp-kit';
import divStyle, {paint} from '../styles';

require('velocity-animate/velocity.ui');

import {VelocityTransitionGroup, velocityHelpers} from 'velocity-react';

import * as _ from 'ramda';
import {getLocalJSON, setLocalJSON, addToHistory} from '../simpleStorage';
import {get, onlyIf, logger, prettyTime} from '../../ramdahelpers.js';
import {speakers, tickers} from './convo/Transition'


console.log(Velocity.RegisterEffect);



//helpers
const initSpeaker = (speakerName) => ({name: speakerName, started: null, currentSpeech: 0, currentLog: [], speaking: false})
const speakingLens = _.lensProp('speaking');
const namelens = _.lensProp('name');
const newNames = _.over(namelens, _.add('h'));
const addTime = _.over(_.lensProp('currentSpeech'), _.add(1));



class Clock extends React.Component{
  render(){
    return <div style={divStyle.bottomSpacing}><b>{this.props.speaker} has held the floor for {prettyTime(this.props.elapsed)}</b></div>
  }
}





const instructions = (speakers) => {
	let nums = _.map(get('currentSpeech'),(speakers));
	if (_.reduce(_.add, 0, nums) == 0)
		return <p>Click on a Participant To Track The Time They Spend Speaking</p>
}




// ::int -> string




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

    

    	const backButton =
    	  <BackButton onTap={this.save} />

    	return (

        <View {...this.props} title="Conversation" titleLeft={backButton}>

	    	
	    	<div style={divStyle.centerDiv}>
	    	<b>Conversation Length: {prettyTime(this.state.currentSpeech)}</b>
	    	<b>Time in Silence: {prettyTime(this.state.silence)}</b>
	    	{instructions(this.state.speakers)}
	    	</div>

	      {this.state.speakers.map(s => {
	      	return <Speaker total={this.state.currentSpeech} speak={this.speak} s={s} count={this.state.speakers.length}/>
	      	})}
          	<br/>
          {alt}
        </View>
        );
    }
}







class Speaker extends React.Component{



	render(){
	let total = this.props.total;
	let s = this.props.s;
	
	const perc = (a, b) =>  (a > 0)? (a/b) * 100 : 0;
	

	
	

	//let ticker = (s.speaking)? <Clock speaker={s.name} elapsed={s.currentSpeech} /> : <div style={{marginBottom: 12}}/>;

	        return(<div style={{marginBottom: 10}}>
		        <Button style={{height: `${(400/this.props.count)}`}} onTap={this.props.speak.bind(this, s)}>
		        {s.name}
		        <div 
		        	style={Object.assign(
		        		divStyle.outline, 
		        		{height: 15, 
	        			borderRadius: 5, 
	        			marginTop: 5, 
	        			marginBottom: 4, 
	        			minWidth: 70})}>
		        	<div style={Object.assign({}, 
		        		{height: "100%", 
		        		width: `${perc(s.currentSpeech, total)}%`, 
		        		backgroundColor: (perc(s.currentSpeech, total) < 80)? 'green' : 'red'})}>
		        	</div>
		        </div>
		        <div style= {{margin: 2, borderRadius: 5, padding: 5, color: (s.speaking)? 'red' : null }}>
		        	{prettyTime(s.currentSpeech)}
		        </div>
		        </Button>
            </div>
          );
	}
}



