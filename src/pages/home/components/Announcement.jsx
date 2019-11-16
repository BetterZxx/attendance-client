import { Card, Col, Icon, Row, Table, Tooltip,List,Pagination } from 'antd';
import React from 'react';
import styles from '../style.less';
import moment from 'moment';

// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.',
// ];

const Announcement = ({ loading,data, dropdownGroup,handleView }) => (

    <List
      renderItem={item => (
        <List.Item>
          <div style={{width:'100%'}}>
            <Icon style={{marginRight:12,fontSize:13}} type='right'></Icon>
            <span onClick={()=>handleView(item.id)} className={styles.announceListSpan}>{item.title}</span>
            <span style={{float:'right'}}>{moment(item.publishTime).format('YYYY-MM-DD')}</span>
          </div>
        </List.Item>
      )}
      dataSource={data}
      pagination={{
        onChange: page => {
          console.log(page);
        },
        size:'small'
        ,
        pageSize: 6,
      }}
    
    >

    </List>
    

);

export default Announcement;
