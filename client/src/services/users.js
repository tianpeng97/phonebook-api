const axios = require('axios')
const baseUrl = '/api/users'

const add = async (newUser) => {
  const res = await axios.post(baseUrl, newUser)
  return res.data
}

export default { add }
