import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Number = ({ name, number, id, handleDelete }) => {
	return <div>{name} {number} <button onClick={() => handleDelete(id)}>delete</button></div>
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>filter shown with <input value={filter} onChange={handleFilterChange} /></div>
  )
}

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(person => 
        <Number key={person.id} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete} />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setNewFilter] = useState('')
	const [notification, setNotification] = useState(null)

	const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

	useEffect(() => {
		console.log('effect')
    personsService
			.getAll()
			.then(initPersons => {
				setPersons(initPersons)
			})
	}, [])

	const addName = (event) => {
		event.preventDefault()

		const existingPerson = persons.find(p => p.name === newName)
		if (existingPerson) {
			
			if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
				const changedPerson = { ...existingPerson, number: newNumber }
				
				personsService
					.update(existingPerson.id, changedPerson)
					.then(returnedName => {
						setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedName))
						setNewName('')
						setNewNumber('')
						showNotification(`${returnedName.name}\'s phone number has been updated`, 'success')
					})
					.catch(error => {
						showNotification(`${existingPerson.name} was already removed from the server`, 'error')
						setPersons(persons.filter(person => person.id !== existingPerson.id))
						setNewName('')
						setNewNumber('')
					})
			}
			return
		}

		const nameObject = {
			name: newName,
			number: newNumber
		}

		personsService
			.create(nameObject)
			.then(returnedNamed => {
				setPersons(persons.concat(returnedNamed))
				setNewName('')
				setNewNumber('')
				showNotification(`${returnedNamed.name} has been added`, 'success')
			})
	}

	const deletePerson = (id) => {
		const person = persons.find(n => n.id === id)

		if (window.confirm(`Delete ${person.name}?`)) {
			personsService
				.deleteEntry(id)
				.then(() => {
					setPersons(persons.filter(n => n.id !== id))
				})
		}
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleFilterChange = (event) => {
		setNewFilter(event.target.value)
	}

	const personsToShow = filter === ''
		? persons
		: persons.filter(person =>
			person.name.toLowerCase().includes(filter.toLowerCase())
		)

  return (
    <div>
      <h2>Phonebook</h2>

			<Notification message={notification?.message} type={notification?.type} />

			<Filter filter={filter} handleFilterChange={handleFilterChange} />

			<h3>Add a new</h3>

			<PersonForm 
				newName={newName}
				newNumber={newNumber}
				addName={addName} 
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange} 
			/>

      <h2>Numbers</h2>

			<Persons persons={personsToShow} handleDelete={deletePerson} />
		</div>
  )
}

export default App