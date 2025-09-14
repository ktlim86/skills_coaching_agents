---
description: "Architecture and infrastructure guidelines for scalable, reliable systems"
applyTo: "docs/architecture/*.md"
---

# Architecture & Infrastructure Instructions

## System Architecture Principles
- Design for horizontal scalability using microservices or modular monolith patterns
- Implement loose coupling between components with well-defined interfaces
- Follow 12-factor app methodology for cloud-native applications
- Use event-driven architecture for asynchronous communication
- Implement circuit breaker patterns for resilience and fault tolerance
- Design stateless applications for better scalability and reliability

## Infrastructure as Code (IaC)
- Define all infrastructure using code (Terraform, CloudFormation, ARM templates)
- Version control all infrastructure definitions and configurations
- Use modular, reusable infrastructure components
- Implement infrastructure testing and validation
- Document infrastructure dependencies and requirements
- Use consistent naming conventions across environments

## Container and Orchestration Strategy
- Use Docker for application containerization with multi-stage builds
- Implement Kubernetes for orchestration with proper resource limits
- Use Helm charts for application deployment and configuration management
- Implement proper security policies for container images
- Use container registries with vulnerability scanning
- Implement proper logging and monitoring for containerized applications

## Cloud Architecture Best Practices
- Use cloud-native services where appropriate (managed databases, message queues)
- Implement auto-scaling based on metrics and demand
- Use multiple availability zones for high availability
- Implement proper disaster recovery and backup strategies
- Use content delivery networks (CDN) for static content
- Implement proper security groups and network isolation

## Database Architecture
- Choose appropriate database types for different use cases (RDBMS, NoSQL, cache)
- Implement database clustering and replication for high availability
- Use connection pooling and query optimization
- Implement proper backup and disaster recovery procedures
- Use database migrations for schema changes
- Monitor database performance and optimize queries regularly

## Security Architecture
- Implement zero-trust security model with proper authentication and authorization
- Use secrets management systems for sensitive configuration
- Implement network segmentation and security groups
- Use encrypted communication for all services (TLS/SSL)
- Implement regular security audits and vulnerability scanning
- Follow principle of least privilege for all access controls

## Monitoring and Observability
- Implement comprehensive logging with structured logging formats
- Use distributed tracing for microservices architectures
- Implement application performance monitoring (APM)
- Set up alerting for critical system metrics and business KPIs
- Use dashboards for real-time system visibility
- Implement health checks and synthetic monitoring

## DevOps and CI/CD Pipeline
- Implement automated CI/CD pipelines with proper testing stages
- Use feature flags for safe deployment and rollback capabilities
- Implement blue-green or canary deployment strategies
- Automate security scanning in deployment pipeline
- Use infrastructure testing and validation in pipeline
- Implement proper artifact management and versioning

## Disaster Recovery and Business Continuity
- Design for failure with proper backup and recovery procedures
- Implement cross-region redundancy for critical services
- Regular disaster recovery testing and documentation
- Use database point-in-time recovery capabilities
- Implement automated failover mechanisms where appropriate
- Document recovery time objectives (RTO) and recovery point objectives (RPO)
