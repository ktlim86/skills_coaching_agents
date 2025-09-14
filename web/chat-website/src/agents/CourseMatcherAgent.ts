import { 
  BaseAgent, 
  AgentType, 
  AgentCapability, 
  AgentRequest, 
  AgentResponse,
  SkillGap,
  Course,
  CourseRecommendation,
  LearningPath,
  SkillQuadrant
} from './BaseAgent';
import { OpenAIService, getOpenAIService } from '../services/OpenAIService';

/**
 * Course Matcher Agent - Matches skills to appropriate courses with learning progression
 * Specialized in course discovery, matching algorithms, and learning path creation
 */
export class CourseMatcherAgent extends BaseAgent {
  private courses: Course[] = [];
  private coursesLoaded = false;
  private openAIService!: OpenAIService;
  
  constructor() {
    const capabilities: AgentCapability[] = [
      {
        name: 'course_matching',
        description: 'Match skill gaps to relevant courses based on skill requirements',
        inputTypes: ['skill_gaps', 'skill_profile', 'learning_goals'],
        outputTypes: ['course_recommendations', 'relevance_scores']
      },
      {
        name: 'learning_path_creation',
        description: 'Create structured learning paths with course progression ordering',
        inputTypes: ['course_recommendations', 'difficulty_progression'],
        outputTypes: ['learning_path', 'course_sequence']
      },
      {
        name: 'course_search',
        description: 'Search and filter courses by various criteria',
        inputTypes: ['search_query', 'filter_criteria'],
        outputTypes: ['course_results', 'filtered_courses']
      },
      {
        name: 'recommendation_ranking',
        description: 'Rank and prioritize course recommendations based on multiple factors',
        inputTypes: ['course_matches', 'user_preferences', 'skill_priorities'],
        outputTypes: ['ranked_recommendations', 'priority_scores']
      }
    ];
    
    super('CourseMatcher', AgentType.COURSE_MATCHER, capabilities);
  }
  
  public async initialize(): Promise<void> {
    try {
      this.openAIService = getOpenAIService();
      await this.loadCourseData();
      this.updateStatus('ready');
      console.log(`Course Matcher Agent initialized with ${this.courses.length} courses and OpenAI service`);
    } catch (error) {
      console.error('Failed to initialize Course Matcher Agent:', error);
      this.updateStatus('error');
      throw error;
    }
  }
  
  public async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    this.updateStatus('busy');
    
    try {
      // Ensure courses are loaded
      if (!this.coursesLoaded) {
        await this.loadCourseData();
      }
      
      let response: AgentResponse;
      
      switch (request.type) {
        case 'match_courses':
          response = await this.matchCoursesToSkillGaps(request);
          break;
          
        case 'create_learning_path':
          response = await this.createLearningPath(request);
          break;
          
        case 'search_courses':
          response = await this.searchCourses(request);
          break;
          
        case 'recommend_by_quadrant':
          response = await this.recommendBySkillQuadrant(request);
          break;
          
        case 'filter_courses':
          response = await this.filterCourses(request);
          break;
          
        default:
          response = this.createResponse(
            request.id,
            'error',
            { message: `Unknown request type: ${request.type}` },
            false,
            { code: 'UNKNOWN_REQUEST_TYPE', message: 'Request type not supported' }
          );
      }
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, !response.success);
      this.updateStatus('ready');
      
      return response;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, true);
      this.updateStatus('error');
      
      return this.createResponse(
        request.id,
        'error',
        { message: 'Internal agent error' },
        false,
        { 
          code: 'INTERNAL_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { error: String(error) }
        }
      );
    }
  }
  
  /**
   * Load course data from CSV file
   */
  private async loadCourseData(): Promise<void> {
    try {
      console.log('Loading course data from comprehensive_course_mapping.csv...');
      
      // Fetch the CSV file from the public directory
      const response = await fetch('/comprehensive_course_mapping.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      this.courses = this.parseCSV(csvText);
      this.coursesLoaded = true;
      
      console.log(`Successfully loaded ${this.courses.length} courses from comprehensive_course_mapping.csv`);
    } catch (error) {
      console.error('Failed to load course data from CSV:', error);
      console.log('Falling back to sample course data...');
      
      // Use fallback sample data
      this.courses = this.generateSampleCourses();
      this.coursesLoaded = true;
    }
  }
  
  /**
   * Parse CSV content into Course objects
   */
  private parseCSV(csvText: string): Course[] {
    const lines = csvText.trim().split('\n');
    
    // Verify headers match expected format
    const expectedHeaders = [
      'course_id', 'course_title', 'course_description', 'career_path', 'career_level',
      'sector', 'job_role', 'primary_skill', 'secondary_skills', 'difficulty_level',
      'duration_hours', 'provider', 'prerequisites', 'learning_outcomes', 'career_progression_target'
    ];
    
    const courses: Course[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length >= expectedHeaders.length) {
          const course: Course = {
            course_id: values[0] || '',
            course_title: values[1] || '',
            course_description: values[2] || '',
            career_path: values[3] || '',
            career_level: values[4] || '',
            sector: values[5] || '',
            job_role: values[6] || '',
            primary_skill: values[7] || '',
            secondary_skills: values[8] || '',
            difficulty_level: this.mapDifficultyLevel(values[9]),
            duration_hours: parseInt(values[10]) || 0,
            provider: values[11] || '',
            prerequisites: values[12] || '',
            learning_outcomes: values[13] || '',
            career_progression_target: values[14] || ''
          };
          
          courses.push(course);
        }
      } catch (error) {
        console.warn(`Failed to parse CSV line ${i + 1}:`, error);
        continue;
      }
    }
    
    return courses;
  }
  
  /**
   * Parse a single CSV line handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }
  
  /**
   * Map difficulty level to expected enum values
   */
  private mapDifficultyLevel(level: string): 'Beginner' | 'Intermediate' | 'Advanced' {
    const normalized = level.toLowerCase().trim();
    
    if (normalized.includes('beginner') || normalized.includes('entry')) {
      return 'Beginner';
    } else if (normalized.includes('advanced') || normalized.includes('expert')) {
      return 'Advanced';
    } else {
      return 'Intermediate';
    }
  }
  
  /**
   * Generate sample courses based on CSV structure (fallback)
   */
  private generateSampleCourses(): Course[] {
    return [
      {
        course_id: 'C001',
        course_title: 'Data Science Fundamentals',
        course_description: 'Comprehensive introduction to data science including statistics, Python programming, and machine learning basics',
        career_path: 'Data Science',
        career_level: 'entry',
        sector: 'Technology',
        job_role: 'Data Scientist',
        primary_skill: 'Data Analytics',
        secondary_skills: 'Python Programming, Statistics, Machine Learning',
        difficulty_level: 'Beginner',
        duration_hours: 40,
        provider: 'Coursera',
        prerequisites: 'None',
        learning_outcomes: 'Master Data Analytics fundamentals and supporting skills',
        career_progression_target: 'Mid-level Data Science positions'
      },
      {
        course_id: 'C002',
        course_title: 'Advanced JavaScript Development',
        course_description: 'Master advanced JavaScript concepts including ES6+, async programming, and modern frameworks',
        career_path: 'Software Engineering',
        career_level: 'mid',
        sector: 'Technology',
        job_role: 'Software Engineer',
        primary_skill: 'JavaScript Programming',
        secondary_skills: 'React, Node.js, TypeScript',
        difficulty_level: 'Advanced',
        duration_hours: 35,
        provider: 'Udemy',
        prerequisites: 'Basic JavaScript knowledge',
        learning_outcomes: 'Master advanced JavaScript development techniques',
        career_progression_target: 'Senior Software Engineer positions'
      },
      {
        course_id: 'C003',
        course_title: 'Project Management Essentials',
        course_description: 'Learn project management fundamentals including Agile, Scrum, and project planning techniques',
        career_path: 'Project Management',
        career_level: 'entry',
        sector: 'Business',
        job_role: 'Project Manager',
        primary_skill: 'Project Management',
        secondary_skills: 'Agile, Scrum, Leadership',
        difficulty_level: 'Intermediate',
        duration_hours: 30,
        provider: 'LinkedIn Learning',
        prerequisites: 'None',
        learning_outcomes: 'Master project management fundamentals and methodologies',
        career_progression_target: 'Senior Project Manager positions'
      },
      {
        course_id: 'C004',
        course_title: 'Digital Marketing Strategy',
        course_description: 'Comprehensive digital marketing course covering SEO, social media, and analytics',
        career_path: 'Digital Marketing',
        career_level: 'entry',
        sector: 'Marketing',
        job_role: 'Digital Marketer',
        primary_skill: 'Digital Marketing',
        secondary_skills: 'SEO, Social Media, Analytics',
        difficulty_level: 'Intermediate',
        duration_hours: 25,
        provider: 'Internal Training',
        prerequisites: 'None',
        learning_outcomes: 'Master digital marketing strategies and tools',
        career_progression_target: 'Senior Marketing roles'
      },
      {
        course_id: 'C005',
        course_title: 'Machine Learning with Python',
        course_description: 'Advanced machine learning techniques using Python, scikit-learn, and TensorFlow',
        career_path: 'Data Science',
        career_level: 'mid',
        sector: 'Technology',
        job_role: 'ML Engineer',
        primary_skill: 'Machine Learning',
        secondary_skills: 'Python, TensorFlow, Data Processing',
        difficulty_level: 'Advanced',
        duration_hours: 50,
        provider: 'Coursera',
        prerequisites: 'Python programming, basic statistics',
        learning_outcomes: 'Master machine learning techniques and implementation',
        career_progression_target: 'Senior ML Engineer positions'
      },
      {
        course_id: 'C006',
        course_title: 'UI/UX Design Principles',
        course_description: 'Learn user interface and user experience design principles and tools',
        career_path: 'Design',
        career_level: 'entry',
        sector: 'Design',
        job_role: 'UX Designer',
        primary_skill: 'UI/UX Design',
        secondary_skills: 'Figma, User Research, Prototyping',
        difficulty_level: 'Beginner',
        duration_hours: 20,
        provider: 'Udemy',
        prerequisites: 'None',
        learning_outcomes: 'Master UI/UX design fundamentals and tools',
        career_progression_target: 'Senior Design positions'
      },
      {
        course_id: 'C007',
        course_title: 'Cloud Architecture with AWS',
        course_description: 'Design and implement cloud solutions using Amazon Web Services',
        career_path: 'Cloud Engineering',
        career_level: 'mid',
        sector: 'Technology',
        job_role: 'Cloud Architect',
        primary_skill: 'Cloud Computing',
        secondary_skills: 'AWS, DevOps, Infrastructure',
        difficulty_level: 'Advanced',
        duration_hours: 45,
        provider: 'AWS Training',
        prerequisites: 'Basic cloud knowledge, networking fundamentals',
        learning_outcomes: 'Master AWS cloud architecture and implementation',
        career_progression_target: 'Senior Cloud Architect positions'
      },
      {
        course_id: 'C008',
        course_title: 'Business Analytics Fundamentals',
        course_description: 'Learn business intelligence, data visualization, and analytical thinking',
        career_path: 'Business Analytics',
        career_level: 'entry',
        sector: 'Business',
        job_role: 'Business Analyst',
        primary_skill: 'Business Analytics',
        secondary_skills: 'Excel, Tableau, SQL',
        difficulty_level: 'Beginner',
        duration_hours: 28,
        provider: 'LinkedIn Learning',
        prerequisites: 'None',
        learning_outcomes: 'Master business analytics fundamentals and tools',
        career_progression_target: 'Senior Business Analyst positions'
      }
    ];
  }
  
  /**
   * Match courses to identified skill gaps
   */
  private async matchCoursesToSkillGaps(request: AgentRequest): Promise<AgentResponse> {
    const { skillGaps } = request.payload as { 
      skillGaps: SkillGap[];
      preferences?: Record<string, unknown>;
    };
    
    if (!skillGaps || !Array.isArray(skillGaps)) {
      return this.createResponse(
        request.id,
        'matching_error',
        { message: 'Invalid skill gaps provided' },
        false,
        { code: 'INVALID_SKILL_GAPS', message: 'Skill gaps must be provided as an array' }
      );
    }
    
    const recommendations: CourseRecommendation[] = [];
    
    // Match each skill gap to relevant courses
    for (const skillGap of skillGaps) {
      const matchedCourses = this.findCoursesForSkillArea(skillGap);
      
      for (const course of matchedCourses) {
        const relevanceScore = this.calculateRelevanceScore(course, skillGap);
        const reasoning = this.generateMatchingReasoning(course, skillGap);
        
        recommendations.push({
          course,
          relevanceScore,
          matchedSkillGaps: [skillGap.area],
          priority: skillGap.priority,
          reasoning
        });
      }
    }
    
    // Sort by relevance score and priority
    const sortedRecommendations = recommendations
      .sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, 10); // Limit to top 10 recommendations
    
    return this.createResponse(
      request.id,
      'courses_matched',
      {
        recommendations: sortedRecommendations,
        totalCourses: this.courses.length,
        matchedGaps: skillGaps.length,
        summary: this.generateMatchingSummary(sortedRecommendations, skillGaps)
      }
    );
  }
  
  /**
   * Find courses that address a specific skill area
   */
  private findCoursesForSkillArea(skillGap: SkillGap): Course[] {
    const skillKeywords = this.extractSkillKeywords(skillGap.area);
    
    return this.courses.filter(course => {
      // Check primary skill match
      const primaryMatch = skillKeywords.some(keyword => 
        course.primary_skill.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Check secondary skills match
      const secondaryMatch = skillKeywords.some(keyword =>
        course.secondary_skills.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Check course title and description match
      const titleMatch = skillKeywords.some(keyword =>
        course.course_title.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const descriptionMatch = skillKeywords.some(keyword =>
        course.course_description.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return primaryMatch || secondaryMatch || titleMatch || descriptionMatch;
    });
  }
  
  /**
   * Extract searchable keywords from skill area
   */
  private extractSkillKeywords(skillArea: string): string[] {
    // Extract meaningful keywords from skill area descriptions
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = skillArea.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    // Add some domain-specific mappings
    const skillMappings: Record<string, string[]> = {
      'competency': ['knowledge', 'theory', 'concepts', 'fundamentals'],
      'capability': ['experience', 'practical', 'application', 'hands-on'],
      'programming': ['coding', 'development', 'software'],
      'analysis': ['analytics', 'data', 'business intelligence'],
      'management': ['leadership', 'project', 'team'],
      'design': ['ui', 'ux', 'user experience', 'interface']
    };
    
    const expandedKeywords = [...words];
    words.forEach(word => {
      if (skillMappings[word]) {
        expandedKeywords.push(...skillMappings[word]);
      }
    });
    
    return [...new Set(expandedKeywords)]; // Remove duplicates
  }
  
  /**
   * Calculate relevance score between a course and skill gap
   */
  private calculateRelevanceScore(course: Course, skillGap: SkillGap): number {
    let score = 0;
    
    const skillKeywords = this.extractSkillKeywords(skillGap.area);
    
    // Primary skill match (highest weight)
    const primaryMatches = skillKeywords.filter(keyword =>
      course.primary_skill.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += primaryMatches * 0.4;
    
    // Secondary skills match
    const secondaryMatches = skillKeywords.filter(keyword =>
      course.secondary_skills.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += secondaryMatches * 0.3;
    
    // Title match
    const titleMatches = skillKeywords.filter(keyword =>
      course.course_title.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += titleMatches * 0.2;
    
    // Description match
    const descriptionMatches = skillKeywords.filter(keyword =>
      course.course_description.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += descriptionMatches * 0.1;
    
    // Adjust for difficulty level based on current skill level
    const difficultyBonus = this.getDifficultyLevelBonus(course.difficulty_level, skillGap.currentLevel);
    score += difficultyBonus;
    
    return Math.min(score, 1.0); // Cap at 1.0
  }
  
  /**
   * Get difficulty level bonus based on current skill level
   */
  private getDifficultyLevelBonus(difficultyLevel: string, currentLevel: number): number {
    const difficultyMap = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
    const courseDifficulty = difficultyMap[difficultyLevel as keyof typeof difficultyMap] || 0;
    
    // Prefer courses slightly above current level
    const idealDifficulty = Math.min(currentLevel + 1, 2);
    const difficultyDiff = Math.abs(courseDifficulty - idealDifficulty);
    
    return difficultyDiff === 0 ? 0.2 : difficultyDiff === 1 ? 0.1 : 0;
  }
  
  /**
   * Generate reasoning for course-skill matching
   */
  private generateMatchingReasoning(course: Course, skillGap: SkillGap): string {
    const reasons = [];
    
    const skillKeywords = this.extractSkillKeywords(skillGap.area);
    
    // Check what matched
    const primaryMatch = skillKeywords.some(keyword =>
      course.primary_skill.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const secondaryMatch = skillKeywords.some(keyword =>
      course.secondary_skills.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (primaryMatch) {
      reasons.push(`Primary skill alignment with "${course.primary_skill}"`);
    }
    
    if (secondaryMatch) {
      reasons.push(`Secondary skills coverage including relevant topics`);
    }
    
    // Add difficulty level reasoning
    const difficultyMap = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
    const courseDifficulty = difficultyMap[course.difficulty_level as keyof typeof difficultyMap] || 0;
    
    if (courseDifficulty >= skillGap.currentLevel) {
      reasons.push(`Appropriate difficulty level (${course.difficulty_level}) for skill advancement`);
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'General relevance to skill area';
  }
  
  /**
   * Create structured learning path from course recommendations
   */
  private async createLearningPath(request: AgentRequest): Promise<AgentResponse> {
    const { recommendations, skillQuadrant } = request.payload as {
      recommendations: CourseRecommendation[],
      skillQuadrant?: SkillQuadrant
    };
    
    if (!recommendations || !Array.isArray(recommendations)) {
      return this.createResponse(
        request.id,
        'path_creation_error',
        { message: 'Invalid course recommendations provided' },
        false,
        { code: 'INVALID_RECOMMENDATIONS', message: 'Course recommendations must be provided' }
      );
    }
    
    // Group courses by difficulty level
    const beginner = recommendations.filter(r => r.course.difficulty_level === 'Beginner');
    const intermediate = recommendations.filter(r => r.course.difficulty_level === 'Intermediate');
    const advanced = recommendations.filter(r => r.course.difficulty_level === 'Advanced');
    
    // Create learning path based on skill quadrant
    const learningPath = this.createOptimalLearningSequence(
      beginner,
      intermediate,
      advanced,
      skillQuadrant
    );
    
    const totalDuration = learningPath.courses.reduce(
      (sum, rec) => sum + rec.course.duration_hours, 0
    );
    
    const skillsAddressed = [
      ...new Set(learningPath.courses.flatMap(rec => rec.matchedSkillGaps))
    ];
    
    const path: LearningPath = {
      id: `path_${Date.now()}`,
      title: this.generateLearningPathTitle(skillQuadrant, skillsAddressed),
      description: this.generateLearningPathDescription(learningPath.courses, skillQuadrant),
      courses: learningPath.courses,
      estimatedDuration: totalDuration,
      skillsAddressed,
      progressionLevel: learningPath.progressionLevel
    };
    
    return this.createResponse(
      request.id,
      'learning_path_created',
      {
        learningPath: path,
        summary: {
          totalCourses: path.courses.length,
          estimatedDuration: totalDuration,
          skillsAddressed: skillsAddressed.length,
          progression: path.progressionLevel
        }
      }
    );
  }
  
  /**
   * Create optimal learning sequence based on skill quadrant
   */
  private createOptimalLearningSequence(
    beginner: CourseRecommendation[],
    intermediate: CourseRecommendation[],
    advanced: CourseRecommendation[],
    skillQuadrant?: SkillQuadrant
  ): { courses: CourseRecommendation[], progressionLevel: 'foundational' | 'intermediate' | 'advanced' | 'expert' } {
    
    let sequence: CourseRecommendation[] = [];
    let progressionLevel: 'foundational' | 'intermediate' | 'advanced' | 'expert' = 'foundational';
    
    switch (skillQuadrant) {
      case SkillQuadrant.EMERGING_TALENT:
        // Start with fundamentals, build both theory and practice
        sequence = [
          ...beginner.slice(0, 3),
          ...intermediate.slice(0, 2)
        ];
        progressionLevel = 'foundational';
        break;
        
      case SkillQuadrant.THEORIST:
        // Focus on practical application courses
        sequence = [
          ...intermediate.filter(r => r.course.course_description.toLowerCase().includes('practical')).slice(0, 2),
          ...beginner.filter(r => r.course.course_description.toLowerCase().includes('hands-on')).slice(0, 2),
          ...advanced.slice(0, 1)
        ];
        progressionLevel = 'intermediate';
        break;
        
      case SkillQuadrant.NATURAL_DOER:
        // Focus on theoretical foundation courses
        sequence = [
          ...beginner.filter(r => r.course.course_description.toLowerCase().includes('fundamental')).slice(0, 2),
          ...intermediate.slice(0, 2),
          ...advanced.slice(0, 1)
        ];
        progressionLevel = 'intermediate';
        break;
        
      case SkillQuadrant.EXPERT_PRACTITIONER:
        // Advanced and specialized courses
        sequence = [
          ...advanced.slice(0, 2),
          ...intermediate.filter(r => r.course.course_description.toLowerCase().includes('advanced')).slice(0, 1)
        ];
        progressionLevel = 'expert';
        break;
        
      default:
        // Default progression: beginner → intermediate → advanced
        sequence = [
          ...beginner.slice(0, 2),
          ...intermediate.slice(0, 2),
          ...advanced.slice(0, 1)
        ];
        progressionLevel = 'foundational';
    }
    
    // Sort by priority and relevance score
    sequence.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.relevanceScore - a.relevanceScore;
    });
    
    return { courses: sequence.slice(0, 5), progressionLevel }; // Limit to 5 courses
  }
  
  /**
   * Generate learning path title based on quadrant and skills
   */
  private generateLearningPathTitle(skillQuadrant?: SkillQuadrant, skillsAddressed: string[] = []): string {
    const primarySkill = skillsAddressed[0] || 'Professional Development';
    
    switch (skillQuadrant) {
      case SkillQuadrant.EMERGING_TALENT:
        return `Foundational ${primarySkill} Learning Path`;
      case SkillQuadrant.THEORIST:
        return `Practical Application in ${primarySkill}`;
      case SkillQuadrant.NATURAL_DOER:
        return `Theoretical Foundation for ${primarySkill}`;
      case SkillQuadrant.EXPERT_PRACTITIONER:
        return `Advanced ${primarySkill} Specialization`;
      default:
        return `Comprehensive ${primarySkill} Development Path`;
    }
  }
  
  /**
   * Generate learning path description
   */
  private generateLearningPathDescription(
    courses: CourseRecommendation[], 
    skillQuadrant?: SkillQuadrant
  ): string {
    const totalHours = courses.reduce((sum, rec) => sum + rec.course.duration_hours, 0);
    const providers = [...new Set(courses.map(rec => rec.course.provider))];
    
    let description = `A structured learning path consisting of ${courses.length} courses (${totalHours} hours total) from ${providers.join(', ')}. `;
    
    switch (skillQuadrant) {
      case SkillQuadrant.EMERGING_TALENT:
        description += 'Designed for beginners to build both theoretical knowledge and practical skills systematically.';
        break;
      case SkillQuadrant.THEORIST:
        description += 'Focused on practical application and hands-on experience to complement your theoretical knowledge.';
        break;
      case SkillQuadrant.NATURAL_DOER:
        description += 'Emphasizes theoretical foundations and frameworks to formalize your practical experience.';
        break;
      case SkillQuadrant.EXPERT_PRACTITIONER:
        description += 'Advanced courses to deepen expertise and explore specialized topics in your field.';
        break;
      default:
        description += 'A comprehensive curriculum progressing from foundational to advanced topics.';
    }
    
    return description;
  }
  
  /**
   * Search courses by query and filters
   */
  private async searchCourses(request: AgentRequest): Promise<AgentResponse> {
    const { query = '', filters = {} } = request.payload as {
      query?: string;
      filters?: {
        difficulty_level?: string;
        provider?: string;
        max_duration?: number;
        sector?: string;
      };
    };
    
    let filteredCourses = this.courses;
    
    // Apply text search
    if (query && typeof query === 'string') {
      const searchTerms = query.toLowerCase().split(' ');
      filteredCourses = filteredCourses.filter(course =>
        searchTerms.some(term =>
          course.course_title.toLowerCase().includes(term) ||
          course.course_description.toLowerCase().includes(term) ||
          course.primary_skill.toLowerCase().includes(term) ||
          course.secondary_skills.toLowerCase().includes(term)
        )
      );
    }
    
    // Apply filters
    if (filters.difficulty_level) {
      filteredCourses = filteredCourses.filter(course =>
        course.difficulty_level === filters.difficulty_level
      );
    }
    
    if (filters.provider) {
      filteredCourses = filteredCourses.filter(course =>
        course.provider === filters.provider
      );
    }
    
    if (filters.max_duration && typeof filters.max_duration === 'number') {
      filteredCourses = filteredCourses.filter(course =>
        course.duration_hours <= filters.max_duration!
      );
    }
    
    if (filters.sector) {
      filteredCourses = filteredCourses.filter(course =>
        course.sector === filters.sector
      );
    }
    
    return this.createResponse(
      request.id,
      'courses_found',
      {
        courses: filteredCourses,
        totalResults: filteredCourses.length,
        query,
        filters
      }
    );
  }
  
  /**
   * Recommend courses based on skill quadrant
   */
  private async recommendBySkillQuadrant(request: AgentRequest): Promise<AgentResponse> {
    const { skillQuadrant } = request.payload as { skillQuadrant: SkillQuadrant };
    
    const recommendations = this.getQuadrantSpecificRecommendations(skillQuadrant);
    
    return this.createResponse(
      request.id,
      'quadrant_recommendations',
      {
        recommendations,
        quadrant: skillQuadrant,
        rationale: this.getQuadrantRationale(skillQuadrant)
      }
    );
  }
  
  /**
   * Get course recommendations specific to skill quadrant
   */
  private getQuadrantSpecificRecommendations(quadrant: SkillQuadrant): Course[] {
    switch (quadrant) {
      case SkillQuadrant.EMERGING_TALENT:
        return this.courses.filter(course => 
          course.difficulty_level === 'Beginner' &&
          course.course_description.toLowerCase().includes('fundamental')
        ).slice(0, 5);
        
      case SkillQuadrant.THEORIST:
        return this.courses.filter(course =>
          course.course_description.toLowerCase().includes('practical') ||
          course.course_description.toLowerCase().includes('hands-on') ||
          course.course_description.toLowerCase().includes('application')
        ).slice(0, 5);
        
      case SkillQuadrant.NATURAL_DOER:
        return this.courses.filter(course =>
          course.course_description.toLowerCase().includes('theory') ||
          course.course_description.toLowerCase().includes('principle') ||
          course.course_description.toLowerCase().includes('concept')
        ).slice(0, 5);
        
      case SkillQuadrant.EXPERT_PRACTITIONER:
        return this.courses.filter(course =>
          course.difficulty_level === 'Advanced'
        ).slice(0, 5);
        
      default:
        return this.courses.slice(0, 5);
    }
  }
  
  /**
   * Get rationale for quadrant-specific recommendations
   */
  private getQuadrantRationale(quadrant: SkillQuadrant): string {
    switch (quadrant) {
      case SkillQuadrant.EMERGING_TALENT:
        return 'Focus on foundational courses that build both theoretical knowledge and practical skills from the ground up.';
      case SkillQuadrant.THEORIST:
        return 'Emphasize practical application courses and hands-on learning to complement your strong theoretical foundation.';
      case SkillQuadrant.NATURAL_DOER:
        return 'Prioritize courses that provide theoretical frameworks and principles to formalize your practical experience.';
      case SkillQuadrant.EXPERT_PRACTITIONER:
        return 'Advanced and specialized courses to deepen expertise and explore cutting-edge topics in your field.';
      default:
        return 'Balanced course selection covering both theoretical and practical aspects.';
    }
  }
  
  /**
   * Filter courses by specific criteria
   */
  private async filterCourses(request: AgentRequest): Promise<AgentResponse> {
    const { criteria } = request.payload as {
      criteria: {
        skills?: string[];
        [key: string]: unknown;
      };
    };
    
    let filteredCourses = this.courses;
    
    if (criteria.skills && Array.isArray(criteria.skills)) {
      filteredCourses = filteredCourses.filter(course =>
        criteria.skills!.some((skill: string) =>
          course.primary_skill.toLowerCase().includes(skill.toLowerCase()) ||
          course.secondary_skills.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }
    
    return this.createResponse(
      request.id,
      'courses_filtered',
      {
        courses: filteredCourses,
        appliedCriteria: criteria,
        resultCount: filteredCourses.length
      }
    );
  }
  
  /**
   * Generate summary of course matching results
   */
  private generateMatchingSummary(
    recommendations: CourseRecommendation[], 
    skillGaps: SkillGap[]
  ): string {
    const totalCourses = recommendations.length;
    const highPriority = recommendations.filter(r => r.priority === 'high').length;
    const avgRelevance = recommendations.reduce((sum, r) => sum + r.relevanceScore, 0) / totalCourses;
    const gapsCovered = skillGaps.length;
    
    return `Found ${totalCourses} relevant courses (${highPriority} high priority) with average relevance score of ${avgRelevance.toFixed(2)}. Addresses ${gapsCovered} identified skill gaps.`;
  }
  
  public async cleanup(): Promise<void> {
    await super.cleanup();
    this.courses = [];
    this.coursesLoaded = false;
  }
}
