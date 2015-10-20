import { Reapp, React, NestedViewList, View, Button } from 'reapp-kit';
// import {Talker} from './Talker.js';






class Home extends React.Component {
  constructor(){
    super()
    this.state = {
      speakers: [{name: 'Silence', start: 0, speeches: []},{name: 'Conor', start: 0, speeches: []},{name: 'Sanj', start: 0, speeches: []}]
    }
  }
  

  render() {
    return (
      <NestedViewList {...this.props.viewListProps}>
        <View title="Talking Stick">
          <Button onTap={() => this.router().transitionTo('sub')}>
            Go to sub view
          </Button>
          <Button onTap={() => this.router().transitionTo('talker')}>
            Go to Talker view
          </Button>
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