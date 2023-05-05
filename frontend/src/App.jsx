import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState();
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("error:", err));
  };

  const completeTodo = async id =>{
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json());
      
    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id){
        todo.complete = data.complete;
      }
      return todo;
    }))
  }

  const delteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE"
    }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("")
  }

  return (
    <div className="app">
      <h1>My todos</h1>
      <div className="todos">
      {todos?.map(todo => (
        <div className={"todo " + (todo.complete ? "complete" : "")} key={todo._id}>
          <div className="flex1" onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
          </div>
          <div className="delete-todo" onClick={() => delteTodo(todo._id)}>x</div>
        </div>
      ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add todo</h3>
            <input type="text" className="add-todo" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
            <div className="button" onClick={addTodo}>Create todo</div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default App;
