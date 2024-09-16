import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";


const blogRouter = new Hono<{
	Bindings : {
		DATABASE_URL : string,
		JWT_SECRET : string
	}
}>();

blogRouter.use("/*", async (c, next) => {
	next();
})

blogRouter.post("/", async (c) => {
	const body = await c.req.json();
	const prisma = new PrismaClient({
		datasourceUrl : c.env.DATABASE_URL
	}).$extends(withAccelerate())

		const blog = await prisma.blog.create({
			data : {
				title : body.title,
				content : body.content,
				authorId : 1
			}
		})
	return c.text("hello from post")
})

blogRouter.put("/", async (c) => {
	const body = await c.req.json();
	const prisma = new PrismaClient({
		datasourceUrl : c.env.DATABASE_URL
	}).$extends(withAccelerate())
	

	const blog = await prisma.blog.update({
		where : {
			id : body.id
		}, 
		data : {
			title : body.title,
			content : body.content
		}
	})
})

blogRouter.get("/", async (c) => {
	const body = await c.req.json()
	const prisma = new PrismaClient({
		datasourceUrl : c.env.DATABASE_URL
	}).$extends(withAccelerate())

	try {
		const blog = await prisma.blog.findFirst({
			where : {
				id : body.id
			}, 
		})
	
		return c.json({blog : blog})
	}
	catch(e){
		c.status(411);
		return c.json({message : "Error while fetching blog"})
	}
})


blogRouter.get("/bulk", async (c) => {
	return c.text("hello from post")
})
export default blogRouter