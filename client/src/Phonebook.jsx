import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import personServices from './services/persons'
import NumbersList from './components/NumbersList'
import Notification from './components/Notification'
import loginService from './services/login'
import Navbar from './components/Navbar'
import usersService from './services/users'

const Phonebook = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [username, setUserame] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isLog, setIsLog] = useState(true)
  const [name, setName] = useState('')
  const [passwordRe, setPasswordRe] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))
      personServices.setToken(user.token)
      setUser(user)
      setUserame('')
      setPassword('')
    } catch (exception) {
      setErrorMsg('Wrong credentials')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if (password !== passwordRe) {
      setPassword('')
      setPasswordRe('')
      setErrorMsg('Passwords not identical.')
      return setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }

    try {
      const user = await usersService.add({
        name,
        username,
        password,
      })

      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))
      personServices.setToken(user.token)
      setUser(user)
      setName('')
      setUserame('')
      setPassword('')
    } catch (exception) {
      setErrorMsg(exception.response.data.error)
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  const fetchPersons = () => {
    personServices.getAll().then((res) => setPersons(res))
  }

  const checkToken = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      personServices.setToken(user.token)
    }
  }

  useEffect(fetchPersons, [user])
  useEffect(checkToken, [])

  const handleIsLog = () => {
    if (!isLog) {
      setName('')
    }
    setUserame('')
    setPassword('')
    setIsLog(!isLog)
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleName = (event) => {
    setName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const removePerson = (id) => {
    const name = persons.filter((person) => person.id === id)[0].name
    if (window.confirm(`Delete ${name}?`)) {
      personServices
        .remove(id)
        .catch((err) => alert(`${name} already deleted from db.`))
      setPersons(persons.filter((person) => person.id !== id))
    }
  }

  // TODO handle redundant submissions in backend
  const handleSubmit = async (event) => {
    event.preventDefault()

    const personsSameName = persons.filter((person) => person.name === newName)
    const isRedundant = personsSameName.length !== 0

    if (isRedundant) {
      const personToAdd = personsSameName[0]
      if (
        window.confirm(
          `${personToAdd.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const personObject = { ...personsSameName[0], number: newNumber }
        try {
          const updatedPerson = await personServices.update(
            personToAdd.id,
            personObject
          )
          setPersons(
            persons.map((person) =>
              person.id === personToAdd.id ? updatedPerson : person
            )
          )
          setNewName('')
          setNewNumber('')
        } catch (exception) {
          setPersons(persons.filter((person) => person.id !== personToAdd.id))
          setErrorMsg(`[ERROR] ${exception.response.data.error}`)
          setTimeout(() => {
            setErrorMsg(null)
          }, 5000)
        }
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personServices
        .add(personObject)
        .then((res) => {
          setPersons(persons.concat(res))
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          setErrorMsg(`[ERROR] ${error.response.data.error}`)
          setTimeout(() => {
            setErrorMsg(null)
          }, 5000)
        })
    }
  }

  const handleSearch = (event) => {
    if (event.target.value === '') {
      setShowAll(true)
    } else {
      setNewSearch(event.target.value)
      setShowAll(false)
    }
  }

  const personsToShow = showAll
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(newSearch))

  const handleUsername = (event) => {
    setUserame(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handlePasswordRe = (event) => {
    setPasswordRe(event.target.value)
  }

  const loginForm = () => {
    return (
      <div className="entry-form">
        <h3 className="title center-title">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-floating">
            <input
              className="form-control input"
              id="username"
              placeholder=""
              type="text"
              value={username}
              name="Username"
              onChange={handleUsername}
            ></input>
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating">
            <input
              className="form-control input"
              type="password"
              placeholder=""
              value={password}
              name="Password"
              id="password"
              onChange={handlePassword}
            ></input>
            <label htmlFor="password">Password</label>
          </div>
          <button className="auth-button form-submit-button" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }

  const registerForm = () => {
    return (
      <div className="entry-form">
        <h3 className="title center-title">Register</h3>
        <form onSubmit={handleRegister}>
          <div className="form-floating">
            <input
              className="form-control input"
              id="name"
              placeholder=""
              type="text"
              value={name}
              name="Name"
              onChange={handleName}
            ></input>
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating">
            <input
              className="form-control input"
              id="username"
              placeholder=""
              type="text"
              value={username}
              name="Username"
              onChange={handleUsername}
            ></input>
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating">
            <input
              className="form-control input"
              type="password"
              placeholder=""
              value={password}
              name="Password"
              id="password"
              onChange={handlePassword}
            ></input>
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-floating">
            <input
              className="form-control input"
              type="password"
              placeholder=""
              value={passwordRe}
              name="PasswordRe"
              id="passwordRe"
              onChange={handlePasswordRe}
            ></input>
            <label htmlFor="password">Repeat Password</label>
          </div>
          <button className="auth-button form-submit-button" type="submit">
            Create
          </button>
        </form>
      </div>
    )
  }

  // TODO logged in users should have home nav-item

  const phonebookForm = () => {
    return (
      <>
        <h1 className="title">{`${user.name}'s Phonebook`}</h1>
        <PersonForm
          onSubmit={handleSubmit}
          newName={newName}
          handleNewName={handleNewName}
          newNumber={newNumber}
          handleNewNumber={handleNewNumber}
        />
        <div className="phonebook-title">
          <div className="title-base-container">
            <h3 className="title-base">Numbers</h3>
          </div>

          <div className="form-floating">
            <input
              className="form-control input"
              id="search"
              placeholder=""
              onChange={handleSearch}
            />
            <label htmlFor="search">Search</label>
          </div>
        </div>

        <NumbersList
          personsToShow={personsToShow}
          removePerson={removePerson}
        />
      </>
    )
  }

  return (
    <>
      <Navbar
        isLog={isLog}
        handleIsLog={handleIsLog}
        handleLogout={handleLogout}
        user={user}
      />
      <div className="container">
        <Notification message={errorMsg} />
        {user === null
          ? isLog
            ? loginForm()
            : registerForm()
          : phonebookForm()}
      </div>
    </>
  )
}

export default Phonebook
