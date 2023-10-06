import React, { useState } from 'react';
import Select from 'react-select';
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';


const Birthyear = ({ authors }) => {
  console.log(authors)
  const [selectedOption, setSelectedOption] = useState(null);
  const [year, setYear] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: selectedOption.name, born: Number(year) } })
    setYear('')
  }

  return (
    <div className="Birthyear">
      <h3>Set birthyear</h3>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={authors}
        getOptionLabel={ author => author.name }
        getOptionValue={ author => author.name }
      />
      <form onSubmit={submit}>
      Born
      <input
        type="text" 
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button type="submit">update author</button>
      </form>
    </div>
  );
}

export default Birthyear