# Student Health & Productivity Tracker

A web application that helps students track their health and productivity during their academic journey. Built with React, AWS Amplify, and Terraform.

## Features

- User authentication and authorization
- Daily productivity logging
- Health metrics tracking
- Dashboard with productivity insights
- Secure cloud infrastructure

## Tech Stack

- Frontend: React, AWS Amplify UI
- Backend: AWS Lambda, API Gateway
- Database: Amazon DynamoDB
- Authentication: Amazon Cognito
- Infrastructure: Terraform
- Hosting: AWS S3, CloudFront

## Prerequisites

- Node.js (v14 or later)
- AWS Account
- Terraform CLI
- Git

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-tracker
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Configure AWS credentials:
   - Create an AWS account if you don't have one
   - Configure AWS CLI with your credentials
   - Update the AWS configuration in `frontend/src/aws-exports.js`

4. Deploy infrastructure:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

5. Start the development server:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
student-tracker/
├── frontend/           # React frontend application
├── terraform/          # Infrastructure as Code
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 