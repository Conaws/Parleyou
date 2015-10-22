import { React, View, Button, BackButton } from 'reapp-kit';

import * as _ from 'ramda';

export default class extends React.Component {

  render() {
  	const Child = this.props.child

    return (
      <View {...this.props} title='Production Points'>
       	<Button onTap={() => this.router().transitionTo('/talker')}>Blo</Button>
       	{Child.toString()}
      </View>
      );
  }
}