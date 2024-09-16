import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { Hono } from "hono";


const userRouter = new Hono<{
	Bindings : {
		DATABASE_URL : string,
		JWT_SECRET : string
	}
}>();

userRouter.post('/signup', async (c) => {
	const body = await c.req.json();
	const prisma = new PrismaClient({
	  datasourceUrl : c.env.DATABASE_URL
	}).$extends(withAccelerate())
  
	try{ 
	const user = await prisma.user.create({
	  data : {
		username : body.username,
		password : body.password,
		name : body.name 
	  }
	})
  
	const jwt = await sign({
	  id : user.id
	}, c.env.JWT_SECRET);
  
	return c.json({token : jwt})  
	}
	catch(err){
	  c.status(401);
	  return c.text("User already exists with this email")
	}  
})

userRouter.post('/signin', async (c) => {
	const prisma = new PrismaClient({
	  datasourceUrl : c.env.DATABASE_URL
	}).$extends(withAccelerate())
  
	const body = await c.req.json();
  
	try {
	  const user = await prisma.user.findFirst({
		where :{ 
		  username : body.username  ,
		  password:  body.password
		}
	  })
	  if(!user){
		c.status(411);
		return c.json({error : "Incorrect Credentials"})
	  }
  
	  const token = await sign({
		id : user.id
	  }, c.env.JWT_SECRET)
  
	  return c.json({token : token})
	} catch (error) {
	  c.status(413);
	  return c.json({error : "Invalid"})    
	}  
})



export default userRouter