import { React, View, Button, BackButton } from 'reapp-kit';

import * as _ from 'ramda';


const storageSetter = _.curry(function(key, value){ return localStorage[key] = value });
const storageGetter = _.curry(function(key){return localStorage[key] || "[]"});
// setLocalJSON("Brave New World")({brave: "new world"});
const setLocalJSON = (term) => {return _.compose(storageSetter(term), JSON.stringify)}
const getLocalJSON = _.compose( JSON.parse, storageGetter);





export default class extends React.Component {
	constructor(props){
		super(props)
    this.state = {
      history: getLocalJSON("History")
    }
	}


  render() {

    const backButton =
      <BackButton onTap={() => window.history.back()} />
    const Child = this.props.child;

    return (
      <View {...this.props} title='Historical Record' titleLeft={backButton}>
        {this.state.history.map((h, index) => {
          return <Button onTap={() => this.router().transitionTo('/talker')}>Hey</Button>

        })}
       	
       	
      </View>
    );
  }
}