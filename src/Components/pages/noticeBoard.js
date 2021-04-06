import React, {useEffect, useState} from 'react'
import Amplify, {API, graphqlOperation} from 'aws-amplify'
import awsExports from "./aws-exports";
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import {Auth} from 'aws-amplify';
import styles from './App.css';

// GRAGH QL RELATED
import {updateTodo, updateUser} from './graphql/mutations'
import {listTodos,listUsers} from './graphql/queries'

// Pages
import {Route, BrowserRouter as Router, Switch, Link} from "react-router-dom"
import noticeBoard from "./pages/noticeBoard";
import profile from "./pages/Profile";

// Tabs
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// Menu
/*import { slide as Menu } from 'react-burger-menu'*/

Amplify.configure(awsExports);

const initialState = {course: '', username: '', email: ''}

const App = () => {
    const [formState, setFormState] = useState(initialState)
    const [names, setNames] = useState([])
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState([])
    /*
        const [searches, setSearches] = useState([])
    */

    useEffect(() => {

        fetchEvents()
        fetchUsers()
        // setFormState(users[0]) dont leave that in loool il submit some code that dont even work lol ahhaha
    }, [])

    function setInput(key, value) {
        setFormState({...formState, [key]: value})
    }

    async function addEvents() {
        try {
            if (!formState.name || !formState.description) return
            const name = {...formState}
            //setNames([...names, name])
            setFormState(initialState)
            await API.graphql(graphqlOperation(updateTodo, {input: {course: name.course, id: ""}, condition: {name: {contains:name.name}} }))
        } catch (err) {
            console.log('error creating event:', err)
        }
    }

    async function fetchEvents() {
        try {
            const todoData = await API.graphql(graphqlOperation(listTodos))
            const todos = todoData.data.listTodos.items
            setNames(todos)
        } catch (err) {
            console.log('error fetching events')
        }
    }

    async function fetchUsers() {
        //while (users.length<1) {
        try {
            let auth = await Auth.currentUserInfo();
            let user = auth.attributes.sub.toString();
            //alert(user)
            const userData = await API.graphql(graphqlOperation(listUsers, {filter: {id: {eq: user}}}))
            const userItems = userData.data.listUsers.items;
            setUsers(userItems)
        } catch (err) {
            console.log('error fetching todos')
        }
        //}

    }

    async function Search() {
        try {

            const search = formState.course
            setFormState(initialState)
            //const result = await API.graphql(graphqlOperation(listUsers,{filter:{course_contains:search}}))
            const result = await API.graphql(graphqlOperation(listUsers,{filter: {course: {contains: search}}}))
            const user = result.data.listUsers.items
            setSearch(user)
        } catch (err) {
            console.log('error creating event:', err)
        }
    }

    async function updateUserF() {
        try {
            let user = await Auth.currentUserInfo();
            const userDetails = {
                id : user.attributes.sub.toString(),
                course: formState.course
            };
            await API.graphql(graphqlOperation(updateUser,{input: userDetails}))
            fetchUsers();
        } catch (err) {
            console.log('error creating event:', err)
        }
    }

    return (
        <AmplifyAuthenticator>
            <div className={"container"}>
                <Router>
                    <nav>
                        <Tabs>
                            <TabList>
                                <Tab><Link to="/noticeBoard"><div className={"button"}>Notice Board</div></Link></Tab>
                                <Tab><Link to="/Profile" ><div className={"button"} >Profile</div></Link></Tab>
                            </TabList>
                            <TabPanel>
                                <h1>Profile Picture (Here)</h1>
                                {
                                    users.map((user, index) => (
                                        <div key={user.id ? user.id : index} className={"todo"}>
                                            <p className={"todoName"}>{"Username : ".concat(user.username)}</p>
                                            <p className={"todoDescription"}>{"Email : ".concat(user.email)}</p>
                                            <p className={"todoDescription"}>{"Course : ".concat(user.course)}</p>
                                        </div>
                                    ))
                                }
                            </TabPanel>
                            <TabPanel >
                                <input
                                    onChange={event => setInput('username', event.target.value)}
                                    className={"input"}
                                    value={formState.username}
                                    placeholder='username'
                                />
                                <input
                                    onChange={event => setInput('email', event.target.value)}
                                    className={"input"}
                                    value={formState.email}
                                    placeholder='email'
                                />
                                <input
                                    onChange={event => setInput('course', event.target.value)}
                                    className={"input"}
                                    value={formState.course}
                                    placeholder='course'
                                />
                                <br/>
                                <button className={"button"} onClick={updateUserF}>Post Event</button>
                            </TabPanel>
                        </Tabs>
                    </nav>
                    <Switch>
                        <Route path="/Profile" component= {profile} render={()=>fetchUsers()} />
                    </Switch>
                </Router>
                <input
                    onChange={event => setInput('course', event.target.value)}
                    className={"input"}
                    value={formState.course}
                    placeholder="Course"
                />
                <button className={"button"} onClick={Search}>Search</button>
                {search.map((user, index) => (
                    <div key={user.id ? user.id : index} className={"todo"}>
                        <p className={"todoName"}>{user.username}</p>
                        <p className={"todoDescription"}>{user.email}</p>
                        <p className={"todoDescription"}>{user.course}</p>
                    </div>
                ))}
                <AmplifySignOut/>
            </div>
        </AmplifyAuthenticator>
    )
}
export default (App)