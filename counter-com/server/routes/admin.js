import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express"
import AdminBroMongoose from "@admin-bro/mongoose"
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
})

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'matinjiri@gmail.com',
  password: process.env.ADMIN_PASSWORD || '123',
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
  cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecret-and-long-password-for-a-cookie-in-the-browser',
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
    }
    return null
  }
})
export default router;