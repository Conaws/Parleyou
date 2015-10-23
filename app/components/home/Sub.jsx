import { React, View, Button, BackButton } from 'reapp-kit';
import divStyle from '../styles';
import * as _ from 'ramda';
import {getLocalJSON, setLocalJSON} from '../simpleStorage';






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