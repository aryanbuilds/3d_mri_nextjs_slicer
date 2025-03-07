# Use official Python 3.12.1 image
FROM python:3.12.1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user to run the app
RUN adduser --disabled-password --gecos '' appuser

# Copy the entire backend folder into the container
COPY . .

# Change ownership of the application files
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the Flask port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
