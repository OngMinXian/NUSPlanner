# NUSPlanner :books:
A web application integrated with NUSMODs that helps students to optimise their time in the areas of work, academics and extracurricular activities.

## Proposed level of achievement :bar_chart:
Artemis 

## Project description :fountain_pen:
NUSPlanner is a productivity-centric web application that utilises statistics and visual summaries to give users a clear view of their time-management in three areas: work, academics and extracurricular activities. This empowers users to manage their priorities effectively so that they can acquire the relevant skills to boost their employability and differentiate themselves from their peers. 

Adhering to its core focus of catering to student demographics, NUSPlanner is integrated with NUSMODS, a popular module planning website for students, so that students can also track their modular progress. This ensures that users of NUSPlanner remain focused on their goals and stay ahead of the game at all times.

## Motivation :fire:
Contrary to popular belief, education is no longer the golden ticket to employment in Singapore.

According to a report by professional networking platform LinkedIn, **39% of companies in Singapore look for employees with technical skills, which is nearly 2 times higher than companies who value traditional qualifications such as education and working experience.**

![Screenshot 2022-05-30 at 2 46 31 PM](https://user-images.githubusercontent.com/79785001/172121911-2c98bb6b-dd3d-44b1-b89d-515441a20abe.png)

If acquiring an arsenal of technical skills like programming and design are not enough to cause headaches for an undergraduate looking to secure his first job, being part of an ever-growing population of university graduates certainly would. 

As of 2020, being **ONE in the 33% of Singaporean degree holders** translates to being ** ONE in 1.9 million**, or more conveniently, **0.0000526% of Singaporeans coveting employment.** The oversaturation of skilled workers in the local job industry can cause the job search for an undergraduate to turn aggressive, or even abusive very quickly as they compete relentlessly with many hopefuls to land their first job.

With this problem in mind, we hope to design a user-friendly application that will help undergraduates remain cognisant of both their working portfolio and academic progress early on in their university journey. This way, much despair and anxiety can be averted, as one can do the necessary homework and preparation needed to land his dream job

## User stories :page_facing_up:
1. As a student, I want to be able to plan and track my progress I have or plan to make in NUS, be it academically, work-related or extracurricular.

2. As a student, I want to be able to look at overall progress I have made during the time I was in NUS.

3. As a student, I want to be able to summarise how my recent workload has been divided, in order to determine where my time is being spent.

## Installation and Set-Up :gear:
1. Install react-js from [create-react-app](https://github.com/facebook/create-react-app)
2. Clone from GitHub repository: https://github.com/OngMinXian/NUSPlanner
3. Navigate to the src folder and instll the following dependencies 
``` bash 
npm i react-router-dom
npm i react-bootstrap
npm install --save react-big-calendar --legacy-peer-deps
npm i react-datepicker
npm i date-fns
npm i styled-components
npm i react-icons
```
5. Within the src folder, install the dependencies for the Firebase database:
```bash 
npm i firebase
```
6. Create the .env.local file containing the Firebase API keys
  - This file should be created on the same level as the src folder
  - Email Shanice at e0774411@u.nus.edu for details.

