terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"  # Change this to your preferred region
}

# Local variables
locals {
  project_name = "student-tracker"
  environment  = "dev"
}

# Tags for all resources
locals {
  common_tags = {
    Project     = local.project_name
    Environment = local.environment
    ManagedBy   = "terraform"
  }
} 