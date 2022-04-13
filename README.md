
# School Management

This is a School management system demo project for practicing perpose.


## Key Technologies 


**Server-Side:** Node JS, Express JS , TypeScript

**Database:** MongoDB (with ODM mongoose)


## Key Roles
- Admin
- Teacher
- Student


## Key Features

- Admin can see all students information
- Admin can see all teachers information.
- Admin can ban or delete any student and teacher.
- Admin can ban or delete any teacher
- Teacher Registration
- Create a new Course
- Create a new MCQ question
- Student Registration
- Enroll a new course
- Take an exam (MCQ question )
- All user can see own profile.
- All user can update own profile.
- All User can change own existing password.
- All user can recover a password if forgot the current one.
- User Login System (with email and pasword)


## Run Locally

Clone the project

```bash
  git clone https://gitlab.com/SY-Yeasar-Practice/school_management_server_ts.git
```

Go to the project directory

```bash
  cd School_Management_Server_TS
```

Install dependencies

```bash
  npm install || npm i
```

Start the server

```bash
  npm run dev
```


## Installation

Install my-project with npm

```bash
  npm install || npm i
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

**`MONGO_URL `** //it wil be the mongodb database local or cloud server link.

**`SERVER_URL `** //it wil be the server port.

**`JWT_CODE `** // it will be the JSON WEB TOKEN'S security code

**`HOST_EMAIL `** // it will be a valid email for nodeMailer host mail. to use this you should have enable low security of you gmail.

**`HOST_PASSWORD `** // it will be a valid email password for nodeMailer host mail. to use this you should have enable low security of you gmail.

**`SENDER_EMAIL`**  //it will be a valid email. 

**`DATA_URL  `** //it will be the server side url 

**`TOKEN_EXPIRE  `** //It will be a token expire date in days (5 input that's mean 5 days)

**`LOOGGED_IN_USER_SESSON `**/It will be a cookies  expire date in days (5 input that's mean 5 days)



## Documentation

- [Database-Design-Doc](https://drive.google.com/file/d/1HgFYbKlPUPmO6hwoybeywEdMuh1cfSZw/view?usp=sharing)
- [API-OVERVIEW-Doc](https://drive.google.com/drive/u/0/folders/1dsJyyIxZ5r7Yg5GNlDtOpPDpniM7ibtk)
- [POSTMAN-API-FULL-DOC](https://www.postman.com/red-trinity-151066/workspace/zamora-mern/overview)
- [APU-FULL-DOC](https://drive.google.com/file/d/13rWQmUJ-0hid9wL_tLTiGFtA_ixYcqyL/view?usp=sharing)


## Support

For support, sadmanishopnil@gmail.com .

