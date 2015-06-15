/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var TodoBox = React.createClass({
  getInitialState: function(){
    return{
      data: []  
    };
  },

  handleTodoSubmit: function(todo){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      chache: false,
      success: function(data){
        this.setState({data: data}); 
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className='todo-box'>
        <TableTitle />
        <TodoTable todos = {this.state.data} />
        <TodoForm onTodoSubmit={this.handleTodoSubmit}/>
      </div>
    );
  }
});  

var TableTitle = React.createClass({
  render: function() {
    return (
      <h2> My Todo list </h2>
    );
  }
});  

var TodoTable = React.createClass({
  render: function() {
    var todos = [];
    this.props.todos.forEach(function(todo){
      todos.push(<TodoRow content={todo.content} deadline={todo.deadline} />)  
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Action</th> 
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {todos}
        </tbody>
      </table> 
    );
  }
});  

var TodoRow = React.createClass({
  getInitialState: function(){
    return{
      rowStyle: {backgroundColor: 'white'}
    };
  },

  handleChange: function(){
    var checkbox = this.refs.statusCheckBox.getDOMNode().checked
    if (checkbox){
      this.setState({
        rowStyle: {backgroundColor: 'green'}
      });
    }else{
      this.setState({
        rowStyle: {backgroundColor: 'white'}
      });
    }
  },
  render: function() {
    return (
      <tr style={this.state.rowStyle}>
        <td>
          <input
           type='checkbox'
           ref='statusCheckBox'
           onChange={this.handleChange}
          />
        </td>
        <td>{this.props.content}</td>
        <td>{this.props.deadline}</td>
      </tr>
    );
  }
});  

var TodoForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var content = React.findDOMNode(this.refs.todoContent).value.trim() 
    var deadline = React.findDOMNode(this.refs.todoDeadline).value.trim() 

    if (!content || !deadline){
      return;
    }

    this.props.onTodoSubmit({content: content, deadline: deadline});
    React.findDOMNode(this.refs.todoContent).value = "";
    React.findDOMNode(this.refs.todoDeadline).value = "";
  },
  render: function() {
    return (
      <form className='todos-form' onSubmit={this.handleSubmit}>
        <input type='text' ref='todoContent' placeholder='Your Todo' />
        <input type='text' ref='todoDeadline' placeholder='Deadline' />
        <input type='submit' />
      </form>
    );
  }
});  

React.render(<TodoBox url="todos.json" pollInterval={2000} />, document.getElementById('content') )