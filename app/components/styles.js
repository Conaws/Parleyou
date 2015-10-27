import {curry, reduce, compose, map, flatten} from 'ramda';

var assign = curry((a, b) => Object.assign(a, b));




let paint = (...styles) => reduce(assign(), {})(styles);

const divStyle = {
  border:  {
    borderStyle: 'solid',
    borderWidth: 1
  },
  outline: {
  	borderStyle: 'solid',
  	borderWidth: 1,
  	//borderColor: 'blue',
  	height: 20,
  	marginBottom: 10
  },

  bottomSpacing: {
  	marginBottom: 10
  },

  hidden: {
    display: 'none'
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  centerDiv: {
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  badCentering: {
    // position: "absolute",
    // width: 30,
    // height: 20,
    // top: "50%",
    // left: "50%",
    // marginLeft: -15, /* Negative half of width. */
    // marginTop: -10 /* Negative half of height. */
  },
  hero: {
    fontSize: 35, 
    marginTop: 20, 
    marginBottom: 20
  },

  paint: (...styles) => reduce(assign(), {})(styles)
}

//var colors = [{blue: "blue"}, {red: "greeen"}],
//paint(colors),


export default divStyle;