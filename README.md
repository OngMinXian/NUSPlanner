# NUSPlanner :books:
A web application integrated with NUSMODs that helps students to optimise their time in the areas of work, academics and extracurricular activities.

## Proposed level of achievement :bar_chart:
Artemis 

## Project description :memo:
NUSPlanner is a productivity-centric web application that utilises statistics and visual summaries to give users a clear view of their time-management in three areas: work, academics and extracurricular activities. This empowers users to manage their priorities effectively so that they can acquire the relevant skills to boost their employability and differentiate themselves from their peers. 

Adhering to its core focus of catering to student demographics, NUSPlanner is integrated with NUSMODS, a popular module planning website for students, so that students can also track their modular progress. This ensures that users of NUSPlanner remain focused on their goals and stay ahead of the game at all times.

## Motivation :fire:
Contrary to popular belief, education is no longer the golden ticket to employment in Singapore.

According to a report by professional networking platform LinkedIn, **39% of companies in Singapore look for employees with technical skills, which is nearly 2 times higher than companies who value traditional qualifications such as education and working experience[^1].**

[^1]: https://www.straitstimes.com/singapore/jobs/singapore-employers-prioritise-skills-over-education-experience-linkedin-survey#:~:text=SINGAPORE%20(THE%20BUSINESS%20TIMES)%20%2D,LinkedIn%20said%20in%20a%20report

![Screenshot 2022-05-30 at 2 46 31 PM](https://user-images.githubusercontent.com/79785001/172121911-2c98bb6b-dd3d-44b1-b89d-515441a20abe.png)

If acquiring an arsenal of technical skills like programming and design are not enough to cause headaches for an undergraduate looking to secure his first job, being part of an ever-growing population of university graduates certainly would. 

As of 2020, being **ONE in the 33% of Singaporean degree holders[^2]** translates to being **ONE in 1.9 million**, or more conveniently, **0.0000526% of Singaporeans coveting employment.** The oversaturation of skilled workers in the local job industry can cause the job search for an undergraduate to turn aggressive, or even abusive very quickly as they compete relentlessly with many hopefuls to land their first job.

[^2]: https://www.straitstimes.com/singapore/spore-population-better-educated-across-age-ethnicity-women-make-greater-strides

With this problem in mind, we hope to design a user-friendly application that will help undergraduates remain cognisant of both their working portfolio and academic progress early on in their university journey. This way, much despair and anxiety can be averted, as one can do the necessary homework and preparation needed to land his dream job

## User stories :page_facing_up:
1. As a student, I want to be able to plan and track my progress I have or plan to make in NUS, be it academically, work-related or extracurricular.

2. As a student, I want to be able to look at overall progress I have made during the time I was in NUS.

3. As a student, I want to be able to summarise how my recent workload has been divided, in order to determine where my time is being spent.

## Tech stacks involved :electric_plug:
| Tech | Purpose | Reasons behind choice 
| ------------- | ------------- | ------------- |
| HTML  | To structure the layout of the web page and its components  | 1. Required to create a website
| CSS  | To align and style the components in the web page | 1. Consistent design </br></br> 2. Compatible across different screen sizes |
| Javascript | To enable interactivity for the web page | 1. Easy to learn <br /></br> 2. Simple to use |
| ReactJS | For web page design and interactivity | 1. Free <br /></br> 2. Easy to learn |
| Firebase | Database to store user information and in-application data | 1. Simple to use <br /></br> 2. Free |
| Google Analytics SDK | To analyse user accounts and user submitted reviews | 1. Powerful in helping us analyse user behaviour and data. |
| NUSMODs API | To collect all information pertaining to modules offered in NUS | 1. NUSMODs contains all the information on every module and is free for access upon request |

## Installation and Set-Up :hammer_and_wrench:
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
  - Email Shanice at e0774411@u.nus.edu for details on the Firebase API keys 

## Proposed system architecture 	:label:
![MS1 Overall Class Diagram drawio](https://user-images.githubusercontent.com/79785001/172174212-c7665734-6d6b-4e4d-bd1e-ac4f0c59bcb3.png)

## Proposed core features :desktop_computer:
### 1. Login and authentication system :lock:
  - Login page
  - Sign-up page 
  - Forget password page 
  
### 2. Dashboard page (Landing page upon login) :chart_with_upwards_trend:
  - **_Descriptive statistics_** for the following 3 segments:
    - #### Productivity :fountain_pen:
      - Productive hours, to be expressed as a percentage in a progress bar and a trend in a line graph
    - #### Wellness :leaves:
      - Overall mood of each day to be rated and given an average score over a period of time 
    - #### Summary :page_facing_up:
      - Pie chart for user to get a breakdown of the duration that they devote to each category (academics/work/extracurriculars) per week/month/year
     
### 3. Today page :round_pushpin:
  - Displays the tasks that users have assigned themselves for the day 
  - Users can **_create tasks and delete tasks for that very day_**. 
    - Tasks are displayed in chronological order. 

### 4. Calendar page :calendar:
  - Displays a calendar that allows users to **_add, remove, resize, and drag and drop events_**
    - #### Adding events :heavy_plus_sign:
      - Events are added by keying in a title for the event, as well as the start date and time and end date and time for the event 
    - #### Removing events :heavy_minus_sign:
      - Events can be removed by double clicking on the event, which will trigger a pop up asking the user to confirm the deletion
    - #### Resizing events :left_right_arrow:
      - Events can be resized by dragging the top and bottom/ left and right limits of the rectangle that the event spans 
      - This allows the number of days that the event spans and the event duration to be adjusted with ease 
    - #### Dragging and dropping events :arrows_counterclockwise:
      - Events can be dragged and dropped over to different days and timeslots, allowing for customisability without having to delete an existing event and input another in its place

- Users can **_add events with "special" tags_** which belong to the work or extracurricular categories :briefcase:
  - #### Adding events with a "special" tag :bookmark:
    - Triggers extra fields for user to input the details of their activity, which is used for generating the descriptive summaries in the Dashboard page and the content in the Progress Report page 
    - #### Example 1: When the work special tag is selected, the user will have to fill up the following additional fields: 
      - User’s role in the workplace
      - Description of duties undertaken
      - Duration taken to complete assigned tasks 
      - Name of organisation that user is employed under
    - #### Example 2: When the extracurriculars special tag is selected, the user will have to fill up the following additional fields: 
      - User’s role or responsibility in their co-curricular activity
      - Hours committed to each activity
      - Name of organisation that user is a part of 

### 5. Modules page :bookmark_tabs:
  - **Advanced feature for Artemis -> Integration with NUSMODs**
  - Users can plan their modules for every Academic Year/Semester using the following features from the NUSMODs Integration: 
    - **_Search for modules in web application based on the following criteria:_** 
      - Name
      - Module Code
      - Semester offered
      - No exam
      - Number of MCs
      - Has S/U options
      - Time
      - Lessons in school
      - Venue (Will require extra effort since it involves geographical location, implement if time permits)

### 6. Progress Report page :card_index_dividers:
  - Helps users to **_track their academic progress_** for their primary major and (if applicable) second degree/major/minor, including their **_progress in work and extracurricular activities_** 
    - #### Tracking of academic progress :notebook:
      - Users can input/update their grades for each module per semester
      - CAP for individual semesters as well as cumulative CAP
      - Data representation of CAP trend
      - Progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion
      - (If applicable) Features here extended to second degree/major/minor
    - #### Monitoring progress in the work and extracurricular activities :briefcase:
      - Users can view all their activities that they have logged under the work and extracurricular "special" tags in this page, enabling them to draft out a resume or make plans to boost their portfolio effectively

### 7. Profile page :bust_in_silhouette:
  - Allows users to **_adjust their account details_** 
    - #### Fields that can be changed ####
      - Username 
      - Email 
      - Profile picture (default profile picture is set if no pictures are specified)
      - Course 
      - Matriculation year 
      - Year of graduation

## Timeline and Executables :alarm_clock:

### :one: Before: Evaluation Milestone 1 (30 May 2022)

#### Planning Stage:
  - [x] UI Design using Figma 
  - [x] Design diagrams 
  - [x] Set up Firebase backend and plan data storage
  - [x] Set up Google Analytics

#### Set up Stage:
  - [x] Create basic theme and structure for the app
  - [x] Install packages and softwares
  - [x] Learn all relevant tech stacks (HTML, CSS, ReactJS, Firebase, Flexbox)
  - [x] Familiarise ourselves with NUSMODS API
  - [x] Read and upload data into Firebase
  - [x]  Create login and authentication system :lock: 
  - [x]  Complete the code and design for the Profile page :bust_in_silhouette:
    - [x] User can edit all fields in their profile and set a profile picture 
    - [x] User can log out of their account
    - [x] Default profile picture is displayed if the user does not set a profile picture

### :two: Before: Evaluation Milestone 2 (27 Jun 2022).

- [x] Complete the code and design for the Calendar page **_by 13 June 2022_** :calendar:
    - [x] Month and year layout for calendar to be completed **-> Completed in MS1**
    - [x] Ensure that interactivity for drag and drop + resizing works as expected **-> Completed in MS1**
    - [x] User is able to add events by day, time and title, as well as to delete events **-> Completed in MS1**
    - [ ] Link data for calendar events to Firebase <br /><br />
- [x] Complete the code and design required for the user to create events in the Today page **_by 6 June 2022_** :round_pushpin:
    - [x] Link data for created events to Firebase **-> Completed in MS1**
    - [ ] Link data to be reflected on the calendar in the Calendar page <br /> <br />
- [ ] Complete the code and design for events with "special" tags, Work and Extracurricular categories **_by 25 June 2022_** :briefcase:
    - [ ] Ensure that special "tags" are being set-up in the Calendar page 
    - [ ] Code the event whereby selecting a "special" tag will lead to more input fields for user to key in the relevant data <br /> <br />
- [ ] Complete the code and design for the Modules page **_by 20 June 2022_** :bookmark_tabs: -> Integration with NUSMODs, Artemis advanced feature 
    - [ ] Retrieve data from NUSMODs and sort it based on the search criteria specified in the web application 
    - [ ] Render the data above and output it in a user-friendly layout <br /> <br />
- [ ] Implement feature where user can share their timetable with others by generating a PDF :clipboard:

### :three: Before: Evaluation Milestone 3 (25 Jul 2022)
- [ ] Complete the Dashboard page of the planner :chart_with_upwards_trend: <br /> <br />
    - [ ] Complete graphics and design for the Productivity segment by **_30 June 2022_** :fountain_pen:
      - [ ]  Code and design for productive hours to be expressed in a progress bar 
      - [ ]  Code and design for productive hours to be expressed as a trend in a line graph 
      - [ ]  User input to be stored in Firebase <br /> <br />
    - [ ] Complete graphics and design for the Wellness segment **_by 5 July 2022_** :leaves:
      - [ ] Code and design for overall mood of the day to be represented as 5 different emojis and assigned a score 
      - [ ] User input to be stored in Firebase 
      - [ ] Average score for mood to be assigned to user <br /> <br />
    - [ ] Complete graphics and design for the Summary segment by **_10 July 2022_** :page_facing_up:
      - [ ] Code and design for pie chart which enables user to get a breakdown of the duration they devote to each category (academics/work/extracurriculars) per week/month/year <br /> <br />
- [ ] Complete the Progress Report page of the planner by **_23 July 2022_** :card_index_dividers: <br /> <br />
    - [ ] Complete the section which allows users to track their academic progress 	:notebook:
      - [ ] Users can input/update their grades for each module per semester 
      - [ ] Calculation of CAP for individual semesters as well as cumulative CAP
      - [ ] Data representation of CAP trend
      - [ ] User input to be stored in Firebase 
      - [ ] Code and design for progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion 
      - [ ] Extend features to second degree/major/minor <br /> <br />
    - [ ] Complete the section which allows users to track their progress in their work/extracurricular activities :briefcase: 
      - [ ] Code and design for users to view all events they have logged under these categories
   
 ### Before: Splashdown (22 Aug 2022) :checkered_flag:
 - [ ] Create project poster and video
 - [ ] Publish web application online
 - [ ] Test web application and fix bugs
 - [ ] If there is enough time, the feature below will be implemented:
    - [ ] Incorporate Telegram link to modules in the Module page 
      - [ ] Parse TeleNUS to include a link to the telegram channel within the module’s information page

## Progress in Milestone 1 :triangular_flag_on_post: :one:
### Technical progress :keyboard:
![MS1 Current Progress Class Diagram drawio](https://user-images.githubusercontent.com/79785001/172189893-8475d118-ae11-4d5f-a638-cf69ae1d985b.png)

### Summary of tasks completed :white_check_mark:
- Please refer to the tasks listed under the **Timeline and Executables** section above for more details on the tasks completed
- All the deliverables required for Milestone 1 are completed, along with a few deliverables for Milestone 2

|  Task Name | Details | Link (if applicable) |
| ------------- | ------------- | ------------- |
| Figma Prototype :bulb:|  1. Drafted out the design elements of all pages in the web application <br /><br /> 2. Transitions and animations added for all relevant features  | [Link to Figma prototype](https://www.figma.com/proto/mvXHFUbWjlcstcUr1ZB1MB/Mentor-Matching-Prototype-(Extra-Effects-Added)?node-id=3%3A2&scaling=scale-down&page-id=0%3A1&starting-point-node-id=3%3A2) <br /><br /> [Link to Figma demo video](https://drive.google.com/file/d/1voxKLLNQAammyWgwaj2RplNJAg7oiw5U/view?usp=sharing) |
| Login and Authentication system :lock:  | 1. The login, sign-up and forget password features have been completed <br /><br /> 2. For the forget password feature, an email will be sent to the user, prompting him to reset his password <br /><br /> 3. Firebase provides the authentication database that allows us to store users' UID, email and passwords. <br /><br /> 4. A “Users” collection in the Firestore database has been created to store user objects  | Not applicable |
| Today page :round_pushpin: | 1. Today page displays the tasks users have assigned for themselves for the day <br /> <br /> 2. Users can create tasks and delete tasks <br /><br /> 3. Tasks created by the user are sorted in chronological order. <br /><br /> 4. Tasks created by the user are stored in the “Tasks” collection on the Firestore database. | Not applicable |
| Calendar page :calendar: | 1. Calendar page displays a calendar that is equipped with the following functionalities: adding, removing, resizing, and dragging and dropping events <br /><br /> 2. Users add an event by assigning a title, start date + time and end date + time to the event <br /> <br /> 3. Events created by the user are stored in the “Events” collection on the Firestore database. | Not applicable |
| Profile Page :bust_in_silhouette: | 1. Profile page is linked to Firebase and reflects any edits that a user maks to his profile <br /><br /> 2. Upon creating an account, a new “user” object is created into the “Users” collection in Firebase. Some fields are left as “-” by default before the user edits the profile. <br /><br /> 3. Users can upload a profile picture from their computer onto the website. This picture is stored in the storage database. <br /><br /> 4. If no ptofile picture has been uploaded by the user, a default profile picture which has been stored in the storage database will be displayed | Not applicable |

## Software Engineering Practices :gear:
### Approach to software design :computer:
We adopted a [bottom-up approach](https://www.geeksforgeeks.org/difference-between-top-down-and-bottom-up-integration-testing/) towards multi-level design in Milestone 1. 
![top2](https://user-images.githubusercontent.com/79785001/172364575-37e8bcd9-0b3d-4692-bfa1-53a9b49dc7b8.png)

As novices in software engineering, **producing code for the layout and design of the web application was our first priority** as it would allow us to produce a user interface, as well as to hone our understanding of HTML, CSS and ReactJS. 

We then **proceeded to develop more technical features that involved routing, hooks and interactivity** after we gained proficiency in styling our web page. During this rudimentary stage, we directed our focus to develop the basic functionalities required for each web page before adding in any interactive features that would be triggered by user input (eg. Coding out the calendar layout properly in the Calendar Page before implementing the drag and drop functionality). This bottom-up approach helped us to understand the limitations of our code and the packages that we chose to use, enabling us to make well-informed decisions about the features that we wished to implement.

Finally, we **integrated the users' account information and in-application data to Firebase.** This step was crucial in binding our the frontend and backend of our web application together, enabling us to produce a viable end product. We strongly feel that the bottom-up approach helped us to develop the fundamental aspects of our web application effectively, thus we will continue to use this approach for future milestones.

### Project management and planning :spiral_notepad:

We **keep track of our tasks and executables using a combination of Google Docs, Github and Google sheets** 

The **checklist and table functions in Google Docs** help us to list down the criteria that each component of our milestone submission is expected to address. Following the fulfillment of a certain criteria, each box is checked off accordingly. 

We also ensure that we update the Google docs with the relevant links or new information each time after we receive emails from the programme supervisor or our student mentor. 

Checklist for Artemis Requirements |  Criteria to meet for milestone submissions
:-------------------------:|:-------------------------:
![Screenshot 2022-06-07 at 7 53 44 PM](https://user-images.githubusercontent.com/79785001/172375940-575f8b7d-e270-4200-93a0-a9ad3a0eb7f4.png) | ![Screenshot 2022-06-07 at 7 53 05 PM](https://user-images.githubusercontent.com/79785001/172375902-71d037ec-54db-45e9-af1c-03a976adc273.png)|

Our **project log in Google sheets allows us to delegate roles to each other effectively and monitor each others' progress on tasks**. The details of every task assigned to each member is logged down consistently, along with the duration taken to accomplish each task. Furthermore, we have incorporated a **column that records the tasks completed by our team in our project log**, giving us a clear idea of our productivity as a team.

The assigned tasks and their associated deadlines are influenced by the **Timeline and Executables** section of this markdown document, facilitating the process of planning to meet deadlines. 

Project log on Google Sheets| Timeline and Executables section on GitHub
:-------------------------:|:-------------------------:
![Screenshot 2022-06-07 at 8 26 54 PM](https://user-images.githubusercontent.com/79785001/172379314-5cc32389-c9f6-4a09-ae11-9935c8e07010.png) |![Screenshot 2022-06-07 at 7 53 05 PM](https://user-images.githubusercontent.com/79785001/172375902-71d037ec-54db-45e9-af1c-03a976adc273.png)|

### Version control and workflow management :file_cabinet:
We constantly **run the code on the deployment server** and ensure that there are no errors before pushing the code onto GitHub. **Branching** is being used to implement new features and **pull requests** are initiated each time a merge is initiated. 

On top of this, we **add succinct commit messages** on GitHub wherever possible to track changes made to the code and to ensure the consistency of our code at all times.

## Technical difficulties encountered :toolbox:

| Nature of Issue  | Reference on GitHub | Solved/Open | Follow-up
| ------------- | ------------- | ------------- | ------------- |
| Standardising layout of web page components across all screen sizes | [Issue 3](https://github.com/OngMinXian/NUSPlanner/issues/3) | Solved | Consulted student advisor, solved by formatting page using react-bootstrap and flexbox instead of pure CSS |
| Content Cell  | Content Cell  |


 
