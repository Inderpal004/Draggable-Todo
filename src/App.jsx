import { useState } from 'react'
import './App.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleSubmit = () => {
    if (editId) {
      const editTodo = todos.find((item) => item.id === editId);
      const updateTodos = todos.map((item) => (
        item.id === editTodo.id ? { id: item.id, todo: todo } : { id: item.id, todo: item.todo }
      ))
      setTodos(updateTodos);
      setTodo("");
      setEditId(null);
      return;
    }

    if (todo !== "") {
      setTodos([...todos, {
        id: Date.now(),
        todo: todo
      }]);
      setTodo("");
    }
  };

  const handleDlt = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
  };

  const handleEdit = (id) => {
    const editTodo = todos.find((item) => item.id === id);
    setTodo(editTodo.todo);
    setEditId(id);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    let add,
      active = todos,
      complete = completedTodos;

    if (source.droppableId === "activeTodos") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === "activeTodos") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='container'>
        <div className="banner">
          <h1 className='heading'>TODO</h1>
          <div className="input-box">
            <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} className='input' placeholder='Todo' />
            <button onClick={handleSubmit} className='submit'>{editId ? "Edit" : "Add"}</button>
          </div>
        </div>

        <div className="todo-container">
          <div className="todos-wrapper red">
            <h1 className="todos-heading">To Do:</h1>
            <Droppable droppableId='activeTodos'>
              {(provided) => (
                <div className="todo-list" ref={provided.innerRef} {...provided.droppableProps}>
                  {todos.length ? todos.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div className="todo" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} key={item.id} id={item.id}>
                          <p className='todo-name'>{item.todo}</p>
                          <div className="btns">
                            <button onClick={() => handleEdit(item.id)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDlt(item.id)} className="dlt-btn">Delete</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )) : <p className="no-todo">No Todos to Display.</p>}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="todos-wrapper green">
            <h1 className="todos-heading">Completed:</h1>
            <Droppable droppableId='removeTodos'>
              {(provided) => (
                <div className="todo-list" ref={provided.innerRef} {...provided.droppableProps}>
                  {completedTodos.length ? completedTodos.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div className="todo" ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} key={item.id} id={item.id}>
                          <p className='todo-name'>{item.todo}</p>
                        </div>
                      )}
                    </Draggable>
                  )) : <p className="no-todo">No Todos to Display.</p>}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

export default App;
