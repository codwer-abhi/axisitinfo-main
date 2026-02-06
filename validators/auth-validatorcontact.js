const {z}=require('zod')
const contactschema=z.object({
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
     select: z
    .enum([
      'HOTEL',
      'RESTAURANT',
      'BAR',
      'MALL',
      'HOSPITAL',
      'SCHOOL',
      'RESORT',
      'WATER PARK'
    ], { required_error: "Select option is required" }),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(5, { message: "Message must be at least 5 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" })
})
module.exports=contactschema