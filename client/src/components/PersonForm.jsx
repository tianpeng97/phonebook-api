import React from 'react'

const PersonForm = ({
  onSubmit,
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
}) => {
  return (
    <div className="person-form">
      <h3 className="center-title title">Add new person</h3>
      <form className="form-content" onSubmit={onSubmit}>
        <div className="form-input">
          <div className="form-floating">
            <input
              id="name"
              className="form-control input"
              value={newName}
              onChange={handleNewName}
              placeholder=""
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating">
            <input
              id="number"
              className="form-control input"
              value={newNumber}
              onChange={handleNewNumber}
              placeholder=""
            />
            <label htmlFor="number">Number</label>
          </div>
        </div>
        <div className="form-submit">
          <button className="form-submit-button" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm
