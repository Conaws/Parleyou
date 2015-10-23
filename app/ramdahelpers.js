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

export default {get, onlyIf, logger, assign, paint}