import { Reapp, React, NestedViewList, View, Button, Container } from 'reapp-kit';
// import {Talker} from './Talker.js';
import {getLocalJSON, setLocalJSON, logger} from './simpleStorage';
import {paint, center, centerDiv, hero, border} from './styles';

import Conversation from './home/Sub';
import * as _ from 'ramda';


class Home extends React.Component{
  constructor(props){
    super(props)
  }

  render() {
    return (
      <NestedViewList {...this.props.viewListProps}>
        <View title="Welcome To Parley">
          <div style={paint(centerDiv, hero)}>
          <b >Speak Less</b>
          <b >Say More</b>
          </div>
          <div style={centerDiv}>
          <p style={center}>Track your speaking habits and use hard data to improve your soft skills</p>
          
          
          <Button onTap={() => this.router().transitionTo('convo')}>
            New Conversation
          </Button>
          </div>
          {/*<Button onTap={() => this.router().transitionTo('sub')}>
            Histories
          </Button>*/}
        </View>
        {this.props.child()}
      </NestedViewList>
    );
  }
}







export default Reapp(Home);

/*
 This is your root route. When you wrap it with Reapp()
 it passes your class two properties:

  - viewListProps: Passes the scrollToStep to your ViewList so it animates
  - child: The child route
*/