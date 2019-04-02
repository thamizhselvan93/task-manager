import React, { Component } from 'react';
import List from './List';
import Modal from 'react-modal';
import Card from './Card';
import { db } from '../firebase';
import { Wrapper, BoardWrapper, SingleLineInput, MultiLineInput, AddComment, CloseIcon } from './styles';

const customStyles = {
  content : {
    overflow: 'hidden',
    margin: '6%',
    border: 'none',
  }
};

export default class Board extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      todo: [], 
      wip: [],
      comp: []
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(task) {
    console.log('task', task)
    this.setState({modalIsOpen: true});
  }
  
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    db.collection('tasks').where('status', '==', 'todo')
    .onSnapshot((querySnapshot) => {    
      this.setState({ todo: []});
      querySnapshot.forEach((doc) => {
        this.setState({
          todo: [...this.state.todo, doc.data() ],
        });
      });
    });
    db.collection('tasks').where('status', '==', 'wip')
    .onSnapshot((querySnapshot) => {    
      this.setState({ wip: []});
      querySnapshot.forEach((doc) => {
        this.setState({
          wip: [...this.state.wip, doc.data() ],
        });
      });
    });
    db.collection('tasks').where('status', '==', 'comp')
    .onSnapshot((querySnapshot) => { 
      this.setState({ comp: []});   
      querySnapshot.forEach((doc) => {
        this.setState({
          comp: [...this.state.comp, doc.data() ],
        });
      });
    });
  }

  render() {
    console.log('this.state board', this.state);
    return (
        <BoardWrapper>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            ariaHideApp={false}
          >
            <Card closeModal={this.closeModal} status={this.props.cat} />
          </Modal>
          <p> Task board </p>
          <List title="To do" tasks={this.state.todo} cat="todo" openModals={this.openModal} />
          <List title="Work in Progress" tasks={this.state.wip} cat="wip" openModals={this.openModal}/>
          <List title="Completed" tasks={this.state.comp} cat="comp" openModals={this.openModal}/>
        </BoardWrapper>
    );
  }
}