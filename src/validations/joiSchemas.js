import Joi from 'joi'

const joiSchemas = {
    signUp_schema:Joi.object({
        su_username:Joi.string().pattern(/^[a-zA-Z0-9@_]{5,20}$/).required().messages({
            'string.base':'username should be a string',
            'string.empty':'username should not be empty',
            'any.required':'username is required',
            'string.pattern.base':'username contains letters, numbers and "@, _", and the length is between 5 and 20'
        }),
        su_email:Joi.string().email({minDomainSegments:2,tlds:{}}).required().messages({
            'string.email':'email address must be valid'
        }),
        su_password:Joi.string().pattern(/^[a-zA-Z0-9@-_]{5,20}$/).required().messages({
            'string.base':'password should be a string',
            'string.empty':'password should not be empty',
            'any.required':'password is required',
            'string.pattern.base':'password contains letters, numbers and "@, _, -", and the length is between 5 and 20'
        }),
        su_confirmPassword:Joi.string().required().valid(Joi.ref('su_password')).messages({
            'any.only':'password mismatch'
        }) 
    }).with('su_password','su_confirmPassword'),
    signIn_schema:Joi.object({
        si_user:Joi.string().replace(/\s+/g,'').required().messages({
            'string.base':'please enter your username or email',
            'string.empty':'please enter your username or email',
            'any.required':'please enter your username or email',
        }),
        si_password:Joi.string().pattern(/^[a-zA-Z0-9@-_]{5,20}$/).required().messages({
            'string.base':'password should be a string',
            'string.empty':'password should not be empty',
            'any.required':'password is required',
            'string.pattern.base':'password contains letters, numbers and "@,_,-", and the length is between 5 and 20'
        }),
    }),
    resetRequest_schema:Joi.object({
        rs_email:Joi.string().email({minDomainSegments:2,tlds:{}}).required().messages({
            'string.email':'email address must be valid'
        })
    }),
    resetPwd_schema:Joi.object({
        rs_newPwd:Joi.string().pattern(/^[a-zA-Z0-9@-_]{5,20}$/).required().messages({
            'string.base':'password should be a string',
            'string.empty':'password should not be empty',
            'any.required':'password is required',
            'string.pattern.base':'password contains letters, numbers and "@,_,-", and the length is between 5 and 20'
        })
    }),
    userProfile_schema:{
        bio:Joi.string().replace(/\s+/g,' ').trim().max(400).required().messages({
            'string.base':'Biography should be a string',
            'string.empty':'Biography should not be empty',
            'any.required':'Biography is required',
            'string.max':'Biography can have 400 chars at most'
        }),
        location:Joi.string().replace(/\s+/g,' ').trim().max(100).required().messages({
            'string.base':'Location should be a string',
            'string.empty':'Location should not be empty',
            'any.required':'Location is required',
            'string.max':'Location can have 100 chars at most'
        }),
        hobbies:Joi.string().replace(/\s+/g,'').max(150).required().messages({
            'string.base':'Hobbies should be a string',
            'string.empty':'Hobbies should not be empty',
            'any.required':'Hobbies is required',
            'string.max':'Hobbies can have 150 chars at most'
        }),
        profession:Joi.string().replace(/\s+/g,' ').trim().max(100).required().messages({
            'string.base':'Profession should be a string',
            'string.empty':'Profession should not be empty',
            'any.required':'Profession is required',
            'string.max':'Profession can have 100 chars at most'
        }),
        avatar:Joi.any().allow('')
    },
    comment_schema:Joi.object({
        contents:Joi.string().replace(/\s+/g,' ').trim().required().messages({
            'string.base':'contents should be a string',
            'string.empty':'contents should not be empty',
            'any.required':'contents is required',
        })
    }),
    post_schema:{
        title:Joi.string().max(100).required().messages({
            'string.base':'title should be a string',
            'string.empty':'title should not be empty',
            'any.required':'title is required',
            'string.max':'title can have 100 chars at most'
        }),
        contents:Joi.string().replace(/\s+/g,' ').trim().required().messages({
            'string.base':'contents should be a string',
            'string.empty':'contents should not be empty',
            'any.required':'contents is required',
        }),
        tags:Joi.string().replace(/\s+/g,'').max(100).required().messages({
            'string.base':'tags should be a string',
            'string.empty':'tags should not be empty',
            'any.required':'tags is required',
            'string.max':'tags can have 100 chars at most'
        }),
        image:Joi.any().required().messages({
            'any.required': 'image is a required'
        })
    },
    editPost_schema:{
        title:Joi.string().max(100).required().messages({
            'string.base':'title should be a string',
            'string.empty':'title should not be empty',
            'any.required':'title is required',
            'string.max':'title can have 100 chars at most'
        }),
        contents:Joi.string().replace(/\s+/g,' ').trim().required().messages({
            'string.base':'contents should be a string',
            'string.empty':'contents should not be empty',
            'any.required':'contents is required',
        }),
        tags:Joi.string().replace(/\s+/g,'').max(100).required().messages({
            'string.base':'tags should be a string',
            'string.empty':'tags should not be empty',
            'any.required':'tags is required',
            'string.max':'tags can have 100 chars at most'
        }),
        image:Joi.any().allow('')
    },
}

export default joiSchemas;