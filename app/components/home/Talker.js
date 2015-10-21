import { React, View, Button } from 'reapp-kit';

import * as _ from 'ramda';




class Clock extends React.Component{

	shouldComponentUpdate(){
		return true;
	}

	componentWillRecieveProps(){

	}

	render(){

		let elapsed = Math.round(this.props.elapsed / 100);
		let time = parseInt(elapsed /10);
		let minutes = () => {
			let m = parseInt(time /60)
			return (m > 0)? `${m} minutes and `: '';
		}

		let seconds = time % 60 ;

		return <h3>{this.props.speaker} has held the floor for {this.props.elapsed} seconds</h3>
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
	  		{name: 'Sanj', started: null, currentSpeech: 0, currentLog: [], speaking: false}],
	  		elapsed: 0
		}
	}

	componentDidMount(){

		this.timer = setInterval(this.tick, 1000)
	}

	tick(){



		
		var sinceStart = (new Date() - this.state.started);
		var currentlog = this.state.currentLog
		var newElapsed = _.reduce(_.add, sinceStart, currentlog);
	

		//maps over all the speakers and ticks the ones who are ticking
		let changespeakers = _.map(onlyIf(get('speaking'), addTime), this.state.speakers);
		
		if (this.state.ticking){
			this.setState({elapsed: newElapsed ,speakers: changespeakers});
		}
	}

	// restartConvo(){
	// 	this.setState({started: Date.now(), currentLog: [], ticking: true})
	// }

	// pause(){
	// 	var thislog = new Date() - this.state.start;
	// 	this.setState({currentLog: this.state.currentLog.concat(thislog), ticking: false});
	// 	}
	
	// resume(){
	// 	this.setState({started: new Date(), ticking: true});
	// }

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
        <Clock speaker={"Silence"} elapsed={this.state.elapsed} />


          {this.state.speakers.map(s => {

          	let ticker = (s.speaking)? <Clock speaker={s.name} elapsed={s.currentSpeech} /> : '';

            return(<div>
            <Button onTap={this.speak.bind(this, s)}>{s.name}</Button>
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