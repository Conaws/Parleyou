import React from 'react';
import * as _ from 'ramda';
import divStyle, {paint} from '../../styles';
import {getLocalJSON, setLocalJSON, logger} from '../../simpleStorage';

import {Motion, spring, TransitionMotion} from 'react-motion';
require('velocity-animate/velocity.ui');

import {VelocityTransitionGroup} from 'velocity-react';
import {prettyTime} from '../../../ramdahelpers';




//:: takes this.state.blocks 
const getStyles = function(blocks) {

    let configs = {};
    //or blocks.keys.map
    Object.keys(blocks).forEach(key => {
      configs[key] = {
        opacity: spring(1, [50, 10]),
        height: spring(20),
        text: blocks[key] // not interpolated

      };
    });
    return logger(configs);
}

const willEnter = function(inputText) {
    return {
      opacity: 0,
      width: 0,
      height: 0, // start at 0, gradually expand
      text: inputText // this is really just carried around so
      // that interpolated values can still access the text when the key is gone
      // from actual `styles`
    };
  }



const willLeave = function(key, style) {
  return {
    opacity: spring(0, [100, 10]), // make opacity reach 0, after which we can kill the key
    text: style.text,
    height: spring(0, [100, 15])
  };
}


export const speakers = (speakers, that) => { 
      logger(speakers);
      logger(that);
      return <TransitionMotion
        styles={getStyles(speakers)}
        willEnter={willEnter}
        willLeave={willLeave}>
        {interpolatedStyles =>
          <div>
            {Object.keys(interpolatedStyles).map(key => {
              const {text, ...style} = interpolatedStyles[key];
              return (
                <div style={style} onClick={that.addSpeaker.bind(event, text, text)}>
                  {text}
                </div>
              );
            })}
          </div>
        }
      </TransitionMotion>
}

export const tickers = (speaking, name, time) => { 
      return 
      <Motion 
          defaultStyle={{x: 10, z: 0}} 
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
              return(<div style={viz}>
                <p>{name} has held the floor for {prettyTime(time)}</p>
                </div>)}}
        </Motion>  
}



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



