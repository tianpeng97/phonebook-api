import React from 'react'
import Person from './Person'

const NumbersList = ({ personsToShow, removePerson }) => {
  return (
    <table className="phonebook">
      <thead>
        <tr className="phonebook-header">
          <th className="phonebook-entry">Name</th>
          <th className="phonebook-entry">Number</th>
          <th className="phonebook-entry">Options</th>
        </tr>
      </thead>
      <tbody className="phonebook-body">
        {personsToShow.map((person) => (
          <Person key={person.id} person={person} removePerson={removePerson} />
        ))}
      </tbody>
    </table>
  )
}

export default NumbersList
