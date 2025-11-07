import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";

const Home = () => {
	
	const [tasks, setTasks] = useState([]);
	const [userInput, setUserInput] = useState("");

	useEffect(() => {
		getUserData()
	}, []);

	async function getUserData () {
		let response = await fetch("https://playground.4geeks.com/todo/users/pmandries");
		let data = await response.json();
			if (data.detail?.includes("doesn't exist")) {
				createUser()
			} else {
				setTasks(data.todos);
			}
	}

	async function createUser () {
		let postResponse = await fetch("https://playground.4geeks.com/todo/users/pmandries", {
			method: "POST",
			headers: {"Content-type": "application/json"}
		})
		let postData = await postResponse.json()
	}
	
	const addToList = async (task) => {
		let newTask = {label: task, is_done: false}
		let response = await fetch("https://playground.4geeks.com/todo/todos/pmandries", {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(newTask)
		});
		let data = await response.json()
			getUserData();
			setUserInput("");
		};

	const markAsDone = async (task) => {
		let putResponse = await fetch("https://playground.4geeks.com/todo/todos/" + task.id, {
    		method: "PUT",
    		headers: { "Content-type": "application/json" },
    		body: JSON.stringify({ 
        	label: task.label,
        	is_done: !task.is_done
    		})
		})
		let putData = await putResponse.json()
		getUserData();
	}

	const deleteTask = async (id) => {
		let deleteResponse = await fetch("https://playground.4geeks.com/todo/todos/" + id, {
			method: "DELETE"
		})
		getUserData();
	}

	const deleteAll = async () => {
		let deleteAllResponses = await fetch("https://playground.4geeks.com/todo/users/pmandries", {
    		method: "DELETE",
			headers: { "accept": "application/json" }
    		})
		createUser();
		getUserData();
	}

	return (
		<div className="container bg-light">
			<div className = "text-center">
				<h1>Task List</h1>
			</div>
			<div className = "text-center mb-3">
				<input 
					type = "text"
					placeholder = "Add a task here"
					onChange = {(e) => setUserInput(e.target.value)}
					value = {userInput} 
					onKeyDown = {(e) => {
						if (e.key === 'Enter' || e.type ==  'Click') {
							addToList(userInput)
						}
					}
					}
				/>
				<button onClick = {() => addToList(userInput)}>Add to List</button>
			</div>
			<div>
				{tasks.map((task, index) => 
					<div key = {index} className="form-check fs-4 d-flex">
  						<input 
							className = "form-check-input me-2" 
							type="checkbox" 
							value="" 
							id="checkDefault" 
							onChange = {
								() => markAsDone(task)
							}
							checked = {task.is_done}
						/>
  						<label 
							className = {
								task.is_done ? "crossedOut form-check-label": "form-check-label" 
							}
							htmlFor="checkDefault">
    						{task.label}
  						</label>
						<span onClick = {() => deleteTask(task.id)}>
							&#x2612;
						</span>
					</div>
					)
				}
			</div>
			<div className = "text-center">
				<button className = "mt-5" onClick = {() => deleteAll()}>Delete All</button>
			</div>
		</div>
	);
};

export default Home;