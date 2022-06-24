# NUSPlanner :books:
A web application integrated with NUSMODs that helps students to optimise their time in the areas of work, academics and extracurricular activities.

## Proposed level of achievement :bar_chart:
Artemis 

## Links to project materials :mag:
:link: [Project Log](https://docs.google.com/spreadsheets/d/1VgjFcwcWWh3wxjAQzy2Xt01viB7zWkEqdCqpskZgZOU/edit?usp=sharing) <br />
:link: [Video demo of Web App](https://drive.google.com/file/d/1GWkICfWkSIvc1QIKtg3mpIe213slZZnm/view?usp=sharing) <br />
:link: [Project Poster](https://drive.google.com/drive/folders/1Rqgj6740apkCmYBPgHh6_XaPx1zzyx2I) <br />
:link: [Project Video](https://drive.google.com/drive/folders/1Rqgj6740apkCmYBPgHh6_XaPx1zzyx2I) <br />
:link: [Figma Prototype](https://www.figma.com/proto/mvXHFUbWjlcstcUr1ZB1MB/Mentor-Matching-Prototype-(Extra-Effects-Added)?node-id=3%3A2&scaling=scale-down&page-id=0%3A1&starting-point-node-id=3%3A2) <br />
:link: [Figma Video](https://drive.google.com/file/d/1voxKLLNQAammyWgwaj2RplNJAg7oiw5U/view?usp=sharing) <br />

## Project description :memo:
NUSPlanner is a productivity-centric web application that utilises statistics and visual summaries to give users a clear view of their time-management in three areas: work, academics and extracurricular activities. This empowers users to manage their priorities effectively so that they can acquire the relevant skills to boost their employability and differentiate themselves from their peers. 

Adhering to its core focus of catering to student demographics, NUSPlanner is integrated with NUSMODS, a popular module planning website for students, so that students can also track their modular progress. This ensures that users of NUSPlanner remain focused on their goals and stay ahead of the game at all times.

## Motivation :fire:
Contrary to popular belief, education is no longer the ticket to employment in Singapore.

According to a report by professional networking platform LinkedIn, **39% of companies in Singapore look for employees with technical skills, which is nearly 2 times higher than companies who value traditional qualifications such as education and working experience[^1].**

[^1]: https://www.straitstimes.com/singapore/jobs/singapore-employers-prioritise-skills-over-education-experience-linkedin-survey#:~:text=SINGAPORE%20(THE%20BUSINESS%20TIMES)%20%2D,LinkedIn%20said%20in%20a%20report

![Screenshot 2022-05-30 at 2 46 31 PM](https://user-images.githubusercontent.com/79785001/172121911-2c98bb6b-dd3d-44b1-b89d-515441a20abe.png)

If acquiring an arsenal of technical skills like programming and design are not enough to cause headaches for an undergraduate looking to secure his first job, being part of an ever-growing population of university graduates certainly would. 

As of 2020, being **ONE in the 33% of Singaporean degree holders[^2]** translates to being **ONE in 1.9 million**, or more conveniently, **0.0000526% of Singaporeans coveting employment.** The oversaturation of skilled workers in the local job industry can cause the job search for an undergraduate to turn aggressive, or even abusive very quickly as they compete relentlessly with many hopefuls to land their first job.

[^2]: https://www.straitstimes.com/singapore/spore-population-better-educated-across-age-ethnicity-women-make-greater-strides

With this problem in mind, we hope to design a user-friendly application that will help undergraduates remain cognisant of both their working portfolio and academic progress early on in their university journey. This way, much despair and anxiety can be averted, as one can do the necessary homework and preparation needed to land his dream job

## User stories :page_facing_up:
1. **\[Epic]** As a student, I want to be able to ***track my progress in NUS***, be it academically, work-related or extracurricular, so that I can optimise how I spend my time
  - As a student, I can view the proportion of time that I spend across all categories of events that I log into the calendar 
  - As a student, I can store and view important details for events that matter to my portfolio
  - As a student, I can create an academic plan for future semesters and view my degree progress

2. As a student, I want to be ***more conscious of my physical and emotional health*** so that I can improve my wellbeing
  - Conditions
    - [x] Provide a range of moods (eg. stressed, relaxed etc.) for users' to select their mood for the day
    - [ ] Provide a range of acitivities (eg. studying, exercising) that users can associate with their mood for the day
    - [x] Create a sleep tracking system where users can indicate their sleep quality and the number of hours that they have rested for the day

3. As a student, I want a ***customisable planning system that is tailored to all aspects of my life*** so that I can stay organised with ease
  - Conditions
    - [x] Design custom user tags for users to add and track different categories of activities
    - [x] Users can input their modules taken and their grades for each module 
    - [ ] Users can view descriptive summaries generated for all categories of events that they log into the calendar


## Tech stacks involved :electric_plug:
| Tech | Purpose | Reasons behind choice 
| ------------- | ------------- | ------------- |
| HTML  | To structure the layout of the web page and its components  | 1. Required to create a website
| CSS  | To align and style the components in the web page | 1. Consistent design </br></br> 2. Compatible across different screen sizes |
| Javascript | To enable interactivity for the web page | 1. Easy to learn <br /></br> 2. Simple to use |
| ReactJS | For web page design and interactivity | 1. Free <br /></br> 2. Easy to learn |
| Firebase | Database to store user information and in-application data | 1. Simple to use <br /></br> 2. Free |
| NUSMODs API | To collect all information pertaining to modules offered in NUS | 1. NUSMODs contains all the information on every module and is free for access upon request |

## Installation and Set-Up :hammer_and_wrench:
1. Install react-js from [create-react-app](https://github.com/facebook/create-react-app)
2. Clone from GitHub repository: https://github.com/OngMinXian/NUSPlanner
3. Navigate to the src folder and instll the following dependencies 
``` bash 
npm i react-router-dom
npm install react-bootstrap bootstrap@5 //command has not been tested yet, previous one that did not work is: npm install react-bootstrap bootstrap@4.6.0
npm install --save react-big-calendar --legacy-peer-deps
npm i react-datepicker
npm i react-datetime-picker
npm i date-fns
npm i styled-components
npm i react-icons
npm i react-select
```
**IMPORTANT: bootstrap version must be compatible with react bootstrap version in order for styling to work properly. Visit this [link](https://stackoverflow.com/questions/65472384/react-bootstrap-only-close-button-styling-not-working) for troubleshooting if this issue is encountered**

5. Within the src folder, install the dependencies for the Firebase database:
```bash 
npm i firebase
```
6. Create the .env.local file containing the Firebase API keys
  - This file should be created on the same level as the src folder
  - Email Shanice at e0774411@u.nus.edu for details on the Firebase API keys 

## Proposed system architecture :label:
![MS1 Architecture Diagram-Architectural Diagram drawio (2)](https://user-images.githubusercontent.com/79785001/175491946-c3ca7a57-e034-4f26-83c0-d36e7ecbf7c7.png)

## Feature list :desktop_computer:
#### Keys used to prioritise requirements :key:
- **\[High]** High priority
- **\[Medium]** Medium priority
- **\[Low]** Low priority
<br></br>

### 1. Login and authentication system :lock:
- #### Login page [High]
- #### Sign-up page [High]
- #### Forget password page [High]

### 2. Today page :round_pushpin: - Landing page upon login

  - #### Mood tracking system [High]
    - Mood of the day
    - Categories associated with mood of the day [Medium]
  - #### Sleep tracking system [High]
    - Quality of sleep 
    - Number of hours of sleep 
  - #### Checklist for events that start and end on that day itself [High]
    - Add event 
    - Delete event 
    - Display events in chronological order
  - #### Display for calendar events that fall on that day itself [High]
    - Add event 
    - Delete event 
    - Display events in chronological order
    - Create custom tags - Refer to "Create custom tags" category under the next section for more details
    - Delete custom tags

### 3. Calendar page :calendar:

- #### Add Events [High]
  - Event title 
  - Start date and time 
  - End date and time 
  - Event tag 
  - Extra input fields -- when the work/extracurriculars tag is selected 
    - Organisation name 
    - Description of user's role 
    - Description of duties undertaken by the user
    - Event description
- #### Edit Events [High]
  - Drag and drop events across timeslots/days 
  - Resize events to span across different timeslots/days
  - Delete events 
- #### Create custom tags [High]
  - Tag label
  - Tag colour
- #### Delete custom tags [High]

### 4. Dashboard page :chart_with_upwards_trend:
- #### Productivity [High]
  - Productive hours expressed as:
    - Percentage in a progress bar
    - Trend in a line graph
- #### Wellness [High]
  - Overall mood of each day to be rated and given an average score 
  - Identify activities most commonly associated with a particular mood
  - Identify trends in sleep quality and duration
- #### Summary [High] 
  - Pie chart for user to get a breakdown of the duration that they devote to each all categories specified in the calendar tags per week/month/year

### 5. Progress Report page :card_index_dividers:
  - #### View history of events logged by tag category [High]
  - #### View a trend in academic data [High]
      - Best and poorest performing modules
      - CAP progression by year

### 6. Modules page :bookmark_tabs: - Advanced Artemis feature
  - #### Search modules by module code [High]
  - #### Filter modules by multiple criteria [High]
    - Semester offered 
    - Has exam 
    - Number of modular credits (MCs)
    - Has S/U options
  - #### Telegram link to group chat for module [Low]

### 7. Profile page :bust_in_silhouette:
  - #### Course details segment [High]
    - Modules taken
    - Verify module code using link to NUSMODs API **[Medium]**
    - Corresponding grades for modules taken
    - Semester that the modules were taken
    - Second major/minor/degree (if applicable) **[Low]**
    - Add semester 
    - Remove semester
  - #### Account settings segment [High]
    - Profile picture (default profile picture is set if no pictures are specified)
    - Username 
    - Email 
    - Faculty
    - Course 
    - Matriculation year 
    - Year of graduation

## Use Cases

  ![MS1 Architecture Diagram-Use Case Diagram drawio](https://user-images.githubusercontent.com/79785001/175489810-17f6cc50-466f-433a-a991-4e768d13f03f.png)

  #### Use Case: UC1 - Creating events
    - System: NUSPlanner
    - Actor: User 
    - Precondition: User is logged in 
    - Guarantees: 
      - Event will be logged only if the event start date and time + event end date and time are specified
      - Extra details for work and extracurriculars tags will be logged only if they are specified by the user 
  
    - MSS: 
      1. User chooses to add a new event
      2. NUSPlanner opens a pop-up tab that requests for the event details
      3. User enters the required details
      4. User confirms 
      5. User input is submitted and stored in the Firestore database 
      6. Event is displayed in the Calendar upon closing the pop up tab
      Use case ends
 
    - Extensions 
      3a. User selects the work/extracurriculars tag 
        3a1. An extra pop-up window with additional text fields are triggered, prompting the user to specify the:
          - Organisation name 
          - Role in organisation
          - Duties undertaken for the activity that he is involved in 
       3a2. User fills in the required details
       3a3. User confirms in the extra-pop up window 
       Use case resumes from step 4
     
      3b. User chooses to omit either the start date and time/end date and time of the event
        *b1. NUSPlanner detects the error 
        *b2. Event details are not submittied and stored in the Firestore database 
        *b3. Event is not displayed in the Calendar upon closing the pop-up tab  
        Use case ends
        
  #### Use Case: UC2 - Editing account settings
    - System: NUSPlanner
    - Actor: User 
    - Precondition: User is logged in 
    
    - MSS: 
      1. User enters the required details 
      2. User confirms 
      3. User input is submitted and stored in the Firestore database 
      4. Page refreshes and updated details are displayed as placeholders in the input fields 
      Use case ends
    
    - Extensions 
      1a. NUSPlanner detects an error in the entered data.
        *a1. NUSPlanner requests for the correct data.
        *a2. User enters new data.
        *Steps a1-a2 are repeated until the data entered are correct.
      Use case resumes from step 2
  
  #### Use Case: UC3 - Editing course details
    - System: NUSPlanner
    - Actor: User 
    - Precondition: User is logged in 
    
    - MSS: 
      1. User selects the year and semester that he wants to input/edit modules for 
      2. User enters the module name and grade attained for that module 
      3. User confirms his changes
      4. User input is submitted and stored in the Firestore database 
      5. Page refreshes and updated details are being displayed in a tabular format
      Use case ends
      
    - Extensions 
      1a. User adds/removes a semester


## Timeline and Executables :alarm_clock:

### :one: Before: Evaluation Milestone 1 (30 May 2022)

#### Planning Stage:
  - [x] UI Design using Figma 
  - [x] Design diagrams 
  - [x] Set up Firebase backend and plan data storage

#### Set up Stage:
  - [x] Create basic theme and structure for the app
  - [x] Install packages and softwares
  - [x] Learn all relevant tech stacks (HTML, CSS, ReactJS, Firebase, Flexbox)
  - [x] Familiarise ourselves with NUSMODS API
  - [x] Read and upload data into Firestore
  - [x]  Create login and authentication system :lock: 
  - [x]  Complete the code and design for the Profile page :bust_in_silhouette:
    - [x] User can edit all fields in their profile and set a profile picture 
    - [x] User can log out of their account
    - [x] Default profile picture is displayed if the user does not set a profile picture
  - [x] Style all website components that have been implemented

### :two: Before: Evaluation Milestone 2 (27 Jun 2022).

- [x] Complete the code and design for the Calendar page **_by 13 June 2022_** :calendar:
    - [x] Month and year layout for calendar to be completed **-> Completed in MS1**
    - [x] Ensure that interactivity for drag and drop + resizing works as expected **-> Completed in MS1**
    - [x] User is able to add events by day, time and title, as well as to delete events **-> Completed in MS1**
    - [x] Link data for calendar events to Firestore
    - [x] Link data for calendar tags to Firestore <br /><br />  
- [x] Complete the code and design required for the user to create events and log their mood + sleep quality in the Today page **_by 6 June 2022_** :round_pushpin:
    - [x] Link data for events created in the checklist to Firestore **-> Completed in MS1**
    - [x] Link data for events created in the events section to the Calendar Page and Firestore
    - [x] Implement mood tracking feature where users can select their mood for the day 
      - [x] Link user input to Firestore
    - [x] Implement sleep tracking feature where users can select their sleep quality and the number of hours of sleep that they had
      - [x] Link user input to Firestore <br /> <br />
- [x] Complete the code and design for events with "special" tags, Work and Extracurricular categories **_by 25 June 2022_** :briefcase:
    - [x] Ensure that default "tags" for work, academics and extracurriculars are being set-up in the Calendar page 
    - [x] Code the event whereby selecting a "special" tag will lead to more input fields for user to key in the relevant data
      - [x] Store user input in Firestore 
    - [x] Allow users to create custom tags by choosing a name and colour for the tag 
      - [x] Users can only delete custom tags  
      - [x] Link new tags created to Firestore <br /> <br />
- [x] Complete the code and design for the Modules page **_by 20 June 2022_** :bookmark_tabs: -> Integration with NUSMODs, Artemis advanced feature 
    - [x] Retrieve data from NUSMODs and sort it based on the search criteria specified 
    - [x] Render the data above in a user-friendly layout 
    - [x] Implement search filters <br></br>
- [x] Develop the profile page further :bust_in_silhouette:
  - [x] Allow users to add and delete semesters 
  - [x] Create feature where users can add module codes and the grades attained in their modules
  - [x] Users can edit module codes and names that have been previously input 
  - [x] User input is linked to Firestore
- [x] Style all website components that have been implemented <br /> <br />

### :three: Before: Evaluation Milestone 3 (25 Jul 2022)
- [ ] Add additional user input for mood to the Today page :round_pushpin: (if time permits) 
  - [ ] User can select a range of activities that are associated with their mood of the day  <br /> <br />
- [ ] Complete the Dashboard page of the planner :chart_with_upwards_trend:
    - [ ] Complete graphics and design for the Productivity segment by **_30 June 2022_** :fountain_pen:
      - [ ]  Code and design for productive hours to be expressed in a progress bar 
      - [ ]  Code and design for productive hours to be expressed as a trend in a line graph 
      - [x]  User input to be stored in Firebase **-> Completed in MS2**  <br /> <br />
    - [ ] Complete graphics and design for the Wellness segment **_by 5 July 2022_** :leaves:
      - [ ] Express duration slept and sleep quality in terms of graphics and descriptive summaries
      - [ ] Analyse data from the mood input system to identify sentiments most commonly experienced by the user 
      - [ ] Analyse data from the mood input system to associate activities most likely to trigger the onset of certain emotions  <br /> <br />
    - [ ] Complete graphics and design for the Summary segment by **_10 July 2022_** :page_facing_up:
      - [ ] Code and design for pie chart which enables user to get a breakdown of the duration they devote to each category (academics/work/extracurriculars) per week/month/year <br /> <br />
- [ ] Complete the Progress Report page of the planner by **_23 July 2022_** :card_index_dividers:
    - [ ] Complete the section which allows users to track their academic progress 	:notebook:
      - [ ] Calculation of CAP for individual semesters as well as cumulative CAP
      - [ ] Data representation of CAP trend
      - [ ] Code and design for progress bar depicting the number of completed modular credits out of the total modular credits required for degree completion 
      - [ ] Extend features to second degree/major/minor (if time permits)
    - [x] Complete the section which allows users to track their progress in their work/extracurricular activities :briefcase: 
      - [x] Code and design for users to view all events they have logged under these categories **-> Completed in MS2**
- [ ] Style all website components that have been implemented <br /> <br />
   
 ### Before: Splashdown (22 Aug 2022) :checkered_flag:
 - [ ] Create project poster and video
 - [ ] Publish web application online
 - [ ] Test web application and fix bugs
 - [ ] If there is enough time, the feature below will be implemented:
    - [ ] Incorporate Telegram link to modules in the Module page 
      - [ ] Parse TeleNUS to include a link to the telegram channel within the module’s information page

## Progress in Milestone 1 :triangular_flag_on_post: :one:

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


## Technical difficulties encountered :toolbox:

| Nature of Issue  | Reference on GitHub | Solved/Open | Follow-up
| ------------- | ------------- | ------------- | ------------- |
| Standardising layout of web page components across all screen sizes | [Issue 3](https://github.com/OngMinXian/NUSPlanner/issues/3) | Solved | Consulted student advisor <br /> <br /> Solved by formatting page using react-bootstrap and flexbox instead of pure CSS |
| Challenges deploying web application on Firebase and GitHub | [Issue 4](https://github.com/OngMinXian/NUSPlanner/issues/4) | Open | Awaiting response from student advisor |
| Challenges formatting layout for elements on top of background image for the login page | [Issue 5](https://github.com/OngMinXian/NUSPlanner/issues/5) | Open | Awaiting response from student advisor |

## Direction for Milestone 2 :arrow_right:
We will act on our student advisor's comments of **deploying the application** and work towards including **detailed evidence of good software engineering in our Project README**. Additionally, we will update our mentor on our progress for Milestone 1 and request for feedback. 

For the technical aspect, we hope to accomplish all the deliverables we have planned under the **Timeline and Executables** section for Milestone 2 and to **resolve all existing technical difficulties**. 

If time permits, we will also gear our application towards integrated user testing using Mocha or other frameworks.
