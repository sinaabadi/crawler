import  JoiObjectId from 'joi-objectid'
import  Joi from '@hapi/joi'

Joi.objectId = JoiObjectId(Joi)
export default Joi
