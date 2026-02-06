const {z}=require('zod')
const signupschema=z.object({
    username: z
    .string({required_error:"name is required"}).trim()
    .min(3,{message:"must be 3 charector"})
    .max(255,{message:"name must not be 255 charecters"}),
     email: z
    .string({required_error:"email is required"}).trim()
    .min(3,{message:"email must be at least of 3 charector"})
    .max(255,{message:"email must not be 255 charecters"}),
     phone: z
    .string({required_error:"phone is required"}).trim()
    .min(10,{message:" phone must be at least of 10 charector"})
    .max(20,{message:"phone must not be 255 charecters"}),
     password: z
    .string({required_error:"password is required"}).trim()
    .min(7,{message:"password must be at least of 6 charector"})
    .max(1024,{message:"password must not be 1024 charecters"}),
})
 module.exports=signupschema