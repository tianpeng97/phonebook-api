import axios from 'axios'
const baseUrl = '/api/persons'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.get(baseUrl, config)
  return res.data
}

const add = async (newPerson) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.post(baseUrl, newPerson, config)
  return res.data
}

const update = async (id, newPerson) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.put(`${baseUrl}/${id}`, newPerson, config)
  return res.data
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((res) => res.data)
}

const services = { getAll, add, update, remove, setToken }

export default services
