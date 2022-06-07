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
    - #### Productivity ####
      - Productive hours, to be expressed as a percentage in a progress bar and a trend in a line graph
    - #### Wellness ####
      - Overall mood of each day to be rated and given an average score over a period of time 
    - #### Summary ####
      - Pie chart for user to get a breakdown of the duration that they devote to each category (academics/work/extracurriculars) per week/month/year
     
### 3. Today page :round_pushpin:
  - Displays the tasks that users have assigned themselves for the day 
  - Users can **_create tasks and delete tasks for that very day_**. 
    - Tasks are displayed in chronological order. 

### 4. Calendar page :calendar:
  - Displays a calendar that allows users to **_add, remove, resize, and drag and drop events_**
    - #### Adding events ####
      - Events are added by keying in a title for the event, as well as the start date and time and end date and time for the event 
    - #### Removing events ####
      - Events can be removed by double clicking on the event, which will trigger a pop up asking the user to confirm the deletion
    - #### Resizing events ####
      - Events can be resized by dragging the top and bottom/ left and right limits of the rectangle that the event spans 
      - This allows the number of days that the event spans and the event duration to be adjusted with ease 
    - #### Dragging and dropping events #### 
      - Events can be dragged and dropped over to different days and timeslots, allowing for customisability without having to delete an existing event and input another in its place

- Users can **_add events with "special" tags_** which belong to the work or extracurricular categories
  - #### Adding events with a "special" tag ####
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
    - #### Tracking of academic progress ####
      - Users can input/update their grades for each module per semester
      - CAP for individual semesters as well as cumulative CAP
      - Data representation of CAP trend
      - Progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion
      - (If applicable) Features here extended to second degree/major/minor
    - #### Monitoring progress in the work and extracurricular activities ####
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

| Stage  | Task |
| ------------- | ------------- |
| Planning  |   - [x] UI Design using Figma <br />
                - [x] Design diagrams (<br />)
                - [x] Set up Firebase backend and plan data storage (<br />)
                - [x] Set up Google Analytics   |
| Set up  |   - [x] Create basic theme and structure for the app
  - [x] Install packages and softwares
  - [x] Learn all relevant tech stacks (HTML, CSS, ReactJS, Firebase, Flexbox)
  - [x] Familiarise ourselves with NUSMODS API
  - [x] Read and upload data into Firebase
  - [x]  Create login and authentication system :lock:
  - [x]  Complete the code and design for the Profile page :bust_in_silhouette:
    - [x] User can edit all fields in their profile and set a profile picture 
    - [x] User can log out of their account
    - [x] Default profile picture is displayed if the user does not set a profile picture  |

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
    - [ ] Link data for calendar events to Firebase
- [x] Complete the code and design required for the user to create events in the Today page **_by 6 June 2022_** :round_pushpin:
    - [x] Link data for created events to Firebase **-> Completed in MS1**
    - [ ] Link data to be reflected on the calendar in the Calendar page
- [ ] Complete the code and design for events with "special" tags which fall under the Work and Extracurricular categories **_by 25 June 2022_**
    - [ ] Ensure that special "tags" are being set-up in the Calendar page 
    - [ ] Code the event whereby selecting a "special" tag will lead to more input fields for user to key in the relevant data 
- [ ] Complete the code and design for the Modules page **_by 20 June 2022_** :bookmark_tabs: -> Integration with NUSMODs, Artemis advanced feature 
    - [ ] Retrieve data from NUSMODs and sort it based on the search criteria specified in the web application 
    - [ ] Render the data above and output it in a user-friendly layout
- [ ] Implement feature where user can share their timetable with others by generating a PDF

### :three: Before: Evaluation Milestone 3 (25 Jul 2022)
- [ ] Complete the Dashboard page of the planner :chart_with_upwards_trend:
    - [ ] Complete graphics and design for the Productivity segment by **_30 June 2022_**
      - [ ]  Code and design for productive hours to be expressed in a progress bar 
      - [ ]  Code and design for productive hours to be expressed as a trend in a line graph 
      - [ ]  User input to be stored in Firebase 
    - [ ] Complete graphics and design for the Wellness segment **_by 5 July 2022_**
      - [ ] Code and design for overall mood of the day to be represented as 5 different emojis and assigned a score 
      - [ ] User input to be stored in Firebase 
      - [ ] Average score for mood to be assigned to user 
    - [ ] Complete graphics and design for the Summary segment by **_10 July 2022_**
      - [ ] Code and design for pie chart which enables user to get a breakdown of the duration they devote to each category (academics/work/extracurriculars) per week/month/year
- [ ] Complete the Progress Report page of the planner by **_23 July 2022_** :card_index_dividers:
    - [ ] Complete the section which allows users to track their academic progress 
      - [ ] Users can input/update their grades for each module per semester 
      - [ ] Calculation ofCAP for individual semesters as well as cumulative CAP
      - [ ] Data representation of CAP trend
      - [ ] User input to be stored in Firebase 
      - [ ] Code and design for progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion
      - [ ] Extend features to second degree/major/minor
    - [ ] Complete the section which allows users to track their progress in their work/extracurricular activities
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
### Screenshots of pages :camera:

