import e, {
    Request,
    Response
} from "express"

//models
import User from "../../model/user"
import Teacher from "../../model/teacher"
import Student from "../../model/student"
import Course from "../../model/course"
import Quiz from "../../model/quiz"
import Question from "../../model/question"
import Result from "../../model/result"


//utils file 
import slugGenerator from "../../../utils/slugGenerator"
import idGenerator from "../../../utils/idGenerator"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import CourseModel from "../../../src/interfaces/model/course"
import QuizModel from "../../../src/interfaces/model/quiz"
import QuestionModel from "../../../src/interfaces/model/question"
import TeacherProfileInterface from "../../../src/interfaces/model/teacher"
import {
    UpdateReturn
} from "../../interfaces/utils/mongoDb"
import {
    CreateNewCourse,
    CreateMCQModal
} from "../../../src/interfaces/BodyInput/Course" 
import ResultBodyInput from "../../interfaces/BodyInput/Result"
import student from "../../model/student"
import ResultInterface from "../../interfaces/model/result"



//create a new course 
const createNewCourseController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    const {
        courseName,
        duration
    }:CreateNewCourse = req.body;
    const courseNameFirstTwoWord: string []  = courseName.split ("").filter ((name, ind) =>{
        if (ind < 2) {
            return name
        }
    })
    const courseId:string = idGenerator (courseNameFirstTwoWord.join("")); //create a new course by using First Two word of course name including 5 digit random integer unique number 
    const courseSlug:string = slugGenerator (courseId,duration, ) //create a course slug 
    const {_id:instructorId}:UserInterface = req.user //store the instructor id
    const createNewCourse = await new Course ({ //create  a new instance of course
        courseName,
        duration,
        instructor: instructorId,
        courseId,
        slug:courseSlug
    })
    const saveNewCourse:CourseModel =  await createNewCourse.save (); //save a new course 
    if (Object.values(saveNewCourse).length != 0) {
        res.json ({
            message: "Course successfully created",
            status: 201
        })
    }else {
        res.json ({
            message: "Course creation failed",
            status: 406
        })
    }
}

//create a new mcq question 
const createNewMcqQuestionController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {
            courseId,
            totalTime,
            totalQuestion,
            questions:inputQuestion,
        }:CreateMCQModal = req.body //get the data from body

        const {
            userId:teacherId
        }:UserInterface = req.user; //get the teacher id from logged in auth
        //create a quiz 
        const quizId:string = idGenerator (teacherId); //create a quiz id
        const quizSlug:string = slugGenerator (teacherId, courseId); //create a slug for quiz
        const createInstance = new Quiz ({
            totalQuestion,
            totalTime,
            slug: quizSlug,
            quizId,
            courseId
        }) //create the instance of a quiz
        const saveQuiz:QuizModel = await createInstance.save(); //save the quiz 
        if (Object.values(saveQuiz).length != 0) { //if save the quiz then it will happen
            const {_id:quizId}:any = saveQuiz
            let questionsId:any [] = []; //it will store all quiz question's object id
            let totalMarks:number = 0; //it will generate total marks base number of marks from each question of the quiz
            //create all quiz  question
            for (let i:number = 0; i <= inputQuestion.length - 1; i++) {
                const question:string = inputQuestion[i].question;
                const questionMark:number = inputQuestion[i].mark;
                const correctOption:string = inputQuestion[i].correctOption;
                const questionId :string= idGenerator (teacherId);
                const questionSlug:string = slugGenerator (questionId,courseId, teacherId); //create the question slug
                totalMarks += questionMark;
                const questionOption = inputQuestion[i].options
                const createQuestionInstance = new Question ({
                    question,
                    questionId,
                    slug:questionSlug,
                    quiz: quizId,
                    mark: questionMark,
                    correctOption,
                    options:questionOption
                }) //create a instance of question
                const saveQuestion:QuestionModel = await createQuestionInstance.save(); //save a new question 
                if (Object.values(saveQuestion).length != 0) { //if question created then it will happen
                    questionsId.push (saveQuestion._id) //store all question object id
                }else {
                    res.json ({
                        message: "Question creation failed",
                        status: 406
                    })
                }
            }

            //store quiz questions object id into  quiz model 
            const storeQuestionId:UpdateReturn = await Quiz.updateOne ( //store all question into quiz schema
                {
                    _id: quizId
                }, //query
                {
                    $set : {
                        questions: questionsId,
                        totalMarks
                    }
                }, //update
                {multi: true}
            ) 

            if (storeQuestionId.modifiedCount != 0) { //if question successfully updated in the quiz schema
                //update the course schema and keep the quiz id there
                const updateCourseSchema:UpdateReturn = await Course.updateOne ( //put the quiz id in the course schema as ref
                    {
                        _id: courseId
                    }, //query
                    {
                        $push: {
                            quizzes: quizId
                        }
                    }, //update,
                    {multi: true}
                )
                if (Object.values (updateCourseSchema).length != 0) {
                     res.json ({
                        message: "A new Quiz has been created",
                        status: 201
                    })
                }else {
                    res.json ({
                        message: "Course Schema update failed",
                        status: 406
                    })
                }
            }else {
                res.json ({
                    message: "Quiz Question store failed",
                    status: 406
                })
            }

        }else {
            res.json ({
                message: "Quiz save failed",
                status: 406
            })
        }
    }catch (err) {
        res.json ({
            message: err,
            status: 406
        })
    }
}


//enroll a new course 
const enrollNewCourseController : (req:Request, res:Response) => Promise <void> = async (req, res) =>  {
    try {
        const {
            courseId
        }: {
            courseId:string
        } = req.body //get the course unique id what logged in student want to enroll 

        const {
            _id: studentObjId
        }: UserInterface = req.user //get the logged in user student object id
        // console.log(studentObjId)
        const enrollNewCourse:UpdateReturn = await  Course.updateOne ( //when student have enrolled a new course 
            {
                _id: courseId
            }, //query 
            {
                $addToSet: {
                    enrolledStudent: studentObjId
                }
            }, //update
            {
                multi: true
            } //option
        )

        if (enrollNewCourse.modifiedCount != 0) { //of student have successfully enrolled
            const updateStudentProfile: UpdateReturn = await Student.updateOne (
                {
                    user: studentObjId
                }, //query 
                {
                    $addToSet: {
                        enrolledCourse: courseId
                    }
                }, //update 
                {
                    multi: true
                } //option
            ) //update the enrolled course status of a student profile 
            if (updateStudentProfile.modifiedCount != 0) {
                res.json ({
                    message: "Student have successfully enrolled",
                    status: 202
                })
            }else {
                res.json ({
                    message: "Student enrolled failed to the course",
                    status: 406
                })
            }
        }else {
            res.json ({
                message: "Student enrolled failed",
                status: 406
            })
        }

    }catch (err) {
        console.log(err)
        res.json({
            message: err,
            satus: 406
        })
    }
}

//generate mcq result instant of response 
const generateQuizResultController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {
            courseId,
            quizId,
            response 
        }: ResultBodyInput = req.body //get the data response data from body object

        //get the logged in user 
        const {
            _id: studentId
        } = req.user //get the logged in student unique object  id
        const findCorrectOptionOfQuizFromQuiz:QuizModel | null = await Quiz.findOne (
           {
               _id: quizId
           }
        ).populate (
            {
                path: "questions",
                select: "questionId correctOption mark _id"
            }
        ).select ("questions totalMarks totalQuestion -_id  ") //find all correct option of quiz question 
        if (findCorrectOptionOfQuizFromQuiz) { //if quiz question found then it will execute
            const quizQuestionDetails: [
                {
                    questionId: string, mark: number, correctOption: string, _id:any
                }
            ] = findCorrectOptionOfQuizFromQuiz.questions

            const studentResponse:[ //this will be the response of a student
                {
                    questionID: QuestionModel,
                    responseOption: string
                }
            ]  = response;
            let finalMark:number = 0; //it will store the final marks base on the response of the student

            //initialize the final mark according to the student response
            studentResponse.map ((response:{questionID: any ,responseOption: string }) => { //check all student's response
                quizQuestionDetails.find ((question: {questionId: string, mark: number, correctOption: string, _id: any}) => { //check all question answer with student's response
                    // console.log({responseQuestionId:response.questionID._id , Original:question._id  })
                    if (response.questionID == question._id ) { //here student response question compare with original question object id
                        response.responseOption == question.correctOption && (finalMark+= question.mark) //if question's original option and student's selected option match then it will increment the final mark as allocate for that following question
                    }
                })
            })
            
            //create the result of that student 
            const resultId:string = idGenerator ("RES") //create a result id
            const resultSlug:string = slugGenerator  (courseId, quizId, resultId)  //create a slug for result 
            const createResult = new Result ({
                resultId,
                slug: resultSlug,
                student: studentId,
                studentResponse: studentResponse,
                mark: finalMark,
                quiz: quizId
            }) //create a result instance 
            const saveResult:ResultInterface = await createResult.save () //save the instance of Result
            if (Object.values(saveResult).length != 0) { //if result successfully created then it will happen 
                //store the result into quiz model
                const insertResultIntoQuizModel:UpdateReturn = await Quiz.updateOne ( //if result object id is successfully store into quiz model
                    {
                        _id: quizId
                    }, //query
                    {
                        $addToSet: {
                            results: saveResult._id
                        }
                    }, //update
                    {
                        multi: true
                    } //option
                )
                if (insertResultIntoQuizModel.modifiedCount != 0) {
                     res.json ({
                        message: "Result Published!!",
                        status: 201,
                        result: saveResult
                    })
                }else {
                    res.json ({
                        message: "Result Published but failed to update Quiz model!!",
                        status: 406,
                        result: saveResult
                    })
                }
               
            }else {
                res.json ({
                    message: "Result Creation failed",
                    status: 406,
                    result: null
                })
            }
        }else {
            res.json ({
                message: "Quiz not found",
                status: 404,
                result: null
            })
        }
       
    }catch (err) {
        console.log(err)
        res.json ({
            message: err,
            status: 406,
            result: null
        })
    }
} 
export {
    createNewCourseController,
    createNewMcqQuestionController,
    enrollNewCourseController,
    generateQuizResultController
}

