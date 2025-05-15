resource "aws_dynamodb_table" "student_logs" {
  name           = "${local.project_name}-logs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "timestamp"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  tags = local.common_tags
}

# IAM policy for Lambda to access DynamoDB
data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [aws_dynamodb_table.student_logs.arn]
  }
}

resource "aws_iam_policy" "dynamodb_access" {
  name        = "${local.project_name}-dynamodb-access"
  description = "Policy for accessing student logs DynamoDB table"
  policy      = data.aws_iam_policy_document.dynamodb_access.json
} 