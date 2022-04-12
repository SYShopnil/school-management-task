const idGenerator: (firstName:string) => string = (firstName) => {
    let newId:string
    //generate 4 digit id 
    let randomNumberGenerator:string = ""
    for(let i:number = 1 ; i<=5; i++ ){
        randomNumberGenerator = Math.floor(Math.random() * 9 + 1) + randomNumberGenerator
    } //generate the random number form appointment
    newId = firstName + randomNumberGenerator
    return newId

}
export default idGenerator