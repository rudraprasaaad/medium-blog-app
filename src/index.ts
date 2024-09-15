import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()


//signup route
app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }
  ).$extends(withAccelerate())

  const body = await c.req.json();
  try{
    const user = await prisma.user.create({
      data : {  
        email : body.email,
        password : body.password
      }
    });

    const token =  await sign({id : user.id}, c.env.JWT_SECRET)
    return c.json({
      jwt : token
    });
  }
  catch(e){
    return c.status(403);
  }
})


//Signin route
app.post('/api/v1/user/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body = await c.req.json();
  
  const user = await prisma.user.findUnique({
    where :{ 
      email : body.email,
      password:  body.password
    }
  })


})


//blog posting route
app.post('/api/v1/blog', (c) => {
  return c.text("hello from post")
})

//Blog updation routes
app.put('/api/v1/blog', (c) => {
  return c.text("hello from put")
})

// Blog get by id
app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text('Hello from get single')
})

export default app
