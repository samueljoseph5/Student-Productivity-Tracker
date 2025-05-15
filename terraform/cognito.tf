resource "aws_cognito_user_pool" "student_pool" {
  name = "${local.project_name}-user-pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
  
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  tags = local.common_tags
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${local.project_name}-client"

  user_pool_id = aws_cognito_user_pool.student_pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  callback_urls = [
    "http://localhost:3000/callback",
    "https://${aws_cloudfront_distribution.frontend.domain_name}/callback"
  ]
  
  logout_urls = [
    "http://localhost:3000",
    "https://${aws_cloudfront_distribution.frontend.domain_name}"
  ]

  supported_identity_providers = ["COGNITO"]
}

output "user_pool_id" {
  value = aws_cognito_user_pool.student_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
} 