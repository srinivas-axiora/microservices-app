pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    }
    stages {
        stage('Test Credential') {
            steps {
                echo 'Credential resolved successfully!'
            }
        }
    }
}
