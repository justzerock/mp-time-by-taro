// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './MyCounter.scss'
/**
 * Shows a number value changing over time. The goal is to visualize
 * data changing over time.
 */
class MyCounter extends Component {
  static commas(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  static defaultProps = {
    commas: true,
    timeout: 500,
    steps: 10
  }
  
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      targetValue: props.value,
      originalValue: props.value,
      currentValue: props.value
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentStep: 0,
      originalValue: this.state.currentValue || 0,
      targetValue: nextProps.value || 0
    });
    clearInterval(this._interval);
    this._interval = setInterval(()=>{
      if (this.state.currentStep >= this.props.steps) {                       
        clearInterval(this._interval);
      }
      this.setState({
        currentValue: this.getValue(this.state.currentStep / this.props.steps),
        currentStep: this.state.currentStep + 1
      });
    }, this.props.timeout / this.props.steps);
  }

  componentWillUnmount(){
    clearInterval(this._interval);
  }

  getValue(percent) {
    const diff = this.state.targetValue - this.state.originalValue;
    return (diff * percent) + this.state.originalValue;
  }

  render() {
    let value = Math.floor(this.state.currentValue * 10) / 10;
    if (this.props.commas) {
      value = MyCounter.commas(value);
    }
    return (
      <View className='my-counter'>
        {value}%
      </View>
    );
  }
}

export default MyCounter as ComponentType
