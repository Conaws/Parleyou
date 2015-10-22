import { React, View, Button, BackButton } from 'reapp-kit';

import * as _ from 'ramda';

export default class extends React.Component {
	constructor(props){
		super(props)
	}


  render() {

    const backButton =
      <BackButton onTap={() => window.history.back()} />
    const Child = this.props.child;

    return (
      <View {...this.props} title='Production Points' titleLeft={backButton}>
       	<Button onTap={() => this.router().transitionTo('/talker')}>Boo</Button>
       	{Child && Child.toString()}
      </View>
    );
  }
}