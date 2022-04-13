import Quiz from "./quiz"
import Question from "./question"
import User from "./user"


interface StudentResponse {
    question: Question,
    response: string
}

interface Result {
    _id: any,
    resultId: string,
    slug: string,
    quiz: Quiz,
    studentResponse : [StudentResponse],
    mark: number,
    student: User
}
export default Result
