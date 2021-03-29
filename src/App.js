import React, {useEffect, useState} from 'react'
import Amplify, {API, graphqlOperation} from 'aws-amplify'
import {createTodo} from './graphql/mutations'
import {listTodos,listUsers} from './graphql/queries'
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const initialState = {event: '', description: ''}

const App = () => {
    const [formState, setFormState] = useState(initialState)
    const [events, setEvents] = useState([])
    const [users, setUsers] = useState([])

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
            setEvents(todos)
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
            if (!formState.event || !formState.description) return
            const event = {...formState}
            setEvents([...events, event])
            setFormState(initialState)
            await API.graphql(graphqlOperation(createTodo, {input: event}))
        } catch (err) {
            console.log('error creating event:', err)
        }
    }

    return (
        <AmplifyAuthenticator>
            <div style={styles.container}>
                <h1>Virtual Notice Board</h1>
                <input
                    onChange={event => setInput('event', event.target.value)}
                    style={styles.input}
                    value={formState.event}
                    placeholder="Event"
                />
                <input
                    onChange={event => setInput('description', event.target.value)}
                    style={styles.input}
                    value={formState.description}
                    placeholder="Description"
                />
                <button style={styles.button} onClick={addEvents}>Post Event</button>
                {
                    events.map((todo, index) => (
                        <div key={todo.id ? todo.id : index} style={styles.todo}>
                            <p style={styles.todoName}>{todo.event}</p>
                            <p style={styles.todoDescription}>{todo.description}</p>
                        </div>
                    ))
                }
                {/*{*/}
                {/*    users.map((user, index) => (*/}
                {/*        <div key={user.id ? user.id : index} style={styles.todo}>*/}
                {/*            <p style={styles.todoName}>{user.username}</p>*/}
                {/*            <p style={styles.todoDescription}>{user.email}</p>*/}
                {/*        </div>*/}
                {/*    ))*/}
                {/*}*/}
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
    button: {backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px'}
}

export default (App)