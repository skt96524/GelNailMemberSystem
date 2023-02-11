import Knex from 'knex'
import { env } from './env'

let profiles = require('./knexfile')

let profile = profiles[env.NODE_ENV]

export let knex = Knex(profile)
