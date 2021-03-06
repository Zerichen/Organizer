import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap';
import Change from './Change';
import '../../css/TimeBlock.css';

class TableContent extends Component {
  constructor(props){
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.state = {
      task: props.task,
      isStarted: props.task.starttime !== "" ? true : false,
      isDone: props.task.state
    };
  }

  handleStart = () => {
    this.setState({isStarted: true}); 

    // set starttime
    const date = new Date().getDate(); //Current Date
    const month = new Date().getMonth() + 1; //Current Month
    const year = new Date().getFullYear(); //Current Year
    const hours = new Date().getHours(); //Current Hours
    const min = new Date().getMinutes(); //Current Minutes
    const starttime = year+"-"+month+"-"+date+"T"+hours+":"+min;
    fetch('/task', {
      method: 'PUT',
      body: JSON.stringify({
        _id: this.state.task._id,
        starttime: starttime
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
		.then((data) => console.log(data))
    .catch((err)=>console.log(err))
  }

  handleUpdate(updateInfo) {
    this.setState({
      task: updateInfo
    });

    this.props.handleUpdate(updateInfo);
  }

  handleSave(saveInfo) {
    this.props.handleSave(saveInfo);
  }
  
  handleDone = () => {
    this.setState({isDone: true});

    //set finishtime
    const date = new Date().getDate(); //Current Date
    const month = new Date().getMonth() + 1; //Current Month
    const year = new Date().getFullYear(); //Current Year
    const hours = new Date().getHours(); //Current Hours
    const min = new Date().getMinutes(); //Current Minutes
    const finishtime = year+"-"+month+"-"+date+"T"+hours+":"+min;
    fetch('/task', {
      method: 'PUT',
      body: JSON.stringify({
        _id: this.state.task._id,
        state: true,
        finishtime: finishtime
      }), 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
		.then((data) => console.log(data))
    .catch((err)=>console.log(err))
  }

  render() {
    let duetime = this.props.task.duetime.slice(11,16);
    const h = parseInt(duetime.slice(0,2));
    let indicator = 'AM';
    if (h >= 12) {
      if (h !== 12)
        duetime = (h-12).toString() + ':' + duetime.slice(3,5);
      indicator = 'PM';
    }
    const user = this.state.task.user;
    return (
      <Row 
        bsPrefix={this.state.isDone ? "row done" : "row"} 
        style={{ textAlign: 'center' }}
      >
          <Col>
            <p ref='Subject'>{this.state.task.classname}</p>
          </Col>
          <Col>
            <p ref='Name'> {this.state.task.name}</p>
          </Col>
          <Col>
            <p ref='Duetime'> { duetime } { indicator } </p>
          </Col>
          <Col>
            <p ref='Estimated'> {this.state.task.predictiontime} Hours</p>
          </Col>
          <Col>
            {this.state.task.tag.map((tag, i) => 
              <font 
                key={i}
                ref='Tag' 
                color={tag.color}
              > 
                {tag.name} &nbsp;
              </font>
            )}
          </Col>
          <Col>
            <Button 
              variant="light" 
              size="sm" 
              disabled={this.state.isStarted || this.state.isDone} 
              onClick={this.handleStart}
            >
              <ion-icon name="arrow-dropright-circle"></ion-icon>
            </Button> 
            <Button 
              variant="light" 
              size="sm" 
              disabled={this.state.isDone} 
              onClick={this.handleDone}
            >
              <ion-icon name="checkmark-circle-outline"></ion-icon>
            </Button> 
            <Change 
              disabled={this.state.isDone}
              user={user} 
              task={this.state.task}
              handleUpdate={this.handleUpdate}
              handleSave={this.handleSave}
            />
            <Button 
              variant="light" 
              size="sm" 
              disabled={this.state.isDone} 
              onClick={this.props.handleDelete}
            >
              <ion-icon name="trash"></ion-icon>
            </Button>
          </Col>
      </Row>
    )
  }

}

export default TableContent;