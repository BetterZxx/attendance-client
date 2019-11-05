import React, { Component } from 'react'
import Chart from './components/Chart'
import {connect} from 'dva'
import moment from 'moment'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
@connect(({analysis})=>({
  chartsData:analysis.data
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  componentDidMount(){
    const {dispatch} = this.props
    dispatch({
      type:'analysis/fetch'
    })
  }
  render() { 
    const {chartsData } = this.props
    let dateList = chartsData.map(item=>{
      return moment(item.date).format('MM-DD')
    })
    let hoursList = chartsData.map(item=>{
      return item.totalHourOfOneDay
    })
    return ( 
     
        <div><Chart dateList={dateList} valueList={hoursList} /></div>
     
     );
  }
}
 
export default Analysis;