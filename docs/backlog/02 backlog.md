Refer to the mockupdeck.pdf.

Slide 1 to 3 refer to the mock up that i have done. Slide 4 to 7 is what linkedin has provided. The objective is to develop a chat that leverage agentic AI to help learner to discover their skillgap and recommend courses to level up their skills.

The steps are as followed
1) On slide 1, user will get into a chat. Agentic AI will greet him.
2) On slide 2, user will type in the chat to say they want to learn new skill.
3) On slide 3, Agentic AI will ask the user to do an assessment using excel link. In the excel link, it will show as below.
Dimension	Question	Scale
Competency	How well can you explain the key concepts and principles of this skill to others?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Competency	How effectively can you apply this skill to solve typical problems or tasks?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Competency	How independently can you use this skill without supervision or guidance?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Competency	How effectively can you adapt this skill to new, unfamiliar, or complex contexts?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Competency	How often do others seek your input or guidance regarding this skill?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Capability	How many years of relevant experience do you have actively applying this skill?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Capability	How consistently do you perform this skill successfully under real workplace conditions?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Capability	How confidently can you apply this skill under pressure or high-stakes situations?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Capability	How much exposure do you have across diverse scenarios where this skill was required?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery
Capability	How regularly do you use this skill in your current or past roles?	0 = Foundational | 1 = Intermediate | 2 = Advanced | 3 = Mastery

4) User will upload the questionaire back to chat and Agentic AI will do an assessment.
5) Agentic AI complete the assessment and then output the skill chart. The chart will display 4 quadrants: 
The scoring of competency is as followed:
0 – None. No formal learning, no demonstrable knowledge.
1 – Limited. Has completed introductory learning (e.g., a basic course, workshop, certification) but cannot yet apply independently.
2 – Strong. Has completed intermediate/advanced learning (e.g., multiple courses, professional certification, structured practice); can apply in controlled contexts.
3 – Expert. Has pursued master-level or cross-domain learning (e.g., postgraduate study, recognized expert certifications, thought leadership) and can create/adapt frameworks.

The scoring for capability is as followed:
0 – None. No experience applying this competency in real tasks.
1 – Limited. <2 years of relevant experience, applied only under guidance or in small-scale tasks.
2 – Strong. 2–5 years of relevant experience, applied independently across projects or contexts.
3 – Expert. >5 years of relevant experience, applied in complex/novel contexts, mentoring others, recognized as practitioner authority.

The survey consists of a set of 10 questions: 5 questions of Competency, 5 questions of Capabilities. In each of the questions, learner should evaluate their skillsets and then a final score will be given. The scoring will be an average of 5 questions for both compentency and capability. 

Then the score will then plot to 2D Map to map the capability and competency. 4 quadrant will be shown. 
Quadrant 1: Expert Practitioner
High Competency, High Capability
Knows the theory, applies it in practice; recognized as advanced/master.
Example: Seasoned negotiator who studied persuasion deeply and has >5 years of field practice.

Quadrant 2: Natural Doer
Low Competency, High Capability
Strong hands-on experience but limited formal knowledge/theory.
Example: Salesperson who has years of persuasion experience but never studied structured influence techniques.

Quadrant 3: Emerging Talent
Low Competency, Low Capability
Just starting out, both theory and practice at early stages.
Example: Fresh graduate who just attended a workshop but has little work experience.

Quadrant 4: Theorist
High Competency, Low Capability
Strong in knowledge/learning but limited practical application.
Example: Someone who studied persuasion academically but rarely used it in real situations.

Once the score has been computed, you are to tell the learner what is their profile. Then a series of courses will be recommended to them. The order of the courses is important. E.g You should recommend intermediate course first followed by the advanced course if the person competency is at foundational level.

6) Agentic AI should allow the user to choose the course and then put it in the learning plan. The learning plan should be allowed be saved so that user can visit the learning plan. At any point of time, user can ask Agentic AI to recommend additional courses so that user can still add them on the learning plan.

7) Once user can complete the learning plan, the next step is to come up with a time table and ask user to acknowledge the learning plan and sign up for the first course in the learning plan. 

The above sum up the requirements. I am particular about the user interface and I use Linkedin learning (see slide slide 4 to 7) as an example. For the user interface, when the chat got activated and when user start chatting, you need to move the chat interface to the left side and then allow display out of the output to be put on the right panel so that user can see the result of the recommendation. On the right panel, instead of excel link (i.e slide 3), you can develop a quiz on the right panel and allow user to put in the value and have a button called submit when the user completed the quiz. 

I want to leverage on Agentic AI. You will need to break down the agentic AI into the following: 
1) Skill Coach agent - This agent will interact with Skill Assessor Agent and Course Matcher Agent to come up with holistic recommendation to the learners.
2) Skill Assessor Agent - This agent will assess the skill gap that learner has input and output the gap in the skills.
3) Course Matcher Agent - This agent will pull from database (i.e excel) and then match against the skill that the user is lacking. 

Take note this is a prototype. No database will be used. It will be using CSV spreadsheet to get the course data and skill required for the course. 

The csv that you be using are :
1) jobsandskills-skillsfuture-tsc-to-unique-skills-mapping.csv
2) job_role_tcs_ccs.csv

Your first task is to see how to create course content list based on the job role and skill, map the job role to the skill and then from the skill and job role, generate a list of course material that map job role and skill. The output must be able to map to the job role and the skill so that i can use it as a testing data. The output must be an csv spreadsheet.

Once this is completed, then you proceed with other tasks. 