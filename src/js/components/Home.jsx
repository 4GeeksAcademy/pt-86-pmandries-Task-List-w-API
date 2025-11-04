import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	
	const [tasks, setTasks] = useState([]);
	const [userInput, setUserInput] = useState("");

	useEffect(() => {
		getUserData()
	}, []); // This should only run once w/ empty array

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
			setUserInput("")
		};

	const markAsDone = (index) => {
		let updatedList = tasks.map((task, i) => {
			if (i == index) {
				return {label: task.label, is_done: !task.is_done}
			}
			else return task;
		})
		setTasks(updatedList)
	}

	const deleteTask = (index) => {
		let updatedList = tasks.filter((task, i) => {
			if (i !== index) {
				return {label: task.label, is_done: task.is_done}
			}
		})
		setTasks(updatedList)
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
								() => markAsDone(index)
							}
						/>
  						<label 
							className = {
								task.is_done ? "crossedOut form-check-label": "form-check-label" 
							}
							htmlFor="checkDefault">
    						{task.label}
  						</label>
						<span onClick = {() => deleteTask(index)}>
							&#x2612;
						</span>
					</div>
					)
				}
			</div>
			<div className = "text-center">
				<button className = "mt-5">Delete All</button>
			</div>
		</div>
	);
};

export default Home;