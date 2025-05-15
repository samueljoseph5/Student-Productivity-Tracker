# Create a temporary directory for packaging
$tempDir = ".\temp-lambda"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir

# Create a Python virtual environment
python -m venv "$tempDir\venv"
& "$tempDir\venv\Scripts\activate.ps1"

# Install dependencies
pip install boto3 -t $tempDir

# Copy the Lambda function to the temporary directory
Copy-Item ".\lambda\student_tracker.py" -Destination $tempDir

# Create a ZIP file
Compress-Archive -Path "$tempDir\*" -DestinationPath ".\backend\lambda.zip" -Force

# Clean up
Remove-Item -Recurse -Force $tempDir

Write-Host "Lambda function packaged successfully!" 