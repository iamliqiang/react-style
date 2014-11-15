/**
 * @jsx React.DOM
 */
'use strict';

require('normalize.css/normalize.css');

var ReactStyle  = require('react-style');
var React       = require('react');
var Icon        = require('react-fa');
var Button      = require('./Button');
var ButtonGroup = require('./ButtonGroup');

var TextAlignSwitcher = React.createClass({

  render() {
    return (
      <ButtonGroup>
        <Button
          active={this.props.textAlign === 'left'}
          onClick={this.props.onTextAlign.bind(null, 'left')}>
          <Icon name="align-left" /> Left
        </Button>
        <Button
          active={this.props.textAlign === 'center'}
          onClick={this.props.onTextAlign.bind(null, 'center')}>
          <Icon name="align-center" /> Center
        </Button>
        <Button
          active={this.props.textAlign === 'right'}
          onClick={this.props.onTextAlign.bind(null, 'right')}>
          <Icon name="align-right" /> Right
        </Button>
      </ButtonGroup>
    );
  }
});

var Application = React.createClass({

  style: ReactStyle({
    backgroundColor: 'white',
    fontSize: '10pt',
    padding: '1em',
    children: {
      marginRight: '0.5em'
    },
    ':last-child': {
      marginRight: 0
    }
  }),

  render() {
    return ReactStyle.style(this.style,
      <div>
        <h1 styles={ReactStyle({textAlign: this.state.textAlign})}>Application</h1>
        <Button styles={Button.styles.success}>
          <Icon name="cog" /> OK
        </Button>
        <Button styles={Button.styles.error}>
          <Icon name="remove" /> Cancel
        </Button>
        <TextAlignSwitcher
          textAlign={this.state.textAlign}
          onTextAlign={this.onTextAlign}
          />
      </div>
    );
  },

  getInitialState() {
    return {textAlign: 'left'};
  },

  onTextAlign(textAlign) {
    this.setState({textAlign});
  }

});

if (typeof window !== 'undefined') {
  ReactStyle.inject();
  React.render(<Application />, document.getElementById('app'));
}

module.exports = Application;
