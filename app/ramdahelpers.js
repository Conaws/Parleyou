import * as _ from 'ramda';



const get = _.curry((property, object) => object[property]);

//takes a match, a callback
//returns a function that will do the callback if the input matches match
const onlyIf = _.curry((match, callback) => {
	return _.cond([
		[match, callback],
		[_.T, _.identity]
	]);
});


const assign = _.curry((a, b) => Object.assign(a, b));

const paint = _.reduce(assign(), {}); 


const logger = (x) => {console.log(x); return x};

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



export default {get, onlyIf, logger, assign, paint, prettyTime}