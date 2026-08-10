pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Catalog Service') {
            steps {
                dir('catalog-service') {
                    sh 'docker build -t catalog-service:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Build Cart Service') {
            steps {
                dir('cart-service') {
                    sh 'docker build -t cart-service:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Build Shipping Service') {
            steps {
                dir('shipping-service') {
                    sh 'docker build -t shipping-service:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t frontend:${BUILD_NUMBER} .'
                }
            }
        }
    }

    post {
        success {
            echo 'All services built successfully!'
        }
        failure {
            echo 'Build failed. Check logs above.'
        }
    }
}
