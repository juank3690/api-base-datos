import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string({
      message: "Invalid username format must be a string",
    })
    .min(3, {
      message: "Username must be at least 3 characters long",
    }),
  email: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters long",
  }),
});


const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters long",
  }),
});



function validateRegisterSchema(body){
    return registerSchema.safeParse(body);//Devuelve si hay un error o hay un valor
}

function validateLoginSchema(body){
    return loginSchema.safeParse(body);
}

export {validateRegisterSchema,validateLoginSchema};