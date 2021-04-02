import React, {useEffect, useState} from 'react'
import {Route, BrowserRouter as Router, Switch, Link} from "react-router-dom"
import Amplify, {API, graphqlOperation} from 'aws-amplify'
import {createTodo} from './graphql/mutations'
import {listTodos,listUsers} from './graphql/queries'
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import awsExports from "./aws-exports";
import editProfile from "./pages/editProfile";
import profile from "./pages/Profile";
import chat from "./pages/Chat";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


Amplify.configure(awsExports);

const initialState = {search: '', name: '', description: ''}

const App = () => {
    const [formState, setFormState] = useState(initialState)
    const [names, setNames] = useState([])
    const [users, setUsers] = useState([])
    const [searches, setSearches] = useState([])

    useEffect(() => {
        fetchEvents()
        fetchUsers()
    }, [])

    function setInput(key, value) {
        setFormState({...formState, [key]: value})
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
        try {
            const userData = await API.graphql(graphqlOperation(listUsers))
            const user = userData.data.listTodos.items
            setUsers(user)
        } catch (err) {
            console.log('error fetching events')
        }
    }

    async function addEvents() {
        try {
            if (!formState.name || !formState.description) return
            const name = {...formState}
            setNames([...names, name])
            setFormState(initialState)
            await API.graphql(graphqlOperation(createTodo, {input: name}))
        } catch (err) {
            console.log('error creating event:', err)
        }
    }
    /*
    * textboxes make up form state
    * get information from formstate
    * pass into query as input
    *    e.g.   const data = await API.graphql(graphqlOperation(createTodo, {input: dataFromForm}))
    * */

    async function Search() {
        try {
            if (!formState.name) return
            const search = {...formState}
            setSearches([...searches, search])
            setFormState(initialState)
            await API.graphql(graphqlOperation(listUsers, {input: search}))
        } catch (err) {
            console.log('error creating event:', err)
        }
    }

    return (
        <AmplifyAuthenticator>
            <div style={styles.container}>
                <Router>
                    <nav>
                    <Tabs>
                        <TabList>
                            <Tab><Link to="/Profile"><div style = {styles.button}>Profile</div></Link></Tab>
                            <Tab><Link to="/editProfile"><div style = {styles.button} >Edit Profile</div></Link></Tab>
                            <Tab><Link to="/chat"><div style = {styles.button} >Chat</div></Link></Tab>
                        </TabList>

                        <TabPanel>
                            <h2>Any content 1</h2>
                        </TabPanel>
                        <TabPanel>
                            <h2>Any content 2</h2>
                        </TabPanel>
                    </Tabs>
                    </nav>

                    <p>Let's Add Routing!</p>
                    <Switch>
                        <Route path="/Profile" component= {profile} />
                        <Route path="/editProfile" component= {editProfile}/>
                    </Switch>
                </Router>
                <h1>Virtual Notice Board</h1>
                <input
                    onChange={event => setInput('name', event.target.value)}
                    style={styles.input}
                    value={formState.name}
                    placeholder="Name"
                />
                <input
                    onChange={event => setInput('description', event.target.value)}
                    style={styles.input}
                    value={formState.description}
                    placeholder="Description"
                />
                <input
                    onChange={event => setInput('search', event.target.value)}
                    style={styles.input}
                    value={formState.search}
                    placeholder="Search"
                />
                <button style={styles.button} onClick={addEvents}>Post Event</button>
                <button style={styles.button} onClick={Search}>Searches</button>

                {

                    names.map((todo, index) => (
                        <div key={todo.id ? todo.id : index} style={styles.todo}>
                            <p style={styles.todoName}>{todo.name}</p>
                            <p style={styles.todoDescription}>{todo.description}</p>
                        </div>
                    ))
                }
                {
                    users.map((user, index) => (
                        <div key={user.id ? user.id : index} style={styles.todo}>
                            <p style={styles.todoName}>{user.username}</p>
                        </div>

                    ))
                }
                <AmplifySignOut/>
            </div>
        </AmplifyAuthenticator>
    )
}

const styles = {
    container: {
        width: 400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#53CCEC'
    },
    todo: {marginBottom: 15},
    input: {border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18},
    todoName: {fontSize: 20, fontWeight: 'bold'},
    todoDescription: {marginBottom: 0},
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        outline: 'none',
        fontSize: 18,
        padding: '15px 32px',
        textalign: 'center',
        textdecoration: 'none',
        display: 'inline-block',
        fontsize: '16px',

    }
}



export default (App)