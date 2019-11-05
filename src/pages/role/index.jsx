import React, { Component,Fragment } from 'react'
import {Card,Table,Button,Select,Divider,Popconfirm,Modal} from 'antd'
import {connect} from 'dva'
import moment from 'moment'
import {PageHeaderWrapper} from '@ant-design/pro-layout'
const {Option} = Select
@connect(({role})=>({
  roleList:role.data
}))
class Role extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      mVisible:false,
      role:3
     }
  }
  componentDidMount(){
    const {dispatch} = this.props
    dispatch({
      type:'role/fetch'
    })
  }
  columns = [
    {
      title:'学号',
      dataIndex:'studentID'
    },
    {
      title:'姓名',
      dataIndex:'name'
    },
    {
      title:'性别',
      dataIndex:'sex',
      render(sex) {
        return (
           sex===1?'男':'女'
        );
      }
    },
    {
      title:'申请时间',
      dataIndex:'createTime',
      render:(time)=>{
        return moment(time).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title:'角色',
      dataIndex:'userRole',
      render:(role)=>{
        switch (role) {
          case 1 :
            return '管理员'
          case 2 : 
            return '普通用户'
          case 3 :
            return '未注册'
        }
      }
    },
    {
      title:'操作',
      render:(stu)=>{
        return <Fragment>
           <a onClick={()=>this.showModal(stu.studentID)}>修改角色</a>
           <Divider type="vertical" />
           <Popconfirm placement="topLeft" title={`确认删除该用户?`} onConfirm={()=>this.handleDelete(stu.studentID)} okText="确认" cancelText="取消">
              <a style={{color:'red'}}>删除</a>
          </Popconfirm> 
        </Fragment>

      }
    }
  ]
  handleUpdate = ()=>{
    const {dispatch} = this.props
    const {studentID,role} = this.state
    dispatch({
      type:'role/update',
      payload:{
        userId:studentID,
        userRole:role
      }
    })
    this.setState({
      mVisible:false
    })
  }
  showModal = (id)=>{
    this.setState({
      mVisible:true,
      studentID:id
    })
  }
  hideModal = ()=>{
    this.setState({
      mVisible:false
    })
  }
  handleDelete = (id)=>{
    console.log(id)
    const {dispatch} = this.props
    dispatch({
      type:'role/delete',
      payload:{
          userId:id
      }
    })

  }
  onSelectChange = (value)=>{
    this.setState({
      role:value
    })

  }
  render() { 
    const {roleList} = this.props
    const {mVisible,role} = this.state
    return (  
    <PageHeaderWrapper>
      <Card
      title='用户管理'
      >
        <Modal
        visible={mVisible}
        onCancel={this.hideModal}
        onOk={this.handleUpdate}
        title="修改角色"
        width='400px'
        >
          <Select
          value={role}
          style={{width:'100%'}}
          onChange={this.onSelectChange}
          >
            <Option value={1}>管理员</Option>
            <Option value={2}>普通用户</Option>
            <Option value={3}>未注册</Option>
          </Select>


        </Modal>
        <Table
        columns={this.columns}
        dataSource={roleList}
        rowKey={(item,key)=>key}
        >

        </Table>

      </Card>
    </PageHeaderWrapper>
     );
  }
}
 
export default Role;