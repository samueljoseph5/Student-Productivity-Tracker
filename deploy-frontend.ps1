# Exit on error
$ErrorActionPreference = "Stop"

# Store the current directory
$CURRENT_DIR = Get-Location

# Build the React app
Write-Host "Building React app..."
Set-Location frontend
npm run build

# Get the S3 bucket name from Terraform output
Write-Host "Getting Terraform outputs..."
Set-Location ../terraform
$BUCKET_NAME = terraform output -raw s3_bucket_name
$DISTRIBUTION_ID = terraform output -raw cloudfront_distribution_id

# Upload files to S3
Write-Host "Uploading files to S3 bucket: $BUCKET_NAME"
Set-Location ../frontend
aws s3 sync build/ s3://$BUCKET_NAME/ --delete

# Invalidate CloudFront cache
Write-Host "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

Write-Host "Deployment complete! Your app should be available at:"
Set-Location ../terraform
terraform output cloudfront_domain_name

# Return to original directory
Set-Location $CURRENT_DIR 