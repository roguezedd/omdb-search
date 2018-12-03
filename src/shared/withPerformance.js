import React from 'react';


function withPerformance(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.startMark = `startMount_${props.id}`;
      this.endMark = `endMount_${props.id}`;
      this.measureName = `measure_${props.id}`;
    }

    componentWillMount() {
      console.log('withPerformance will mount');
      if (typeof window !== 'undefined' && window.performance) {
        performance.mark(this.startMark);
      }
    }

    componentDidMount() {
      console.log('withPerformance did mount');
      performance.mark(this.endMark);
      performance.measure(this.measureName, this.startMark, this.endMark);
    }

    render() {
      return (<WrappedComponent {...this.props}/>);
    }
  };
}

export default withPerformance;