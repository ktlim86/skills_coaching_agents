import csv
import random
from collections import defaultdict

def analyze_skills_mapping_csv(file_path):
    """Analyze the skills mapping CSV file"""
    print(f"Analyzing {file_path}")
    
    skills_data = []
    sectors = set()
    skills = set()
    proficiency_levels = set()
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:  # Handle BOM
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"Headers: {headers}")
        
        for i, row in enumerate(reader):
            if i < 5:  # Show first 5 rows
                print(f"Row {i+1}: {row}")
            
            skills_data.append(row)
            sectors.add(row['sector_title'])
            skills.add(row['skill_11k_title'])
            proficiency_levels.add(row['proficiency_level'])
            
            if i >= 1000:  # Limit to first 1000 rows for analysis
                break
    
    print(f"\nDataset summary:")
    print(f"Total rows analyzed: {len(skills_data)}")
    print(f"Unique sectors: {len(sectors)}")
    print(f"Unique skills: {len(skills)}")
    print(f"Proficiency levels: {proficiency_levels}")
    print(f"Sample sectors: {list(sectors)[:10]}")
    print(f"Sample skills: {list(skills)[:10]}")
    
    return skills_data, sectors, skills, proficiency_levels

def analyze_job_role_csv(file_path):
    """Analyze the job role CSV file"""
    print(f"\nAnalyzing {file_path}")
    
    job_data = []
    job_roles = set()
    
    with open(file_path, 'r', encoding='utf-8-sig') as f:  # Handle BOM
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"Headers: {headers}")
        
        for i, row in enumerate(reader):
            if i < 5:  # Show first 5 rows
                print(f"Row {i+1}: {row}")
            
            job_data.append(row)
            job_roles.add(row.get('job_role', ''))
            
            if i >= 1000:  # Limit to first 1000 rows for analysis
                break
    
    print(f"\nJob Role Dataset summary:")
    print(f"Total rows analyzed: {len(job_data)}")
    print(f"Unique job roles: {len(job_roles)}")
    print(f"Sample job roles: {list(job_roles)[:10]}")
    
    return job_data, job_roles

def create_comprehensive_course_mapping_csv(skills_data, sectors, skills, output_file):
    """Create a comprehensive course mapping CSV with career progression and detailed skill mapping"""
    print(f"\nGenerating comprehensive course mapping data...")
    
    # Define career progression levels and their corresponding job roles
    career_progressions = {
        'Software Engineering': {
            'entry': ['Junior Software Engineer', 'Software Developer Intern', 'Graduate Software Engineer'],
            'mid': ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
            'senior': ['Senior Software Engineer', 'Tech Lead', 'Software Architect'],
            'lead': ['Lead Software Engineer', 'Engineering Manager', 'Principal Engineer']
        },
        'Data Science': {
            'entry': ['Junior Data Analyst', 'Data Science Intern', 'Business Intelligence Analyst'],
            'mid': ['Data Scientist', 'Machine Learning Engineer', 'Data Engineer'],
            'senior': ['Senior Data Scientist', 'ML Engineering Lead', 'Data Science Manager'],
            'lead': ['Principal Data Scientist', 'Head of Data Science', 'Chief Data Officer']
        },
        'Product Management': {
            'entry': ['Associate Product Manager', 'Product Management Intern', 'Junior Product Analyst'],
            'mid': ['Product Manager', 'Senior Product Manager', 'Product Owner'],
            'senior': ['Principal Product Manager', 'Group Product Manager', 'Product Lead'],
            'lead': ['VP of Product', 'Head of Product', 'Chief Product Officer']
        },
        'DevOps Engineering': {
            'entry': ['Junior DevOps Engineer', 'Cloud Support Associate', 'Infrastructure Intern'],
            'mid': ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer'],
            'senior': ['Senior DevOps Engineer', 'Platform Engineer', 'Infrastructure Architect'],
            'lead': ['Lead DevOps Engineer', 'Engineering Manager - Platform', 'Head of Infrastructure']
        },
        'UX/UI Design': {
            'entry': ['Junior UX Designer', 'UI Designer', 'Design Intern'],
            'mid': ['UX Designer', 'Product Designer', 'Interaction Designer'],
            'senior': ['Senior UX Designer', 'Design Lead', 'UX Research Lead'],
            'lead': ['Principal Designer', 'Head of Design', 'Chief Design Officer']
        },
        'Financial Analysis': {
            'entry': ['Junior Financial Analyst', 'Finance Intern', 'Financial Associate'],
            'mid': ['Financial Analyst', 'Senior Financial Analyst', 'Budget Analyst'],
            'senior': ['Principal Financial Analyst', 'Finance Manager', 'Financial Planning Lead'],
            'lead': ['Director of Finance', 'VP Finance', 'Chief Financial Officer']
        },
        'Risk Management': {
            'entry': ['Junior Risk Analyst', 'Risk Associate', 'Compliance Intern'],
            'mid': ['Risk Manager', 'Senior Risk Analyst', 'Compliance Manager'],
            'senior': ['Principal Risk Manager', 'Risk Management Lead', 'Head of Compliance'],
            'lead': ['Director of Risk', 'VP Risk Management', 'Chief Risk Officer']
        },
        'Investment Banking': {
            'entry': ['Investment Banking Analyst', 'Junior Investment Associate', 'Finance Graduate'],
            'mid': ['Investment Banking Associate', 'Senior Analyst', 'Portfolio Analyst'],
            'senior': ['VP Investment Banking', 'Principal Investment Manager', 'Senior Portfolio Manager'],
            'lead': ['Director Investment Banking', 'Managing Director', 'Head of Investment Banking']
        },
        'Healthcare Administration': {
            'entry': ['Healthcare Admin Assistant', 'Junior Healthcare Coordinator', 'Medical Admin Intern'],
            'mid': ['Healthcare Administrator', 'Medical Office Manager', 'Clinical Coordinator'],
            'senior': ['Senior Healthcare Administrator', 'Department Manager', 'Operations Manager'],
            'lead': ['Director of Operations', 'VP Healthcare Operations', 'Chief Operations Officer']
        },
        'Medical Practice': {
            'entry': ['Medical Intern', 'Resident Physician', 'Junior Medical Officer'],
            'mid': ['Medical Officer', 'Attending Physician', 'Senior Doctor'],
            'senior': ['Consultant Physician', 'Department Head', 'Medical Director'],
            'lead': ['Chief Medical Officer', 'Medical Director', 'Head of Medicine']
        },
        'Nursing': {
            'entry': ['Graduate Nurse', 'Junior Nurse', 'Staff Nurse'],
            'mid': ['Registered Nurse', 'Senior Nurse', 'Charge Nurse'],
            'senior': ['Nurse Manager', 'Clinical Nurse Specialist', 'Nurse Educator'],
            'lead': ['Director of Nursing', 'Chief Nursing Officer', 'VP Patient Care']
        },
        'Pharmacy': {
            'entry': ['Pharmacy Intern', 'Junior Pharmacist', 'Clinical Pharmacy Resident'],
            'mid': ['Pharmacist', 'Clinical Pharmacist', 'Hospital Pharmacist'],
            'senior': ['Senior Pharmacist', 'Pharmacy Manager', 'Clinical Pharmacy Specialist'],
            'lead': ['Director of Pharmacy', 'Chief Pharmacist', 'VP Pharmaceutical Services']
        },
        'Education': {
            'entry': ['Teaching Assistant', 'Substitute Teacher', 'Junior Educator'],
            'mid': ['Teacher', 'Classroom Teacher', 'Subject Specialist'],
            'senior': ['Senior Teacher', 'Department Head', 'Curriculum Coordinator'],
            'lead': ['Principal', 'Education Director', 'Superintendent']
        },
        'Marketing': {
            'entry': ['Marketing Assistant', 'Junior Marketing Specialist', 'Marketing Intern'],
            'mid': ['Marketing Manager', 'Digital Marketing Specialist', 'Brand Manager'],
            'senior': ['Senior Marketing Manager', 'Marketing Director', 'Brand Director'],
            'lead': ['VP Marketing', 'Head of Marketing', 'Chief Marketing Officer']
        }
    }
    
    # Define skill categories mapped to career levels
    skill_categories = {
        'Technical Foundation': {
            'entry': ['Programming and Coding', 'Data Analytics', 'Systems Thinking', 'Business Acumen'],
            'mid': ['Project Execution and Control', 'Cyber Security', 'Infrastructure Design', 'Financial Modelling'],
            'senior': ['Strategy Planning', 'Change Management', 'Risk Advisory', 'Business Process Management'],
            'lead': ['Programme and Project Management', 'Finance Business Partnering', 'Sustainability Assurance']
        },
        'Domain Expertise': {
            'entry': ['Equipment Maintenance and Housekeeping', 'Food Safety Management', 'Lesson Planning'],
            'mid': ['Aircraft Sensing Components Maintenance', 'Green Manufacturing Design and Implementation', 'Arts Curriculum Design'],
            'senior': ['Aviation Legislation Compliance', 'Farm Biosecurity Compliance and Management', 'Multimedia Operations'],
            'lead': ['Predictive Maintenance', 'Automated System Design', 'Multi-Camera Operations for Live Shows']
        },
        'Leadership & Management': {
            'entry': ['Engagement Quality Control', 'Disruption Management', 'Cash Flow Management'],
            'mid': ['Budgeting', 'Capital Raising', 'Accounting and Tax Systems'],
            'senior': ['Restructuring Insolvency Advisory', 'Valuation Conclusion and Reporting', 'Infocomm Security and Data Privacy'],
            'lead': ['Valuation of Different Classes of Interest', 'Engineering Drawing, Interpretation and Management']
        }
    }
    
    course_data = []
    skills_list = list(skills)
    sectors_list = list(sectors)
    
    course_id = 1
    
    # Generate courses for each career progression
    for career_path, levels in career_progressions.items():
        for level, job_roles in levels.items():
            for job_role in job_roles:
                # Determine number of courses per role based on level
                num_courses = {
                    'entry': 3,     # 3 courses for entry level
                    'mid': 4,       # 4 courses for mid level  
                    'senior': 5,    # 5 courses for senior level
                    'lead': 6       # 6 courses for lead level
                }[level]
                
                for course_num in range(1, num_courses + 1):
                    # Select appropriate skills based on career level
                    if level == 'entry':
                        primary_skills = skill_categories['Technical Foundation']['entry']
                        secondary_skills_pool = skill_categories['Domain Expertise']['entry']
                    elif level == 'mid':
                        primary_skills = skill_categories['Technical Foundation']['mid'] + skill_categories['Domain Expertise']['entry']
                        secondary_skills_pool = skill_categories['Technical Foundation']['entry'] + skill_categories['Domain Expertise']['mid']
                    elif level == 'senior':
                        primary_skills = skill_categories['Technical Foundation']['senior'] + skill_categories['Leadership & Management']['entry']
                        secondary_skills_pool = skill_categories['Technical Foundation']['mid'] + skill_categories['Domain Expertise']['senior']
                    else:  # lead
                        primary_skills = skill_categories['Technical Foundation']['lead'] + skill_categories['Leadership & Management']['senior']
                        secondary_skills_pool = skill_categories['Leadership & Management']['mid'] + skill_categories['Domain Expertise']['lead']
                    
                    # Fallback to random skills if categories are empty
                    if not primary_skills:
                        primary_skills = random.sample(skills_list, min(10, len(skills_list)))
                    if not secondary_skills_pool:
                        secondary_skills_pool = random.sample(skills_list, min(20, len(skills_list)))
                    
                    # Select skills for this course
                    primary_skill = random.choice(primary_skills)
                    num_secondary = random.randint(4, 8)  # 4-8 secondary skills
                    secondary_skills = random.sample(secondary_skills_pool, min(num_secondary, len(secondary_skills_pool)))
                    
                    # Course specialization based on course number
                    specializations = {
                        1: 'Fundamentals',
                        2: 'Advanced Concepts', 
                        3: 'Practical Applications',
                        4: 'Leadership Skills',
                        5: 'Strategic Thinking',
                        6: 'Executive Excellence'
                    }
                    
                    course_title = f"{job_role} - {specializations.get(course_num, 'Fundamentals')}"
                    
                    # Course difficulty progression
                    difficulty_mapping = {
                        'entry': ['Beginner', 'Beginner', 'Intermediate'],
                        'mid': ['Intermediate', 'Intermediate', 'Advanced', 'Advanced'],
                        'senior': ['Advanced', 'Advanced', 'Advanced', 'Expert', 'Expert'],
                        'lead': ['Expert', 'Expert', 'Expert', 'Master', 'Master', 'Master']
                    }
                    
                    difficulty = random.choice(difficulty_mapping[level])
                    
                    # Duration based on level and difficulty
                    duration_ranges = {
                        ('entry', 'Beginner'): (15, 30),
                        ('entry', 'Intermediate'): (25, 45),
                        ('mid', 'Intermediate'): (35, 60),
                        ('mid', 'Advanced'): (45, 75),
                        ('senior', 'Advanced'): (60, 90),
                        ('senior', 'Expert'): (75, 120),
                        ('lead', 'Expert'): (90, 150),
                        ('lead', 'Master'): (120, 200)
                    }
                    
                    duration_range = duration_ranges.get((level, difficulty), (30, 60))
                    duration_hours = random.randint(*duration_range)
                    
                    # Select sector
                    sector = random.choice(sectors_list)
                    
                    # Provider distribution
                    providers = ['LinkedIn Learning', 'Coursera', 'Udemy', 'edX', 'Pluralsight', 'MasterClass', 'Internal Training', 'External Certification']
                    provider = random.choice(providers)
                    
                    course_data.append({
                        'course_id': f'C{course_id:04d}',
                        'course_title': course_title,
                        'course_description': f'Comprehensive {level}-level course for {job_role} professionals focusing on {primary_skill} and related competencies',
                        'career_path': career_path,
                        'career_level': level,
                        'sector': sector,
                        'job_role': job_role,
                        'primary_skill': primary_skill,
                        'secondary_skills': ', '.join(secondary_skills),
                        'difficulty_level': difficulty,
                        'duration_hours': duration_hours,
                        'provider': provider,
                        'prerequisites': f'Completion of {level} level requirements' if level != 'entry' else 'None',
                        'learning_outcomes': f'Master {primary_skill}, develop {len(secondary_skills)} supporting skills, advance to {level} proficiency',
                        'career_progression_target': 'Senior level roles' if level == 'mid' else 'Leadership roles' if level == 'senior' else 'Executive positions' if level == 'lead' else 'Mid-level positions'
                    })
                    
                    course_id += 1
    
    # Write to CSV
    fieldnames = ['course_id', 'course_title', 'course_description', 'career_path', 'career_level', 
                 'sector', 'job_role', 'primary_skill', 'secondary_skills', 'difficulty_level', 
                 'duration_hours', 'provider', 'prerequisites', 'learning_outcomes', 'career_progression_target']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(course_data)
    
    print(f"Generated {len(course_data)} comprehensive course records in {output_file}")
    
    # Print summary statistics
    career_path_counts = defaultdict(int)
    level_counts = defaultdict(int)
    difficulty_counts = defaultdict(int)
    
    for course in course_data:
        career_path_counts[course['career_path']] += 1
        level_counts[course['career_level']] += 1
        difficulty_counts[course['difficulty_level']] += 1
    
    print(f"\n📊 Course Distribution Summary:")
    print(f"Career Paths: {dict(career_path_counts)}")
    print(f"Career Levels: {dict(level_counts)}")
    print(f"Difficulty Levels: {dict(difficulty_counts)}")
    
    return course_data

def main():
    """Main analysis function"""
    skills_file = "docs/backlog/jobsandskills-skillsfuture-tsc-to-unique-skills-mapping.csv"
    job_role_file = "docs/backlog/job_role_tcs_ccs.csv"
    output_file = "docs/backlog/comprehensive_course_mapping.csv"
    
    try:
        # Analyze skills mapping data
        skills_data, sectors, skills, proficiency_levels = analyze_skills_mapping_csv(skills_file)
        
        # Analyze job role data
        job_data, job_roles = analyze_job_role_csv(job_role_file)
        
        # Create comprehensive course mapping for testing
        course_data = create_comprehensive_course_mapping_csv(skills_data, sectors, skills, output_file)
        
        print(f"\n✅ Comprehensive data analysis complete!")
        print(f"📊 Generated comprehensive course mapping CSV with {len(course_data)} records")
        print(f"📁 Output file: {output_file}")
        
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("Please ensure the CSV files are in the docs/backlog/ directory")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
