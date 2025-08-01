import {z} from "zod";

export const messageSchema = z.object({
     content : z
     .string().nonempty({message : "content must not be empty"}) 
})