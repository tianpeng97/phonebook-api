import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons'

const Person = ({ person, removePerson }) => {
  return (
    <tr className="phonebook-row">
      <td className="phonebook-entry">{person.name}</td>
      <td className="phonebook-entry">{person.number}</td>
      <td className="phonebook-entry">
        <button className="options" onClick={() => removePerson(person.id)}>
          <FontAwesomeIcon icon={faCircleMinus} />
        </button>
      </td>
    </tr>
  )
}

export default Person
