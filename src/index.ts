import { Hono } from 'hono'

const app = new Hono()

//signup route
app.post('/api/v1/user/signup', (c) => {
  return c.text("hello from signup")
})


//Signin route
app.post('/api/v1/user/signin', (c) => {
  return c.text("hello from signin")
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
