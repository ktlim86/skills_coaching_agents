---
description: "Site Reliability Engineering guidelines for maintaining high-availability, scalable systems"
applyTo: "**/monitoring/**,**/sre/**,**/ops/**,**/*monitoring*,**/*sre*,**/*ops*"
---

# Site Reliability Engineering (SRE) Instructions

## Service Level Objectives (SLOs) and SLIs
- Define clear Service Level Indicators (SLIs) for availability, latency, and throughput
- Set realistic Service Level Objectives (SLOs) based on business requirements
- Implement error budgets to balance reliability and feature velocity
- Monitor SLI compliance and alert on SLO violations
- Regular SLO review and adjustment based on system behavior
- Document SLOs and communicate them to development teams

## Monitoring and Alerting Strategy
- Implement the four golden signals: latency, traffic, errors, and saturation
- Use synthetic monitoring for proactive issue detection
- Implement meaningful alerting that requires human action
- Avoid alert fatigue with proper alert aggregation and routing
- Use runbooks for alert response and troubleshooting procedures
- Implement escalation policies for critical incidents

## Incident Response and Management
- Establish clear incident response procedures with defined roles
- Implement incident severity classification and response times
- Use incident command system for major incidents
- Conduct blameless post-mortems for all significant incidents
- Track Mean Time To Recovery (MTTR) and Mean Time Between Failures (MTBF)
- Maintain incident communication procedures for stakeholders

## Capacity Planning and Performance
- Monitor resource utilization trends and plan for growth
- Implement automated scaling based on demand patterns
- Regular performance testing and capacity validation
- Monitor and optimize database performance and query efficiency
- Implement caching strategies to reduce load on backend services
- Plan for peak traffic scenarios and seasonal variations

## Reliability Engineering Practices
- Implement chaos engineering to test system resilience
- Design and test disaster recovery procedures regularly
- Use circuit breakers and retry mechanisms for fault tolerance
- Implement proper timeout and backoff strategies
- Design systems to gracefully handle partial failures
- Regular failure mode and effects analysis (FMEA)

## Automation and Tooling
- Automate repetitive operational tasks and procedures
- Implement infrastructure as code for consistent environments
- Use configuration management tools for system consistency
- Automate deployment and rollback procedures
- Implement automated testing for infrastructure changes
- Create self-healing systems where possible

## Security and Compliance
- Monitor for security incidents and anomalous behavior
- Implement log aggregation and analysis for security events
- Regular security assessments and penetration testing
- Ensure compliance with relevant standards and regulations
- Implement proper access controls and audit trails
- Monitor for compliance violations and remediate issues

## Documentation and Knowledge Management
- Maintain accurate system documentation and architecture diagrams
- Create and maintain operational runbooks and procedures
- Document known issues and their resolutions
- Implement knowledge sharing practices within the team
- Regular review and update of documentation
- Create training materials for new team members

## Continuous Improvement
- Regular retrospectives on operational incidents and processes
- Implement feedback loops from development teams
- Track and improve key operational metrics
- Invest in tooling and automation to reduce toil
- Share learnings and best practices across teams
- Regular review of SRE practices and methodologies

## Cost Optimization
- Monitor and optimize cloud resource usage and costs
- Implement automated resource cleanup and management
- Regular review of resource utilization and rightsizing
- Use reserved instances and spot instances where appropriate
- Monitor for cost anomalies and investigate unusual spending
- Balance cost optimization with reliability requirements
