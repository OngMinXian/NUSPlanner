# NUSPlanner :books:
A web application integrated with NUSMODs that helps students to optimise their time in the areas of work, academics and extracurricular activities.

## Proposed level of achievement :bar_chart:
Artemis 

## Project description :memo:
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

## Proposed core features :desktop_computer:
### 1. Login and authentication system ### 	:lock:
  - Login page
  - Sign-up page 
  - Forget password page 
  
### 2. Dashboard page (Landing page upon login) ### :chart_with_upwards_trend:
  - **_Descriptive statistics_** for the following 3 segments:
    - #### Productivity ####
      - Productive hours, to be expressed as a percentage in a progress bar and a trend in a line graph
    - #### Wellness ####
      - Overall mood of each day to be rated and given an average score over a period of time 
    - #### Summary ####
      - Pie chart for user to get a breakdown of the duration that they devote to each category (academics/work/extracurriculars) per week/month/year
     
### 3. Today page ### :round_pushpin:
  - Displays the tasks that users have assigned themselves for the day 
  - Users can **_create tasks and delete tasks for that very day_**. 
    - Tasks are displayed in chronological order. 

### 4. Calendar page ### :calendar:
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

- Users can **_add events with "special" tags_** which belong to either the work or extracurricular categories
  - #### Adding events with a "special" tag ####
    - Triggers extra fields for user to input the details of their activity, which is used for generating the descriptive summaries in the Dashboard page and the content in the Progress Report page 
    - Example 1: When the work special tag is selected, the user will have to fill up the following additional fields: 
      - User’s role in the workplace
      - Description of duties undertaken
      - Duration taken to complete assigned tasks 
      - Name of organisation that user is employed under
    - Example 2: When the extra-curriculars special tag is selected, the user will have to fill up the following additional fields: 
      - User’s role or responsibility in their co-curricular activity
      - Hours committed to each activity
      - Name of organisation that user is a part of 

### 5. Progress Report page ### :card_index_dividers:
  - Helps users to **_track their academic progress_** for their primary major and (if applicable) second degree/major/minor, including their **_progress in work and extracurricular activities_**
    - #### Tracking of academic progress ####
      - CAP for individual semesters as well as cumulative CAP
      - Data representation of CAP trend
      - Progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion
      - (If applicable) Features here extended to second degree/major/minor
    - #### Monitoring progress in the work and extracurricular activities ####
      - Users can view all their activities that they have logged under the work and extracurricular "special" tags in this page, enabling them to draft out a resume or make plans to boost their portfolio effectively

### 6. Profile page ### :bust_in_silhouette:
  - Allows users to **_adjust their account details_** 
    - #### Aspects that can be changed ####
      - Username 
      - Email 
      - Profile picture (default profile picture is set if no pictures are specified)
      - Course 
      - Matriculation year 
      - Year of graduation

#### 7. Settings page #### :gear:
  - Users can **_input/update their grades for each module_** per semester

    





