import bcryptjs from "bcryptjs"

const users = [
  {
    name: "Admin",
    email: "admin@proshop.com",
    password: bcryptjs.hashSync("Vasucr@007"),
    isAdmin: true,
  },
]

export default users
