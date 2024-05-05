import Joi from "joi";
import ICONS_LIST from "../../constants/iconsList.js";
import BACKGROUND_LIST from "../../constants/backgroundList.js";

export const boardAddSchema = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.base": "Title must be a string",
    "string.min": "Title must have a minimum length of {#limit} symbols",
    "any.required": "Missing required field title",
  }),
  icon: Joi.string()
    .valid(...ICONS_LIST)
    .messages({
      "string.base": "Icon must be a string",
      "any.only": "Invalid icon value",
    }),
  background: Joi.string()
    .valid(...BACKGROUND_LIST)
    .messages({
      "string.base": "Background must be a string",
      "any.only": "Invalid background value",
    }),
});

export const boardEditSchema = Joi.object({
  title: Joi.string().min(2).messages({
    "string.base": "Title must be a string",
    "string.min": "Title must have a minimum length of {#limit} symbols",
  }),
  icon: Joi.string()
    .valid(...ICONS_LIST)
    .messages({
      "string.base": "Icon must be a string",
      "any.only": "Invalid icon value",
    }),
  background: Joi.string()
    .valid(...BACKGROUND_LIST)
    .messages({
      "string.base": "Background must be a string",
      "any.only": "Invalid background value",
    }),
});
