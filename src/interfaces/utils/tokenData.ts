interface Token {
    userId: string,
    userType: string,
    slug: string
}

interface JWTTokenData <T>{
    data: T
}



export default Token