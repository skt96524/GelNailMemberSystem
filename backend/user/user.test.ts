import jwt from "jwt-simple";

let token = jwt.encode({ id: 1, is_admin: true }, 'secret')

console.log(token)

