import dotenv from 'dotenv'
import _ from 'lodash'

const result = dotenv.config()

const MasterKeys = {
  development: {
    apiEndPoint: process.env.VUE_APP_NEW_API_URL_DEV,
  },
  // staging: {
  //   apiEndPoint: 'staging.example.com',
  // },
  production: {
    apiEndPoint: process.env.VUE_APP_NEW_API_URL_PROD,
  }
};

export { MasterKeys };

let envs: { [key: string]: string } = {}

if (!('error' in result)) {
  envs = result.parsed as { [key: string]: string }
} else {
  envs = {}
  _.each(process.env, (value, key) => (envs[key] = value || ''))
}

// module.exports = envs
export default envs
