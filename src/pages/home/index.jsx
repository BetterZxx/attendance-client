import {
  Avatar,
  Card,
  Col,
  List,
  Skeleton,
  Row,
  Statistic,
  Button,
  Progress,
  Badge,
  Pagination,
  Radio,
  Icon,
  Descriptions,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import Radar from './components/Radar';
import EditableLinkGroup from './components/EditableLinkGroup';
import ReactPlayer from 'react-player';
import { saveAs } from 'file-saver';
import { Player } from 'video-react';
import aaa from '../../assets/aaa.jpg';
import wolf from '../../assets/wolf.jpg';
import '../../../node_modules/video-react/dist/video-react.css';
import styles from './style.less';
//import { thisExpression } from '@babel/types';
//import e from 'express';

const pageSize = 3;

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.photo} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.name}
          ，祝你开心每一天！
        </div>
        <div>
          大家好，我叫佩奇
          {/* {currentUser.title} |{currentUser.group} */}
        </div>
      </div>
    </div>
  );
};

@connect(({ user: { userInfo, rankUsers } }) => ({
  // currentUser,
  userInfo,
  rankUsers,
  // projectNotice,
  // activities,
  // radarData,
  // currentUserLoading: loading.effects['dashboardWorkplace/fetchUserCurrent'],
  // projectLoading: loading.effects['dashboardWorkplace/fetchProjectNotice'],
  //activitiesLoading: loading.effects['dashboardWorkplace/fetchActivitiesList'],
}))
class Workplace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MediaStream: null,
      statusType: 'all',
      gradeStatus: 0, //0所有，1同级
      punchStatus: 2, //0离线，1在线，2所有
      curPage: 1,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'dashboardWorkplace/init',
    // });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'dashboardWorkplace/clear',
    // });
  }
  ListContent = user => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>状态</span>
        <p>
          <Badge status={user.punch ? 'success' : 'default'} />
          <span>{user.punch ? '打卡中' : '未打卡'}</span>
        </p>
      </div>
      <div className={styles.listContentItem}>
        <span>本周打卡</span>
        <p>{user.weekTime}h</p>
      </div>
      <div className={styles.listContentItem}>
        <span>今日打卡</span>
        <p>{user.todayTime}h</p>
      </div>
      <div className={styles.listContentItem}>
        <div>打卡完成进度</div>
        <Progress
          percent={+((+user.weekTime / 28) * 100).toFixed(2)}
          strokeWidth={6}
          style={{
            width: 180,
          }}
        />
      </div>
    </div>
  );

  renderActivities = (item, index) => {
    return (
      <List.Item key={index}>
        <Row style={{ width: '100%' }}>
          <Col style={{ textAlign: 'center', height: '100%' }} span={1}>
            <span style={{ fontSize: 17 }}>{index + 1}</span>
          </Col>
          <Col span={6}>
            <List.Item.Meta
              style={{}}
              avatar={<Avatar src={item.avatar} />}
              title={
                <span>
                  <a className={styles.username}>{item.name}</a>
                </span>
              }
              description={
                <span className={styles.datetime} title={item.updatedAt}>
                  {item.grade}级
                </span>
              }
            />
          </Col>
          <Col span={17}>{this.ListContent(item)}</Col>
        </Row>
      </List.Item>
    );
  };
  openCamera = () => {
    let constraints = {
      video: { width: 600, height: 400 },
      audio: true,
    };
    let successCb = MediaStream => {
      console.log(MediaStream);
      this.setState({ img: aaa }, () => {
        setTimeout(() => {
          this.setState({ MediaStream });
        }, 50);
      });
    };
    ////////////////////////////////
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // 首先，如果有getUserMedia的话，就获得它
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // 否则，为老的navigator.getUserMedia方法包裹一个Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(successCb)
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
  };
  captureImg = () => {
    let player = document.getElementById('player').childNodes[0];

    let c = document.createElement('canvas');
    c.width = 600;
    c.height = 400;
    var cxt = c.getContext('2d');
    cxt.drawImage(player, 0, 0, 600, 400);
    c.toBlob(blob => {
      saveAs(blob, 'test.png');
    }, 'image/png');
  };
  handleGradeStatusChange = e => {
    this.setState({
      gradeStatus: e.target.value,
    });
  };
  handlePunchStatusChange = e => {
    this.setState({
      punchStatus: e.target.value,
    });
  };
  startPunch = () => {
    const { dispatch, userInfo } = this.props;
    if (userInfo.punch) {
      Modal.success({
        title: '您正在打卡中',
        content: `本次已打卡${'3.2h'}`,
      });
    } else
      dispatch({
        type: 'dashboardWorkplace/startPunch',
        payload: { studentID: userInfo.studentID },
      });
  };

  endPunch = () => {
    const { dispatch, userInfo } = this.props;
    if (!userInfo.punch) {
      Modal.warning({
        title: `${userInfo.name}未开始打卡！`,
        content: '请先开始打卡',
      });
    } else
      dispatch({
        type: 'dashboardWorkplace/endPunch',
        payload: { studentID: userInfo.studentID },
      });
  };
  handleChangePage = page => {
    this.setState({
      curPage: page,
    });
  };
  render() {
    const {
      //projectNotice,
      //projectLoading,
      //activitiesLoading,
      // radarData,
      userInfo,
      rankUsers,
    } = this.props;
    const { gradeStatus, punchStatus, curPage } = this.state;
    let rankStudents = rankUsers
      .filter(item => {
        return gradeStatus === 0 || userInfo.grade === item.grade;
      })
      .filter(
        item =>
          punchStatus === 2 ||
          (punchStatus === 1 && item.punch) ||
          (punchStatus === 0 && !item.punch),
      );
    let pageRankStudents = rankUsers.slice(curPage * pageSize - pageSize, curPage * pageSize);
    console.log(pageRankStudents);
    const headStatus = (
      <span>
        <span>状态 : </span>

        <Badge status={userInfo.punch ? 'success' : 'default'} />
        <span>{userInfo.punch ? '打卡中' : '未打卡'}</span>
      </span>
    );
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <Statistic title="本周打卡" value={userInfo.weekTime} suffix="h" />
        </div>
        <div className={styles.statItem}>
          <Statistic title="团队内排名" value={userInfo.rank} suffix={`/ ${rankUsers.length}`} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="今日打卡" value={userInfo.todayTime} suffix="h" />
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={userInfo} />}
        extra={headStatus}
        extraContent={extraContent}
        breadcrumb={{
          routes: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/',
              breadcrumbName: 'home',
            },
          ],
        }}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{
                marginBottom: 24,
              }}
              title="狼眼识别"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
              <Row>
                <Col span={16}>
                  <div
                    style={{
                      background: `url(${this.state.img}) no-repeat`,
                      backgroundSize: '535px 360px',
                      backgroundColor: '#eee',
                    }}
                  >
                    <ReactPlayer
                      id="player"
                      width="1"
                      playing={true}
                      url={this.state.MediaStream}
                    ></ReactPlayer>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Row type="flex" justify="space-around" style={{ marginTop: 20 }}>
                      <Col span={12} style={{ textAlign: 'center' }}>
                        <Button onClick={this.openCamera} type="primary">
                          启动摄像头
                        </Button>
                      </Col>
                      <Col span={12} style={{ textAlign: 'center' }}>
                        <Button onClick={this.startPunch} type="primary">
                          开始打卡
                        </Button>
                      </Col>
                    </Row>

                    <Descriptions column={1} style={{ marginTop: 20, marginLeft: 15 }}>
                      <Descriptions.Item label="本周打卡">
                        <Statistic value={userInfo.weekTime} suffix="h" />
                      </Descriptions.Item>
                      <Descriptions.Item label="今日打卡">{userInfo.todayTime}h</Descriptions.Item>
                      <Descriptions.Item label="剩余打卡时间">
                        {userInfo.weekLeftTime}h
                      </Descriptions.Item>
                      <Descriptions.Item label="状态">
                        <Badge status={userInfo.punch ? 'processing' : 'default'}></Badge>
                        {userInfo.punch ? '打卡中' : '未打卡'}
                      </Descriptions.Item>
                      <Descriptions.Item label="本次已打卡">3h 30min</Descriptions.Item>
                    </Descriptions>
                    <Button style={{ marginLeft: 15, marginTop: 15 }} onClick={this.endPunch}>
                      停止打卡
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title={
                <div>
                  <Icon type="flag" style={{ marginRight: 15 }} />
                  <span>本周打卡榜</span>
                </div>
              }
              extra={
                <div>
                  <div className={styles.salesCardExtra}>
                    <div className={styles.salesTypeRadio}>
                      <Radio.Group
                        value={this.state.gradeStatus}
                        style={{ marginRight: 20 }}
                        onChange={this.handleGradeStatusChange}
                      >
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>同级</Radio.Button>
                      </Radio.Group>
                      <Radio.Group
                        value={this.state.punchStatus}
                        onChange={this.handlePunchStatusChange}
                      >
                        <Radio.Button value={2}>全部</Radio.Button>
                        <Radio.Button value={1}>打卡中</Radio.Button>
                        <Radio.Button value={0}>离线</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              }
            >
              <List
                renderItem={(item, index) => this.renderActivities(item, index)}
                dataSource={
                  gradeStatus === 0 && punchStatus === 2 ? pageRankStudents : rankStudents
                }
                className={styles.activitiesList}
                size="large"
                footer={
                  gradeStatus === 0 && punchStatus === 2 ? (
                    <Pagination
                      pageSize={pageSize}
                      current={this.state.curPage}
                      onChange={this.handleChangePage}
                      style={{ textAlign: 'right' }}
                      size="small"
                      total={rankUsers.length}
                    />
                  ) : (
                    ''
                  )
                }
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
              {/* <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} /> */}
            </Card>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="公告"
            >
              <div className={styles.chart}>
                {/* <Radar hasLegend height={343} data={radarData} /> */}
              </div>
            </Card>
            <Card
              bodyStyle={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
              bordered={false}
              title="团队"
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {/* {projectNotice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))} */}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
