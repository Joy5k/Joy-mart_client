import { jwtDecode } from "jwt-decode"

export const verifyToken = (token:string) => {
    return  jwtDecode(token) as { email: string,userId:string,role:string,iat:number,exp:number };
}

