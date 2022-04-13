
import Question from "../model/question"

interface ResultInput {
    courseId: string,
    quizId: string,
    response: [
        {
            questionID: Question,
            responseOption: string
        }
    ]
}

export default ResultInput